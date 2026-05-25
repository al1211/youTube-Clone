import VideoCard from "../component/VideoCard"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

const VideotPage = () => {
  const [parameters, setParameters] = useSearchParams();
  const [vidoeDetails, setVideoDetails] = useState([]);
  const id = parameters.get("id")
  const [isLoading, setIsLoading] = useState(true);
  const [resomendedVideo, setRecomendedVideo] = useState([])
  const [hasLoading, SetHasLoading] = useState(true);
  const navigate = useNavigate();
  const [comments, setComments] = useState("")

  useEffect(() => {
    axios.get("http://localhost:3000/api/video/" + id).then((response) => {
      setVideoDetails(response.data)
      setIsLoading(false)
    })
  }, [id])

  useEffect(() => {
    axios.get("http://localhost:3000/api/video").then((value) => {
      setRecomendedVideo(value.data)
      SetHasLoading(false)
    })
  }, [])

  if (hasLoading) return <p>loading...</p>
  const gotoChannelPage = (username: string) => {
    navigate(`/channels/${username}`)
  }
  const handleSubscribe = async () => {
    const curentUser = localStorage.getItem("token");
    console.log(curentUser);
    const res = await axios.post("http://localhost:3000/api/subscriber", {
      channelId: vidoeDetails.user.id,
    }, {
      headers: {
        Authorization: `Bearer ${curentUser}`
      }
    })
  }
  const handleLike = async () => {
    const curentUser = localStorage.getItem("token");
    console.log(curentUser);
    const res = await axios.post("http://localhost:3000/api/likes", {
      uploadId: vidoeDetails.id,
    }, {
      headers: {
        Authorization: `Bearer ${curentUser}`
      }
    })
  }
  const handleComments = async () => {
    const curentUser = localStorage.getItem("token");
    const res = await axios.post("http://localhost:3000/api/comments", {
      uploadId: vidoeDetails.id,
      comment: comments
    }, {
      headers: {
        Authorization: `Bearer ${curentUser}`
      }
    })
  }
  console.log(vidoeDetails);
  return (
    <div style={{ display: 'flex'}} >
      {!isLoading ? <div style={{ width: "1000px" }}>
<div style={{ 
        width: "100%", 
        aspectRatio: "16/9", // Yeh har card ke video box ko same dimension dega
        borderRadius: "12px", 
        overflow: "hidden", 
        backgroundColor: "#000",
        position: "relative"
      }}>
        <video 
          controls
          loop
          playsInline
          poster={vidoeDetails.thumbnail}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" // Crucial: Video ko stretch hone se rokega aur barabar fit karega
          }}
          // onClick={(e) => e.stopPropagation()}
        >
          <source src={vidoeDetails.videoUrl} type="video/mp4" />
        </video>
      </div>
        <div>
          {vidoeDetails.title}
        </div>
        <div style={{ display: "flex", margin: 10, gap: 10, alignItems: "center" }}>
          {vidoeDetails.user.channelName}
          <button onClick={handleSubscribe} style={{ backgroundColor: "black", color: "white ", padding: 10, borderRadius: 20 }}>Subscribe</button>
          <button onClick={handleLike} style={{ backgroundColor: "black", color: "white ", padding: 10, borderRadius: 20 }}>Like</button>
        </div>
        <div>
          <input type="text" placeholder="comments...." onChange={(e) => setComments(e.target.value)} />
          <button onClick={handleComments} style={{ backgroundColor: "black", color: "white ", padding: 10, borderRadius: 20 }}>Comments</button>
        </div>

        <div>
          <img src={vidoeDetails.user.profilePicture} onClick={() => navigate(`/channels/${vidoeDetails.user.username}`)} alt='hello' />
        </div>
      </div> : <p>Loading...</p>}
      <div style={{
        display: 'flex',          // 1. Ek row mein laane ke liye
        flexDirection: 'column',     // 2. Horizontal direction set karne ke liye
        overflowY: 'auto',        // 3. Agar videos screen se baahar jayein toh scrollbar dikhane ke liye
        gap: '24px',              // Cards ke beech ka gap
        padding: '0',
        maxHeight: '1400px',
        maxWidth:"400px",
        border: "1px solid gray",
        marginLeft:"auto",
        paddingRight:20,
        boxSizing: 'border-box',
        WebkitOverflowScrolling: 'touch' // Mobile par smooth scrolling ke liye
      }}>
        {resomendedVideo.map((item: any) => (
          <VideoCard
            key={item.id}
            onClick={() => gotoChannelPage(item.username || item.user?.username)}
            thumbNail={item.thumbnail}
            videoUrl={item.videoUrl}
            href={`/watch?id=${item.id}`}
            channelImage={item.user?.profilePicture}
            channelName={item.user?.channelName}
            title={item.title}
            views={item.viewCount}
            like={item.likeCount}

          />
        ))}
      </div>
    </div>
  )
}

export default VideotPage