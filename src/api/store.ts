// import {create} from 'zustand';
// import { loginUser, logoutUser } from './auth';

// interface AuthState {
//   isUserLoggedIn: boolean;
//   login: (email: string, password: string) => void;
//   logout: () => void;
// }

// const useAuthStore = create<AuthState>((set: (fn: (state: AuthState) => Partial<AuthState>) => void) => ({
//   isUserLoggedIn: false,
//   login: (email: string, password: string) => {
//     loginUser(email, password);
//     set(() => ({ isUserLoggedIn: true }));
//   },
//   logout: () => {
//     logoutUser();
//     set(() => ({ isUserLoggedIn: false }));
//   },
// }));

// export default useAuthStore;
