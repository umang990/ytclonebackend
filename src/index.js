
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
}) 
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

import { app } from "./app.js";
// import express from "express";
// const app=express();
// ;( async ()=>{
//     try{
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
//       app.on("error",(error)=>{
//         console.error("err: ",error);
//         throw error
//       });
//       app.listen(process.env.PORT,()=>{
//         console.log(`app is listenig on port {process.env.port}`)
//       })
//     } 
//     catch(error){
//         console.error("error occured: ",error)
//         throw error
//     }
// })()

connectDB()
.then(()=>{
     app.on("error",(error)=>{
        console.error("err: ",error);
        throw error
      })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is runnig at : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("mongodb connection failed: ",err)
})


