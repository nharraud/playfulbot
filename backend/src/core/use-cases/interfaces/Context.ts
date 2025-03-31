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
  startRootTx: () => Promise<void>,
  commitRootTx: () => Promise<void>,
  rollbackRootTx: (error?: Error) => Promise<void>,
  // txPromise: (releaseTransactionPromise: Promise<void>) => Promise<{ contextReady: Promise<void>, transactionPromise: Promise<void> }>,
  txIf: (task: (ctx: FinalContext) => Promise<void> | void) => Promise<void>,
  providers: {
    user: UserProvider<FinalContext>,
    tournament: TournamentProvider<FinalContext>,
    tournamentInvitation: TournamentInvitationProvider<FinalContext>
    team: TeamProvider<FinalContext>
    gameDefinitions: GameDefinitionProvider
  }
}