import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
// import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { axiosInstanace } from './lib/axios'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
  //console.log(`OnlineUsers ${onlineUsers}`);
  
  useEffect(()=>
  {
    checkAuth();
  },[checkAuth]);
 
  if(isCheckingAuth && !authUser) return  (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  return (<>
  <div>
    <Navbar />
     <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>}/>
      <Route path="/signup" element={!authUser ?<SignupPage />: <Navigate to="/"/>}/>
      <Route path="/login" element={!authUser ?<LoginPage />: <Navigate to="/"/>}/>
      {/* <Route path="/settings" element={<SettingsPage />}/> */}
      <Route path="/profile" element={authUser ?<ProfilePage /> : <Navigate to="/login"/>}/>
     </Routes>
     <Toaster />
     </div>
    </>
  )
}

export default App