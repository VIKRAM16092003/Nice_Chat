import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstanace } from "../lib/axios";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>(
{
    messages:[],
    users:[],
    selectedUsers:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    

    getUsers:async()=>
    {
        set({isUserLoading:true});
        try {
            const res=await axiosInstanace.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
        finally{
            set({isUsersLoading:false});
        }
        
    },
    getMessages:async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res=await axiosInstanace.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }     
        finally{
            set({isMessagesLoading:false});
        }   
    },
    sendMessage:async (MessageData) => {
        const {selectedUser,messages}=get()
        try {
            const res=await axiosInstanace.post(`/messages/send/${selectedUser._id}`,MessageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages:()=>
    {
        const {selectedUser}=get();
        if(!selectedUser) return;
        const socket=useAuthStore.getState().socket;


       
        socket.on("newMessage",(newMessage)=>
        {
            if(newMessage.sender!==selectedUser._id) return;
            set({messages:[...get().messages,newMessage],})
        })
    },
    unsubscribeFromMessages:()=>
        {
            const socket=useAuthStore.getState().socket;
            socket.off("newMessage");
        },

    setSelectedUser:(selectedUser)=>set({selectedUser}),


}));