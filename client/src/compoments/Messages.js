import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import { v4 as uuidV4 } from 'uuid';
import { useUserInfo } from '../context/UserInfoProvider';

export default function Messages({ room }) {
  const [message, setMessage] = useState('');
  const [receiveMessages, setReceiveMessages] = useState([]);
  const defaultImg =
    'http://beepeers.com/assets/images/tradeshows/default-image.jpg';
  const user = useUserInfo();
  const socket = useSocket();
  const setRef = useCallback(
    (node) => {
      if (node) {
        node.scrollIntoView({ smooth: true });
      }
    },
    []
  );

  useEffect(() => {
    socket.on('receive-message', (sender) => {
      setReceiveMessages((cur) => [...cur, sender]);
    });
    return () => socket.off('receive-message');
  }, [socket]);

  function handleSunbmit(e) {
    e.preventDefault();
    if (!message) return;

    const sender = {
      username: user.username,
      avatar: user.avatar,
      message: message,
      messageId: uuidV4(),
    };

    socket.emit('send-message', sender, room);
    setMessage('');
  }

  return (
    <section className="chat">
      <div className="messages">
        {receiveMessages.map((sender, index) => {
          if (sender.username === 'system') {
            return (
              <div
                className="system_message"
                key={sender.username + sender.message + sender.time}
              >
                <p>{sender.message}</p>
              </div>
            );
          }
          return (
            <div
              className="message_wrapper"
              key={sender.messageId}
              ref={index === receiveMessages.length - 1 ? setRef : null}
            >
              <div className="avatar">
                <img
                  src={sender.avatar}
                  alt={sender.username}
                  onError={(e) => (e.target.src = defaultImg)}
                />
              </div>
              <div className="content">
                <span className="author">{sender.username}</span>
                <span className="time">{sender.time}</span>
                <p className="message">{sender.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form className="message_input" onSubmit={handleSunbmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">send</button>
      </form>
    </section>
  );
}
