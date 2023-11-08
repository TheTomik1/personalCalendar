import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrationForm = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isFormValid, setFormValid] = useState(false);
    const [registrationError, setRegistrationError] = useState('');

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const strength = calculatePasswordStrength(newPassword);
        setPasswordStrength(strength);
        validateForm(username, email, newPassword);
    }

    const calculatePasswordStrength = (password) => {
        const lengthCondition = password.length >= 8;
        const lowercaseCondition = /[a-z]/.test(password);
        const uppercaseCondition = /[A-Z]/.test(password);
        const numberCondition = /[0-9]/.test(password);
        const specialCharCondition = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

        return (lengthCondition ? 1 : 0) + (lowercaseCondition ? 1 : 0) + (uppercaseCondition ? 1 : 0) + (numberCondition ? 1 : 0) + (specialCharCondition ? 1 : 0);
    }

    const validateForm = (username, email, password) => {
        const isUsernameValid = username.length >= 4;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = calculatePasswordStrength(password) === 5;

        const formIsValid = isUsernameValid && isEmailValid && isPasswordValid;
        setFormValid(formIsValid);

        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm(username, email, password)) {
            return;
        }

        try {
            const registerRequest = await axios.post('http://localhost:8080/api/register', { username, email, password });

            if (registerRequest.status === 201) {
                window.location.href = "/my-calendar";
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
            <div className="text-center bg-slate-700 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl text-white font-semibold mb-4">Registration</h2>
                <p className="text-white mb-4">Let's get you going. Your new calendar is waiting for you.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                validateForm(e.target.value, email, password);
                            }}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-slate-500 text-white focus:outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateForm(username, e.target.value, password);
                            }}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-slate-500 text-white focus:outline-none"
                        />
                    </div>
                    <div className="mb-6 relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                handlePasswordChange(e);
                                validateForm(username, email, e.target.value);
                            }}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-slate-500 text-white focus:outline-none"
                        />
                        <div className="absolute top-10 right-4">
                            <div className={`w-24 h-2 rounded-full inline-block mr-1 ${passwordStrength < 1 ? 'bg-white' : 'bg-red-500'}`}></div>
                            <div className={`w-24 h-2 rounded-full inline-block mr-1 ${passwordStrength < 3 ? 'bg-white' : 'bg-yellow-500'}`}></div>
                            <div className={`w-24 h-2 rounded-full inline-block ${passwordStrength < 5 ? 'bg-white' : 'bg-green-500'}`}></div>
                        </div>
                    </div>
                    {registrationError && (
                        <p className="text-red-500 text-sm mb-2">{registrationError}</p>
                    )}
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white mt-5 px-4 py-2 w-36 rounded hover-bg-blue-700 mr-2 ${isFormValid ? '' : 'cursor-not-allowed'}`}
                        disabled={!isFormValid}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
