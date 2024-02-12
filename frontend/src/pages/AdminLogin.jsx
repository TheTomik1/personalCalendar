import React, {useState} from "react";
import {Helmet} from "react-helmet";

import {MdVisibility, MdVisibilityOff} from "react-icons/md";
import {use} from "bcrypt/promises";
import axios from "axios";

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async() => {
        const loginRequest = await axios.post('http://localhost:8080/api/admin/login', {username, password});

        if (loginRequest.status === 200) {
            window.location.href = "/admin-panel";
        }
    }

    const isFormValid = username === "admin" && password.length >= 8;

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className={"text-center bg-zinc-900 min-h-screen p-4"}>
            <Helmet>
                <title>Personal Calendar | Admin Login</title>
            </Helmet>

            <h1 className={"text-5xl text-white font-bold pt-24"}>Admin Login</h1>
            <h2 className={"mt-6 text-lg text-white"}>This is the admin login page for the Personal Calendar application. Once successfully logged in, you will be able to access admin.</h2>

            <div className="flex justify-center mt-12">
                <form onSubmit={handleSubmit} className="bg-zinc-800 rounded-xl w-1/3 p-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="text-left text-white text-xl mb-1 block">Username</label>
                        <input type="text" placeholder="Use the admin username provided." value={username} onChange={handleUsernameChange}
                               className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                    </div>
                    <div className="mb-2 relative">
                        <label htmlFor="password" className="text-left text-white text-xl mb-1 block">Password</label>
                        <input type={showPassword ? "text" : "password"} placeholder="Use the admin password provided."
                               value={password} onChange={handlePasswordChange}
                               className="w-full px-4 py-2 rounded border border-zinc-500 bg-zinc-600 text-white focus:outline-none"/>
                        <button type="button" className="absolute mt-3 right-0 mr-3" onClick={handleTogglePassword}>
                            {showPassword ? <MdVisibilityOff className="text-white text-xl"/> :
                                <MdVisibility className="text-white text-xl"/>}
                        </button>
                    </div>
                    <button type="submit" className={`bg-blue-600 text-white mt-5 px-4 py-2 w-36 rounded hover:bg-blue-500 ${isFormValid ? '' : 'cursor-not-allowed'}`} disabled={!isFormValid}>Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin;