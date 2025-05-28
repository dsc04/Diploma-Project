import { createContext, useState, useEffect } from 'react';
import $api from '../http';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await $api.post('/api/login', { email, password }, { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      setUser({ ...response.data.user, id: response.data.user.id || response.data.user._id });
      setIsAuth(true);
      console.log("Login user:", response.data.user);
    } catch (e) {
      console.error("Ошибка входа:", e.response?.data?.message || e.message);
      throw e;
    }
  };

  const registration = async (email, password, name, description) => {
    try {
      const response = await $api.post('/api/registration', { email, password, name, description }, { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      setUser({ ...response.data.user, id: response.data.user.id || response.data.user._id });
      setIsAuth(true);
      console.log("Registration user:", response.data.user);
    } catch (e) {
      console.error("Ошибка регистрации:", e.response?.data?.message || e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await $api.post('/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setUser(null);
      setIsAuth(false);
    } catch (e) {
      console.error("Ошибка выхода:", e.response?.data?.message || e.message);
    }
  };

  const checkAuth = async (retries = 3, delay = 1000) => {
    setIsLoading(true);
    try {
      const response = await $api.get('/api/refresh', { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      setUser({ ...response.data.user, id: response.data.user.id || response.data.user._id });
      setIsAuth(true);
      console.log("Check auth user:", response.data.user);
    } catch (e) {
      console.error("Ошибка проверки авторизации:", e.response?.data?.message || e.message);
      if (retries > 0 && e.response?.status === 401) {
        console.log(`Повторная попытка ${4 - retries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return checkAuth(retries - 1, delay);
      }
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
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        login,
        registration,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};