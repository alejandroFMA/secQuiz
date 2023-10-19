const api = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple' //api en variable para trabajar más simple

const preguntas = [] //guardamos objetos en un array
const correctas =[]
const mezcladas = []

let numbers = [0,1,2,3]

function caos(array) {
    array.sort(() => Math.random() - 0.5);
    return array
    
  }
 
async function getQuiz() {

    let response = await fetch(api);
    let data = await response.json();

    for(let i=0; i< data.results.length; i++){     //bucle de objetos
      
        preguntas.push(data.results[i].question)                          //creamos objeto de la estructura de las preguntas
    
       correctas.push(data.results[i].correct_answer)
       

        mezcladas.push(data.results[i].incorrect_answers.concat(data.results[i].correct_answer))    
        
    }

    console.log(mezcladas)



    for (let i = 0; i < preguntas.length; i++) {

        let rnd = caos(numbers)
    
        let template = document.getElementById("form") 
        
         template.innerHTML += 
        `<fieldset>
            <legend>${preguntas[i]}</legend>
            <div>
                <label for="${mezcladas[i][rnd[0]]}">${mezcladas[i][rnd[0]]}</label>
                <input type="radio" name="${mezcladas[i][rnd[0]]}" value="${mezcladas[i][rnd[0]]}">
            </div>
            <div>
                <label for="${mezcladas[i][rnd[1]]}">${mezcladas[i][rnd[1]]}</label>
                <input type="radio" name="${mezcladas[i][rnd[1]]}" value="${mezcladas[i][rnd[1]]}">
            </div>
            <div>
                <label for="${mezcladas[i][rnd[2]]}">${mezcladas[i][rnd[2]]}</label>
                <input type="radio" name="${mezcladas[i][rnd[2]]}" value="${mezcladas[i][rnd[2]]}">
            </div>
            <div>
                <label for="${mezcladas[i][rnd[3]]}">${mezcladas[i][rnd[3]]}</label>
                <input type="radio" name="${mezcladas[i][rnd[3]]}" value="${mezcladas[i][rnd[3]]}">
            </div>
        </fieldset>
        ` 
    
    
    }
    
    
}


getQuiz();





