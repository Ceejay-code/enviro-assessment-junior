export interface AuthData {
  accessToken: string;
  tokenType: string;
  userId: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export type LoginResponse = AuthData | { data: AuthData; message?: string };
