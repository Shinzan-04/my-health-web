import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ApiService from './ApiService';

export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthenticated(!!token);
  }, []);

  if (authenticated === null) return null;
  return authenticated ? Component : <Navigate to="/login" state={{ from: location }} />;
};

export const AdminRoute = ({ element: Component }) => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const profile = await ApiService.getMyDoctorProfile();
        setIsAdmin(profile.role === 'ADMIN');
      } catch {
        setIsAdmin(false);
      }
    };
    check();
  }, []);

  if (isAdmin === null) return null;
  return isAdmin ? Component : <Navigate to="/login" state={{ from: location }} />;
};
