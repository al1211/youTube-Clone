import Appbar from '@/component/Appbar';
import VideoCard from "../component/VideoCard"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

const Landing = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/api/video").then((value) => {
      setData(value.data)
      setLoading(false)
    })
  }, [])

  const gotoChannelPage = (username: string) => {
    navigate(`/channel/${username}`)
  }
  
  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>Loading...</p>

  return (
    // Max-width ko 100% kiya taaki puri screen ka use ho sake (YouTube ki tarah)
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f9f9f9", fontFamily: "sans-serif" }}>
      <Appbar />

      {/* 🚀 CSS Grid Wrapper for Video Cards */}
      <div
       
      style={{
        display: 'grid',
        // Yeh line screen size ke hisab se automatic cards ko wrap karegi (Min width 280px ek card ki)
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {data.map((item: any) => (
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

export default Landing;