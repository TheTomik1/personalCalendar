import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUserEditModal = ({ user, handleClose }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [fullname, setFullname] = useState(user.fullname);
    const [isFormValid, setFormValid] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        validateForm(username, email, fullname);
    }, [username, email, fullname]);

    const editUserInformation = async(userId, userInformation) => {
        await axios.post("http://localhost:8080/api/admin/edit-user/", {id: userId, data: userInformation});

        navigate(0);
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        switch (name) {
            case "username":
                setUsername(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "fullname":
                setFullname(value);
                break;
        }
    }

    const validateForm = (username, email, fullname) => {
        if (username.length >= 4 && /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && fullname.length >= 3) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-zinc-800 rounded-lg w-3/3 p-4">
                <h1 className="text-3xl text-white">Edit this user</h1>
                <p className="text-white ml-4">You can edit the user's information here.</p>

                <div className="flex flex-col mt-4">
                    <label htmlFor="username" className="text-white text-left">Username</label>
                    <input name="username" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Username" value={username}/>
                    {username.length < 4 && <small className="text-red-500 text-xs">Username must be at least 4 characters long.</small>}
                </div>

                <div className="flex flex-col mt-4">
                    <label htmlFor="email" className="text-white text-left">Email</label>
                    <input name="email" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Email" value={email}/>
                    {!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && <small className="text-red-500 text-xs">Provided Email is not valid.</small>}
                </div>

                <div className="flex flex-col mt-4">
                    <label htmlFor="fullname" className="text-white text-left">Full Name</label>
                    <input name="fullname" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Full Name" value={fullname}/>
                    {fullname.length < 3 && <small className="text-red-500 text-xs">Full Name must be at least 3 characters long.</small>}
                </div>

                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                        className={`flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded ${isFormValid ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                        onClick={() => editUserInformation(user.id, {"userName": username, "email": email, "fullName": fullname})}
                        disabled={!isFormValid}>
                        Save
                    </button>
                    <button
                        className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded"
                        onClick={handleClose}>Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminUserEditModal;