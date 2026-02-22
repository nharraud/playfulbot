import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';

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
import { AuthenticationRequired } from './AuthenticationRequired';
import { BackendClientProvider } from './infrastructure/graphql/GraphqlClientProviders';
import cssCls from './App.module.css';

import { ThemeProvider } from './ui/Theme';
import { IntlProvider } from 'react-intl';
import langMessages from 'compiled-lang/en.json';
// import { TournamentInvitationPage } from './ui/TournamentInvitation/TournamentInvitationPage';


function App() {
  return (
    <div className={cssCls.app}>
      <ThemeProvider>
        <IntlProvider messages={langMessages} locale="en" defaultLocale="en">
          <BackendClientProvider>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
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
                      <Route element={<AuthenticationRequired/>}>
                        <Route path="/home" loader={AuthenticationRequired} element={<UserHomePage />}/>
                        <Route path="/tournament/:tournamentID/*" loader={AuthenticationRequired} element={<TournamentPage />}/>
                        {/* 
                        <Route path="/create_tournament">
                          <TournamentCreationPage />
                        </Route>
                        */}
                      </Route>
                    </Routes>
                  </Router>
                </UserContextProvider>
              </div>
            </LocalizationProvider>
          </BackendClientProvider>
        </IntlProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
