import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from 'react-bootstrap';
import { socket } from '../socket.js';

const Chat = () => {
  const [messageEvents, setMessageEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // used to target div that contains message elements
  const div = useRef(null);

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

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onMessageEvent(value) {
      setMessageEvents((previous) => [...previous, value]);
    }

    socket.on('message', onMessageEvent);

    // automatically scrolls to bottom of messages with each state change
    div.current.scrollIntoView({behavior: "smooth", block: "end"});

    return () => {
      socket.off('message', onMessageEvent);
    };
  }, [messageEvents]);

  const emitMessage = () => {
    setIsLoading(true);
    const now = new Date();
    socket.timeout(500).emit(
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

  const messageElements = messageEvents.map((msg, i) => {
    if (msg.message.split(': ')[0] === userObj.username) {
      return (
        <div className="right-message" key={i}>
          <div>
          <span className="right-name-time">
            <span className="right-msg-time">{dayjs(msg.createdAt).format('h:mm:ss a')}</span>
          </span>
          </div>
          <div className="right-msg-content">{msg.message.split(': ')[1]}</div>
        </div>
      );
    } else {
      return (
        <div className="message" key={i}>
          <div>
          <span className="name-time">
            <span className="msg-name">{msg.message.split(': ')[0]}</span>
            <span>{'   '}</span>
            <span className="msg-time">{dayjs(msg.createdAt).format('h:mm:ss a')}</span>
          </span>
          </div>
          <div className="msg-content">{msg.message.split(': ')[1]}</div>
        </div>
      );
    }
});

  return (
    <div className='chat'>
      <div className='message-area'>
        <div ref={div}>
          {messageElements}
        </div>
      </div>
      <div className='input-area'>
        <textarea
          className='chat-textarea'
          placeholder='Type message here...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => enterKeydown(e)}
        />
        <Button type='button' disabled={isLoading} onClick={emitMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
