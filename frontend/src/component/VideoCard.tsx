import { useNavigate } from "react-router"

interface VideoCard{
  imageUrl:string,
  title:string,
  channelImage:string,
  channelName:string,
  href:string,
  onClick?:()=>void
}
export default function VideoCard({imageUrl,title,onClick,channelImage,channelName,href}:VideoCard){
  const navigation=useNavigate();;
  return <div style={{maxWidth:300,borderRadius:30}} onClick={()=>navigation(href)}>
    <img src={imageUrl} style={{display:"block",width:"100%"}}/>
    <div>
      {title}
    </div>
    <div onClick={(e)=>{
          e.stopPropagation();
          onClick()
    }}>
       <img src={channelImage} style={{width:30,borderRadius:30}}/>
      {channelName }
    </div>
  </div>
}