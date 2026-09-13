import React, { useCallback, useEffect, useRef, useState } from 'react'
import { dummyRemoteParticipants } from '../assets/asset'
import toast from 'react-hot-toast'

const useWebRTC = (_roomId, user, onMeetingEnded, _enabled = true) => {

  const [localStream, setLocalStream] = useState(null)
  const [remoteUsers, setRemoteUsers] = useState(dummyRemoteParticipants)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)

  const localStreamRef = useRef(null)

  //initalize local camera stream if available in browser
  const initLocalStream = useCallback(async () => {
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })
        localStreamRef.current = stream;
        setLocalStream(stream)
        return stream
      }
    } catch (error) {
      console.log("mock webRTC :Running in camera preview fallback mode");

    }
    return null;
  }, [])
  useEffect(() => {
    initLocalStream()
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }

    }
  }, [initLocalStream])
  //toggle localmic
  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = newState;
    }
    toast(newState?"Microphone Turned on":"Microphone muted",{
      icon:newState?"🎙️":"🔇",
    })
  }

  //toggle local camera
  const toggleVideo = () => {
    const newState = !videoEnabled;
    setVideoEnabled(newState);
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = newState;
    }
    toast(newState?"Camera Turned on":"Camera turned Off",{
      icon:newState?"📹":"📷",
    })
  }

  //end meeting for everyone 
  const endMeeting = useCallback(()=>{
    if(onMeetingEnded){
      onMeetingEnded("Meeting ended ")
    }
  },[onMeetingEnded])


  return {
    
      localStream,
      remoteUsers,
      audioEnabled,
      videoEnabled,
      toggleAudio,
      toggleVideo,
      endMeeting

    
  }
}

export default useWebRTC
