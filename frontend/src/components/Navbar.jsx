import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <a href="/" className="text-white text-2xl font-semibold">Personal Calendar</a>
                    <div className="space-x-4">
                        <a href="/" className="text-white">My Calendar</a>
                        <a href="/" className="text-white">About</a>
                        <a href="/" className="text-white">Login</a>
                        <a href="/Register" className="text-white">Register</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
