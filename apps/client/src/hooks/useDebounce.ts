/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export function useDebounce(
  values: unknown[],
  timeout: number,
  sync: () => void
) {
  useEffect(() => {
    const timer = setTimeout(sync, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, values);
}
