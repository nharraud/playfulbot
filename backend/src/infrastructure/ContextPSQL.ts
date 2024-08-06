import { Logger } from "pino";
import { Context } from "./Context";
import { DbOrTx } from "playfulbot-backend-commons/lib/model/db/helpers";

export interface ContextPSQL extends Context {
  logger: Logger,
  dbOrTx: DbOrTx
}