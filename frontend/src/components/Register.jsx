import React, { useState, useEffect } from 'react';
import axios from 'axios';

import toastr from 'toastr';

import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const RegistrationForm = ({ onClose }) => {
    const [userName, setUsername] = useState('');
    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isFormValid, setFormValid] = useState(false);
    const [registrationError, setRegistrationError] = useState('');

    const calculatePasswordStrength = (password) => {
        const lengthCondition = password.length >= 8;
        const lowercaseCondition = /[a-z]/.test(password);
        const uppercaseCondition = /[A-Z]/.test(password);
        const numberCondition = /[0-9]/.test(password);
        const specialCharCondition = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

        return (lengthCondition ? 1 : 0) + (lowercaseCondition ? 1 : 0) + (uppercaseCondition ? 1 : 0) + (numberCondition ? 1 : 0) + (specialCharCondition ? 1 : 0);
    }

    const validateForm = (userName, fullName, email, password) => {
        const isUsernameValid = userName.length >= 4;
        const isFullNameValid = fullName.length >= 10;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = calculatePasswordStrength(password) === 5;

        const formIsValid = isUsernameValid && isFullNameValid && isEmailValid && isPasswordValid;

        setFormValid(formIsValid);

        return formIsValid;
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        validateForm(e.target.value, fullName, email, password);
    }

    const handleFullnameChange = (e) => {
        setFullname(e.target.value);
        validateForm(userName, e.target.value, email, password);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateForm(userName, fullName, e.target.value, password);
    }

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const strength = calculatePasswordStrength(newPassword);
        setPasswordStrength(strength);
        validateForm(userName, fullName, email, newPassword);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateForm(userName, fullName, email, password)) {
            return;
        }

        try {
            const registerRequest = await axios.post('http://localhost:8080/api/register', { userName, fullName, email, password });

            if (registerRequest.status === 200) {
                toastr.success('Registration successful. You can now login.');
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === 'User already exists.') {
                setRegistrationError('Such username or email already exists.');
            }
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('fixed-top')) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 fixed-top">
            <div className="text-center bg-zinc-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-4xl text-white font-semibold mb-4">Registration</h2>
                <p className="text-white mb-4">Let's get you going. Your new calendar is waiting for you.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="text-left text-white text-xl mb-1 block">Username</label>
                        <input type="text" placeholder="Create your new username here." value={userName} onChange={handleUsernameChange} className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                        {userName.length < 4 && userName.length !== 0 && <p className="text-red-500 text-sm mt-2">Username must be at least 4 characters long.</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fullname" className="text-left text-white text-xl mb-1 block">Full name</label>
                        <input type="text" placeholder="Your full name." value={fullName} onChange={handleFullnameChange} className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                        {fullName.length < 10 && fullName.length !== 0 && <p className="text-red-500 text-sm mt-2">Full name must be at least 10 characters long.</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-left text-white text-xl mb-1 block">Email</label>
                        <input type="email" placeholder="Your login email." value={email} onChange={handleEmailChange} className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                    </div>
                    <div className="mb-2 relative">
                        <label htmlFor="password" className="text-left text-white text-xl mb-1 block">Password</label>
                        <input type={showPassword ? "text" : "password"} placeholder="Your login password." value={password} onChange={handlePasswordChange} className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                        <button type="button" className="absolute mt-3 right-0 mr-3" onClick={handleTogglePassword}>
                            {showPassword ? <MdVisibilityOff className="text-white text-xl" /> : <MdVisibility className="text-white text-xl" />}
                        </button>
                        <div className="flex items-center justify-between mt-2">
                            <div className={`flex-1 h-1 rounded ${passwordStrength < 1 ? "bg-gray-700" : "bg-red-500"} mr-2`}></div>
                            <div className={`flex-1 h-1 rounded ${passwordStrength < 2 ? "bg-gray-700" : "bg-orange-500"} mr-2`}></div>
                            <div className={`flex-1 h-1 rounded ${passwordStrength < 3 ? "bg-gray-700" : "bg-yellow-500"} mr-2`}></div>
                            <div className={`flex-1 h-1 rounded ${passwordStrength < 4 ? "bg-gray-700" : "bg-green-300"} mr-2`}></div>
                            <div className={`flex-1 h-1 rounded ${passwordStrength < 5 ? "bg-gray-700" : "bg-green-500"}`}></div>
                        </div>
                    </div>
                    {registrationError && (
                        <p className="text-red-500 text-sm mb-2">{registrationError}</p>
                    )}
                    <button type="submit" className={`bg-blue-600 text-white mt-5 px-4 py-2 w-36 rounded hover:bg-blue-500 mr-2 ${isFormValid ? '' : 'cursor-not-allowed'}`} disabled={!isFormValid}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
