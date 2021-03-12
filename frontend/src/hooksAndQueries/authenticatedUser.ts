import { useQuery, useMutation, gql, ApolloCache } from '@apollo/client';
import { useCallback } from 'react';
import { client } from '../apolloConfig';

const AUTHENTICATED_USER_QUERY = gql`
    query getAuthenticatedUser {
        authenticatedUser { id, username }
    }
`;

export function useAuthenticatedUser() {
    const { loading, error, data } = useQuery(AUTHENTICATED_USER_QUERY);
    return { authenticatedUser: data ? data.authenticatedUser: null };
};


function updateAuthentication(cache: ApolloCache<any>, loginResult: any) {
    cache.writeQuery({
        query: AUTHENTICATED_USER_QUERY,
        data: { authenticatedUser: loginResult.user }
    });
    localStorage.setItem('token', loginResult.token);
}


const REGISTER_USER_MUTATION = gql`
  mutation registerUser($username: String!, $password: String!) {
      registerUser(username: $username, password: $password) {
          user {
              id, username
          }
          token
      }
  }
`;

export function useRegisterUser() {
    const [register, result] = useMutation(REGISTER_USER_MUTATION, {
        update(cache, { data: { registerUser } }) {
            updateAuthentication(cache, registerUser);
        }
    });

    const registerCallback = useCallback(
        (username, password) => register({ variables: { username, password } }),
         [register]
    );

    return {registerUser: registerCallback, result}
};


const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            user {
                id, username
            }
            token
        }
    }
`;

export function useLogin() {
  const [login, result] = useMutation(LOGIN_MUTATION, {
      update(cache, { data: { login } }) {
        updateAuthentication(cache, login);
      }
  });

  const loginCallback = useCallback(
      (username, password) => login({ variables: { username, password } }),
       [login]
  );

  return {login: loginCallback, result}
};

const LOGOUT_MUTATION = gql`
    mutation logout {
        logout
    }
`;

export function useLogout() {
    const [logout, result] = useMutation(LOGOUT_MUTATION, {
        onCompleted() {
            localStorage.removeItem('token');
            client.resetStore();
        }
    });
  
    return {logout}
  };
