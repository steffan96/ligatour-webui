import React, { useState, useContext } from 'react';
import axiosInstance from '../../router/axios';
import AuthContext from '../auth/AuthContext';

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
	const payload = {email, password, confirmPassword};
	const response = await axiosInstance.post('/api/auth/register', payload);
	return response.data;
};

export const loginUser = async (email: string, password: string) => {
	const { setAuthState } = useContext(AuthContext);

	try {
		const response = await axiosInstance.post('/api/auth/login', { email, password });
		setAuthState({
			accessToken: response.data.token,
			refreshToken: response.data.refresh_token,
		});
	} catch (error) {
		console.error('Login error:', error);
	}
};
