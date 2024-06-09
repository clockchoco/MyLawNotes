import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Verify from './user_verify'
import { decode } from 'js-base64'


const AuthContext = createContext();
const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET;



export function AuthProvider({ children }) {
  const [login_username, set_login_username] = useState(null);
  const [login_state, set_login_state] = useState(false);
  const router = useRouter();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (token && Verify(token, SECRET_KEY)) {
      const payload = token.split('.')[1];
      set_login_username(JSON.parse(decode(payload)).username);
      set_login_state(true);
    } else {
      localStorage.removeItem('token');
      if (router.pathname !== '/auth/signup' && router.pathname !== '/auth/login') {
        router.push('/auth/login');
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [router.pathname]);  

  const login = () => {
    const token = localStorage.getItem('token');
    if (token && Verify(token, SECRET_KEY)) {
      const payload = token.split('.')[1];
      set_login_username(JSON.parse(decode(payload)).username);
      set_login_state(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    set_login_username(null);
    set_login_state(false);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ login_username, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
