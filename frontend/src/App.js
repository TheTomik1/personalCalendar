import React, {useEffect} from "react";
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import toastr from "toastr";

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
import {format} from "date-fns";

function App() {
    /*
      TODO: Test the app (Design, Responsiveness, Functionality, Fix any bugs, Code quality and consistency, etc.)
      TODO: Test backend first, then frontend.
      TODO: Use the date-fns (especially the format function) to format the dates in both backend and frontend.
     */

    axios.defaults.withCredentials = true;
    const navigate = useNavigate()

    useEffect(() => {
        setInterval(() => {
            checkBanStatus();
        }, 60000); // Check if the user is banned every minute.
    }, []);

    const checkBanStatus = async () => {
        try {
            const meResponse = await axios.get("http://localhost:8080/api/me");

            if (meResponse.data.userInformation.isBanned === 1) {
                await axios.post("http://localhost:8080/api/logout");
                toastr.error("You have been banned.");
                navigate(0);
            }
        } catch (error) {
            // User is not logged in.
        }
    }

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

            <footer className="bg-zinc-900 text-white text-center p-4">
                <p>&copy; {format(new Date(), "yyyy")} - Personal Calendar</p>
            </footer>
        </>
    );
}

export default App;
