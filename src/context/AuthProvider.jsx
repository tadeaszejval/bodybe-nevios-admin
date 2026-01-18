"use client";
import * as React from "react";
import * as authApi from "../utils/authApi";

// Create auth context
const AuthContext = React.createContext({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshUserData: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [tokenRefreshInterval, setTokenRefreshInterval] = React.useState(null);

  // Check for existing session on mount
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = authApi.getAccessToken();
        
        if (accessToken) {
          // Try to get user data with existing token
          try {
            const response = await authApi.getCurrentUser(accessToken);
            
            if (response.success && response.user) {
              setUser(response.user);
            } else {
              // Token invalid, clear it
              authApi.logout();
              setUser(null);
            }
          } catch (error) {
            console.error("Token validation failed:", error);
            
            // Try to refresh token
            const refreshToken = authApi.getRefreshToken();
            if (refreshToken) {
              try {
                const refreshResponse = await authApi.refreshToken(refreshToken);
                if (refreshResponse.success) {
                  authApi.setTokens(refreshResponse.access_token, refreshResponse.refresh_token);
                  
                  // Get user data with new token
                  const userResponse = await authApi.getCurrentUser(refreshResponse.access_token);
                  if (userResponse.success && userResponse.user) {
                    setUser(userResponse.user);
                  }
                }
              } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                authApi.logout();
                setUser(null);
              }
            } else {
              // No refresh token, clear auth
              authApi.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up automatic token refresh (optional - only if tokens expire)
  React.useEffect(() => {
    if (user && authApi.getRefreshToken()) {
      // Refresh token every 50 minutes (if using 1 hour expiry)
      // If using long-lived tokens (10 years), this won't be needed but doesn't hurt
      const interval = setInterval(async () => {
        try {
          const refreshToken = authApi.getRefreshToken();
          if (refreshToken) {
            const response = await authApi.refreshToken(refreshToken);
            if (response.success) {
              authApi.setTokens(response.access_token, response.refresh_token);
            }
          }
        } catch (error) {
          console.error("Background token refresh failed:", error);
          // Don't logout on background refresh failure
        }
      }, 50 * 60 * 1000); // 50 minutes

      setTokenRefreshInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [user]);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response.success) {
        // Store tokens
        authApi.setTokens(response.access_token, response.refresh_token);
        
        // Set user data
        setUser(response.user);
        
        return { success: true, data: response };
      } else {
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear token refresh interval
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        setTokenRefreshInterval(null);
      }
      
      // Clear tokens and user state
      authApi.logout();
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data (useful after profile updates)
  const refreshUserData = async () => {
    try {
      const accessToken = authApi.getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await authApi.getCurrentUser(accessToken);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: "Failed to refresh user data" };
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  return React.useContext(AuthContext);
};
