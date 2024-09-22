import { Logger } from "pino";
import { TeamProvider } from "~playfulbot/core/use-cases/TeamProvider";
import { TournamentProvider } from "~playfulbot/core/use-cases/TournamentProvider";
import { UserProvider } from "~playfulbot/core/use-cases/UserProvider";

export type ErrorConverter = (error: any) => Error;

export interface Context<FinalContext extends Context<FinalContext>> {
  logger: Logger,
  convertError: ErrorConverter,
  providers: {
    user: UserProvider<FinalContext>,
    tournament: TournamentProvider<FinalContext>,
    team: TeamProvider<FinalContext>
  }
}