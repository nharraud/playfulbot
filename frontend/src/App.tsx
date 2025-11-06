import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import LuxonUtils from '@date-io/luxon';
import { ApolloProvider } from '@apollo/client/react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import logo from './logo.svg';
import './App.css';
import Login from './ui/Login';
// import Registration from './ui/Registration';

import TournamentPage from './ui/Tournament/TournamentPage';
// import TournamentCreationPage from './ui/Tournament/TournamentCreationPage';
import { LandingPage } from './ui/LandingPage/LandingPage';
import { UserContextProvider } from './UserContext';
import { UserHomePage } from './ui/UserHomePage/UserHomePage';
import { authenticationRequired } from './AuthenticationRequired';
import { BackendClientProvider } from './infrastructure/graphql/GraphqlClientProviders';
import cssCls from './App.module.css';
// import { TournamentInvitationPage } from './ui/TournamentInvitation/TournamentInvitationPage';

// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }



// declare module '@mui/styles/defaultTheme' {
//   // eslint-disable-next-line @typescript-eslint/no-empty-interface
//   interface DefaultTheme extends Theme {}
// }

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}



declare module '@mui/material/styles/createPalette' {
  interface Palette {
    menu: Palette['primary'];
    code: PaletteOptions['text'];
  }
  interface PaletteOptions {
    menu: PaletteOptions['primary'];
    code: PaletteOptions['text'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ef5350',
    },
    menu: {
      main: '#3f51b5',
      dark: '#303f9f',
    },
    background: {
      default: '#212121',
      paper: '#353535',
    },
    code: {
      primary: '#ffa657',
    },
  },
  typography: {
    h1: {
      fontSize: '2.3rem',
      fontWeight: 400,
    },
    h2: {
      fontSize: '2.0rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
  },
});

function App() {
  return (
    // <ApolloProvider client={client}>
    <div className={cssCls.theme}>
      <BackendClientProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <CssBaseline />
              <div className="App">
                <UserContextProvider>
                  <Router>
                    <Routes>
                      <Route exact path="/" element={ <LandingPage />}/>
                      <Route path="/login" element={<Login />}/>
                      {/* <Route path="/register" element={<Registration />}/> */}
  {/*
                      <Route path="/tournament_invitation/:tournamentInvitationLinkID">
                        <TournamentInvitationPage />
                      </Route>
  */}
                      {/* <Route element={<AuthenticationRequired/>}> */}
                        <Route path="/home" loader={authenticationRequired} element={<UserHomePage />}/>
                        <Route path="/tournament/:tournamentID/*" loader={authenticationRequired} element={<TournamentPage />}/>
                        {/* 
                        <Route path="/create_tournament">
                          <TournamentCreationPage />
                        </Route>
                        */}
                      {/* </Route> */}
                    </Routes>
                  </Router>
                </UserContextProvider>
              </div>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>

      </BackendClientProvider>
    </div>
  );
}

export default App;
