import React, { useState } from 'react';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

const Home = () => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleTryOutClick = () => {
        setShowRegistration(true);
    };

    const handleRegistrationClose = () => {
        setShowRegistration(false);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
    }

    const handleLoginClose = () => {
        setShowLogin(false);
    }

    return (
        <div className={"text-center bg-gradient-to-b from-zinc-900 to-zinc-700"}>
            <h1 className={"text-5xl text-white font-bold pt-24"}>Seamlessly Schedule Your Life.</h1>
            <h2 className={"mt-6 text-lg text-white"}>Personal calendar will be your best friend for scheduling your days.</h2>
            {showRegistration ? (
                <RegistrationForm onClose={handleRegistrationClose} />
            ) : (
                <a onClick={handleTryOutClick} className="bg-blue-700 hover:bg-blue-500 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5">Try me out today!</a>
            )}
            {showLogin ? (
                <LoginForm onClose={handleLoginClose} />
            ) : (
                <h3 className={"mt-2 text-sm text-white"}>Already using the calendar? <a onClick={handleLoginClick} className={"text-amber-600"}>Login now!</a></h3>
            )}
        </div>
    );
};

export default Home;
