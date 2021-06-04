import { apolloCache } from "src/apolloCache";
import { usePrevious } from "./usePrevious";

/**
 * Force Apollo Cache to retain an object.
 * If the id changes the previously retained object will be released.
 * @param id id of the object to retain.
 */
export function useGraphqlCacheLock(id: string): void {
  const previousID = usePrevious(id);
  if (previousID !== id) {
    if (id) {
      apolloCache.retain(id);
    }
    if (previousID) {
      apolloCache.release(previousID);
    }
  }
}