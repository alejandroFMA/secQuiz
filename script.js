
const firebaseConfig = {
    apiKey: "AIzaSyDXwc-XRYEeU4XRDcf21IJy9oPdmJ24eWs",
    authDomain: "telequiz-cb0e4.firebaseapp.com",
    projectId: "telequiz-cb0e4",
    storageBucket: "telequiz-cb0e4.appspot.com",
    messagingSenderId: "911800771479",
    appId: "1:911800771479:web:d1bce9392241d007451ad2"

};


firebase.initializeApp(firebaseConfig);
  
const db = firebase.firestore();


// const api = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple' 

// const preguntas = [] 
// const correctas =[]
// const mezcladas = []

// let numbers = [0,1,2,3]

// function caos(array) {
//     array.sort(() => Math.random() - 0.5);
//     return array
    
//   }

// async function getQuiz() {

//     let response = await fetch(api);
//     let data = await response.json();

//     for(let i=0; i< data.results.length; i++){     
      
//         preguntas.push(data.results[i].question)                         
    
//        correctas.push(data.results[i].correct_answer)
       

//         mezcladas.push(data.results[i].incorrect_answers.concat(data.results[i].correct_answer))    
        
//     }

//     console.log(mezcladas)


//     for (let i = 0; i < preguntas.length; i++) {

//         let rnd = caos(numbers)
    
//         let template = document.getElementById("form") 
        
//          template.innerHTML += 
//         `<fieldset class="field hide" id="${[i]}">
//             <legend>${preguntas[i]}</legend>
//             <div>
//                 <label for="${mezcladas[i][rnd[0]]}">${mezcladas[i][rnd[0]]}</label>
//                 <input type="radio" name="${[i]}" value="${mezcladas[i][rnd[0]]}">
//             </div>
//             <div>
//                 <label for="${mezcladas[i][rnd[1]]}">${mezcladas[i][rnd[1]]}</label>
//                 <input type="radio" name="${[i]}" value="${mezcladas[i][rnd[1]]}">
//             </div>
//             <div>
//                 <label for="${mezcladas[i][rnd[2]]}">${mezcladas[i][rnd[2]]}</label>
//                 <input type="radio" name="${[i]}" value="${mezcladas[i][rnd[2]]}">
//             </div>
//             <div>
//                 <label for="${mezcladas[i][rnd[3]]}">${mezcladas[i][rnd[3]]}</label>
//                 <input type="radio" name="${[i]}" value="${mezcladas[i][rnd[3]]}">
//             </div>
//         </fieldset>
//         ` 
//     }


//     let submit = document.createElement("button")
//     submit.setAttribute("type", "submit")
//     submit.innerText = "Submit"
//     document.getElementById("form").appendChild(submit)
    
// }

// getQuiz();


//AUTH

const createUser = (user) => {
    db.collection("users")
      .add(user)
      .then((docRef) => console.log("Document written with ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
};
  
const signUpUser = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        let user = userCredential.user;
        console.log(`se ha registrado ${user.email} ID:${user.uid}`)
        alert(`La cuenta de ${user.email} ha sido registrada con éxito`)
        createUser({
          email: user.email,
          password: password
        });
  
      })
      .catch((error) => {
        console.log("Error en el sistema" + error.message, "Error: "+error.code);
        if (error.code === "auth/email-already-in-use") {
          alert("El correo electrónico ya está en uso. Por favor, inicia sesión en lugar de registrarte.");
      } else {
          alert("No se pudo crear el usuario. Revisa los datos.");
      }
  });
}
  
  document.getElementById("crear").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;
  
    pass === pass2 ? signUpUser(email, pass) : alert("error password");
  })
  

  
const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha logado ${user.email} ID:${user.uid}`)
        alert(`se ha logado ${user.email} ID:${user.uid}`)
        console.log("USER", user);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
  }
  