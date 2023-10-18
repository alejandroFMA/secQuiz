async function crearPreguntas(){

let response = await fetch ('https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple')
let data = await response.json()


}



