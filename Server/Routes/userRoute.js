
import express from "express"


const router = express.Router();




router.get("/test",(req,res)=>{
    
    return res.send("User are getting...")
})



export default router