import React, { useState } from 'react';

import RegistrationForm from "../components/Register";
import LoginForm from "../components/Login";

const Home = () => {
    const [showRegistration, setShowRegistration] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleTryOutClick = () => {
        setShowRegistration(true);
    };

    const handleRegistrationClose = () => {
        setShowRegistration(false);
    };

    const handleLoginClick = () => {
        setShowLogin(true);
    }

    const handleLoginClose = () => {
        setShowLogin(false);
    }

    return (
        <div className={"text-center bg-zinc-900 min-h-screen p-4"}>
            <h1 className={"text-5xl text-white font-bold pt-24"}>Seamlessly Schedule Your Life.</h1>
            <h2 className={"mt-6 text-lg text-white"}>Personal calendar will be your best friend for scheduling your
                days.</h2>
            {showRegistration ? (
                <RegistrationForm onClose={handleRegistrationClose}/>
            ) : (
                <a onClick={handleTryOutClick}
                   className="bg-blue-700 hover:bg-blue-600 w-64 text-white text-xl font-bold py-3 rounded inline-block mt-5 hover:cursor-pointer">Try
                    me out today!</a>
            )}
            {showLogin ? (
                <LoginForm onClose={handleLoginClose}/>
            ) : (
                <h3 className={"mt-2 text-sm text-white"}>Already using the calendar? <a onClick={handleLoginClick}
                                                                                         className={"text-yellow-500"}>Login
                    now!</a></h3>
            )}

            <div className={"mt-4 sm:mt-8 md:mt-16"}>
                <h1 className={"text-4xl sm:text-5xl text-white font-bold text-center"}>Features</h1>
                <div className={"flex flex-wrap justify-center items-start mt-6"}>
                    <div className={"w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"}>
                        <div
                            className={"bg-zinc-700 p-6 m-4 rounded-lg shadow-lg hover:cursor-pointer hover:scale-105 transition-transform"}>
                            <img alt={"calendar"}
                                 src={"https://cdn.pixabay.com/photo/2015/05/31/14/23/organizer-791939_1280.jpg"}
                                 className={"w-full h-auto rounded-lg"}/>
                            <h2 className={"text-2xl sm:text-3xl text-white font-bold pt-4"}>Easy to Use</h2>
                            <p className={"text-white mt-4"}>The calendar is designed to be easy to use. You can
                                easily
                                add events,
                                delete events, and view your events.</p>
                        </div>
                    </div>
                    <div className={"w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"}>
                        <div
                            className={"bg-zinc-700 p-6 m-4 rounded-lg shadow-lg hover:cursor-pointer hover:scale-105 transition-transform"}>
                            <img alt={"calendar"}
                                 src={"https://img.freepik.com/free-photo/pretty-girl-looking-her-pink-phone-smiling-wearing-silk-pajama-sitting-window-sill-she-has-beautiful-wavy-blonde-hair-room-with-turquoise-wall_197531-2821.jpg?w=1380&t=st=1706799180~exp=1706799780~hmac=deecd3efd8d53d5fd29568f81215e5eccbc0fb538237d00e6f3aa277a175106f"}
                                 className={"w-full h-auto rounded-lg"}/>
                            <h2 className={"text-2xl sm:text-3xl text-white font-bold pt-4"}>Never miss
                                anything</h2>
                            <p className={"text-white mt-4"}>We have partnered with <a href={"https://ntfy.sh/"}
                                                                                       className={"text-amber-500"}>ntfy.sh</a> as
                                an external service for you to receive reminder(s) right into your phone or computer
                                about upcoming events in your calendar.</p>
                        </div>
                    </div>
                    <div className={"w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"}>
                        <div
                            className={"bg-zinc-700 p-6 m-4 rounded-lg shadow-lg hover:cursor-pointer hover:scale-105 transition-transform"}>
                            <img alt={"calendar"}
                                 src={"https://img.freepik.com/free-photo/medium-shot-man-taking-notes_23-2149271163.jpg?w=1380&t=st=1706799541~exp=1706800141~hmac=507aef3ceb11c9152ff97cb6ac77c5104d2e8d8be625ba123c7465a762428200"}
                                 className={"w-full h-auto rounded-lg"}/>
                            <h2 className={"text-2xl sm:text-3xl text-white font-bold pt-4"}>Free</h2>
                            <p className={"text-white mt-4"}>The calendar is designed to be free. You can use the
                                calendar without
                                paying a single cent.</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className={"text-white text-center mt-12 mb-4"}>Made with ❤️ by <a href={"https://github.com/TheTomik1"} className={"text-green-500"}>TheTomik</a></p>
        </div>
    );
};

export default Home;
