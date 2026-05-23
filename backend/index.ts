import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { ZodError } from "zod";
import { prisma } from "./db"
import cors from "cors"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import multer from "multer"
import { fa } from "zod/locales";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());


const JWT_SECRET=process.env.JWT_SECRET || "my-secret-key"
const Cloud_Name=process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET



  cloudinary.config({
    cloud_name:Cloud_Name,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
  })

  const storage=new CloudinaryStorage({
    cloudinary,
    params:{
      folder:"uploads",
      allowed_format:["jpg","png","jpeg","webp"]
    }
  });

  const uploads=multer({storage})

// ─── Response Helpers ──────────────────────────────────────────────────────
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | object;
}

function getUserID(req:express.Request):string |null{
  const auth=req.headers.authorization;
  if(!auth?.startsWith("Bearer ")) return null;
  try{
    const payload=jwt.verify(auth.slice(7),JWT_SECRET) as {userId:string};
    return payload.userId;

  }catch{
    return null
  }
}

// const ok = <T>(res: Response, message: string, data?: T, status = 200): Response =>
//   res.status(status).json({ success: true, message, data } as ApiResponse<T>);

// const fail = (res: Response, message: string, error?: string | object, status = 500): Response =>
//   res.status(status).json({ success: false, message, error } as ApiResponse);

// ─── Zod Schemas ───────────────────────────────────────────────────────────
const singupSchema = z.object({
  username:       z.string().min(3, "Username must be at least 3 characters").trim(),
  password:       z.string().min(6, "Password must be at least 6 characters"),
  gender:         z.enum(["Male","Female","Others"]),
  channelName:    z.string().min(2, "Channel name must be at least 2 characters").trim(),

});
const signIn = z.object({
  username:       z.string().min(3, "Username must be at least 3 characters").trim(),
  password:       z.string().min(6, "Password must be at least 6 characters"),
  
});

const uploadSchema = z.object({
  videoUrl:z.url(),
  thumbnail:z.url(),
});





// ─── Health ────────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════════════════════
//  USER ROUTES
// ══════════════════════════════════════════════════════════════════════════



// POST /api/users
app.post("/api/singup", async (req: Request, res: Response) => {
  const parsed=singupSchema.safeParse(req.body);
  if(!parsed.success) {
     res.status(400).json({error :parsed.error.message}); return
  }

  const {username,password,gender,channelName}=parsed.data;
  const existing=await prisma.user.findFirst({where:{username}});

  if(existing){
    res.status(409).json({error:"User already taken"})
    return;
  }

  const hashpassword= await bcrypt.hash(password,10);
  const user=await prisma.user.create({
    data:{username,password:hashpassword,gender,channelName}
  })
  const token=jwt.sign({userId:user.id},JWT_SECRET)

  res.status(201).json({token,userId:user.id})
  
});


app.post("/api/singin", async (req: Request, res: Response) => {
  const parsed=signIn.safeParse(req.body);
  if(!parsed.success) {
     res.status(400).json({error :parsed.error.message}); return
  }

  const {username,password}=parsed.data;
  const user=await prisma.user.findFirst({where:{username}});

  if(!user){
    res.status(409).json({error:"Invalid Credientals"})
    return;
  }

  const hashpassword=bcrypt.compare(password,user.password);
  if(!hashpassword){
    res.status(401).json({error:"Invalid credientals"})
    return;
  }
  const token=jwt.sign({userId:user.id},JWT_SECRET)

  res.status(201).json({token,userId:user.id})
  
});

// ══════════════════════════════════════════════════════════════════════════
//  UPLOAD ROUTES
// ══════════════════════════════════════════════════════════════════════════

// GET /api/uploads
app.get("/api/video", async (_req: Request, res: Response) => {
   const vidoes=await prisma.uploads.findMany({
    include:{user:{select:{id:true,channelName:true,profilePicture:true,username:true}}},
    orderBy:{createAt:"desc"}
   })
   res.json(vidoes)
});

// GET /api/uploads/user/:userId
app.get("/api/video/:id", async (req: Request, res: Response) => {
 const video=await prisma.uploads.findUnique({
  where:{id:req.params.id as string},
  include:{user:{select:{id:true,channelName:true,profilePicture:true,subscriberCount:true,username:true}}}
 })
 if(!video) {
  res.status(404).json({error:"Video not found"})
  return;
 }
 res.json(video)
});

// POST /api/uploads
app.post("/api/videos", async (req: Request, res: Response) => {
  const userId=getUserID(req);
  if(!userId) { res.status(401).json({error:"Unauthorized"});return}


  const parsed=uploadSchema.safeParse(req.body);
  if(!parsed.success) { res.status(400).json({error:parsed.data?.message });return};
  const video=await prisma.uploads.create({
    data:{...parsed.data,userId}
  });
  res.status(201).json(video)
});



// DELETE /api/uploads/:id
app.delete("/api/vidoe/:id", async (req: Request, res: Response) => {
  const userId=getUserID(req);
  if(!userId) { res.status(401).json({error:"Unauthorized"});return}


  const video=await prisma.uploads.findUnique({where:{id:req.params.id as string} });
  if(!video) { res.status(404).json({error:"Video not found"}); return;}
  if(video.id !==userId) { res.status(403).json({error:"Forbidden"});return;}
  await prisma.uploads.delete({where:{id:req.params.id as string}})
  res.json({message:"Deleted"})
});

