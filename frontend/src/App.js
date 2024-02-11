import React from "react";

import { Route, Routes } from 'react-router-dom';

import Home from "./pages/Home";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from './context/Auth';

import './styles.css';

function App() {
    /*
      TODO: Overhaul the add/edit event page (Includes ntfy support (the script, guides page with tutorial for ntfy, etc.))
      TODO: Testing (Code consistency, testing of functionality, same styling, responsive design, etc.)
      TODO: Security (Encryption of some data in DB, refresh tokens, etc.)
      TODO: Use the date-fns (especially the format function) to format the dates in both backend and frontend.
     */

    return (
        <>
            <Navbar/>

            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/guides" element={null} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    <Route path="/admin-panel" element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    } />

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
