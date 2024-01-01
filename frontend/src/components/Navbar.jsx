import React, { useState, useEffect } from 'react';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import axios from 'axios';

const Navbar = () => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function checkLoggedIn() {
            try {
                const fetchUser = await axios.get("http://localhost:8080/api/current-user", { withCredentials: true });
                setLoggedIn(true);
                setUser(fetchUser.data.userInformation);

            } catch (error) {
                setLoggedIn(false);
            }
        }

        checkLoggedIn();
    }, []);

    const handleTryOutClick = () => {
        setShowRegistration(true);
    };

    const handleRegistrationClose = () => {
        setShowRegistration(false);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleLoginClose = () => {
        setShowLogin(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", null, { withCredentials: true });
            setLoggedIn(false);
            setUser(null);
        } catch (error) {
            toastr.error("Error logging out");
        }
    };

    return (
        <nav className="bg-zinc-900 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <a href="/" className="text-white text-2xl font-semibold">Personal Calendar</a>
                    <div className="space-x-4">
                        <a href="/my-calendar" className="text-white">My Calendar</a>
                        <a href="/" className="text-white">About</a>
                        {loggedIn ? (
                            <>
                                <div className="relative inline-block text-left space-x-4">
                                    <a href="/profile" className="text-white hover:text-gray-300">
                                        Profile
                                    </a>
                                    <button className="text-white hover:text-gray-300" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href="#" className="text-white" onClick={handleLoginClick}>
                                    Login
                                </a>
                                <a href="#" className="text-white" onClick={handleTryOutClick}>
                                    Register
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {showLogin && <LoginForm onClose={handleLoginClose} />}
            {showRegistration && <RegistrationForm onClose={handleRegistrationClose} />}
        </nav>
    );
};

export default Navbar;
