import { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdSave } from "react-icons/md";

const Profile = () => {
    const [error, setError] = useState(null);
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchUserInfo = await axios.get("http://localhost:8080/api/current-user", { withCredentials: true });

                if (fetchUserInfo.status === 200) {
                    const userData = fetchUserInfo.data.userInformation;

                    setFullName(userData.fullname);
                    setUserName(userData.username);
                    setEmail(userData.email);
                    setPassword(userData.password);
                } else {
                    setError("User not found.");
                }
            } catch (error) {
                if (error.response?.data.message === "Unauthorized.") {
                    setError(error.response.data.message);
                }
            }
        }

        fetchData();
    }, []);

    const handleStartEditing = () => {
        setIsEditing(true);
    };

    const handleStopEditing = () => {
        setIsEditing(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case "fullName":
                setFullName(value);
                break;
            case "userName":
                setUserName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "currentEmail":
                setCurrentEmail(value);
                break;
            case "newEmail":
                setNewEmail(value);
                break;
            case "currentPassword":
                setCurrentPassword(value);
                break;
            case "newPassword":
                setNewPassword(value);
                break;
            default:
                break;
        }
    }

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex justify-center text-center items-center bg-zinc-900 min-h-screen">
            <div className="flex flex-col items-center bg-zinc-800 rounded-xl shadow-2xl p-24">
                <img src="https://avatars.githubusercontent.com/u/56132780?v=4" alt="Profile" className="w-32 h-32 mb-12 rounded-full border-4 border-white"/>

                <div className="flex flex-col items-start">
                    <label className="text-white text-2xl">Full name</label>
                    <input type="text" name="fullName" value={fullName} readOnly={!isEditing} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none caret-white focus:outline-blue-500" onChange={handleInputChange}/>

                    <label className="text-white text-2xl">User name</label>
                    <input type="text" name="userName" value={userName} readOnly={!isEditing} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>

                    <label className="text-white text-2xl">Email</label>
                    <input type="text" name="email" value={email} readOnly={!isEditing} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>

                    {isEditing && (
                        <>
                            <label className="text-white text-2xl">Current Email</label>
                            <input type="text" name="currentEmail" value={currentEmail} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>

                            <label className="text-white text-2xl">New Email</label>
                            <input type="text" name="newEmail" value={newEmail} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>
                        </>
                    )}

                    <label className="text-white text-2xl">Password</label>
                    <input type="password" name="passsword" value={password} readOnly={!isEditing} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"/>

                    {isEditing && (
                        <>
                            <label className="text-white text-2xl">Current Password</label>
                            <input type="password" name="currentPassword" value={currentPassword} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>

                            <label className="text-white text-2xl">New Password</label>
                            <input type="password" name="newPassword" value={newPassword} className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white" onChange={handleInputChange}/>
                        </>
                    )}
                </div>

                <div className="flex flex-row items-center space-x-4 mt-4">
                    {isEditing ? (
                        <button className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded" onClick={handleStopEditing}>
                            <MdModeEditOutline className="mr-2"/> Stop Editing
                        </button>
                    ) : (
                        <button className="flex items-center bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-2 px-4 rounded" onClick={handleStartEditing}>
                            <MdModeEditOutline className="mr-2"/> Edit
                        </button>
                    )}

                    {isEditing && (
                        <button className="flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded" onClick={handleSave}>
                            <MdSave className="mr-2"/> Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;