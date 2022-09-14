import { useEffect } from 'react';
import { apolloCache } from 'src/apolloCache';
import { usePrevious } from './usePrevious';

/**
 * Force Apollo Cache to retain an object.
 * If the id changes the previously retained object will be released.
 * @param id id of the object to retain.
 */
export function useGraphqlCacheLock(id: string): void {
  const previousID = usePrevious(id);
  useEffect(() =>
    // release all on unmount
    () => {
      apolloCache.release(previousID);
      apolloCache.release(id);
    }
  );
  if (previousID !== id) {
    if (id) {
      apolloCache.retain(id);
    }
    if (previousID) {
      apolloCache.release(previousID);
    }
  }
}
