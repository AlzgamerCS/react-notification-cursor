import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { authService, userService, User, AuthResponse } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch user profile when component mounts
      const fetchUserProfile = async () => {
        try {
          const userData = await userService.getProfile();
          console.log(userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else {
      setLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Sent request to log in...");
      // Get the auth response which includes both token and user data
      const authResponse: AuthResponse = await authService.login(
        email,
        password
      );
      console.log(authResponse);
      if (!authResponse.token) {
        throw new Error("No token received from login");
      }

      // Store the token
      localStorage.setItem("authToken", authResponse.token);

      // Set the user data from the auth response
      setUser(authResponse.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
