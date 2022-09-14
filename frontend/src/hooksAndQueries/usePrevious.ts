import { useEffect, useRef } from 'react';

/**
 * Store the provided value and returns the previously provided
 * value, or undefined if it is called for the first time.
 * @param value new value to store.
 * @returns previously stored value.
 */
export function usePrevious<TYPE>(value: TYPE): TYPE {
  const ref = useRef<TYPE>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
