import React, {useEffect, useMemo, useState} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import SendIcon from '@mui/icons-material/Send';

function Chats (props) {
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

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

    return <div className="chat-window">
        <div className="chat-header">
            <p>Room ID: {props.room}</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((content)=> {
                    return <div className="message" id={content.username === props.username ? "you": "other"}>
                        <div>
                            <div className="message-content" id={content.username === props.username ? "you": "other"}>
                                <p>{content.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{content.time}</p>
                                <p id="author">{content.username}</p>
                            </div>
                        </div>
                    </div>;
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
}

export default Chats;