import { ApolloServerPlugin } from "@apollo/server";
import { ApolloContext } from "../types/apolloTypes";
import { DeferredPromise } from "~playfulbot/utils/DeferredPromise";
import { UnkownError } from "~playfulbot/core/use-cases/Errors";
import { Context } from "~playfulbot/core/use-cases/interfaces/Context";

class CancelTransactionError extends Error {
  constructor() {
    super('This error is used to cancel the GraphQL transaction after an error happened');
  }
}

/**
 * @returns Apollo server plugin which creates a new transaction for each request and stops it when the request ends
 */
export function ApolloTransactionPlugin (): ApolloServerPlugin<ApolloContext> {
  return {
    async requestDidStart() {
      let rootCtx: Context<any>;
      let encounteredErrors = false;
      let executionStarted = false;
      return {
        async executionDidStart({ contextValue: { ctx } }) {
          executionStarted = true;
          ctx.startRootTx();
          rootCtx = ctx;
        },
        async didEncounterErrors() {
          if (!executionStarted) {
            return;
          }
          await rootCtx.rollbackRootTx();
          encounteredErrors = true;
        },

        async didEncounterSubsequentErrors() {
          console.error('subsequent');
        },

        async willSendResponse(requestContext) {
          if (encounteredErrors || !executionStarted) {
            return;
          }
          // Fail the transaction if we return an Error. As we don't throw errors in this case we need to intercept the response.
          if (requestContext.response.body.kind === 'single') {
            // These are not exceptions so they are not handled by `didEncounterErrors`.
            // Note that we do not support incremental results such as @stream and @defer. We only check `body.singleResult`.
            for (const response of Object.values(requestContext.response.body.singleResult.data) as any) {
              if ((response?.__typename as string)?.match(/(Failure|Error)$/)) {
                encounteredErrors = true;
              }
            }
            if (encounteredErrors) {
              await rootCtx.rollbackRootTx();
            } else {
              await rootCtx.commitRootTx();
            }
          }
        }
      }
    },
  };
};