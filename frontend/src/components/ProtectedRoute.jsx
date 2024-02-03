import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, adminAccount } = useAuth();

    if (!adminAccount && children.type.name === "AdminPanel") {
        return <Navigate to="/" />;
    }

    // TODO: The page becomes white for a second before redirecting to /admin-panel. Fix this.
    if ((children.type.name === "Profile" || children.type.name === "Calendar") && adminAccount) {
        return <Navigate to="/admin-panel" />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
