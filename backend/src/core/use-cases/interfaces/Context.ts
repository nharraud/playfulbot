import { Logger, Bindings } from "pino";
import { TeamProvider } from "~playfulbot/core/use-cases/interfaces/TeamProvider";
import { TournamentInvitationProvider } from "~playfulbot/core/use-cases/interfaces/TournamentInvitiationProvider";
import { TournamentProvider } from "~playfulbot/core/use-cases/interfaces/TournamentProvider";
import { UserProvider } from "~playfulbot/core/use-cases/interfaces/UserProvider";
import { GameDefinitionProvider } from "./GameDefinitionProvider";

export type ErrorConverter = (error: any) => Error;

export interface Context<FinalContext extends Context<FinalContext>> {
  logger: Logger,
  ctxWithChildLogger: (bindings: Bindings) => FinalContext,
  convertError: ErrorConverter,
  txIf: (task: (ctx: FinalContext) => Promise<any> | void) => Promise<any>,
  providers: {
    user: UserProvider<FinalContext>,
    tournament: TournamentProvider<FinalContext>,
    tournamentInvitation: TournamentInvitationProvider<FinalContext>
    team: TeamProvider<FinalContext>
    gameDefinitions: GameDefinitionProvider
  },
  fingerprint?: string | null;
}