export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthContextType {
  user: GoogleUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}
