import { createContext, useContext, useState } from "react";
import { User } from "models/shoreline";
import React from "react";
import AuthApiClient from "../api";

interface IAuthContext {
  user: User | null,
  login(username: string , password: string): Promise<User>,
  logout(): void,
  signup(username: string , password: string): void,
}

export const AuthContext = createContext({} as IAuthContext);

// Hook for child components to get the auth object
// and re-render when it changes.
export function useAuth() : IAuthContext {
  return useContext(AuthContext);
}

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().
// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={ auth }> 
      { children }
    </AuthContext.Provider>
  );
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState({ userid: '-1', username: "noemail" });

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = (username: string, password: string) => {
    console.log('test signin: ', username, password);
    return AuthApiClient
      .login(username, password)
      .then((user: User) => {
        setUser(user);
        return user;
      });
  };

  const signup = (username: string, password: string): void => {
    console.log('test signup', username, password);
  };

  const logout = (): void => {
    console.log('test signout');
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any
  // component that utilizes this hook to re-render with the
  // latest auth object.
  // useEffect(() => {
  //   const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();

  // }, []);

  // Return the user object and auth methods
  return {
    user,
    login,
    logout,
    signup,
  };
}

export default { useAuth };
