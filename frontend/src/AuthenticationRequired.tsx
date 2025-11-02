import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from './UserContext';

// export function AuthenticationRequired(props) {
//   const { authenticated } = useContext(UserContext);
//   const navigate = useNavigate();
//   if (authenticated) {
//     console.log('authenticated', props.children)
//     return props.children;
//   }
//   navigate('/login');
//   return <div />;
// }

export function authenticationRequired() {
  const { authenticated } = useContext(UserContext);
  const navigate = useNavigate();
  if (!authenticated) {
    navigate('/login');
  }
}