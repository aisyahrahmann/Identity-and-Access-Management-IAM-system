import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getToken } from '../service/AuthService';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      element={getToken() ? <Component /> : <Navigate to="/" />}
    />
  );
};

export default PrivateRoute;
