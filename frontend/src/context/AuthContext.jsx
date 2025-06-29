import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { publicAxios } from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated: isAuth0Authenticated, user: auth0User } = useAuth0();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (token && rememberMe) {
          const response = await publicAxios.get('/auth/me');
          
          // Axios automatically throws errors for non-2xx status codes
          // If we reach here, the request was successful
          const userData = response.data;
          setUser(userData);
        }
      } catch (error) {
        if (!error.message?.includes('ECONNREFUSED') && !error.message?.includes('Failed to fetch')) {
          console.error('Session check error:', error);
        }
        if (error.message?.includes('ECONNREFUSED') || error.message?.includes('Failed to fetch')) {
          setTimeout(checkExistingSession, 2000);
          return;
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('rememberMe');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isAuth0Authenticated) {
      setTimeout(checkExistingSession, 1000);
    } else {
      setLoading(false);
    }
  }, [isAuth0Authenticated]);

  useEffect(() => {
    if (isAuth0Authenticated && auth0User) {
      setUser({
        ...auth0User,
        fullName: auth0User.name,
        profilePicture: auth0User.picture
      });
      setLoading(false);
    }
  }, [isAuth0Authenticated, auth0User]);
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await publicAxios.post('/auth/login', credentials);
      
      // Axios automatically throws errors for non-2xx status codes
      // If we reach here, the request was successful
      const data = response.data;

      setUser(data.user);
      localStorage.setItem('token', data.token);
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      setLoading(false); 
      return data;
    } catch (error) {
      setLoading(false);
      
      // Handle Axios error response
      if (error.response) {
        const data = error.response.data;
        if (data.errors) {
          throw { fieldErrors: data.errors };
        }
        throw new Error(data.error || `HTTP ${error.response.status}: Login failed`);
      }
      
      // Handle network errors
      throw new Error(error.message || 'Network error');
    }
  };

  const signup = async (userData) => {
    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    const fieldErrors = {};

    if (!emailRegex.test(userData.email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (!userData.password || userData.password.length < 8) {
      fieldErrors.password = 'Password must be at least 8 characters.';
    }
    if (!nameRegex.test(userData.fullName || userData.name || '')) {
      fieldErrors.fullName = 'Name must contain only alphanumeric characters and spaces.';
    }
    if (Object.keys(fieldErrors).length > 0) {
      throw { fieldErrors };
    }
    try {
      setLoading(true);
      
      const response = await publicAxios.post('/auth/signup', userData);
      
      // Axios automatically throws errors for non-2xx status codes
      // If we reach here, the request was successful
      const data = response.data;

      setUser(data.user);
      localStorage.setItem('token', data.token);
      
      if (userData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      
      // Handle Axios error response
      if (error.response) {
        const data = error.response.data;
        if (data.errors) {
          throw { fieldErrors: data.errors };
        }
        throw new Error(data.error || `HTTP ${error.response.status}: Signup failed`);
      }
      
      // Handle network errors
      throw new Error(error.message || 'Network error');
    }
  };

  const updateUser = async (updateData) => {
    try {
      const response = await publicAxios.put('/auth/profile', updateData);

      // Axios automatically throws errors for non-2xx status codes
      // If we reach here, the request was successful
      const data = response.data;

      setUser(data.user);
      return data;
    } catch (error) {
      // Handle Axios error response
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.message || 'Update failed');
      }
      
      // Handle network errors
      throw new Error(error.message || 'Network error');
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await publicAxios.post('/upload/profile-picture', formData);

      // Axios automatically throws errors for non-2xx status codes
      // If we reach here, the request was successful
      const data = response.data;

      setUser(prev => ({
        ...prev,
        profilePicture: data.profilePicture
      }));

      return data;
    } catch (error) {
      // Handle Axios error response
      if (error.response) {
        const data = error.response.data;
        throw new Error(data.message || 'Upload failed');
      }
      
      // Handle network errors
      throw new Error(error.message || 'Network error');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    uploadProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};