import {Server} from "socket.io";
import http from "http";
import express from "express";
// Purpose: when we develope an an and see in one browser and open and see in the another browser when we change something in one browser it will reflect on the another browser to like sending messages
const app=express();
const server=http.createServer(app);

const io=new Server(server,
    {
        cors:{
            origin:"http://localhost:5173",
        },
        pingTimeout: 60000,
    }
);

export function getRecieverSocketId(userId)
{
    return userSockectMap[userId];
}

//used to store the online Users
const userSockectMap={};//{userId:socketId}
io.on("connection",(socket)=>
{
    console.log("A user connection ",socket.id);
    const userId=socket.handshake.query.userId;
    if(userId)
    {
        userSockectMap[userId]=socket.id
    }


    //io.emit() is used to send events to all the connected clients
     io.emit("getOnlineUsers",Object.keys(userSockectMap));
    socket.on("disconnect",()=>
    {
        console.log("A user disconnected",socket.id);
        delete userSockectMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSockectMap));
        
    })
})
export {io,app,server};