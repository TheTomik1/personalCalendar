import React, {useEffect, useState} from "react";

import { Route, Routes } from 'react-router-dom';
import { useCookies } from "react-cookie";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import './styles.css';

function App() {
    const [cookies, setCookies] = useCookies();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (cookies.auth) {
            setIsLoggedIn(true);
        }
        if (!cookies.auth) {
            setIsLoggedIn(false);
        }
    }, [cookies.auth]);

    return (
        <>
            <Navbar isLoggedIn={isLoggedIn}/>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/my-calendar" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Calendar />
                    </ProtectedRoute>
                }/>
                <Route path="/profile" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Profile />
                    </ProtectedRoute>
                }/>
            </Routes>
        </>
    );
}

export default App;
