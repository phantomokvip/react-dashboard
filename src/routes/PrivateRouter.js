import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isLogin = localStorage.getItem("token");

    if (!isLogin || Date.now() > parseInt(isLogin, 10)) {
        return <Navigate to="login" replace />;
    }

    return element;
};

export default PrivateRoute;
