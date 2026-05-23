import React from 'react'
import { useNavigate } from 'react-router'

const Appbar = () => {
  const navigate=useNavigate();
  return (
    <div style={{display:"flex",justifyContent:"space-between"}}>
        <p>YouTube</p>
        <div>
            <button onClick={()=> navigate("/uploads")}>upload</button>
        </div>
    </div>
  )
}

export default Appbar