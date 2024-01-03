import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toastr from 'toastr';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

const Navbar = ({ isLoggedIn }) => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const navigate = useNavigate();

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
            navigate("/");
            toastr.success("Logout successful.");
        } catch (error) {
            toastr.error("Logout failed. Try again later.");
        }
    };

    return (
        <nav className="bg-zinc-900 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-white text-2xl font-semibold">Personal Calendar</Link>
                    <div className="space-x-4">
                        <Link to="/my-calendar" className="text-white">My Calendar</Link>
                        <Link to="/" className="text-white">About</Link>
                        {isLoggedIn ? (
                            <>
                                <div className="relative inline-block text-left space-x-4">
                                    <Link to="/profile" className="text-white hover:text-gray-300">
                                        Profile
                                    </Link>
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
