import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';

export default function Members() {
  const socket = useSocket();
  const [members, setMebers] = useState([]);

  useEffect(() => {
    socket.on('room-users', (data) => {
      setMebers(data.users);
    });
    return () => socket.off('room-users');
  }, [socket]);

  return (
    <section className="members">
      <header>
        <h3>Room Members</h3>
        <span>{members.length}</span>
      </header>
      {members.map((member) => {
        return (
          <div className="member_wrapper" key={member.id}>
            <span className="icon-dot">
              <i className="fa-solid fa-circle"></i>
            </span>
            <p className="member">{member.username}</p>
          </div>
        );
      })}
    </section>
  );
}
