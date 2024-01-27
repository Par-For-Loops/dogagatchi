import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { socket } from '../socket.js';

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messageEvents, setMessageEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userObj = JSON.parse(sessionStorage.getItem('user'));

  const smoothScroll = () => {
    const anchor = document.getElementById('message-area');
    anchor.scrollTo(0, anchor.scrollHeight);
  }

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

    smoothScroll();

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
    const now = new Date();
    socket.timeout(1000).emit(
      'message',
      {
        message: `${userObj.username}: ${message}`,
        createdAt: now.toISOString(),
      },
      () => {
        setIsLoading(false);
        setMessage('');
      }
    );
    axios
      .post('/messages/post', { message: `${userObj.username}: ${message}` })
      .catch((err) => console.error('Could not POST msg: ', err));
  };

  const enterKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      emitMessage();
    }
  }

  return (
    <div className='chat'>
      <div className='message-area' id='message-area'>
        <ul>
          {messageEvents.map((msg, i) => (
            <div key={i}>
              {msg.message} - {dayjs(msg.createdAt).format('h:mm:ss a')}
            </div>
          ))}
        </ul>
        <div id='anchor'></div>
      </div>
      <div className='input-area'>
        <textarea
          className='chat-textarea'
          placeholder='Type message here...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => enterKeydown(e)}
        />
        <button type='button' disabled={isLoading} onClick={emitMessage}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Chat;
