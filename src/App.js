import { useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chats from "./Chats";
import Signup from './Signup';
import { connection } from './connection';
const randomize = require('randomatic');

const socket = io.connect(connection);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [wrongRoom, setWrongRoom] = useState("neutral");
  const logged = localStorage.getItem("logged");
  const reloadedUsername = localStorage.getItem("reloadedUsername");
  const reloadedRoom = localStorage.getItem("reloadedRoom");
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


  if (reloadedUsername)
  {
    async function execute() {
      await socket.emit("send_message", {
        room: reloadedRoom,
        username: reloadedUsername,
        message: `${reloadedUsername} left the chat`,
        time: new Date(Date.now()).getHours() + ":" + ("0" + new Date(Date.now()).getMinutes()).substr(-2),
        t: "announce"
      });
      localStorage.removeItem("reloadedUsername");
      localStorage.removeItem("reloadedRoom");
    }
    execute();
  }

  async function joinRoom() {
    const response = await fetch(connection + "/rooms", {
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({room: room}),
      method: "POST"
    });

    const data = await response.json();
    setWrongRoom(data.status);
    if (wrongRoom === "no")
    {
      socket.emit("join_room", {room: room, username: localStorage.getItem("logged")});
      socket.emit("send_message", {
        room: room,
        username: localStorage.getItem("logged"),
        message: `${localStorage.getItem("logged")} joined the chat`,
        time: new Date(Date.now()).getHours() + ":" + ("0" + new Date(Date.now()).getMinutes()).substr(-2),
        t: "announce"
      });
      setJoinedRoom(true);
    }
  }

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
    const response = await fetch(connection + "/register", {
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
    const response = await fetch(connection + "/login", {
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(loginDetails),
      method: "POST"
    });

    const data = await response.json();
    setLoginStatus(data.status);
    if (data.status === "yeah")
    {
      localStorage.setItem("logged", data.name);
    }
    setUsername(data.name);
  }

  function createNewRoom() {
    const roomID = randomize('0', 8);
    socket.emit("join_room", {room: roomID, username: localStorage.getItem("logged")});
    socket.emit("send_message", {
      room: roomID,
      username: username,
      message: `${username} joined the chat`,
      time: new Date(Date.now()).getHours() + ":" + ("0" + new Date(Date.now()).getMinutes()).substr(-2),
      t: "announce"
    });
    setJoinedRoom(true);
    setRoom(roomID);
  }

  return (
    <div className="App">
      {!logged ? <Signup signupChanged={signupChanged} loginChanged={loginChanged} loginSubmit={loginSubmit} signupSubmit={signupSubmit} signupStatus={signupStatus} loginStatus={loginStatus} />
      : !joinedRoom ? <div>
        <h1 style={{display: "flex", justifyContent: "center", color: "white"}}>Username: {logged}</h1>
        <button onClick={createNewRoom} id="create-new-room">Create New Room</button>
        {wrongRoom === "yeah" ? <p style={{color: "red", display: "flex", justifyContent: "center"}}>Wrong room ID entered, Re-enter the room ID or create a new one</p>: null}
        <input type="text" placeholder='Room ID...' onChange={(event)=> {setRoom(event.target.value)}}></input>
        <button onClick={joinRoom}>Join Room</button>
        <button id="logout" onClick={()=> {localStorage.removeItem("logged"); window.location.reload();}}>Logout</button>
      </div>
      :<Chats socket={socket} username={logged} room={room} />}
    </div>
  );
}

export default App;
