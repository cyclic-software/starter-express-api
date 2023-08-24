// document.querySelector("li").classlist.toggle("cut");
// document.getElementById('taskList').addEventListener('change', function(event) {
//     if (event.target.matches('.taskCheckbox')) {
//         event.target.nextElementSibling.classList.toggle('strikethrough');
//     }
// });

// document.getElementsByClassName(".taskCheckbox").addEventListener("click",function(){
//     document.querySelectorAll("#listElemnts").classList.toggle("strikethrough");
// });
// let licreato = document.querySelector("#listElemnts");
// let ulCreato = document.querySelector("#taskList");
// document.querySelector(".submitBtn").addEventListener("click",function(){
//     ulCreato.appendChild(licreato);
// });

// for (let index = 0; index < display.length; index++) {
//     const element = display[index];
//     console.log(element);
//     document.querySelectorAll("#listElemnts")[element].classList.toggle("strikethrough");
    
// }


// function strike(list){
//     for (let index = 0; index <= array.length; index++) {
//         const element = array[index];
//         document.querySelectorAll("#listElemnts")[element].classList.toggle("strikethrough");
        
//     }
// }
// function handleClick(cb) {
//     alert("Clicked, new value = " + cb.checked);
//     for (let index = 0; index < array.length; index++) {
//         const element = array[index];
//         if(cb.checked == true){
//             document.querySelectorAll("#listElemnts")[this.element].classList.add("strikethrough");
//         }
//         else{
//             document.querySelectorAll("#listElemnts")[this.element].classList.remove("strikethrough");
//         }
        
//     }
// }
//  function handleClick(cb){
//     console.log (cb.checked);
// }
// console.log(checkMark);
var checked = document.querySelectorAll("#checkbox");
var array = document.querySelectorAll("#listElemnts");

// for (var index = 0; index < array.length; index++) {
//     console.log(array.length);
//     checked[index].addEventListener("click",()=>{array[index].classList.toggle("strikethrough")});
// }

// checked[0].addEventListener("click",()=>{array[0].classList.toggle("strikethrough")});
for (let index = 0; index < array.length; index++) {
    checked[index].addEventListener("click",()=>{
        array[index].classList.toggle("strikethrough");
        array[index].classList.save();
    });
    
}