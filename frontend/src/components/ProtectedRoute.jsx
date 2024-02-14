import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import toastr from "toastr";

const LoadingIndicator = () => (
    <div className={"bg-zinc-900 min-h-screen p-4"}>
        <h1 className={"text-4xl text-center text-white"}>Loading...</h1>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, adminAccount } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate an async operation such as checking authentication status.
        const delay = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(delay);
    }, []);

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!adminAccount && children.type.name === "AdminPanel") {
        toastr.error("You are not an admin.");
        return <Navigate to="/" />;
    }

    if ((children.type.name === "Profile" || children.type.name === "Calendar") && adminAccount) {
        toastr.error("As an admin you cannot access profile or calendar.");
        return <Navigate to="/admin-panel" />;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
