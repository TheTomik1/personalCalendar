import React, {useEffect, useState} from "react";
import axios from "axios";

const LoginForm = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setFormValid] = useState(false);
    const [loginError, setLoginError] = useState('');

    const validateForm = (email, password) => {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.length >= 8;

        const formIsValid = isEmailValid && isPasswordValid;

        setFormValid(formIsValid);

        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm(email, password)) {
            return;
        }

        try {
            const loginRequest = await axios.post('http://localhost:8080/api/login',{ email, password }, {withCredentials: true });

            if (loginRequest.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            if (error.response && error.response.data && ["User does not exist.", "Invalid password."].includes(error.response.data.message)) {
                setLoginError(error.response.data.message);
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
            <div className="bg-slate-700 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl text-white font-semibold mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateForm(e.target.value, password);
                            }}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-slate-500 text-white focus:outline-none"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validateForm(email, e.target.value)
                            }}
                            className="w-full px-4 py-2 rounded border border-gray-600 bg-slate-500 text-white focus:outline-none"
                        />
                    </div>
                    {loginError && (
                        <p className="text-red-500 text-sm mb-2">{loginError}</p>
                    )}
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white mt-5 px-4 py-2 w-36 rounded hover-bg-blue-700 mr-2 ${isFormValid ? '' : 'cursor-not-allowed'}`}
                        disabled={!isFormValid}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;