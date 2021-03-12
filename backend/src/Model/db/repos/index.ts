import { TeamsRepository } from './teams';
import { TournamentsRepository } from './tournaments';
import { UsersRepository } from './users';

// Database Interface Extensions:
interface IExtensions {
  users: UsersRepository;
  tournaments: TournamentsRepository;
  teams: TeamsRepository;
}

export { IExtensions, UsersRepository, TournamentsRepository, TeamsRepository };
