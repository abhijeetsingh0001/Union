import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedLayout from './components/ProtectedLayout'
import Dashboard from './pages/Dashboard'
import Session from './pages/Session'
import Pricing from './pages/Pricing'
import MeetingRoom from './pages/MeetingRoom'




const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        {/*Public rpoutes*/}
        <Route path='/login' element={<Login mode="login" />} />
        <Route path='/register' element={<Login mode="register" />} />
        {/*Protected routes*/}
        <Route element={<ProtectedRoute/>}>
          <Route element={<ProtectedLayout/>}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/sessions' element={<Session/>} />
            <Route path='/pricing' element={<Pricing/>} />
          </Route>

        </Route>
        <Route path='/meeting/:meetingId' element={<MeetingRoom/>} />
        {/*other routes*/}
        <Route path='*' element={<Navigate to="/dashboard" replace />} />


      </Routes>



    </>
  )
}

export default App
