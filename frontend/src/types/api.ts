export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  creatorId: string;
  players: string[];
  status: 'waiting' | 'in_progress' | 'finished';
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  gameId: string;
  inviterId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  expiresAt: string;
}