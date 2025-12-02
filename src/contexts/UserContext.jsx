import { createContext, useContext, useMemo, useState } from "react";
import { axiosClient } from "../config/axios_config";


const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const { user, token } = userData;
    localStorage.setItem("token", token);
    axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}

export default UserContext;
