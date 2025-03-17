import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import MessageRoutes from "./routes/message.route.js";
import cors from "cors";
import path from "path";

import {app,server} from "./lib/socket.js";
dotenv.config()
// const app=express(); we need to create the express server app() in socket.io(utils)


app.use(express.json({ limit: "1mb" }))
app.use(cookieParser());  //Extract Cookies: It reads the cookies from incoming HTTP requests and makes them accessible via req.cookies (for regular cookies) and req.signedCookies (for signed cookies)
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
const PORT=process.env.PORT;
// Run garbage collection manually
if (global.gc) {
    setInterval(() => {
      global.gc();
    }, 60000); // Runs every 60 seconds
  }
const __dirname=path.resolve();
app.use("/api/auth",authRoutes);
app.use("/api/messages",MessageRoutes);
// app.listen(PORT,()=>{console.log("server connected on port "+PORT);
//     connectDB();
// }) here we need to use server from the socket.io


if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>
    {
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}
server.listen(PORT,()=>{console.log("server connected on port "+PORT);
    connectDB();
})
