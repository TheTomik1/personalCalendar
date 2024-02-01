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
    /*
      TODO: Events in the day cannot overlap
      TODO: Ntfy support
      TODO: Admin panel for user listing and banning
      TODO: Code consistency and cleanup
      TODO: ProtectedRoute gets false sometimes when it should not, check that one up.
      TODO: Use query params when the user clicks on add event somewhere in a specific day, so that way the add/edit event page can be pre-filled with the date
      TODO: Fix some smaller bugs (e.g. go through everything and test everything)
      TODO: Responsiveness (navbar especially)
     */

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
