import React from "react";

const EditEmail = ({currentEmail, newEmail, onNewEmailChange}) => {
    return (
        <>
            <label className="text-white text-xl">Current email:</label>
            <input type="text"
                   name="currentEmail"
                   placeholder="Your current email."
                   value={currentEmail}
                   readOnly={true}
                   className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
            />

            <label className="text-white text-xl">New email:</label>
            <input type="text"
                   name="newEmail"
                   placeholder="Your new email."
                   value={newEmail}
                   className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                   onChange={onNewEmailChange}
            />
            {currentEmail === newEmail && <small className="text-red-500">Your new email is the same as your current email.</small>}
            {newEmail.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(newEmail) === false && <small className="text-red-500">Your new email is not a valid email.</small>}
        </>
    );
}

export default EditEmail;