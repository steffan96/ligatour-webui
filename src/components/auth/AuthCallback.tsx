import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token: string | null = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/');
      navigate('/');
    }
  }, []);

  return <p>Logging you in...</p>;
}
