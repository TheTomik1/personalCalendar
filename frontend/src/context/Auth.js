import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext(undefined);

const LoadingIndicator = () => (
    <div className={"bg-zinc-900 min-h-screen p-4"}>
        <h1 className={"text-4xl text-center text-white"}>Loading...</h1>
    </div>
);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminAccount, setAdminAccount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/me")
            .then(response => {
                setIsLoggedIn(response.status === 200);
                setAdminAccount(response.data.userInformation.isAdmin);
            })
            .catch(() => {
                setIsLoggedIn(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        // Due to async request in useEffect, we need to make sure the request is processed before rendering the children, so we render a loading indicator instead.
        return <LoadingIndicator />;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, adminAccount, setAdminAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
