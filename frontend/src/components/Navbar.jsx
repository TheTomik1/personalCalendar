import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toastr from 'toastr';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

const Navbar = ({ isLoggedIn }) => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    const navigate = useNavigate();

    const handleRegistrationClick = () => {
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

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav className="bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-32">
                    <div className="flex-shrink-0">
                        <a href={"/"}>
                            <img
                                src={require("../Images/calendar-logo.png")}
                                alt={"LOGO"}
                                className={"h-24 rounded"}
                            />
                        </a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={toggleNavbar} className="text-white hover:text-white focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16m-7 6h7"/>
                            </svg>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="/my-calendar"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                My calendar
                            </a>
                            <a href="/about"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                About
                            </a>
                            <a href="/guides"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                Guides
                            </a>
                            <p onClick={handleLoginClick} className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">Login</p>
                            <p onClick={handleRegistrationClick} className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">Register</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden" style={{
                maxHeight: navbarOpen ? '100vh' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease-in-out'
            }}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="/my-calendar" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        My calendar
                    </a>
                    <a href="/about" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        About
                    </a>
                    <a href="/guides" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        Guides
                    </a>
                    <p onClick={handleLoginClick} className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                        Login
                    </p>
                    <p onClick={handleRegistrationClick} className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                        Register
                    </p>
                </div>
            </div>
            {showLogin && <LoginForm onClose={handleLoginClose} />}
            {showRegistration && <RegistrationForm onClose={handleRegistrationClose} />}
        </nav>
    );
};

export default Navbar;
