export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}