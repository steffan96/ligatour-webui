import axiosInstance from '../router/axios';

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
  try {
    const payload = { email, password, confirmPassword };
    const response = await axiosInstance.post('/api/auth/register', payload);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Registration failed.';
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email,
      password,
    });
    if (response && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      localStorage.setItem('userID', response.data.user.id);
      return response.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Login failed.';
  }
};

export const logoutUser = async () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userID');
    const userID = localStorage.getItem('userID');
    const response = await axiosInstance.post('/api/auth/logout', { userID });
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Logout failed.';
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post('/api/auth/request-password-reset', { email });
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Password reset request failed.';
  }
};

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  try {
    const payload = { token, password, confirmPassword };
    const response = await axiosInstance.post('/api/auth/reset-password', payload);
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Password reset failed.';
  }
};

export const loginWithGoogle = () => {
  try {
    const backendGoogleLoginUrl = `${process.env.REACT_APP_BASE_URL}/api/auth/google/login`;
    window.location.href = backendGoogleLoginUrl;
  } catch (error: any) {
    throw error.message || 'Google login failed.';
  }
};
