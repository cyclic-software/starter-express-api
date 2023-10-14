import React, { useEffect, useState } from 'react'
import "./login.css"
import signupvector from "../../assets/signup.png"
import loginvector from "../../assets/login.png"
import { toast } from 'react-toastify'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { useAuth } from '../../context/authContext'

 

function Login(props) {
  const body=document.querySelector("body");
  const navigate= useNavigate();
 
  const [auth,setAuth]=useAuth();


  const handleSignupAnimation = () => {
    resetInputs();
    setpassVisible(false);
    const container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
  }
  const handleSigninAnimation = () => {
    resetInputs();
    setpassVisible(false)
    const container = document.querySelector(".container");
    container.classList.remove("sign-up-mode");
  }
  
  const [passVisible,setpassVisible]=useState(false);
  const [email, setEmail] = useState("");
  const [username, setusername] = useState("");
  const [number, setnumber] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpass, setconfirmpass] = useState("");
  const [strong,setStrong]=useState(0);

  const emojies=['','😑','😕','😊','😎','💪'];
  const colors=['transparent','#ff0000','#ffa700','#fff400','#a3ff00','#2cba00'];

  const strongEvaluation=()=>{
       let st=[false,false,false,false,false];
       let n=password.length;
       if(n>0){
        st[0]=true;
       }
      
        for(let i=0;i<n;i++){
        
            let asci=password[i].charCodeAt(0);
            if(asci>=65&&asci<=90){
              st[2]=true;
            }
            else if(asci>=48&&asci<=57){
              st[3]=true;
            }
            
            if(n>6){
              st[1]=true;
            if((asci>=32&&asci<=48)||(asci>=58&&asci<=64)||(asci>=90&&asci<=96)){
              st[4]=true;
            }
            }
          
        }
       
       let sc=0;
       for(let i=0;i<st.length;i++){
        if(st[i]){
          sc++;
        }
       }
       setStrong(sc);
  }

  const resetInputs = () => {
    setEmail("");
    setconfirmpass("");
    setnumber("");
    setpassword("");
    setusername("");
  }

  const handleLogin=async (e)=>{
    e.preventDefault();
    try {

      body.style.pointerEvents="none";
      const res=await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{email,password});
      if(res.data.success){
        toast.success("login successfull")
        setAuth({
          ...auth,
          token:res.data.token,
          user:{
            ...res.data.user
          }
        })
        localStorage.setItem("authData",JSON.stringify({
          token:res.data.token,
          user:{
            ...res.data.user
          }
        }))
        if(!props.goBack){
          navigate("/")
        }
      }
      else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong")
    }
    
    setTimeout(()=>{
    body.style.pointerEvents="all";},1500)
  }

  const handleRegister= async()=>{
    try {

      if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
        toast.error("invalid email");
        return;
      }
      if(!password||!username||!number){
        toast.error("please fill all the fields");
        return;
      }
      if(!/^\d{10}$/.test(number)){
        toast.error("invalid phone number");
        return;
      }
      if(strong<4){ 
        toast.error("Please use a strong password");
        return;
      }
      if(password!==confirmpass){
        toast.error("Passwords doesn't match")
        return;
      }

      
      body.style.pointerEvents="none";
      const res=await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`,{name:username,email,password,number});
      if(res.data.success){
        toast.success(res.data.message)
        const loginres=await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`,{email,password})
        console.log(loginres.data)
        setAuth({
          ...auth,
          token:loginres.data.token,
          user:{
            ...loginres.data.user
          }
        })
        localStorage.setItem("authData",JSON.stringify({
          token:loginres.data.token,
          user:{
            ...loginres.data.user
          }
        }))
        if(!props.goBack){
          navigate("/")
        }
      }
      else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong")
    }
    setTimeout(()=>{
    body.style.pointerEvents="all";},1500)

  }


  useEffect(()=>{
     strongEvaluation()
  })
  return (
    <div className="container">


      <div className="forms-container">

        <div className="signin-signup">

          <form action="#" className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fa fa-envelope"></i>
              <input type="text" placeholder="Email id"
              value={email} onChange={(e)=>{
                setEmail(e.target.value);
              }}  />
            </div>
            <div className="input-field" style={{
              gridTemplateColumns:"15% 70% 15%",
              cursor:"pointer"
            }}>
              <i className="fa fa-lock"></i>
              <input type={passVisible===true?"text":"password"} placeholder="Password"
              value={password} onChange={(e)=>{
                setpassword(e.target.value)
              }} />
              <i className={passVisible===true?"fa fa-eye":"fa fa-eye-slash"} onClick={()=>{
                setpassVisible(passVisible===true?false:true)
              }}></i>
            </div>
            <input type="submit" value="Login" className="btn solid" onClick={handleLogin} />
          </form>


          <form action="#" className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input type="text" placeholder="Username"
              value={username} onChange={(e)=>{
                setusername(e.target.value)
              }}/>
            </div>
            <div className="input-field">
              <i className="fa fa-envelope"></i>
              <input type="email" placeholder="Email"
              value={email} onChange={(e)=>{
                setEmail(e.target.value)
              }} />
            </div>
            <div className="input-field">
              <i className="fa fa-phone"></i>
              <input type="text" placeholder="phone no"
              value={number} onChange={(e)=>{
                setnumber(e.target.value)
              }} />
            </div>
            <div className="input-field" style={{
              gridTemplateColumns:"15% 70% 8% 7%",
              cursor:"pointer",
              border:`2px solid ${colors[strong]}`
            }}>
              <i className="fa fa-lock"></i>
              <input type={passVisible===true?"text":"password"} id='regpass' placeholder="Password" 
              value={password} onChange={ (e)=>{
                 setpassword(e.target.value)
                
              }}/>
              <p>{emojies[strong]}</p>
              <i className={passVisible===true?"fa fa-eye":"fa fa-eye-slash"} onClick={()=>{
                setpassVisible(passVisible===true?false:true)
              }}></i>
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input type={passVisible===true?"text":"password"} placeholder="confirm password"
              value={confirmpass} onChange={(e)=>{
                setconfirmpass(e.target.value)
              }} />
            </div>
            <input type="submit" className="btn" value="Sign up" onClick={(e)=>{
                e.preventDefault();
                handleRegister();
            }} />
          </form>

        </div>


        <div className="panels-container">


          <div className="panel left-panel">
            <div className="content">
              <h3>New User?</h3>
              <p>
                Register yourself and get personalized shoping experince
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignupAnimation}>
                Sign up
              </button>
            </div>
            <img src={signupvector} className="image" alt="" />
          </div>


          <div className="panel right-panel">
            <div className="content">
              <h3>Already a user?</h3>
              <p>
                Login with your existing account and continue with your drip
              </p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSigninAnimation}>
                Sign in
              </button>
            </div>
            <img src={loginvector} className="image" alt="" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login