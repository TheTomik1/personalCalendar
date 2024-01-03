import { useEffect, useState } from "react";

import axios from "axios";
import bcrypt from "bcryptjs-react";
import toastr from "toastr";

import { MdModeEditOutline, MdSave, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";

const Profile = () => {
    const [error, setError] = useState("");
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const fetchUserInfo = await axios.get("http://localhost:8080/api/current-user", { withCredentials: true });

            if (fetchUserInfo.status === 200) {
                const userData = fetchUserInfo.data.userInformation;

                setFullName(userData.fullname);
                setUserName(userData.username);
                setEmail(userData.email);
                setPassword(userData.password);
                setAccessToken(userData.accessToken);
            } else {
                toastr.error("Something went wrong. Please try again later.");
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const userProfilePicture = await axios.get(`http://localhost:8080/api/profile-picture?accesstoken=${accessToken}`, { withCredentials: true, responseType: 'blob' });

                const imageUrl = URL.createObjectURL(userProfilePicture.data);
                setProfilePicture(imageUrl)
            } catch (error) {
                if (error.response?.status === 404) {
                    const defaultImageUrl = "https://robohash.org/noprofilepic.png";
                    setProfilePicture(defaultImageUrl);
                }
            }
        }

        fetchData();
    }, [accessToken]);

    useEffect(() => {
        const checkPassword = async () => {
            if (await bcrypt.compare(currentPassword, password)) {
                setPasswordMatch(true);
            } else {
                setPasswordMatch(false);
            }
        };

        if (currentPassword.length > 0) {
            checkPassword();
        }
    }, [currentPassword, password]);

    const editUser = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/api/edit-user", { userName, fullName, newEmail, newPassword }, { withCredentials: true });
            if (response.status === 201) {
                toastr.success("User information updated successfully.");

                handleStopEditing();
                setEmail(newEmail); // Force to update email because other field is where new email is typed.
                setCurrentEmail("");
                setNewEmail("");
                setCurrentPassword("");
                setNewPassword("");
                setError("");
            }
        } catch (error) {
            if (error.response?.data?.message === "Such username or email already exists.") {
                setError("Such username or email already exists.")
                return;
            }

            toastr.error("Something went wrong. Please try again later.");
        }
    }

    const deleteUser = async(e) => {

    }

    const handleStartEditing = () => {
        setIsEditing(true);
    };

    const handleStopEditing = () => {
        setIsEditing(false);
    };

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
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

    return (
        <div className="flex justify-center text-center items-center bg-zinc-900 min-h-screen">
            <form onSubmit={editUser} className="flex flex-col items-center bg-zinc-800 rounded-xl shadow-2xl p-16 m-12">
                <div className="relative w-32 h-32 mb-12 rounded-full border-4 border-white overflow-hidden group">
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover"/>

                    {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50">
                            <label htmlFor="fileInput" className="cursor-pointer">
                                <MdModeEditOutline className="text-white text-2xl"/>
                            </label>
                            <input type="file" id="fileInput" className="hidden"/>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-start">
                    <label className="text-white text-xl">Username</label>
                    <input type="text" name="userName" value={userName} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}/>
                    {userName.length < 4 && isEditing && userName.length !== 0 && (
                        <small className="text-red-500">Username must be at least 4 characters long.</small>
                    )}

                    <label className="text-white text-xl">Full name</label>
                    <input type="text" name="fullName" value={fullName} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}/>

                    <label className="text-white text-xl">Email</label>
                    <input type="text" name="email" value={email} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"/>
                    {isEditing && (
                        <>
                            <label className="text-white text-xl">Current Email</label>
                            <input type="text" name="currentEmail" placeholder="Your current email."
                                   value={currentEmail}
                                   className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                   onChange={handleInputChange}/>
                            {currentEmail !== email && currentEmail.length !== 0 && (
                                <small className="text-red-500">Provided email is not yours.</small>
                            )}

                            <label className="text-white text-xl">New Email</label>
                            <input type="text" name="newEmail" placeholder="Your new email." value={newEmail}
                                   className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                   onChange={handleInputChange}/>
                            {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && isEditing && newEmail.length !== 0 && (
                                <small className="text-red-500">Invalid email.</small>
                            )}
                            {newEmail === email && isEditing && newEmail.length !== 0 && (
                                <small className="text-red-500">New email cannot be the same as the current one.</small>
                            )}
                        </>
                    )}

                    {isEditing && (
                        <>
                            <label className="text-white text-xl">Current Password</label>
                            <div className="relative">
                                <input type={showCurrentPassword ? "text" : "password"} name="currentPassword"
                                       placeholder="Your current password." value={currentPassword}
                                       className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                       onChange={handleInputChange}/>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                     onClick={toggleShowCurrentPassword}>
                                    {showCurrentPassword ? (
                                        <MdVisibility className="text-white"/>
                                    ) : (
                                        <MdVisibilityOff className="text-white"/>
                                    )}
                                </div>
                            </div>
                            {!passwordMatch && currentPassword.length !== 0 && (
                                <small className="text-red-500">Incorrect password.</small>
                            )}

                            <label className="text-white text-xl">New Password</label>
                            <div className="relative">
                                <input type={showNewPassword ? "text" : "password"} name="newPassword"
                                       placeholder="Your new password." value={newPassword}
                                       className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                       onChange={handleInputChange}/>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                     onClick={toggleShowNewPassword}>
                                    {showNewPassword ? (
                                        <MdVisibility className="text-white"/>
                                    ) : (
                                        <MdVisibilityOff className="text-white"/>
                                    )}
                                </div>
                            </div>
                            {(newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword)) && newPassword.length !== 0 && (
                                <small className="text-red-500">Password is not strong enough.</small>
                            )}
                        </>
                    )}
                </div>

                {error && isEditing && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <div className="flex flex-row items-center space-x-4 mt-4">
                    {isEditing ? (
                        <button
                            className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded"
                            onClick={handleStopEditing}>
                            <MdModeEditOutline className="mr-2"/> Stop Editing
                        </button>
                    ) : (
                        <div className="flex flex-row items-center space-x-4">
                            <button
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-2 px-4 rounded"
                                onClick={handleStartEditing}>
                                <MdModeEditOutline className="mr-2"/>Edit
                            </button>
                            <button
                                className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded"
                                onClick={deleteUser}>
                                <MdDelete className="mr-2"/>Delete
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <>
                            <button className="flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded">
                                <MdSave className="mr-2"/> Save
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Profile;