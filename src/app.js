import express, { urlencoded } from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app=express();
//enable cors for all origins
app.use(cors({
    origin:true,
    credentials:true
}))
app.use(express.json({
    limit: "16kb"
}))
app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import userroute
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users",userRouter)

export {app}