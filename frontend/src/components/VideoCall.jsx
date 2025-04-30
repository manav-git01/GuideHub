import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './VideoCall.css';

const VideoCall = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Simulated user data
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState({
    id: 'mentor1',
    name: 'Tal Hibner',
    avatar: '/images/tal-avatar.jpg'
  });

  useEffect(() => {
    // Get user from localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    // In a real app, this would initialize WebRTC connection
    // For demo purposes, we'll just set up local video
    setupLocalVideo();

    // Cleanup function
    return () => {
      // In a real app, this would close WebRTC connections
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const setupLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // For demo purposes, we'll simulate a remote connection after 2 seconds
      setTimeout(() => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          const oldStream = localVideoRef.current.srcObject;
          const audioTrack = oldStream.getAudioTracks()[0];
          screenStream.addTrack(audioTrack);
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      // Switch back to camera
      setupLocalVideo();
      setIsScreenSharing(false);
    }
  };

  const endCall = () => {
    // In a real app, this would close the WebRTC connection
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    navigate(-1);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user?.name || 'You',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate mentor response after 2 seconds
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          sender: mentor.name,
          text: 'Thanks for your question. Let me explain that in more detail...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  return (
    <div className="video-call-page">
      <div className="video-container">
        <div className="main-video-wrapper">
          <video 
            ref={remoteVideoRef} 
            className="main-video" 
            autoPlay 
            playsInline
          ></video>
          <div className="participant-name">{mentor.name}</div>
        </div>
        
        <div className="self-video-wrapper">
          <video 
            ref={localVideoRef} 
            className="self-video" 
            autoPlay 
            playsInline 
            muted
          ></video>
          <div className="participant-name">You</div>
        </div>
        
        <div className="call-controls">
          <button 
            className={`control-btn ${isMuted ? 'active' : ''}`} 
            onClick={toggleMute}
          >
            <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          </button>
          
          <button 
            className={`control-btn ${isVideoOff ? 'active' : ''}`} 
            onClick={toggleVideo}
          >
            <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
          </button>
          
          <button 
            className={`control-btn ${isScreenSharing ? 'active' : ''}`} 
            onClick={toggleScreenShare}
          >
            <i className="fas fa-desktop"></i>
          </button>
          
          <button className="control-btn end-call" onClick={endCall}>
            <i className="fas fa-phone-slash"></i>
          </button>
        </div>
      </div>
      
      <motion.div 
        className="chat-container"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="chat-header">
          <h2>Chat</h2>
        </div>
        
        <div className="messages-container">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.sender === (user?.name || 'You') ? 'self' : 'other'}`}
            >
              <div className="message-header">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">{message.timestamp}</span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VideoCall;