import { useNavigate } from "react-router";

export default function VideoCard({ thumbNail, videoUrl, title, onClick, channelImage, channelName, href }: VideoCardProps) {
  const navigation = useNavigate();

  return (
    <div 
      style={{ 
        width: "100%", 
        cursor: "pointer",
        display: "flex",
        flexDirection: "column", // Elements ko vertical line mein rakhta hai
        border:"1px solid black"
      }} 
      onClick={() => {navigation(href),console.log("helo")}}
      
    >
      {/* 1. FIXED ASPECT RATIO CONTAINER */}
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
          poster={thumbNail}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover" // Crucial: Video ko stretch hone se rokega aur barabar fit karega
          }}
          // onClick={(e) => e.stopPropagation()}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      {/* Details Area */}
      <div style={{ display: "flex", gap: "12px", marginTop: "12px", padding: "0 4px" }}>
        
        {/* Channel Avatar */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}
        >
          <img src={channelImage || "https://via.placeholder.com/36"} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="channel" />
        </div>

        {/* 2. FIXED HEIGHT FOR TEXT SECTION */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
          
          {/* Title with Fixed Line Height and Max 2 Lines restriction */}
          <div style={{ 
            fontSize: "14px", 
            fontWeight: 600, 
            color: "#0f0f0f", 
            lineHeight: "20px",
            height: "40px", // Fixed height (20px line-height * 2 lines = 40px)
            display: "-webkit-box",
            WebkitLineClamp: 2, 
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {title}
          </div>
          
          {/* Channel Name */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            style={{ 
              fontSize: "12px", 
              color: "#606060", 
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis" // Agar name bohot bada hai toh ... lag jayega
            }}
          >
            {channelName}
          </div>
        </div>

      </div>
    </div>
  )
}