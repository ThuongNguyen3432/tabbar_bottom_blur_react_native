export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
