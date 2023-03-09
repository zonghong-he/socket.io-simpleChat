import React from 'react';
import Login from './Login';
import { SocketProvider } from '../context/SocketProvider';
import useLocalStorage from '../hook/useLocalStorage';
import '../styles/style.scss';
import Room from './Room';
import { UserInfoProvider } from '../context/UserInfoProvider';

function App() {
  const [user, setUser] = useLocalStorage('user', {});

  const dashboard = (
    <SocketProvider id={user.id}>
      <UserInfoProvider user={user}>
        <Room room={'chat1'} />
      </UserInfoProvider>
    </SocketProvider>
  );

  return <>{user.id ? dashboard : <Login onIdSubmit={setUser} />}</>;
}

export default App;
