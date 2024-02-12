import React, {useEffect} from "react";
import axios from "axios";

import { Route, Routes, useLocation } from 'react-router-dom';

import Home from "./pages/Home";
import About from "./pages/About";
import Guides from "./pages/Guides";
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
      TODO: Overhaul the add/edit event page (guides page with tutorial for ntfy)
      TODO: Testing (Code consistency, testing of functionality, same styling, responsive design, etc.)
      TODO: Security (Encryption of some data in DB, refresh tokens, etc.)
      TODO: Use the date-fns (especially the format function) to format the dates in both backend and frontend.
     */

    axios.defaults.withCredentials = true;

    const location = useLocation();

    useEffect(() => {
        const title = "Personal Calendar";
        const matchedRoute = routes.find(route => route.path === location.pathname);
        const componentName = matchedRoute ? getComponentName(matchedRoute.element) : "Not Found";
        document.title = `${title} | ${componentName}`;
    }, [location.pathname]);

    const routes = [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/guides", element: <Guides /> },
        { path: "/admin-login", element: <AdminLogin /> },
        { path: "/admin-panel", element: <ProtectedRoute><AdminPanel /></ProtectedRoute> },
        { path: "/my-calendar", element: <ProtectedRoute><Calendar /></ProtectedRoute> },
        { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "*", element: <NotFound /> }
    ];

    const getComponentName = (element) => {
        if (element.type === ProtectedRoute) {
            return getComponentName(element.props.children);
        } else {
            return element.type.name;
        }
    };

    return (
        <>
            <Navbar/>

            <AuthProvider>
                <Routes>
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Routes>
            </AuthProvider>
        </>
    );
}

export default App;
