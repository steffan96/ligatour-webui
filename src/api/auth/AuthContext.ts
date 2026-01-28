import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import axiosinstance from '../../router/axios';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const defaultAuthContext: AuthContextType = {
  authState: {
    accessToken: null,
    refreshToken: null,
  },
  setAuthState: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
  });

  // Use refs to access current tokens without causing re-renders
  const authStateRef = useRef(authState);

  useEffect(() => {
    authStateRef.current = authState;
  }, [authState]);

  useEffect(() => {
    const reqInterceptor = axiosinstance.interceptors.request.use(
      (config) => {
        const token = authStateRef.current.accessToken;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axiosinstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = authStateRef.current.refreshToken;
            if (!refreshToken) {
              return Promise.reject(error);
            }

            const response = await axiosinstance.post('/token', {
              token: refreshToken,
            });

            const newAccessToken = response.data.accessToken;
            setAuthState((prev) => ({
              ...prev,
              accessToken: newAccessToken,
            }));

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosinstance(originalRequest);
          } catch (refreshError) {
            // Clear auth state on refresh failure
            setAuthState({
              accessToken: null,
              refreshToken: null,
            });
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosinstance.interceptors.request.eject(reqInterceptor);
      axiosinstance.interceptors.response.eject(resInterceptor);
    };
  }, []); // Empty dependency array - interceptors only set up once
};

export default AuthContext;
