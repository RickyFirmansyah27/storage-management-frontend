export interface Register {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    is_merchant?: boolean;
}

export interface Login {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_merchant: boolean;
    createdAt: string;
    updatedAt: string;
  }