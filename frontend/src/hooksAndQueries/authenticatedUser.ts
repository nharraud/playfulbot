import { useQuery, ApolloCache } from '@apollo/client';
import { useCallback, useContext } from 'react';
import { client } from '../apolloConfig';
import { useHistory } from "react-router-dom";

import * as gqlTypes from '../types/graphql';
import { UserContext } from 'src/UserContext';


export function useAuthenticatedUser() {
    const { authenticated } = useContext(UserContext);

    const { error, data } = useQuery<gqlTypes.GetAuthenticatedUserQuery>(gqlTypes.GetAuthenticatedUserDocument, {
        skip: localStorage.getItem('token') === null
    });

    return { authenticatedUser: data ? data.authenticatedUser: null };
};


function updateAuthentication(cache: ApolloCache<any>, loginResult: any) {
    cache.writeQuery({
        query: gqlTypes.GetAuthenticatedUserDocument,
        data: { authenticatedUser: loginResult.user }
    });
}


export function useRegisterUser() {
    const { setToken } = useContext(UserContext);
    const [register, result] = gqlTypes.useRegisterUserMutation({
        update(cache, { data: { registerUser } }) {
            updateAuthentication(cache, registerUser);
            setToken(registerUser.token);
        }
    });

    const registerCallback = useCallback(
        (username, password) => register({ variables: { username, password } }),
         [register]
    );

    return {registerUser: registerCallback, result}
};


export function useLogin() {
    const { setToken } = useContext(UserContext);
    const history = useHistory();
    const [login, result] = gqlTypes.useLoginMutation({
        update(cache, { data: { login } }) {
            updateAuthentication(cache, login);
            setToken(login.token);
            history.push('/home');
        }
    });

  const loginCallback = useCallback(
      (username, password) => login({ variables: { username, password } }),
       [login]
  );

  return {login: loginCallback, result}
};


export function useLogout() {
    const { authenticated, deleteToken } = useContext(UserContext);
    const [logoutMutation, result] = gqlTypes.useLogoutMutation({
        onCompleted() {
            deleteToken();
            client.clearStore();
        }
    });
    
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        logoutMutation();
    }, [logoutMutation]);
  
    return {logout}
  };
