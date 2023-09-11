import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@mono-test/routes';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string | null) {
  if (token === null) {
    localStorage.removeItem('token');
  } else {
    localStorage.setItem('token', token);
  }
}

export const api = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      headers() {
        return {
          Authorization: `BEARER ${getToken()}`
        };
      }
    })
  ]
});
