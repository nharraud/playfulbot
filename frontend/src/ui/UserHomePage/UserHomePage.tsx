import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme, Typography } from '@material-ui/core';
import { useAuthenticatedUser } from 'src/hooksAndQueries/authenticatedUser';
import MenuBar from '../MenuBar/MenuBar';
import { useAuthenticatedUserTournamentsQuery, useRegisterTournamentInvitationLinkMutation } from '../../types/graphql';
import { InvitedTournamentsList } from './InvitedTournamentsList';
import { JoinedTournamentsList } from './JoinedTournamentsList';
import { useURIQuery } from 'src/utils/router/useURIQuery';
import { useHistory } from 'react-router';

import textures from 'textures';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    welcomeTitle: {
      flex: '0 0 auto',
      marginTop: theme.spacing(5),
    },
    mainRow: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'

    },
    column: {
      flex: '1 1 auto',
      display: 'flex',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      marginTop: theme.spacing(25),
    },
    texture: {

    }
  }),
);

// function dom(name?: string) {
//   this.name = name;
//   this.els = [];
//   this.attrs = {};
// }

// dom.prototype.append = function(name) {
//   if (name === "defs") return this;
//   if (this.name === undefined) {
//     this.name = name;
//     return this;
//   }
//   var el = new dom(name);
//   this.els.push(el);
//   return el;
// }
// dom.prototype.attr = function(key, value) {
//   this.attrs[key] = value;
//   return this;
// }
// dom.prototype.toString = function() {
//   var attrs = '';
//   var k;
//   for (k in this.attrs) {
//     attrs += " " + k + "='" + this.attrs[k] + "'";
//   }
//   if (this.els.length) {
//     return "<"+this.name+attrs+">"+this.els.map(function(el) { return el.toString()}).join('\n')+"</"+this.name+">";
//   } else {
//     return "<"+this.name+attrs+"/>"
//   }
// }

class TextureElement {
  name: string;
  attrs: Record<string, string> = {};
  elements = new Array<TextureElement>();

  constructor(name: string) {
    this.name = name;
  }

  append(name): TextureElement {
    const newElement = new TextureElement(name);
    this.elements.push(newElement);
    return newElement;
  }

  attr(key, value): this {
    this.attrs[key] = value;
    return this;
  }
}

class TextureDefinition {
  pattern: TextureElement
  append(name): TextureElement | TextureDefinition {
    if (name === 'defs') {
      return this
    }
    if (this.pattern !== undefined) {
      return this.pattern;
    }
    const newElement = new TextureElement(name);
    this.pattern = newElement;
    return newElement;
  }
}

function TextureSubComponent(props) {
  if (props.def.name === 'path') {
    return (
      <path {...props.def.attrs}/>
    )
  } else if (props.def.name === 'circle') {
    return (
      <circle {...props.def.attrs}/>
    )
  } else if (props.def.name === 'rect') {
    return (
      <rect {...props.def.attrs}/>
    )
  } else {
    throw new Error(`Texture element "${props.def.name}" is not supported`);
  }
}

function Texture() {
  const texture = textures
  .circles()
  .thinner()
  .heavier()
  .complement()
  .radius(4)
  .fill("transparent")
  .stroke("white")
  .strokeWidth(2);

  const texture2 = textures
  .paths()
  .d("waves")
  .thicker()
  .stroke("white");

  const texture3 = textures
  .paths()
  .d("nylon")
  .lighter()
  .shapeRendering("crispEdges")
  .stroke("white");

  const texture4 = textures
  .lines()
  .thicker()
  .stroke("white");

  const texture5 = textures
  .lines()
  .orientation("3/8", "7/8")
  .stroke("white");

  const texture6 = textures
  .paths()
  .d("woven")
  .lighter()
  .thinner()
  .stroke("white");

  const texture7 = textures
  .lines()
  .heavier(5)
  .thinner(1.5)
  .stroke("white");

  // var sel = new dom();
  // texture(sel);
  // console.log(sel.attrs['id']);
  // console.log(sel.toString())
  const def = new TextureDefinition();
  // texture7(def);
  // texture(def);
  // texture2(def);
  texture3(def);
  // texture4(def);
  // texture5(def);
  texture6(def);

  return (
  <svg viewBox="0 0 230 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern {...def.pattern.attrs}>
      { def.pattern.elements.map((elt) => <TextureSubComponent def={elt}/>)}
      {/* <polygon points="0,0 2,5 0,10 5,8 10,10 8,5 10,0 5,2"/> */}
    </pattern>
  </defs>

  {/* <circle cx="50"  cy="50" r="50" fill="url(#star)"/>
  <circle cx="180" cy="50" r="40" fill="none" stroke-width="20" stroke="url(#star)"/> */}
  <rect width="300" height="100" fill={`url(#${def.pattern.attrs['id']})`}/>
  </svg>
  )
}

export function UserHomePage() {
  const classes = useStyles();
  const { authenticatedUser } = useAuthenticatedUser();
  const { error, data: userTournaments, refetch: refetchUserTournaments } = useAuthenticatedUserTournamentsQuery();

  const history = useHistory()
  const [ registerTournamentInvitation, tournamentInvitationResult ] = useRegisterTournamentInvitationLinkMutation();
  const query = useURIQuery();
  const tournamentInvitationLinkID = query.get('tournament_invitation');
  useEffect(() => {
    if (tournamentInvitationLinkID) {
      query.delete('tournament_invitation')
      history.replace({
        search: query.toString(),
      })
      registerTournamentInvitation({
        variables: { tournamentInvitationLinkID }
      });
    }
  }, [tournamentInvitationLinkID, query, history, registerTournamentInvitation, refetchUserTournaments]);

  const [ invitationProcessed, setInvitationProcessed ] = useState(false);
  useEffect(() => {
    if (tournamentInvitationResult.data && !invitationProcessed) {
      setInvitationProcessed(true);
      refetchUserTournaments();
    }
  }, [tournamentInvitationResult.data, invitationProcessed, setInvitationProcessed, refetchUserTournaments]);




  return (
  <div className={classes.root}>
    <MenuBar />
    <Typography variant='h3' className={classes.welcomeTitle}>
      Welcome { authenticatedUser?.username }!
    </Typography>
    <div className={classes.texture}>
      <Texture/>
    </div>
    <div className={classes.mainRow}>
      <div className={classes.column}>
        <JoinedTournamentsList teams={userTournaments?.authenticatedUser?.teams}/>
      </div>
      <div className={classes.column}>
        <InvitedTournamentsList invitations={userTournaments?.authenticatedUser?.tournamentInvitations}/>
      </div>
    </div>
  </div>
  )
}