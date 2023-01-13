function register() {
    var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/user/signup", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload = function () {
        if (this.status == 200) {
            alert('registered successfully! Login to continue')
            window.location.replace('login.html')
        }
        else {
            alert('Failed! Try again')
            window.location.replace('signup.html')
        }
    }
}

function login() {
    var data =
    {
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "http://localhost:3000/user/login", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload = function () {
        if (this.status == 200) {
            var data = JSON.parse(this.responseText)
            
            localStorage.setItem("JWT_Token", "JWT " + data.token)
            localStorage.setItem("NAME" , data.userDetails.name)
            window.location.replace('selection.html')
        }
        else {
            alert('Invalid login credentials')
            window.location.replace('login.html')
        }
    }
}

function getuser() {
    var jwt = localStorage.getItem('JWT_Token')
    const name= localStorage.getItem('NAME')
    var xh = new XMLHttpRequest();
    xh.open("GET", "http://localhost:3000/user/login", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload = function () {
        if (this.status == 200) {
         
                $('#useritem').append(` <p>Logged In as:</p><p><b>${name}</b></p>`)
       
        }
        else if(this.status==400){
            alert('Error in getting items')
        }
        else if(this.status==401){
            alert('Please authenticate user')
        }
    }

}

