import { Logger, Bindings } from "pino";
import { TeamProvider } from "~playfulbot/core/use-cases/interfaces/TeamProvider";
import { TournamentInvitationProvider } from "~playfulbot/core/use-cases/interfaces/TournamentInvitiationProvider";
import { TournamentProvider } from "~playfulbot/core/use-cases/interfaces/TournamentProvider";
import { UserProvider } from "~playfulbot/core/use-cases/interfaces/UserProvider";
import { GameDefinitionProvider } from "./GameDefinitionProvider";
import { ArenaProvider } from "./ArenaProvider";
import { GameRepository } from "./GameRepository";

export type ErrorConverter = (error: any) => Error;

export interface Context<FinalContext extends Context<FinalContext>> {
  logger: Logger,
  ctxWithChildLogger: (bindings: Bindings) => FinalContext,
  convertError: ErrorConverter,
  txIf: (task: (ctx: FinalContext) => Promise<any> | void) => Promise<any>,
  providers: {
    arena: ArenaProvider<FinalContext>,
    gameDefinitions: GameDefinitionProvider,
    gameRepository: GameRepository,
    user: UserProvider<FinalContext>,
    team: TeamProvider<FinalContext>,
    tournament: TournamentProvider<FinalContext>,
    tournamentInvitation: TournamentInvitationProvider<FinalContext>,
  },
  fingerprint?: string | null;
}