import React, { useEffect, useState } from 'react'
import { user } from '../join/Join';
import socketIo from "socket.io-client";
import "./chat.css";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";

let socket;

const ENDPOINT ="https://chatapp0204.onrender.com";

const Chat = () => {
    const [id, setid] = useState("") 
    const [messages, setMessages] = useState([]) 
    const send = () =>{
      const message= document.getElementById('chatInput').value;
      socket.emit('message',{ message,id });
      document.getElementById('chatInput').value="";
    }


  console.log(messages); 
  useEffect(() =>{
    socket = socketIo(ENDPOINT, {transports:['websocket']});
    socket.on('connect',()=>{
      alert('connected');
      setid(socket.id);
    })
    console.log(socket);
    socket.emit('joined', { user })

    socket.on('welcome',(data) =>{
      setMessages([...messages, data]);
      console.log(data.user, data.message);
 
    })

    socket.on('userJoined', (data) =>{
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    })

    socket.on('laeve',(data)=>{
      setMessages([...messages, data]);
      console.log(data.user,data.message)
    })

    return () => {
      // socket.emit('disconnect');
      socket.off();
        
    }},[])

useEffect(() => {
  socket.on('sendMessage',(data) =>{
    setMessages([...messages, data]);
    console.log(data.user, data.message, data.id);
  })


  return () => {
    
  }
}, [messages])


  return (
    <div className="chatpage">
        <div className="chatContainer">
         <div className="header">
          <h2>CHAT APP</h2>
          {/* <img src={closeIcon} alt="Close"/>  */}
          </div>
         <ReactScrollToBottom className="chatBox">
            {messages.map((item,i)=> <Message user={item.id===id?'':item.user} message={item.message} classs={item.id===id?'right':'left'} />)}
         </ReactScrollToBottom>
         <div className="inputBoxe">
            <input onKeyPress={(event)=>event.key === 'Enter' ? send() : null } type="text" id="chatInput" />
            <button onClick={send} className="sendBtn">send</button>
            
         </div>
  
        </div>
    </div>
    
  )
}

export default Chat;
