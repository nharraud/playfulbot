
import React, { useCallback, useEffect, useState } from 'react';

export const UserContext = React.createContext({
  authenticated: localStorage.getItem('token') !== null,
  setToken: (token: string) => {},
  deleteToken: () => {},
});

export function triggerUserContextUpdate() {
  var event = new Event("updateUserContexts");
  document.dispatchEvent(event);
}

export function UserContextProvider(props) {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null)

  const setToken = useCallback((token: string) => {
    localStorage.setItem('token', token);
    setAuthenticated(true);
  }, []);

  const deleteToken = useCallback(() => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  }, []);

  useEffect(() => {
    const checkToken = () => {
      setAuthenticated(localStorage.getItem('token') !== null);
    }
    document.addEventListener("updateUserContexts", checkToken);

    return () => {
      document.removeEventListener("updateUserContexts", checkToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{authenticated, setToken, deleteToken}}>
        {props.children}
    </UserContext.Provider>
  )
}