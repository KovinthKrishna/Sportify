import axios from "axios";
import { AUTH_API_BASE } from "../constants/api";
import { User } from "../types";
import { storageUtils } from "../utils/storage";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Using DummyJSON for authentication simulation
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // DummyJSON login endpoint
      const response = await axios.post(`${AUTH_API_BASE}/auth/login`, {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60,
      });

      const { token, id, username, email, firstName, lastName } = response.data;

      const user: User = {
        id: id.toString(),
        username: username,
        email: email,
        fullName: `${firstName} ${lastName}`,
      };

      // Store token and user
      await storageUtils.saveAuthToken(token);
      await storageUtils.saveUser(user);

      return { user, token };
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error("Invalid username or password");
      }
      throw new Error("Login failed. Please try again.");
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // DummyJSON doesn't have a real register endpoint, so we'll simulate it
      // In a real app, this would call a proper registration API

      // Simulate registration by creating a user object
      const user: User = {
        id: Math.random().toString(36).substring(7),
        username: data.username,
        email: data.email,
        fullName: data.fullName,
      };

      // Generate a dummy token
      const token = "dummy_token_" + Math.random().toString(36).substring(7);

      // Store token and user
      await storageUtils.saveAuthToken(token);
      await storageUtils.saveUser(user);

      return { user, token };
    } catch {
      throw new Error("Registration failed. Please try again.");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await storageUtils.clearAuthData();
    } catch {
      throw new Error("Logout failed");
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const user = await storageUtils.getUser();
      return user;
    } catch {
      return null;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await storageUtils.getAuthToken();
      return !!token;
    } catch {
      return false;
    }
  },
};
