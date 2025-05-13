import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Set axios defaults
  axios.defaults.withCredentials = true;

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/status`
      );
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/login`,
        { email, password }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/signup`,
        {
          email,
          password,
          firstName,
          lastName,
        }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
