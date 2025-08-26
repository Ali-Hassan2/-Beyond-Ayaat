import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [adname, setAdName] = useState('');

  // safeParse function
  const safeParse = (key) => {
    try {
      const value = localStorage.getItem(key);
      return value && value !== "undefined" ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = safeParse("user");

    const admintoken = localStorage.getItem("admintoken");
    const admin = safeParse("admin");

    if (token && user) {
      setName(user.first_name);
    }

    if (admintoken && admin) {
      setAdName(admin.first_name);
    }
  }, []);

  return (
    <UserContext.Provider value={{ name, adname }}>
      {children}
    </UserContext.Provider>
  );
};
