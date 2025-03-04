import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { signIn, signUp, signOut, getCurrentUser } from '../firebase/auth';
import { updateGraphQLAuthToken } from '../graphql/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => void;
  loginAsGuest: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await signIn(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          updateGraphQLAuthToken(user.id);
          localStorage.removeItem('guestMode');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
        }
      },
      
      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await signUp(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
          updateGraphQLAuthToken(user.id);
          localStorage.removeItem('guestMode');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register', 
            isLoading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
          updateGraphQLAuthToken(null);
          localStorage.removeItem('guestMode');
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to logout', 
            isLoading: false 
          });
        }
      },
      
      loginAsGuest: () => {
        localStorage.setItem('guestMode', 'true');
        set({ isLoading: false });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      initAuth: () => {
        const user = getCurrentUser();
        set({ 
          user, 
          isAuthenticated: !!user, 
          isLoading: false 
        });
        
        if (user) {
          updateGraphQLAuthToken(user.id);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);