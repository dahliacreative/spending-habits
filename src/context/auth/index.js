import React, { createContext, useContext, useState } from "react";
import api from "../../api";

const Context = createContext();

const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(parsedUser);

  if (parsedUser) {
    api.defaults.headers.common = {
      Authorization: `Bearer ${parsedUser.access_token}`,
    };
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Context.Provider
      value={{
        isAuthed: !!user,
        setUser,
        user,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useAuth = () => useContext(Context);

export { AuthProvider, useAuth };
