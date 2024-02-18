import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import toastr from "toastr";

const LoadingIndicator = () => (
    <div className="bg-zinc-900 min-h-screen p-4 flex justify-center space-x-2">
        <h1 className="text-4xl text-center text-white">Loading...</h1>
        <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." className="w-8 h-8 mt-2"/>
    </div>
);

const ProtectedRoute = ({children}) => {
    const {isLoggedIn, adminAccount } = useAuth();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

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
        navigate("/");
    }

    if ((children.type.name === "Profile" || children.type.name === "Calendar") && adminAccount) {
        toastr.error("As an admin you cannot access profile or calendar.");
        navigate("/admin-panel");
    }

    if (!isLoggedIn) {
        navigate("/");
    }

    return children;
};

export default ProtectedRoute;
