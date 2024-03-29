import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const Announcement = () => {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const socket = socketIOClient('http://127.0.0.1:5000/');

    socket.on('announcement', (res) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        setAnnouncement({ ...res[0], timestamp });
    })
    socket.on('connect_error', (error) => {console.error('Socket connection error:', error);});
    socket.on('disconnect', () => {console.log('Socket disconnected')});

    return () => {socket.disconnect();};
  }, []);

  return (
    <div className='container'>
      {announcement && (
        <p className="blockquote-footer">
          Time: {announcement.timestamp} &emsp;
          Manufacturer : {announcement.name} &emsp;
          Model: {announcement['name.1']} &emsp;
          TAC: {announcement.tac} &emsp;
        </p>
      )}
    </div>
  );
}

export default Announcement;