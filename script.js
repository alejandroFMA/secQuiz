import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXwc-XRYEeU4XRDcf21IJy9oPdmJ24eWs",
  authDomain: "telequiz-cb0e4.firebaseapp.com",
  projectId: "telequiz-cb0e4",
  storageBucket: "telequiz-cb0e4.appspot.com",
  messagingSenderId: "911800771479",
  appId: "1:911800771479:web:d1bce9392241d007451ad2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize Auth
const auth = getAuth();
const user = auth.currentUser;
//Initialize DDBB
const db = getFirestore(app);
//Initialize cloudstore
const storage = getStorage();

//Selectores
const signUpForm = document.getElementById('form1');
const loginForm = document.getElementById('form2');
const logout = document.getElementById('salir');
const botones = document.getElementById('botones');
const userData = document.getElementById('user-data');

//SignUp function
signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById("sign-loader").style.visibility = "visible";    
  const signUpEmail = document.getElementById('email').value;
  const signUpPassword = document.getElementById('pass').value;
  const signUpUser = document.getElementById('signup-user').value;
  const usersRef = collection(db, "users");
  const signUpImg = document.getElementById('signup-picture').files[0];
  const storageRef = ref(storage, signUpImg.name);
  let publicImageUrl;
  try {
    //Create auth user
    await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      console.log('User registered')
      const user = userCredential.user;
      signUpForm.reset();
      document.getElementById("sign-loader").style.visibility = "hidden";    
    })
    //Upload file to cloud storage
    await uploadBytes(storageRef, signUpImg).then(async (snapshot) => {
      console.log('Uploaded a blob or file!')
      publicImageUrl= await getDownloadURL(storageRef);
    })
    //Create document in DB
    await setDoc(doc(usersRef, signUpEmail), {
      username: signUpUser,
      email: signUpEmail,
      puntuacion: 0,
      profile_picture: publicImageUrl
    })
  } catch (error) {
    console.log('Error: ', error)
  }
    
  }); 


//Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById("log-loader").style.visibility = "visible";
  const loginEmail = document.getElementById('email2').value;
  const loginPassword = document.getElementById('pass3').value;
  //Call the collection in the DB
  const docRef = doc(db, "users", loginEmail);
  //Search a document that matches with our ref
  const docSnap = await getDoc(docRef);

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      console.log('User authenticated')
      const user = userCredential.user;
      loginForm.reset();
    })
    .then(() => {
      if (docSnap.exists()) {
        document.getElementById("inicio").style.display="none";
         botones.innerHTML = `
                        <button id="getquiz">Go to quiz</button>
                        <button id="results">My scores</button>`
        userData.innerHTML = `<h3>Welcome</h3>
                              <h5>Username:</h5> <p id ="username">${docSnap.data().username}</p>
                              <img src=${docSnap.data().profile_picture} alt='User profile picture'>`
           document.getElementById("getquiz").addEventListener("click", function () {
            getQuiz()
             
            })

            document.getElementById("results").addEventListener("click", function () {
              getScores()
               
              })
      } else {
        console.log("No such document!");
    }})
    .catch((error) => {
      document.getElementById('msgerr').innerHTML='Invalid user or password';
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Código del error: ' + errorCode);
      console.log('Mensaje del error: ' + errorMessage);
    }).finally(() => {
      document.getElementById("log-loader").style.visibility = "hidden";
    });
})

//Logout function
logout.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('Logout user')
    location.reload();
  }).catch((error) => {
    console.log('Error: ', error)
  });
})

//Observe the user's state
auth.onAuthStateChanged(user => {
  if(user){
    console.log('Logged user');
  }else{
    console.log('No logged user');
  }
})


