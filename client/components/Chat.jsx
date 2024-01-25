import React, { useState, useEffect } from 'react';
import { socket } from '../socket.js';

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userObj = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    console.log(userObj);
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onMessageEvent(value) {
      setMessageEvents((previous) => [...previous, value]);
    }

    socket.on('message', onMessageEvent);

    return () => {
      socket.off('message', onMessageEvent);
    };
  }, [messageEvents]);

  const emitMessage = () => {
    setIsLoading(true);
    socket
      .timeout(1000)
      .emit('message', `${userObj.username}: ${message}`, (err) => {
        setIsLoading(false);
        if (err) {
          emit(socket, 'message', `${userObj.username}: ${message}`);
        }
      });
  };

  return (
    <div className='chat'>
      <p>State: {'' + isConnected}</p>
      <button onClick={() => socket.connect()}>Connect</button>
      <button onClick={() => socket.disconnect()}>Disconnect</button>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type='button' disabled={isLoading} onClick={emitMessage}>
        Submit
      </button>
      <ul>
        {messageEvents.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
