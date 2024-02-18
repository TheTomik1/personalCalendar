import React from "react";
import { Link } from "react-router-dom";

import { FaGithub } from "react-icons/fa";

const About = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="text-center bg-zinc-900 min-h-screen p-4">
            <h1 className="text-6xl text-white font-bold">About</h1>
            <p className="text-2xl text-white pt-4">2023 - {currentYear}</p>

            <div className="mt-12 mx-auto w-2/3 sm:w-1/3">
                <p className="text-lg text-white">
                    This application was crated with a sole purpose of learning and improving my skills in the web
                    development.
                    It may serve as a good example of a proper web application with the best security practices and a
                    good user experience.
                </p>
                <p className="text-lg text-white mt-8">
                    This means the application can be deployed to a production environment and used by real users. It is
                    not just a simple
                    project that was created for the sake of learning. It is a real application that can be used by
                    anyone.
                </p>
                <p className="text-lg text-white mt-8">
                    If you wish to deploy this application to a production environment, you can do so by following the
                    instructions in the README file in the root of the project. However, deploy at your own discretion.
                </p>

                <h1 className="text-5xl sm:text-3xl text-white font-bold text-center mt-12">Project stack</h1>
                <div className="flex flex-wrap justify-center mt-6 gap-4">
                    <div className="w-full sm:w-48 h-64 bg-zinc-800 p-4 rounded-md shadow-md hover:cursor-pointer hover:scale-105 transition-transform">
                        <h2 className="text-2xl font-bold text-white mb-2">Frontend</h2>
                        <p className="text-gray-200 mb-12">React, TailwindCSS, React Router, Axios, date-fns.</p>
                        <Link to={"https://github.com/TheTomik1/personalCalendar/tree/main/frontend"} className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded">See more</Link>
                    </div>

                    <div className="w-full sm:w-48 h-64 bg-zinc-800 p-4 rounded-md shadow-md hover:cursor-pointer hover:scale-105 transition-transform">
                        <h2 className="text-2xl font-bold text-white mb-2">Backend</h2>
                        <p className="text-gray-200 mb-12">Node.js, Express.js, SQLite, JWT, Bcrypt, Crypto.</p>
                        <Link to={"https://github.com/TheTomik1/personalCalendar/tree/main/backend"} className="bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded">See more</Link>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-3xl text-white font-bold text-center mt-12">Contact</h1>
                <p className="text-lg text-white mt-4">
                    If you have any questions or suggestions, feel free to contact me at Discord (username: <span>TheTomik</span>).
                    You can also visit my <Link to={"https://github.com/TheTomik1"} className="text-blue-500">GitHub profile</Link> and see other projects I've worked on.
                </p>

                <div className="flex justify-center items-center">
                    <Link to={"https://github.com/TheTomik1/personalCalendar"}>
                        <FaGithub className="text-6xl text-white mt-8 hover:text-gray-300 cursor-pointer"/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default About;