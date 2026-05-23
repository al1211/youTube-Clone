import VideoCard from '@/component/VideoCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

const Channels = () => {
    const [uploads, setUploads] = useState({});
    const [channels, setChannels] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const { username } = useParams();

    useEffect(() => {
        axios.get("http://localhost:3000/channel/" + username).then((respone) => {
            setUploads(respone.data.AlluploadsVideos)
            setChannels(respone.data.channelname)
            setIsLoading(false)
        })
    }, [])
    const gotoChannelPage=(username)=>{
    navigate(`/channel/${username}`)
  }
    if (isLoading) return <p>Loading...</p>
    return (
        <>
            <div>Channels</div>
            <img src={channels!.banner ?? ""} />
            {uploads.map((item) => (
                <div key={item.id} >

                    <VideoCard onClick={()=>gotoChannelPage(uploads.username)} href={`/watch?id=${item.id}`} imageUrl={item.thumbnail} channelImage={channels.profilePicture} channelName={channels.channelName} title={item.title} />
                </div>
            ))}
        </>
    )
}

export default Channels