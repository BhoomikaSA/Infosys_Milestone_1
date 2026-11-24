
import React, { createContext, useContext, useState } from "react";
import { DEMO_USER } from "../data/clinicalData";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem("retinavision_user");
      return stored ? JSON.parse(stored) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem("retinavision_token"))
  );

  const [toast, setToast] = useState(null);

  // Display notification messages
  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Register a new user through FastAPI
  const register = async (data) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        full_name: data.fullName,
        email: data.email,
        password: data.password
      })
    });

    return response;
  };

  // Login through FastAPI
  const login = async (email, password) => {

    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    });

    // Save JWT token
    sessionStorage.setItem(
      "retinavision_token",
      response.access_token
    );

    // Convert backend user data to frontend format
    const updatedUser = {
      ...DEMO_USER,
      id: response.user.id,
      name: response.user.full_name,
      full_name: response.user.full_name,
      email: response.user.email
    };

    sessionStorage.setItem(
      "retinavision_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setIsAuthenticated(true);

    showToast(`Welcome back, ${updatedUser.name}!`, "success");

    return true;
  };

  // Logout
  const logout = () => {
    sessionStorage.removeItem("retinavision_token");
    sessionStorage.removeItem("retinavision_user");

    setUser(DEMO_USER);
    setIsAuthenticated(false);

    showToast("You have been signed out.", "info");
  };

  // Update profile locally
  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };

    setUser(updated);

    sessionStorage.setItem(
      "retinavision_user",
      JSON.stringify(updated)
    );

    showToast("Profile details updated.", "success");
  };

  // Password change is not connected to the backend yet
  const changePassword = () => {
    showToast(
      "Password change is not available yet.",
      "info"
    );

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        toast,
        showToast,
        dismissToast: () => setToast(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
