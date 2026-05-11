// import { useState, useEffect } from "react";
// import axiosInstance from '../router/axios';

// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface AuthState {
//   user: User | null;
//   loading: boolean;
//   login: () => void;
//   logout: () => void;
// }

// export function useAuth(): AuthState {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     axiosInstance
//       .get<User>("/api/handle-google-user")
//       .then((res) => setUser(res.data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   const login = (): void => {
//     window.location.href = `${process.env.REACT_APP_BASE_URL}/api/auth/google/login`;
//   };

//   const logout = (): void => {
//     window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/google/logout`;
//   };

//   return { user, loading, login, logout };
// }