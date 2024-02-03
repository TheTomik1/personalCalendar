import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUserEditModal = ({ user, handleClose }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [fullname, setFullname] = useState(user.fullname);

    const navigate = useNavigate();

    const editUserInformation = async(userId, userInformation) => {
        await axios.post("http://localhost:8080/api/admin/edit-user/", {id: userId, data: userInformation}, {withCredentials: true});

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

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-zinc-800 rounded-lg w-3/3 p-4">
                <h1 className="text-3xl text-white">Edit this user</h1>
                <p className="text-white ml-4">You can edit the user's information here.</p>

                <div className="flex flex-col mt-4">
                    <input name="username" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Username" value={username}/>
                    {username.length < 4 && <small className="text-red-500 text-xs">Username must be at least 4 characters long.</small>}
                </div>

                <div className="flex flex-col mt-4">
                    <input name="email" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Email" value={email}/>
                    {!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && <small className="text-red-500 text-xs">Provided Email is not valid.</small>}
                </div>

                <div className="flex flex-col mt-4">
                    <input name="fullname" type="text" onChange={handleInputChange} className="w-full bg-zinc-700 text-white p-2 rounded focus:outline-none" placeholder="Full Name" value={fullname}/>
                    {fullname.length < 10 && <small className="text-red-500 text-xs">Full Name must be at least 10 characters long.</small>}
                </div>

                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button
                        className="flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded"
                        onClick={() => editUserInformation(user.id, {"userName": username, "email": email, "fullName": fullname})}>Save
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