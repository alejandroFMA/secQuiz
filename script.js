//firebase



//adventlist de boton de inicio con llamada a la funcion





const api = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple' 

const preguntas = [] 
const correctas =[]
const mezcladas = []

let numbers = [0,1,2,3]

function caos(array) {
    array.sort(() => Math.random() - 0.5);
    return array
  }

function pintar(pregunta, mezcladas, i){
    let rnd = caos(numbers)
    let template = document.getElementById("section") 
    
     template.innerHTML = 
    `<fieldset class="field hide" id="${[i]}">
        <legend>${pregunta}</legend>
        <div>
            <label for="a${i}">${mezcladas[rnd[0]]}</label>
            <input type="radio" name="${pregunta}" value="${mezcladas[rnd[0]]}" id= "a${i}"  required>
        </div>
        <div>
            <label for="b${i}">${mezcladas[rnd[1]]}</label>
            <input type="radio" name="${pregunta}" value="${mezcladas[rnd[1]]}" id= "b${i}"  required>
        </div>
        <div>
            <label for="c${i}">${mezcladas[rnd[2]]}</label>
            <input type="radio" name="${pregunta}" value="${mezcladas[rnd[2]]}" id= "c${i}"  required>
        </div>
        <div>
            <label for="d${i}">${mezcladas[rnd[3]]}</label>
            <input type="radio" name="${pregunta}" value="${mezcladas[rnd[3]]}" id= "d${i}"  required>
        </div>
    </fieldset>
    <button id="next">NEXT</button>
    ` 

    document.querySelector("#next").addEventListener("click", comprobar)
}



 //Crear form
async function getQuiz() {

    let response = await fetch(api);
    let data = await response.json();

    for(let i=0; i< data.results.length; i++){     
      
        preguntas.push(data.results[i].question)                         
        correctas.push(data.results[i].correct_answer)
        mezcladas.push(data.results[i].incorrect_answers.concat(data.results[i].correct_answer))    
        
    }
    let i = 0
      pintar(preguntas[i], mezcladas[i], i)  
    }
    
getQuiz();

//validación

function comprobar(event){
    event.preventDefault();
    console.log(event)
   
console.log("Holaaa")
    const respuestaUsuario = document.querySelectorAll("input:checked").nodeValue
    let alerta ="";
    let score = 0

    for (let i = 0; i < preguntas.length; i++) {
       
        if(respuestaUsuario[i] != correctas[i]){
            alerta+="Respuesta incorrecta!";
        } else if(respuestaUsuario[i].nodeValue == correctas[i]){
            score++
        }  
    }

    console.log(alerta)
    console.log(score)
}


document.querySelector("#form").addEventListener("submit", comprobar)


//pintarUsuarios(usuarios);
//if (!boolean) {
 //   Swal.fire({
   //     icon: 'error',
    //    title: 'Vaya...',
     //   text: 'No hay ningún usuario con ese nombre',
    //  });
//}


