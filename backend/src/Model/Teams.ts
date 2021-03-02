import { v4 as uuidv4 } from 'uuid';

import { Team, TeamID, UserID, User } from '~playfulbot/types/backend';
import { getUserByID } from '~playfulbot/Model/Users';

const teams: Team[] = [];

export function getTeamByName(name: string): Team | undefined {
  return teams.find((team) => team.name === name);
}

export function getTeamByID(id: TeamID): Team | undefined {
  return teams.find((team) => team.id === id);
}

export function getTeamMemberID(userID: UserID): Team | undefined {
  const matchProvidedUser = (user: User) => user.id === userID;
  return teams.find((team) => team.members.find(matchProvidedUser));
}

export function createTeam(name: string): Team {
  const team: Team = {
    id: uuidv4(),
    name,
    members: [],
  };
  teams.push(team);
  return team;
}

export function addTeamMember(teamID: TeamID, userID: UserID): void {
  const team = getTeamByID(teamID);
  const user = getUserByID(userID);
  team.members.push(user);
}
