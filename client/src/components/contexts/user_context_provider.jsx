import React, { useState, useContext } from "react";

const userContext = React.createContext();

export const useUserContext = () => {
  return useContext(userContext);
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return <userContext.Provider value={{ user, setUser, token, setToken }}>{children}</userContext.Provider>;
};

export default UserContextProvider;
