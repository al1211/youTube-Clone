import axios from 'axios'
import { password } from 'bun'
import React from 'react'
import { useNavigate } from 'react-router'

const Signup = () => {
  const navigate=useNavigate();

  const signIn=async ()=>{
   const response=await  axios.post("http://localhost:3000/api/singup",{
      username:document.getElementById("username")!.value,
      password:document.getElementById("password")!.value,
      channelName:document.getElementById("channleName")!.value,
      gender:"Male"
    });

    localStorage.setItem("token",response.data.token)
   navigate("/signin")
  }

   
  return (
    <div>
      <input id='username' type='text' placeholder='Enter a username'/>
      <input id='password' type='password' placeholder='Enter a password'/>
      <input id='channleName' type='text' placeholder='Enter a channel Name'/>
      <button onClick={signIn} >Sign up</button>
    </div>
  )
}

export default Signup