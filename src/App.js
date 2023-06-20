import { useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chats from "./Chats";

const socket = io.connect("http://localhost:3001");


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function joinRoom() {
    socket.emit("join_room", room);
    setLoggedIn(true);
  }

  return (
    <div className="App">
      {!loggedIn ?  <div className="joinChatContainer">
        <h3>Join a Chat</h3>
        <input type="text" placeholder="John..." onChange={(event)=> {setUsername(event.target.value)}}></input>
        <input type="text" placeholder="Room ID..." onChange={(event)=> {setRoom(event.target.value)}}></input>
        <button onClick={joinRoom}>Join a room</button>
      </div>

      :<Chats socket={socket} username={username} room={room} />}
    </div>
  );
}

export default App;
