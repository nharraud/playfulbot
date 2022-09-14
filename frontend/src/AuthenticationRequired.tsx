import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './UserContext';

export function AuthenticationRequired(props) {
  const { authenticated } = useContext(UserContext);
  const history = useHistory();
  if (authenticated) {
    return props.children;
  }
  history.push('/login');
  return <div />;
}
