import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import { get } from "lodash";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/api/v1/auth";
const TOKEN_KEY = "authToken";

interface User {
  id: number;
  name: string;
  email: string;
  is_merchant: boolean;
  password: string;
  createdAt: string;
  updatedAt: string;
}
export const authService = {
  isAuthenticated: (): boolean => {
    return localStorage.getItem(TOKEN_KEY) !== null;
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user: User | undefined): void => {
    if (!user) {
      console.error("User is undefined, cannot set user in localStorage");
      return;
    }
    const { password, ...sanitizedUser } = user;
    localStorage.setItem("user", JSON.stringify(sanitizedUser));
  },

  getUser: (): User => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: (): void => {
    localStorage.removeItem("user");
  },

  logout: (): void => {
    authService.removeToken();
    authService.removeUser();
  }
};

// Interface for login response
interface LoginResponse {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      password: string;
      is_merchant: boolean;
      createdAt: string;
      updatedAt: string;
    }
  }
}

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (body) => apiPost(`${basePath}/login`, body),
    onSuccess: (response) => {
      const dataUser = get(response, 'data.data', []);
      const { token, user } = dataUser;

      authService.setToken(token);
      authService.setUser(user);
    }
  });
};

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

export const useRegister = () => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (body: RegisterBody) => apiPost(`${basePath}/register`, body),
  });
};