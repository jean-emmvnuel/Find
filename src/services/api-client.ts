/**
 * Client HTTP unique de l'app. Tout appel réseau passe par ici pour centraliser
 * l'URL de base, le jeton et la gestion d'erreurs.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : null),
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return (await response.json()) as T;
}
