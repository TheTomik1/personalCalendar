import React, { useEffect, useState } from "react";
import axios from "axios";
import toastr from "toastr";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const LoginForm = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setFormValid] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('fixed')) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateForm(email, password)) {
            return;
        }

        try {
            const loginResponse = await axios.post('http://localhost:8080/api/login', { email, password });

            if (loginResponse.status === 200) {
                window.location.href = "/my-calendar"; // Explicitly need to set window.location.href to /my-calendar to refresh the page and get the user data before continuing.
                toastr.success('Login successful.');
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && ["User does not exist.", "Invalid password.", "This account is banned. See guides to learn more about ban appeal."].includes(error.response.data.message)) {
                setLoginError(error.response.data.message);
            }
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateForm(e.target.value, password);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validateForm(email, e.target.value);
    }

    const validateForm = (email, password) => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 8;

        const formIsValid = isEmailValid && isPasswordValid;

        setFormValid(formIsValid);

        return formIsValid;
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="text-center bg-zinc-800 p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
                <h2 className="text-4xl text-white font-semibold mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="email" className="text-left text-white text-xl mb-1 block">Email</label>
                        <input type="text"
                               placeholder="Use your email here."
                               value={email} onChange={handleEmailChange}
                               className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                    </div>
                    {email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                        <p className="text-red-500 text-sm mb-2">Invalid email format.</p>
                    )}
                    <div className="mb-2 relative">
                        <label htmlFor="password" className="text-left text-white text-xl mb-1 block">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Use your password here."
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                        <button type="button" className="absolute mt-3 right-0 mr-3" onClick={handleTogglePassword}>
                            {showPassword ? <MdVisibilityOff className="text-white text-xl" /> : <MdVisibility className="text-white text-xl" />}
                        </button>
                    </div>
                    {password.length > 0 && password.length < 8 && (
                        <p className="text-red-500 text-sm mb-2">Password must be at least 8 characters long.</p>
                    )}

                    {loginError && (
                        <p className="text-red-500 text-sm mb-2">{loginError}</p>
                    )}
                    <button type="submit"
                            className={`bg-blue-600 text-white font-bold mt-5 px-4 py-2 w-36 rounded ${isFormValid ? 'hover:bg-blue-500' : 'cursor-not-allowed bg-opacity-75'}`}
                            disabled={!isFormValid}>
                        Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;