import React, {useEffect, useMemo, useState} from "react";
import ScrollToBottom from "react-scroll-to-bottom";

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
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
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
        });
    }, [props.socket]);

    return <div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((content)=> {
                    return <div className="message" id={content.username === props.username ? "you": "other"}>
                        <div>
                            <div className="message-content">
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
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
}

export default Chats;