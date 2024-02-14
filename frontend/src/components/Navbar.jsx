import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toastr from 'toastr';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

const Navbar = () => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserProfilePicture, setLoggedInUserProfilePicture] = useState("");

    const [navbarOpen, setNavbarOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuthStatus() {
            try {
                const meResponse = await axios.get("http://localhost:8080/api/me");
                if (meResponse.status === 200) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        }

        checkAuthStatus();
    }, []);

    useEffect(() => {
        async function fetchProfilePicture() {
            try {
                const meProfilePictureResponse = await axios.get("http://localhost:8080/api/me-profile-picture", { responseType: "blob" });
                const profilePictureObjectUrl = URL.createObjectURL(meProfilePictureResponse.data)

                setLoggedInUserProfilePicture(profilePictureObjectUrl);
            } catch (error) {
                setLoggedInUserProfilePicture("https://robohash.org/noprofilepic.png")
            }
        }

        fetchProfilePicture();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/logout", null);
            navigate("/"); // Navigate to / so that way the user is redirected to the home page and to avoid any issues with the current page.
            navigate(0)  // Refresh the page to update the navbar.
        } catch (error) {
            toastr.error("Logout failed. Try again later.");
        }
    };

    const handleRegistrationOpen = () => {
        setShowRegistration(true);
    };

    const handleRegistrationClose = () => {
        setShowRegistration(false);
    };

    const handleLoginOpen = () => {
        setShowLogin(true);
    };

    const handleLoginClose = () => {
        setShowLogin(false);
    };

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav className="bg-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img
                                src={require("../images/calendar-logo.png")}
                                alt={"LOGO"}
                                className={"h-16 rounded"}
                            />
                        </Link>
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
                            <Link to="/my-calendar"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                My calendar
                            </Link>
                            <Link to="/about"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                About
                            </Link>
                            <Link to="/guides"
                               className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium">
                                Guides
                            </Link>
                            {isLoggedIn ? (
                                <div className="flex space-x-4">
                                    <p onClick={handleLogout} className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Logout
                                    </p>
                                    <Link to="/profile">
                                        <img src={loggedInUserProfilePicture} alt={"Profile"} className={"h-12 w-12 rounded-full select-none hover:cursor-pointer hover:scale-105 transition-transform"}/>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex space-x-4">
                                    <p onClick={handleLoginOpen}
                                       className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Login
                                    </p>
                                    <p onClick={handleRegistrationOpen} className="text-white font-cubano hover:bg-zinc-700 px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                        Register
                                    </p>
                                </div>
                            )}
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
                    <Link to="/my-calendar" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        My calendar
                    </Link>
                    <Link to="/about" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        About
                    </Link>
                    <Link to="/guides" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                        Guides
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium">
                                Profile
                            </Link>
                            <p onClick={handleLogout} className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Logout
                            </p>
                        </>
                    ) : (
                        <>
                            <p onClick={handleLoginOpen} className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Login
                            </p>
                            <p onClick={handleRegistrationOpen} className="text-white font-cubano hover:bg-zinc-700 block px-3 py-2 rounded-md text-2xl font-medium select-none hover:cursor-pointer">
                                Register
                            </p>
                        </>
                    )}
                </div>
            </div>
            {showLogin && <LoginForm onClose={handleLoginClose} />}
            {showRegistration && <RegistrationForm onClose={handleRegistrationClose} />}
        </nav>
    );
};

export default Navbar;
