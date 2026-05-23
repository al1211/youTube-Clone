import axios from 'axios'
import React, { useState } from 'react'

const Uploads = () => {
    const [uploadsvides,setUpLoadsVideos]=useState(null);
    const [uploadImage,setUploadImage]=useState(null);
    const [title,setTitle]=useState("");
    const [isLoading,setIsLoading]=useState(false);
 const sumbit=async()=>{
   try{
      // signature
       const {data}=await axios.get("http://localhost:3000/api/signature");
       
       // Video Upload
    const VidoeData=new FormData();
        VidoeData.append("file", uploadsvides);
    VidoeData.append("api_key", data.CLOUDINARY_API_KEY);
    VidoeData.append("timestamp", data.timestamp);
    VidoeData.append("signature", data. signature);

    const res=await axios.post(`https://api.cloudinary.com/v1_1/${data.Cloud_Name}/video/upload`,
        VidoeData
    )
    
    // Image upload



     const imageData=new FormData();
        VidoeData.append("file", uploadImage);
      VidoeData.append("api_key", data.CLOUDINARY_API_KEY);
       VidoeData.append("timestamp", data.timestamp);
      VidoeData.append("signature", data. signature);

     const imageResponse=await axios.post(`https://api.cloudinary.com/v1_1/${data.Cloud_Name}/image/upload`,
        VidoeData
    )
    

    const videoUrl=res.data.secure_url;
    const thumbnail=imageResponse.data.secure_url;

   const completeResponse= await axios.post("http://localhost:3000/api/uploads",{
           title,
            videoUrl,
           thumbnail
    })
     localStorage.getItem("token")
        
        

   }catch(err){
     console.log(err)
   }
}

  return (
    <div>
        <input type='text' placeholder='Enter text' onChange={(e)=>setTitle(e.target.value)}/>
        <input id='videoUrl' type='file' placeholder='Video url'
         onChange={(e)=>{
            setUpLoadsVideos(e.target.files[0])
         }}
        />
        <input id='thumbnail' type='file' placeholder='thumbnail'
         onChange={(e)=>{
            setUploadImage(e.target.files[0])
         }}
        />
        
            <button disabled={true} onClick={sumbit}>Complete upload</button>
       
    </div>
  )
}

export default Uploads