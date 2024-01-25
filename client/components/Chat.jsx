import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../socket.js';

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userObj = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    axios
      .get('/messages/all')
      .then(({ data }) => {
        setMessageEvents(data);
      })
      .catch((err) => {
        console.error('Could not GET all msgs: ', err);
      });

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
      // console.log(value);
      setMessageEvents((previous) => [...previous, value]);
    }

    socket.on('message', onMessageEvent);

    return () => {
      socket.off('message', onMessageEvent);
    };
  }, [messageEvents]);

  const emitMessage = () => {
    setIsLoading(true);
    const now = new Date();
    socket
      .timeout(1000)
      .emit(
        'message',
        { message: `${userObj.username}: ${message}`, createdAt: now.toISOString() },
        () => {
          setIsLoading(false);
        }
      );
    axios
      .post('/messages/post', { message: `${userObj.username}: ${message}` })
      .catch((err) => console.error('Could not POST msg: ', err));
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
          <li key={i}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
