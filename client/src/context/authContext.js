import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const authContext = createContext();


const AuthProvider=({children})=>{
    const[auth,setAuth]=useState({
        user:null,
        token:""
    })
    axios.defaults.headers.common["Authorization"]=auth?.token;
    useEffect(()=>{
        const authData=JSON.parse(localStorage.getItem("authData"))
        if(authData){
            setAuth({

                token:authData.token,
                user:{
                    ...authData.user
                }
            })
        }
    },[])
    return (
        <authContext.Provider value={[auth,setAuth]}>
            {children}
        </authContext.Provider>
    )
}
const useAuth=()=>useContext(authContext);
export {useAuth,AuthProvider}