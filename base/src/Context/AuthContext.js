import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import $api, { API_URL } from '../http'; // не забудь поправить путь

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await $api.post('/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      setUser(response.data.user);
      setIsAuth(true);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  };

  const registration = async (email, password, name, description) => {
    try {
      const response = await $api.post('/registration', {
        email,
        password,
        name,
        description
      });
      localStorage.setItem('token', response.data.accessToken);
      setUser(response.data.user);
      setIsAuth(true);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  };

  const logout = async () => {
    try {
      await $api.post('/logout');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuth(false);
    } catch (e) {
      console.error(e.response?.data?.message);
    }
  };

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true
      });
      localStorage.setItem('token', response.data.accessToken);
      setUser(response.data.user);
      setIsAuth(true);
    } catch (e) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuth, isLoading,
      login, registration, logout, checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
