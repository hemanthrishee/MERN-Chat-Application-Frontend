import { useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chats from "./Chats";
import Signup from './Signup';

const socket = io.connect("http://localhost:3001");


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);

  function joinRoom() {
    socket.emit("join_room", room);
    setJoinedRoom(true);
  }

  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  });

  const [signupStatus, setSignupStatus] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  function signupChanged(event) {
    setSignupDetails((prevValue)=> {
      return {
        ...prevValue,
        [event.target.name]: event.target.value
      }
    });
  }

  function loginChanged(event) {
    setLoginDetails((prevValue) =>{
      return {
        ...prevValue,
        [event.target.name]: event.target.value
      }
    });
  }

  async function signupSubmit(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/register", {
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(signupDetails),
      method: "POST"
    });

    const data = await response.json();
    setSignupStatus(data.status);
  }

  async function loginSubmit(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/login", {
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(loginDetails),
      method: "POST"
    });

    const data = await response.json();
    setLoginStatus(data.status);
    setUsername(data.name);
  }

  return (
    <div className="App">
      {loginStatus !== "yeah" ? <Signup signupChanged={signupChanged} loginChanged={loginChanged} loginSubmit={loginSubmit} signupSubmit={signupSubmit} signupStatus={signupStatus} loginStatus={loginStatus} />
      : !joinedRoom ? <div>
        <input type="text" placeholder='Room ID...' onChange={(event)=> {setRoom(event.target.value)}}></input>
        <button onClick={joinRoom}>Join Room</button>
      </div>
      :<Chats socket={socket} username={username} room={room} />}
    </div>
  );
}

export default App;
