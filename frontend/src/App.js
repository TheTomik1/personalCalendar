import React from "react";

import { Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import About from "./pages/About";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from './context/Auth';

import './styles.css';

function App() {
    /*
      TODO: Overhaul the add/edit event page (Includes ntfy support (the script and reminder picking, better date picker, prefill data when clicked directly in the calendar, guides page with tutorial for ntfy, etc.))
      TODO: Testing (Code consistency, testing of functionality, same styling, responsive design, etc.)
     */

    return (
        <>
            <Navbar/>

            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
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
