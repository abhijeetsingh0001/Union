import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyMeetingDetails, dummyUser } from '../assets/asset'
import VideoGrid from '../components/meeting/VideoGrid'
import {useWebRTC} from '../hooks/useWebRTC.js'
import ChatPanel from '../components/meeting/ChatPanel.jsx'
import { useChat } from '../hooks/useChat.js'
import ParticipantList from '../components/meeting/ParticipantList.jsx'
import ControlBar from '../components/meeting/ControlBar.jsx'
import toast from 'react-hot-toast'
import {useAuth, useUser} from '@clerk/react'
import api from '../config/api.js'
import Loader from '../components/Loader.jsx'

const MeetingRoom = () => {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const {user} = useUser()
  const {getToken} = useAuth();

 

  const userdata = useMemo(()=>{
    if(!user) return null;
    return{
      id:user.id,
      name:user.fullName ||user.firstName || user.primaryEmailAddress?.emailAddress?.split("@")[0] ||"User",
      email:user.primaryEmailAddress?.email||"",
      image:user.imageUrl||"",
    }
  },[user?.id,user?.fullName,user?.firstName,user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl
  ])

  const [meeting,setMeeting] = useState(null)
  const [loadingMeeting,setLoadingMeeting] = useState(true);
   const [isParticipantOpen, setIsParticipantOpen] = useState(false)

   //fetch meeting details to verify validity begore enabling webRTC camera access

   useEffect(()=>{
    const fetchMeeting = async()=>{
      try {
        const token = await getToken();
        const res = await api.get(`/api/meetings/${meetingId}`,{
          headers:{
            Authorization:`Bearer${token}`,
          },
          
        })
        if(res.data.meeting.status === "ended"){
            toast.error("This meeting has ended");
            navigate("/dashboard");
            return;
          }
          setMeeting(res.data.meeting)
      } catch (error) {
        const errorMsg = error.response?.data?.error ||"Meeting not found or has ended";
        toast.error(errorMsg);
        navigate("/dashboard");
      }finally{
        setLoadingMeeting(false);
      }

    }
    fetchMeeting();

   },[meetingId,navigate])
  

  const handleMeetingEnded = useCallback(() => {
    navigate('/dashboard')

  }, [navigate])

  //initialize webrtc
  const {localStream,remoteUsers,audioEnabled,videoEnabled,toggleAudio,toggleVideo,endMeeting} = useWebRTC(meetingId,userdata,handleMeetingEnded)
  //intialize chat
  const {messages,sendMessage,unreadCount,isChatOpen,toggleChat}= useChat(meetingId,userdata)

  const hostId = meeting?.host?.id || meeting?.host;
  const isHost = Boolean(userdata?.id &&hostId&& hostId.toString() ===userdata.id.toString())

  const handleLeave = () => {
    toast("You Left The Meeting");
    navigate("/dashboard")

  }
  const handleEndMeeting = () => {
    endMeeting();
    toast("Meeting Ended for all Participants");
    navigate("/dashboard")

  }
  if(loadingMeeting){
    return<Loader text='Joining meeting room ...'/>
  }

  return (
    <div className='h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden relative font-sans'>
      {/*top bar */}
      <header className='w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 flex items-center justify-between z-30 shadow-xs'>
        <div className='flex items-center gap-3'>
          <h2 className='text-base font-semibold text-slate-900 tracking-tight'>
            {dummyMeetingDetails.title}({meetingId || dummyMeetingDetails.meetingId})
          </h2>
          <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />

        </div>

      </header>
      {/* Main Content Area (Video Grid + Side Panels) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Grid Center */}
        <VideoGrid
        localStream={localStream}
        localUser={userdata}
        remoteUsers={remoteUsers}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        />


        {/* In-Meeting Chat Drawer */}
        <ChatPanel 
        isOpen={isChatOpen}
        onClose={toggleChat}
        messages={messages}
        onSendMessage={sendMessage}
        currentUser={userdata}/>

        {/* Participants Drawer */}
        <ParticipantList
        isOpen = {isParticipantOpen}
        onClose={()=> setIsParticipantOpen(false)}
        localUser = {userdata}
        localAudio = {audioEnabled}
        localVideo={videoEnabled}
        remoteUsers={remoteUsers}
        meetingHostId={dummyUser.id}/>

       

      </div>
       {/* Bottom Floating Control Bar */}
        <ControlBar
        roomId={meetingId||dummyMeetingDetails.meetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={toggleChat}
        onToggleParticipants={()=> setIsParticipantOpen((prev)=> !prev)}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantOpen}
        unreadCount={unreadCount}
        participantCount={1+remoteUsers.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
        
        />

      </div>
      )
}

      export default MeetingRoom
