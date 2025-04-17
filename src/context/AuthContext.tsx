import { createContext, useState, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("authToken") // Check if token exists
  );
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem("authToken", token); // Save token
    setIsAuthenticated(true);
    navigate("/dashboard"); // Redirect to dashboard after login
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};