import React, { useContext, useEffect, useState } from 'react';

const UserInfoContext = React.createContext(null);

export function useUserInfo() {
  return useContext(UserInfoContext);
}
export function UserInfoProvider({ user, children }) {
  const [userInfo,setUserInfo] = useState(null)

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  return (
    <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>
  );
}