//variables
  const api = 'https://opentdb.com/api.php?amount=10&category=14&type=multiple' 
  
  const preguntas = [] 
  const correctas =[]
  const mezcladas = []
  let finales= []
  let i = 0;
  let score = 0;
  let alerta = 0;
  let numbers = [0,1,2,3]


  

  //conseguir preguntas random
  function caos(array) {
      array.sort(() => Math.random() - 0.5);
      return array
    }
  

  //pintar preguntas en el DOM
  function pintar(pregunta, mezcladas, i){
      let rnd = caos(numbers)
      let template = document.getElementById("quiz") 
      
       template.innerHTML = 
      `<fieldset class="question" id="${[i]}">
          <legend>${pregunta}</legend>
          <div class = "form">
          <input type="radio" name="n${i}" value="${mezcladas[rnd[0]]}" id= "a${i}"  required>
              <label for="a${i}">${mezcladas[rnd[0]]}</label>
          </div>
          <div class = "form">
          <input type="radio" name="n${i}" value="${mezcladas[rnd[1]]}" id= "b${i}"  required>
              <label for="b${i}">${mezcladas[rnd[1]]}</label>
          </div>
          <div class = "form">
          <input type="radio" name="n${i}" value="${mezcladas[rnd[2]]}" id= "c${i}"  required>
              <label for="c${i}">${mezcladas[rnd[2]]}</label>
          </div>
          <div class = "form">
          <input type="radio" name="n${i}" value="${mezcladas[rnd[3]]}" id= "d${i}"  required>
              <label for="d${i}">${mezcladas[rnd[3]]}</label>
          </div>
      </fieldset>
      <button id="next">NEXT</button>
      <input type="submit" id="finish" value="Finish quiz"></input>
      ` 
      if(i<9){
          document.getElementById("finish").style.display = "none"
      }
      document.querySelector("#next").addEventListener("click", comprobarYPasar);
      document.querySelector("#finish").addEventListener("click", validar)
  }
  
  
  
   //Llamar al quiz
  async function getQuiz() {
    document.getElementById("quiz-loader").style.visibility = "visible";
      let response = await fetch(api);
      let data = await response.json();
  
      for(let i=0; i< data.results.length; i++){     
        
          preguntas.push(data.results[i].question)                         
          correctas.push(data.results[i].correct_answer)
          mezcladas.push(data.results[i].incorrect_answers.concat(data.results[i].correct_answer))    
          
      }
      document.getElementById("quiz-loader").style.visibility = "hidden";    
        pintar(preguntas[i], mezcladas[i], i)  
        
      }
    
  
  //sumar puntos y pasar pregunta
  
      function comprobarYPasar(event){
          event.preventDefault();
          const respuestaUsuario = document.querySelector(`input[name=n${i}]:checked`).value
          console.log("respuestaUsuario es " + respuestaUsuario)
  
          if (respuestaUsuario == correctas[i]){
              score++
              finales.push(respuestaUsuario)
          } else if (respuestaUsuario != correctas[i]){
              alerta++
              finales.push(respuestaUsuario)
          }
          i++
          pintar(preguntas[i], mezcladas[i], i)
        
          if(i==9){
              document.querySelector("#next").remove()
          }
  }
  
  // validar quiz
    function validar(event){
      event.preventDefault();

      const respuestaUsuario = document.querySelector(`input[name=n${i}]:checked`).value
      if (respuestaUsuario == correctas[i]){
        score++
        finales.push(respuestaUsuario)
    } else if (respuestaUsuario != correctas[i]){
        alerta++
        finales.push(respuestaUsuario)
    }

      console.log(finales)

      document.getElementById("quiz").remove()

      let contenedor = document.getElementById("test")
      let aviso = document.createElement("article")
      
      aviso.innerHTML=
      `<p>You answered ${score} questions correctly.<br>
      <br>
      These are the questions's correct answers:</p>
      
      <ol>
      <li id="a0">Question: ${preguntas[0]}, correct answer: ${correctas[0]} , your answer: ${finales[0]}</li>
      <br>
      <li id="a1">Question: ${preguntas[1]}, correct answer: ${correctas[1]} , your answer: ${finales[1]}</li>
      <br>
      <li id="a2">Question: ${preguntas[2]},<br> correct answer: ${correctas[2]} ,<br> your answer: ${finales[2]}</li>
      <br>
      <li id="a3">Question: ${preguntas[3]},<br> correct answer: ${correctas[3]} ,<br> your answer: ${finales[3]}</li>
      <br>
      <li id="a4">Question: ${preguntas[4]},<br> correct answer: ${correctas[4]} ,<br> your answer: ${finales[4]}</li>
      <br>
      <li id="a5">Question: ${preguntas[5]},<br> correct answer: ${correctas[5]} ,<br> your answer: ${finales[5]}</li>
      <br>
      <li id="a6">Question: ${preguntas[6]},<br> correct answer: ${correctas[6]} ,<br> your answer: ${finales[6]}</li>
      <br>
      <li id="a7">Question: ${preguntas[7]},<br> correct answer: ${correctas[7]} ,<br> your answer: ${finales[7]}</li>
      <br>
      <li id="a8">Question: ${preguntas[8]},<br> correct answer: ${correctas[8]} ,<br> your answer: ${finales[8]}</li>
      <br>
      <li id="a9">Question: ${preguntas[9]},<br> correct answer: ${correctas[9]} ,<br> your answer: ${finales[9]}</li>
      </ol>
      <button id="grafica">My scores</button>
      `
    
      contenedor.appendChild(aviso)

for (let j = 0; j < correctas.length; j++) {
  if(finales[j]==correctas[j]){
    document.getElementById(`a${j}`).style.color = "green"
  } else{
    document.getElementById(`a${j}`).style.color = "red"
  }
  
}

console.log(alerta);

const userRef = doc(db, 'users', auth.currentUser.email);
  updateDoc(userRef, {
  puntuacion: arrayUnion(score)
})
.then(() => {
    console.log("Document successfully updated!");
})
.catch((error) => {
    console.error("Error updating document: ", error);
});


document.getElementById("grafica").addEventListener("click", generarGrafica)


}


  //GRAFICA//

  function generarGrafica(){
    document.getElementById("chart-loader").style.visibility = "visible";
    let series = [score, alerta];
    let labels = ["correct", "incorrect"];
    let data = {
    labels: labels,
    series: [series]
    };
  
    var options = {
        high: 10,
        axisY: {
          onlyInteger: true
     }
    };
  
    let barras = document.getElementById("chart")


    new Chartist.Bar(barras, data, options);
    document.getElementById("chart-loader").style.visibility = "hidden";

  }