app.get('/channel/:username',async(req:Request,res:Response)=>{
       const channelname=await prisma.user.findFirst({
        where:{
          username:req.params.username
        },
        select:{
          username:true,
          banner:true,
          id:true,
          description:true,
          profilePicture:true,
          subscriberCount:true,
         
        }
       });
       if(!channelname){
        res.status(411).json({
          message:"A channel with this username does not exist"
        })
        return;
       }

       const AlluploadsVideos=await prisma.uploads.findMany({
        where:{
          userId:channelname.id
        }
       });

       res.json({
           channelname,AlluploadsVideos
       })
})

app.get("/api/signature",async(req:Request,res:Response)=>{
   const timestamp=Math.round(Date.now()/1000);

   const signature=cloudinary.utils.api_sign_request(
    {
      timestamp
    },
   CLOUDINARY_API_SECRET!
   );

   res.json({
    timestamp,
    signature,
    Cloud_Name,
    CLOUDINARY_API_KEY
   })
})

app.post("/api/uploads",uploads.single("image"), async(req:Request,res:Response)=>{
  
 try {
    const userId=getUserID(req);
    if(!userId) { res.status(401).json({message:"user is unaurhorized"})};
     const {title,videoUrl,thumbnail}=req.body;
     const videoandImage=await prisma.uploads.create({
      data:{
        userId:userId,
         title:title,
        thumbnail:thumbnail,
        videoUrl:videoUrl,
        slud:title,
       


      }
     })
     res.json({
      success:true,
      data:videoandImage 
     })
  } catch (error) {


    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
})


app.post("/api/subscriber", async (req: Request, res: Response) => {
  const { channelId } = req.body;
  const userId=getUserID(req);
  console.log("req",req);

  console.log(channelId, userId);

  if (!channelId || !userId) {
    return res.status(400).json({
      success: false,
      message: "userId and channelId required",
    });
  }

  if (userId === channelId) {
    return res.status(400).json({
      success: false,
      message: "You can't subscribe own channel",
    });
  }

  // check channel exists
  const channel = await prisma.user.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: "Channel not found",
    });
  }

  // check already subscribed
  const existing = await prisma.subscription.findUnique({
    where: {
      channelId_userId: {
        channelId,
        userId,
      },
    },
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Already subscribed",
    });
  }

  // create subscription
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      channelId,
    },
  });

  // increment subscriber count
  await prisma.user.update({
    where: {
      id: channelId,
    },
    data: {
      subscriberCount: {
        increment: 1,
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: subscription,
  });
});

app.post("/api/likes", async (req: Request, res: Response) => {
  const {  uploadId } = req.body;
  const userId=getUserID(req)

  if (!uploadId || !userId) {
    return res.status(400).json({
      success: false,
      message: "uploadId and userId required",
    });
  }

  // find upload
  const uploadChannel = await prisma.uploads.findFirst({
    where: {
      id: uploadId,
    },
  });

  if (!uploadChannel) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  // own video like check
  if (uploadChannel.userId === userId) {
    return res.status(401).json({
      success: false,
      message: "You can't like your own video",
    });
  }

  // already liked
  const exist = await prisma.like.findUnique({
    where: {
      userId_uploadId: {
        userId,
        uploadId,
      },
    },
  });

  if (exist) {
    return res.status(400).json({
      success: false,
      message: "Already liked",
    });
  }

  // create like
  const likes = await prisma.like.create({
    data: {
      userId,
      uploadId,
    },
  });

  // increment like count
  await prisma.uploads.update({
    where: {
      id: uploadId,
    },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });

  return res.status(201).json({
    success: true,
    data: likes,
  });
});

app.post("/api/comments",async(req:Request,res:Response)=>{
  const {comment,uploadId}=req.body;
  const userId=getUserID(req)

  if(!uploadId || !userId){
     return res.status(400).json({
      success: false,
      message: "uploadId and userId required",
    });
  }
  if (!comment) {
  return res.status(400).json({
    success: false,
    message: "Comment required",
  });
}
  // find channel

  const uploadChannel=await prisma.uploads.findFirst({
    where:{
      id:uploadId
    }
  })

  if(!uploadChannel){
    res.status(404).json({
      success:false,
      message:"Video not found"
    })
    return;
  }
  if(uploadChannel?.userId == userId){
    res.status(401).json({
      success:false,
      message:"You can't comment own videos"
    })
    return
  }

  // create comment

  const createComment=await prisma.comments.create({
    data:{
         comments:comment,
         userId:userId,
         uploadId:uploadId
    }
  })

  await prisma.uploads.update({
    where:{
      id:uploadId
    },
    data:{
    commentCount:{
      increment:1
    }
    }
  })

  res.status(201).json({
    success:true,
    data:createComment
  })
})



// ─── 404 & Global Error Handler ───────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});




app.listen(3000,()=>{
  console.log("Server is running on http://localhost:3000")
})