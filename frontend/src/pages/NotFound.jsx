import React from "react";

const NotFound = () => {
    return (
        <div className={"text-center bg-zinc-900 min-h-screen p-4"}>
            <h1 className={"text-6xl text-white font-bold"}>404</h1>
            <p className={"text-2xl text-white pt-4"}>Oops!</p>
            <p className={"text-2xl text-white mb-12"}>It seems like you've got lost.</p>

            <a href={"/"} className={"bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-bold py-2 px-4 rounded"}>Take me back.</a>
        </div>
    );
}

export default NotFound;