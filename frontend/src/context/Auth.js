import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [adminAccount, setAdminAccount] = useState(0);

    useEffect(() => {
        async function checkIfLoggedIn() {
            try {
                const meResponse = await axios.get("http://localhost:8080/api/me");
                setIsLoggedIn(meResponse.status === 200);
                setAdminAccount(meResponse.data.userInformation.isAdmin);
            } catch (error) {
                setIsLoggedIn(false);
            }
        }

        checkIfLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, adminAccount }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
