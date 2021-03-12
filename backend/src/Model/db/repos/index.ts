import { TournamentsRepository } from './tournaments';
import { UsersRepository } from './users';

// Database Interface Extensions:
interface IExtensions {
  users: UsersRepository;
  tournaments: TournamentsRepository;
}

export { IExtensions, UsersRepository, TournamentsRepository };
