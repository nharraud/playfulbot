import { ApolloCache } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useCallback, useContext } from 'react';

import { UserContext } from 'src/UserContext';
import { useNavigate } from 'react-router';
import { useURIQuery } from 'src/utils/router/useURIQuery';
// import { client } from '../../../infrastructure/graphql/useGraphqlClient';
import { BackendClientContext } from 'src/infrastructure/graphql/GraphqlClientContexts'

import { graphql } from '../../../types/backend/graphql';
 
const getAuthenticatedUserQuery = graphql(`
  query getAuthenticatedUser {
    authenticatedUser { id, username }
  }
`)

export function useAuthenticatedUser() {
  const { authenticated } = useContext(UserContext);
  const client = useContext(BackendClientContext);

  const { error, data } = useQuery(
    getAuthenticatedUserQuery,
    {
      skip: localStorage.getItem('token') === null,
      client
    }
  );

  return { authenticatedUser: data ? data.authenticatedUser : null };
}

function updateAuthentication(cache: ApolloCache, loginResult: any) {
  cache.writeQuery({
    query: getAuthenticatedUserQuery,
    data: { authenticatedUser: loginResult.user },
  });
}

export function useRedirectionAfterAuthentication() {
  const navigate = useNavigate();
  const query = useURIQuery();
  const tournamentInvitationID = query.get('tournament_invitation');

  return useCallback(() => {
    if (tournamentInvitationID) {
      navigate(`/home?tournament_invitation=${tournamentInvitationID}`, { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  }, [tournamentInvitationID, navigate]);
}

// export function useRegisterUser() {
//   const { setToken } = useContext(UserContext);
//   const redirect = useRedirectionAfterAuthentication();
//   const [register, result] = gqlTypes.useRegisterUserMutation({
//     update(cache, { data: { registerUser } }) {
//       updateAuthentication(cache, registerUser);
//       setToken(registerUser.token);
//       redirect();
//     },
//   });

//   const registerCallback = useCallback(
//     (username, password) => register({ variables: { username, password } }),
//     [register]
//   );

//   return { registerUser: registerCallback, result };
// }

const loginMutation = graphql(`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        user {
            id, username
        }
        token
    }
  }
`)

export function useLogin() {
  const { setToken } = useContext(UserContext);
  const client = useContext(BackendClientContext);
  const redirect = useRedirectionAfterAuthentication();
  const [login, result] = useMutation(loginMutation, {
      update: function update (cache, { data: { login } }) {
        updateAuthentication(cache, login);
        setToken(login.token);
        redirect();
      },
      client
  });

  const loginCallback = useCallback(
    (username: string, password: string) => login({
      variables: { username, password }
    }),
    [login]
  );

  return { login: loginCallback, result };
}

const logoutMutation = graphql(`
  mutation logout {
    logout
}`);

export function useLogout() {
  const client = useContext(BackendClientContext);
  const { authenticated, deleteToken } = useContext(UserContext);
  const [logoutMut, result] = useMutation(logoutMutation, {
    onCompleted() {
      deleteToken();
      client?.clearStore();
    },
    client
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    logoutMut();
  }, [logoutMut]);

  return { logout };
}
