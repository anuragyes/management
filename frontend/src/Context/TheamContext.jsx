import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { StudentLogin, StudentRegsiterApi } from "../ApiInstance/Allapis";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  /* ---------------- THEME ---------------- */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"  // set in loacalstorGE 
  );

  /* ---------------- AUTH ---------------- */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Set axios default headers

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  // -------- REGISTER --------
  const registerStudent = async (formData) => {
    try {
      setAuthLoading(true);
      const response = await axios.post(StudentRegsiterApi, formData);

      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // -------- LOGIN --------
  const loginStudent = async (loginData) => {
    try {
      setAuthLoading(true);
      const response = await axios.post(StudentLogin, loginData, {
        withCredentials: true,
      });

      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Login failed. Please check credentials",
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };
  // console.log("user this is user" , user);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        token,
        authLoading,
        registerStudent,
        loginStudent,
        logout,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
