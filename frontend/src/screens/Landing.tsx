import Appbar from '@/component/Appbar';
import VideoCard from "../component/VideoCard"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

interface ResponseData{

}

const Landing = () => {
  const [data,setData]=useState([]);
  const [loading,setLoading]=useState(true)
  const navigate=useNavigate();
  useEffect(()=>{
  axios.get("http://localhost:3000/api/video").then((value)=>{
    setData(value.data)
    setLoading(false)
  })
  },[])
  const gotoChannelPage=(username)=>{
    navigate(`/channel/${username}`)
  }
  if(loading) return <p>Loading</p>
  return (
    <div style={{maxWidth:"600px"}}>
     <Appbar/>
    <div style={{display:'flex',gap:20}}>
      <video controls
  loop
  playsInline
  poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop"
  width="800"
>
  <source
    src="https://www.w3schools.com/html/mov_bbb.mp4"
    type="video/mp4"
  />
</video>
     { data.map((item)=>(
         <div key={item.id} >
          
      <VideoCard onClick={()=>gotoChannelPage(item.username)} href={`/watch?id=${item.id}`} imageUrl={item.thumbnail} channelImage={item.user.profilePicture} channelName={item.user.channelName} title={item.title}  />
         </div>
      ))}
    </div>
    </div>
  )
}


export default Landing