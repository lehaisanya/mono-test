import { useEffect } from 'react';

export function useSingleRequest<T>(
  request: () => Promise<T>,
  beforeRequest: () => void,
  afterRequest: (data: T) => void
) {
  useEffect(() => {
    let ignore = false;

    const makeResuest = async () => {
      beforeRequest();
      const data = await request();
      if (!ignore) {
        afterRequest(data);
      }
    };

    makeResuest();

    return () => {
      ignore = true;
    };
  }, [request]);
}
