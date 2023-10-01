import React, {useEffect, useMemo, useState} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import { connection } from "./connection";
import Member from "./Member";

function Chats (props) {
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [messageListGettingToggle, setMessageListGettingToggle] = useState(true);
    const [memberList, setMemberList] = useState([]);

    window.onbeforeunload = ()=> {
        window.localStorage.setItem("reloadedUsername", props.username);
        window.localStorage.setItem("reloadedRoom", props.room);
    }

    function typingText(event) {
        setMessage(event.target.value);
    }

    async function sendMessage(event) {
        if (message !== "")
        {
            const messageData = {
                room: props.room,
                username: props.username,
                message: message,
                time: new Date(Date.now()).getHours() + ":" + ("0" + new Date(Date.now()).getMinutes()).substr(-2),
                t: "message"
            };

            await props.socket.emit("send_message", messageData);
            setMessageList((d)=> {
                return [...d, messageData];
            });
            setMessage("");
            setMessageListGettingToggle(messageListGettingToggle);
        }
    }

    useMemo(()=> {
        props.socket.on("recieve_message", (data)=> {
            setMessageList((d)=> {
                return [...d, data];
            });
            console.log(messageList[messageList.length - 1]);
        });
    }, [props.socket]);

    useEffect(()=> {
        async function execute()
        {
            const response = await fetch(connection + `/get/${props.room}`);
            const jsonData = await response.json();
            if (jsonData.messages)
            {
                setMessageList(jsonData.messages);
            }
        }
        execute();
    }, []);

    useEffect(()=> {
        async function fetchData() {
            const response = await fetch(connection + `/members/${props.room}`)
            const jsonData = await response.json();
            if (jsonData) {
                setMemberList(jsonData.members);
            }
        }
        fetchData();
    }, [messageList])

    async function copy() {
        const roomID = props.room;
        await navigator.clipboard.writeText(roomID);
        const para = document.querySelector(".chat-header #copied");
        para.innerHTML = "copied";
	    setTimeout(function () {
	    	para.innerHTML = "";
	    }, 2500);
    }

    return (
    <div>
    <div className="full">
        <div className="members">
            <div className="members-header">
                <button onClick={()=> {window.location.reload()}} ><LogoutIcon /></button>
                <p>Members</p>
            </div>
            {memberList !== undefined ? memberList.map((n)=> {return <Member name={n} />}) : null}
        </div>
    <div className="chat-window">
        <div className="chat-header">
            <p>Room ID: {props.room}</p>
            <button id="copy" onClick={copy}><ContentCopyIcon /></button>
            <p id="copied"></p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((content)=> {
                    return content.t !== "announce" ?
                        <div className="message" id={content.username === props.username ? "you": "other"}>
                        <div>
                            <div className="message-content" id={content.username === props.username ? "you": "other"}>
                                <p>{content.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{content.time}</p>
                                <p id="author">{content.username}</p>
                            </div>
                        </div>
                    </div>
                    : <p id="announce">{content.message}</p>;
                })}
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input value={message} type="text" placeholder="Write your message" onChange={typingText} onKeyDown={(event)=> {
                event.key === "Enter" && sendMessage();
            }} />
            <button onClick={sendMessage} style={{backgroundColor: "#e0dede", color: "grey"}}><SendIcon /></button>
        </div>
    </div>
    </div>
    </div>)
}

export default Chats;