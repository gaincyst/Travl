import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUser, getToken, isAuthenticated, logout, onAuthChange } from "../utils/auth";
import { API_ENDPOINTS } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const hydratedAvatarUserIdRef = useRef(null);

  const refreshAuth = useCallback(() => {
    setIsLoggedIn(isAuthenticated());
    setCurrentUser(getCurrentUser());
  }, []);

  const logoutUser = useCallback(() => {
    logout();
  }, []);

  const updateUser = useCallback((updates = {}) => {
    setCurrentUser((prevUser) => {
      const nextUser = {
        ...(prevUser || {}),
        ...updates
      };

      localStorage.setItem('user', JSON.stringify(nextUser));
      setIsLoggedIn(Boolean(getToken() && nextUser));
      return nextUser;
    });
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

  useEffect(() => {
    if (!isLoggedIn) {
      hydratedAvatarUserIdRef.current = null;
      return;
    }

    const userId = currentUser?.userId;
    const hasCachedAvatar = Boolean(currentUser?.avatarUrl || currentUser?.avatar_url);

    if (!userId || hydratedAvatarUserIdRef.current === userId) {
      return;
    }

    if (hasCachedAvatar) {
      hydratedAvatarUserIdRef.current = userId;
      return;
    }

    let cancelled = false;

    const hydrateAvatar = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const avatarUrl = result?.data?.profile?.avatarUrl;

        if (!cancelled && avatarUrl) {
          updateUser({ avatarUrl, avatar_url: avatarUrl });
        }

        hydratedAvatarUserIdRef.current = userId;
      } catch {
        // Ignore avatar hydration failures; the default avatar will continue to render.
        hydratedAvatarUserIdRef.current = userId;
      }
    };

    hydrateAvatar();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.userId, currentUser?.avatarUrl, currentUser?.avatar_url, isLoggedIn, updateUser]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      currentUser,
      token: getToken(),
      refreshAuth,
      logoutUser,
      updateUser
    }),
    [isLoggedIn, currentUser, refreshAuth, logoutUser, updateUser]
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
