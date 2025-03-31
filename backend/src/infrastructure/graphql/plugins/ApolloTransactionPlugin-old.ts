import { ApolloServerPlugin } from "@apollo/server";
import { ApolloContext } from "../types/apolloTypes";
import { DeferredPromise } from "~playfulbot/utils/DeferredPromise";
import { UnkownError } from "~playfulbot/core/use-cases/Errors";

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
      const requestPromise = new DeferredPromise<void>;
      const txPromise = new DeferredPromise<void>;
      let encounteredErrors = false;
      let executionStarted = false;
      return {
        async executionDidStart({ contextValue: { ctx } }) {
          executionStarted = true;
          const { contextReady, transactionPromise } = await ctx.txPromise(requestPromise.promise);

          transactionPromise.then(() => txPromise.resolve())
            .catch((err) => {
              if (err instanceof CancelTransactionError) {
                txPromise.resolve();
              } else {
                txPromise.reject(new UnkownError('Transaction failed', err))
              }
            });

          await contextReady;

          return {}
        },
        async didEncounterErrors() {
          if (!executionStarted) {
            return;
          }
          requestPromise.reject(new CancelTransactionError());
          encounteredErrors = true;
          await txPromise.promise;
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
              requestPromise.reject(new CancelTransactionError());
            } else {
              requestPromise.resolve();
            }
            await txPromise.promise;
          }
        }
      }
    },
  };
};