import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const userInfo = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userInfo && token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }
      }

      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Could not refresh user";
    }
  };

  const login = async (email, password) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    try {
      const { data } = await api.post("/auth/login", { email: normalizedEmail, password });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const register = async (name, email, password, role) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email: normalizedEmail,
        password,
        role: role || "Registered"
      });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";

      // Backward-compatible handling for older backend responses.
      if (/user already exists|email already exists/i.test(message)) {
        try {
          const fallbackLogin = await login(normalizedEmail, password);
          return fallbackLogin;
        } catch {
          throw "Account already exists. Please use Login with your password.";
        }
      }

      throw message;
    }
  };

  const oauthContinue = async (provider, preferredName) => {
    try {
      const tempEmail = `${provider}_${Date.now()}@oauth.local`;
      const { data } = await api.post("/auth/oauth/continue", {
        provider,
        name: preferredName || `${provider} user`,
        email: tempEmail,
      });

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "OAuth sign-in failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, oauthContinue, logout, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
