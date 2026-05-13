// import {useEffect} from 'react';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { user, login } = useAuth();

//   useEffect(() => {
//     if (!user) {

//     }
//   }, [user]); // only fires when auth state settles

//   if (!user) {
//     return null; // login() is already being called via useEffect
//   }

//   return <>{children}</>;
// }