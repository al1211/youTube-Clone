import VideoCard from "../component/VideoCard"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {  useNavigate, useSearchParams } from 'react-router'

const VideotPage = () => {
  const [parameters,setParameters]=useSearchParams();
  const [vidoeDetails,setVideoDetails]=useState([]);
  const id = parameters.get("id")
  const [isLoading,setIsLoading]=useState(true);
  const [resomendedVideo,setRecomendedVideo]=useState([])
  const [hasLoading,SetHasLoading]=useState(true);
  const navigate=useNavigate();

  useEffect(()=>{
    axios.get("http://localhost:3000/api/video/"+id).then((response)=>{
      setVideoDetails(response.data)
      setIsLoading(false)
    })
  },[id])

   useEffect(()=>{
    axios.get("http://localhost:3000/api/video").then((value)=>{
    setRecomendedVideo(value.data)
    SetHasLoading(false)
  })
  },[])
  
  if(hasLoading) return <p>loading...</p>
  const gotoChannelPage=(username:string)=>{
     navigate(`/channels/${username}`)
  }
  const handleSubscribe=async()=>{
      const curentUser=localStorage.getItem("token");
      console.log(curentUser);
      const res =  await axios.post("http://localhost:3000/api/subscriber",{
        channelId:vidoeDetails.user.id,
        },{
          headers:{
            Authorization:`Bearer ${curentUser}`
          }
        })
  }
  console.log(resomendedVideo)
  return (
    <div style={{display:'flex'}} >
      {!isLoading ?<div style={{width:"1000px"}}>

      <img src={vidoeDetails.thumbnail}/>
      <div>
        {vidoeDetails.title}
      </div>
      <div style={{display:"flex",margin:10,gap:10,alignItems:"center"}}>
        {vidoeDetails.user.channelName}
        <button onClick={handleSubscribe} style={{backgroundColor:"black",color:"white ",padding:10, borderRadius:20}}>Subscribe</button>
      </div>
      
      <div>
        <img src={vidoeDetails.user.profilePicture} onClick={()=>navigate(`/channels/${vidoeDetails.user.username}`)} alt='hello'/>
      </div>
      </div>:<p>Loading...</p>}
       <div style={{display:'flex',flexDirection:"column", justifyContent:"flex-end",alignItems:"flex-end",padding:50, width:"100%" ,gap:20}}>
           { resomendedVideo.map((item)=>(
               <div key={item.id} >
                  
            <VideoCard onClick={()=>gotoChannelPage(item.user.username)} href={`/watch?id=${item.id}`} imageUrl={item.thumbnail} channelImage={item.user.profilePicture} channelName={item.user.channelName} title={item.title}  />
               </div>
            ))}
          </div>
    </div>
  )
}

export default VideotPage