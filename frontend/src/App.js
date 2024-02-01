import React from "react";

import { Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from './context/Auth';

import './styles.css';

function App() {
    /*
      TODO: Ntfy support
      TODO: Admin panel for user listing and banning
      TODO: Code consistency and cleanup (Same button styles, same approach to things, etc.)
      TODO: Use query params when the user clicks on add event somewhere in a specific day, so that way the add/edit event page can be pre-filled with the date
      TODO: Fix some smaller bugs (e.g. go through everything and test everything)
      TODO: Responsiveness (navbar especially)
     */


    return (
        <>
            <Navbar/>

            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={null} />
                    <Route path="/guides" element={null} />

                    <Route path="/admin-panel" element={null} />

                    <Route path="/my-calendar" element={
                        <ProtectedRoute>
                            <Calendar />
                        </ProtectedRoute>
                    }/>
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }/>

                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </AuthProvider>
        </>
    );
}

export default App;
