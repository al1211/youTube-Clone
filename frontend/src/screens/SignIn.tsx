import axios from 'axios'
import { password } from 'bun'
import React from 'react'
import { useNavigate } from 'react-router'

const SignIn = () => {
  const navigation=useNavigate();

  const signIn=async ()=>{
   const response=await  axios.post("http://localhost:3000/api/singin",{
      username:document.getElementById("username")!.value,
      password:document.getElementById("password")!.value
    });

    localStorage.setItem("token",response.data.token)
    navigation("/")
  }

   
  return (
    <div>
      <input id='username' type='text' placeholder='Enter a username'/>
      <input id='password' type='password' placeholder='Enter a password
      '/>
      <button onClick={signIn} >Sign In</button>
    </div>
  )
}

export default SignIn