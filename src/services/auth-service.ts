import type { AuthResponse } from '@/types/auth';

export type SessionUser = AuthResponse['user'];

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async request(path: string, init: RequestInit = {}): Promise<Response> {
    const baseUrl = import.meta.env.VITE_AUTH_API_URL?.replace(/\/+$/, '');
    if (!baseUrl) {
      throw new Error('VITE_AUTH_API_URL is not set. Check your .env file.');
    }

    try {
      // The session lives in an HttpOnly cookie set by the auth server, so it has to be sent explicitly.
      return await fetch(`${baseUrl}${path}`, { credentials: 'include', ...init });
    } catch {
      throw new Error('Cannot reach the authentication server. Please try again later.');
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.status === 401) throw new Error('Invalid username or password. Please try again.');
    if (response.status === 429) throw new Error('Too many attempts. Please wait a few minutes and try again.');
    if (!response.ok) throw new Error('Could not sign in. Please try again later.');

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await this.request('/auth/logout', { method: 'POST' });
    if (!response.ok) throw new Error('Could not close the session on the server.');
  }

  // Returns the signed-in user, or null when there is no valid session.
  async getSession(): Promise<SessionUser | null> {
    const response = await this.request('/auth/me');

    if (response.status === 401) return null;
    if (!response.ok) throw new Error('Could not verify the session.');

    const data: { user: SessionUser } = await response.json();
    return data.user;
  }
}

export default AuthService.getInstance();
