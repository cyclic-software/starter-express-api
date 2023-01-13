const socket = io("http://localhost:3000");
  
socket.on("hello", () => {
console.log("connected"); // world
});

window.saveDataAcrossSessions = true

const LOOK_DELAY = 2000 // 1 second
const LEFT_CUTOFF = window.innerWidth / 4
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4

let startLookTime = Number.POSITIVE_INFINITY
let lookDirection = null
let error=0;

webgazer
  .setGazeListener((data, timestamp) => {
    // console.log(data,timestamp)
    if (data == null || lookDirection === "STOP") return

    if (
      data.x < LEFT_CUTOFF &&
      lookDirection !== "LEFT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "LEFT"
    } else if (
      data.x > RIGHT_CUTOFF &&
      lookDirection !== "RIGHT" &&
      lookDirection !== "RESET"
    ) {
      startLookTime = timestamp
      lookDirection = "RIGHT"
    } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = null
    }

    if (startLookTime + LOOK_DELAY < timestamp) {
      if (lookDirection === "LEFT") {
       playAudio()
        alert("stop looking around")
       socket.emit("data","left")
       error++;

      } else {
        playAudio()
        alert("stop looking around")
        socket.emit("data","right")
        error++;

      }
      console.log(error)
      if(error > 3 ){
        window.location.replace('block.html')
      }
      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = "STOP"
      setTimeout(() => {
        lookDirection = "RESET"
      }, 200)
    }
  })
  .begin()
  

  function playAudio() {
    var x = document.getElementById("myAudio"); 

    x.play()
  }
// webgazer.showVideoPreview(false).showPredictionPoints(false)

function select(event){
  let option = document.getElementsByClassName("option")
  option[0].classList.remove("selected")
  option[1].classList.remove("selected")
  option[2].classList.remove("selected")
  event.classList.add("selected")
  console.log(event.innerText)
}




function showQuestion(event){
  const Questions =[
    {
      question:"Which one of the following is not a step of requirement engineering?",
      correct:"design",
      options :[
        {
         option:"documentation",
         correct:false 
        },
        {
          option:"analysis",
          correct:false
         },
         {
          option:"design",
          correct:true 
         }
      ]
    },
    {
      question:"The spiral model was originally proposed by",
      correct:"Barry Boehm",
      options :[
        {
         option:"IBM",
         correct:false 
        },
        {
          option:"Barry Boehm",
          correct:true 
         },
         {
          option:"Pressman",
          correct:false 
         }
      ]
    },
    {
      question:"Spiral Model has user involvement in all its phases.",
      correct:"False",
      options :[
        {
         option:"True",
         correct:false 
        },
        {
          option:"False",
          correct:true 
         },
         {
          option:"Can't say",
          correct:false 
         }
      ]
    },
    {
      question:"If you were to create client/server applications, which model would you go for?",
      correct:"Concurrent Model",
      options :[
        {
         option:"WINWIN Spiral Model",
         correct:false 
        },
        {
          option:"Concurrent Model",
          correct:true 
         },
         {
          option:"Incremental Model",
          correct:false 
         }
      ]
    },
    {
      question:"FAST stands for",
      correct:"Facilitated Application Specification Technique",
      options :[
        {
         option:"Facilitated Application Specification Technique",
         correct:true 
        },
        {
          option:"Fast Application Specification Technique",
          correct:false
         },
         {
          option:"Functional Application Specification Technique",
          correct:false 
         }
      ]
    },
    {
      question:"The user system requirements are the parts of which document ?",
      correct:"SRS",
      options :[
        {
         option:"SDD",
         correct:false 
        },
        {
          option:"SRS",
          correct:true 
         },
         {
          option:"DDD",
          correct:false 
         }
      ]
    },
  ]
question = document.getElementById("question")
question.innerText = Questions[Number(event.innerText)-1].question
let option = document.getElementsByClassName("option")
option[0].classList.remove("selected")
option[1].classList.remove("selected")
option[2].classList.remove("selected")
  option[0].innerText=Questions[Number(event.innerText)-1].options[0].option
  option[1].innerText=Questions[Number(event.innerText)-1].options[1].option
  option[2].innerText=Questions[Number(event.innerText)-1].options[2].option
console.log(event.innerText)
}

// var answers =[]

function save(event) {
option = document.getElementsByClassName("option")
console.log(option[0].classList)
if(option[0].classList.contains("selected")){
if(!answers.includes(option[0].innerText))
answers.push(option[0].innerText)
}
else if(option[1].classList.contains("selected")){
  if(!answers.includes(option[1].innerText))
  answers.push(option[1].innerText)
}
else if(option[2].classList.contains("selected")){
  if(!answers.includes(option[2].innerText))
  answers.push(option[2].innerText)
}
else{
console.log('ille')
}
console.log(answers)
}

function result(){
  correct=0
  correctAnswers = ["design","Barry Boehm","False","Concurrent Model","Facilitated Application Specification Technique","SRS"]
  console.log(answers)
  for(i in answers){
    for(j in correctAnswers)
    if(answers[i]==correctAnswers[j]){
      correct+=1
    }
  }
 

  localStorage.setItem("result", correct);
  console.log("Result : ", correct)
  window.location.replace("http://127.0.0.1:5500/frontend/complete.html");

};

function showResult() {
  x = document.getElementById("result")
  correct = localStorage.getItem("result")
  x.innerText = `${correct} points`
}