import { useQuery, useMutation, gql } from '@apollo/client';
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
          cache.writeQuery({
              query: AUTHENTICATED_USER_QUERY,
              data: { authenticatedUser: login.user }
          });
          localStorage.setItem('token', login.token);
      }
  });

  return {login, result}
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