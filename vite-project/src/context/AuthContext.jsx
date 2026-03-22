import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, getToken, isAuthenticated, logout, onAuthChange } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const refreshAuth = useCallback(() => {
    setIsLoggedIn(isAuthenticated());
    setCurrentUser(getCurrentUser());
  }, []);

  const logoutUser = useCallback(() => {
    logout();
  }, []);

  useEffect(() => {
    const unsubscribeAuthChange = onAuthChange(refreshAuth);

    const handleStorageChange = (event) => {
      if (event.key === "token" || event.key === "user") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribeAuthChange();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshAuth]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      token: getToken(),
      refreshAuth,
      logoutUser
    }),
    [isLoggedIn, currentUser, refreshAuth, logoutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
