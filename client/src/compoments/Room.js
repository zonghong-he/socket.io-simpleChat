import React, { useEffect} from 'react';
import { useSocket } from '../context/SocketProvider';
import { useUserInfo } from '../context/UserInfoProvider';
import Members from './Members';
import Messages from './Messages';

export default function Room({ room }) {
  const socket = useSocket();
  const user = useUserInfo();

  useEffect(() => {
    if (socket == null || user == null) return;

    socket.emit('join-room', user.username, room);
  }, [user, socket, room]);

  return (
    <>
      <header className="main_header">
        <h1>{room}</h1>
      </header>
      <main className="room">
        <Members />
        <Messages room={room} />
      </main>
    </>
  );
}
