function getquiz() {
    var jwt = localStorage.getItem('JWT_Token')
    const name= localStorage.getItem('NAME')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("GET", "http://localhost:3000/quiz/view?id=60af86175a5fdb67969188e6", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload = function () {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText)
            console.log(data)
            console.log(data.quiz)
            const newdata = data.quiz
            console.log(newdata.questions)
            $('#useritem').append(` <p>Logged In as:</p><p><b>${name}</b></p>`)
            for (var i = 0; i < newdata.questions.length; i++) {
                
                $('#questionContainer').append(`<div class="item">
                <div class="question">
                    <p>${newdata.questions[i].title}</p>
                    <div class ="options" id="options${i}"> </div>
                </div>
               
            </div>`)
            for (var j = 0; j <=3; j++){
                $(`#options${i}`).append(`<p>${newdata.questions[i].options[j]}</p>`)
            }

            }
           
          

        }
        else if(this.status==400){
            alert('Error in getting items')
        }
        else if(this.status==401){
            alert('Please authenticate user')
        }
    }

}
