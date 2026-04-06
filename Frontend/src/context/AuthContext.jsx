import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextStore';
import { usersAPI, authAPI } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token with backend
          const userData = await authAPI.getCurrentUser();

          if (userData && userData._id) {
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalid or error, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (rollNumber, name) => {
    try {
      const data = await authAPI.login(rollNumber, name);

      if (data.message && !data.token) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };



  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const data = await usersAPI.updateUser(user._id, userData);

      if (data.message === 'User not found' || data.message === 'Server error') { // fallback catch
        throw new Error(data.message || 'Update failed');
      }
      
      // when using the api, it typically returns the user object directly.
      if (data && data._id) {
          setUser(data);
          return { success: true };
      } else {
         throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};