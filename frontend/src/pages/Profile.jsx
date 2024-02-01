import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs-react";
import toastr from "toastr";

import { MdModeEditOutline, MdSave, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";

import ContestModal from "../components/ContestModal";

const Profile = () => {
    const [error, setError] = useState("");

    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ntfyTopic, setNtfyTopic] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const [currentEmail, setCurrentEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [userDeleteContest, setUserDeleteContest] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const meResponse = await axios.get("http://localhost:8080/api/me", { withCredentials: true });

            if (meResponse.status === 200) {
                const userData = meResponse.data.userInformation;

                setFullName(userData["fullname"]);
                setUserName(userData["username"]);
                setEmail(userData["email"]);
                setPassword(userData["password"]);

                if (userData["topic"] === null) {
                    setNtfyTopic("");
                } else {
                    setNtfyTopic(userData["topic"]);
                }

                if (userData["profilePicture"] === null) {
                    setProfilePicture("https://robohash.org/noprofilepic.png");
                } else {
                    await fetchProfilePicture();
                }
            } else {
                toastr.error("Something went wrong. Please try again later.");
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const checkPassword = async () => {
            if (await bcrypt.compare(currentPassword, password)) {
                console.log("true");
                setPasswordMatch(true);
            } else {
                console.log("false");
                setPasswordMatch(false);
            }
        };

        if (currentPassword.length > 0) {
            checkPassword();
        }
    }, [currentPassword, password]);

    const modifyUser = async(e) => {
        try {
            const editUserResponse = await axios.post("http://localhost:8080/api/edit-user", { userName, fullName, newEmail, newPassword }, { withCredentials: true });
            const modifyNtfyTopicResponse = await axios.post("http://localhost:8080/api/modify-ntfy-topic", { ntfyTopic }, { withCredentials: true });

            if (editUserResponse.status === 201 && modifyNtfyTopicResponse.status === 201) {
                toastr.success("User information updated successfully.");

                toggleEditing();
                setEmail(newEmail); // TODO: Broken
                setCurrentEmail("");
                setNewEmail("");
                setCurrentPassword("");
                setNewPassword("");
                setError("");
                setNtfyTopic("");
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
        try {
            const deleteUserResponse = await axios.post("http://localhost:8080/api/delete-user", { password }, { withCredentials: true });
            if (deleteUserResponse.status === 201) {
                toastr.success("Your account and all of its associated information has been deleted successfully.");
                navigate("/");
            }
        } catch (error) {
            toastr.error("Something went wrong. Please try again later.");
        }
    }

    const toggleUserDeleteContest = () => {
        setUserDeleteContest(!userDeleteContest);
    }

    const fetchProfilePicture = async() => {
        try {
            const meProfilePictureResponse = await axios.get("http://localhost:8080/api/me-profile-picture", { withCredentials: true, responseType: "blob" });
            const profilePictureObjectUrl = URL.createObjectURL(meProfilePictureResponse.data)

            setProfilePicture(profilePictureObjectUrl);
        } catch (error) {
            setProfilePicture("https://robohash.org/noprofilepic.png")
        }
    }

    const handleProfilePictureChange = async(event) => {
        const aaaa = event.target.files[0];

        const formData = new FormData();
        formData.append("image", aaaa);

        try {
            const uploadProfilePictureResponse = await axios.post("http://localhost:8080/api/upload-profile-picture",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (uploadProfilePictureResponse.status === 201) {
                toastr.success("Profile picture uploaded successfully.");
                fetchProfilePicture();
            }
        } catch (error) {
            if (error.response?.data?.message === "Image size too large.") {
                toastr.error("Image is too large. Please upload an image smaller than 5MB.");
                return;
            }

            toastr.error("Error uploading profile picture. Please try again later.");
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    }

    const validateEditing = () => {
        if (userName.length < 4 || fullName.length < 4 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) || newEmail === email ||
            newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) ||
            !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword) || ntfyTopic.length < 4) {
            return false;
        }

        return true;
    }

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
            case "ntfyTopic":
                setNtfyTopic(value);
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex justify-center text-center items-center bg-zinc-900 min-h-screen">
            <div className="flex flex-col items-center bg-zinc-800 rounded-xl shadow-2xl p-16 m-12">
                <div className="relative w-32 h-32 mb-12 rounded-full border-4 border-white overflow-hidden group">
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover"/>

                    {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50">
                            <label htmlFor="fileInput" className="cursor-pointer">
                                <MdModeEditOutline className="text-white text-2xl"/>
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                accept={".png, .jpg, .jpeg"}
                                onChange={handleProfilePictureChange}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-start">
                    <label className="text-white text-xl">Username</label>
                    <input type="text" name="userName" value={userName} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}
                    />
                    {userName.length < 4 && isEditing && userName.length !== 0 && (
                        <small className="text-red-500">Username must be at least 4 characters long.</small>
                    )}

                    <label className="text-white text-xl">Full name</label>
                    <input type="text" name="fullName" value={fullName} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}
                    />

                    <label className="text-white text-xl">Email</label>
                    <input type="text" name="email" value={email} readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                    />
                    {isEditing && (
                        <>
                            <label className="text-white text-xl">Current Email</label>
                            <input type="text" name="currentEmail" placeholder="Your current email."
                                   value={currentEmail}
                                   className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                   onChange={handleInputChange}
                            />
                            {currentEmail !== email && currentEmail.length !== 0 && (
                                <small className="text-red-500">Provided email is not yours.</small>
                            )}

                            <label className="text-white text-xl">New Email</label>
                            <input type="text" name="newEmail" placeholder="Your new email." value={newEmail}
                                   className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                   onChange={handleInputChange}
                            />
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
                                       onChange={handleInputChange}
                                />
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
                            {passwordMatch && newPassword.length !== 0 && (
                                <small className="text-red-500">New password cannot be the same as the current one.</small>
                            )}
                            {(newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword)) && newPassword.length !== 0 && (
                                <small className="text-red-500">Password is not strong enough.</small>
                            )}

                            <label className="text-white text-xl">Ntfy topic</label>
                            <input type="text" name="ntfyTopic" placeholder="Your ntfy topic name." value={ntfyTopic} readOnly={!isEditing}
                                   className="my-2 p-2 rounded-md text-white text-xl bg-zinc-700 focus:outline-none focus:border-none caret-white"
                                   onChange={handleInputChange}/>
                            {ntfyTopic.length < 4 && isEditing && ntfyTopic.length !== 0 && (
                                <small className="text-red-500">Ntfy topic must be at least 4 characters long.</small>
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
                            onClick={toggleEditing}>
                            <MdModeEditOutline className="mr-2"/>Stop Editing
                        </button>
                    ) : (
                        <div className="flex flex-row items-center space-x-4">
                            <button
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-2 px-4 rounded"
                                onClick={toggleEditing}>
                                <MdModeEditOutline className="mr-2"/>Edit
                            </button>
                            <button
                                className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded"
                                onClick={toggleUserDeleteContest}>
                                <MdDelete className="mr-2"/>Delete
                            </button>
                        </div>
                    )}

                    {isEditing && (
                        <button
                            className="flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
                            disabled={!validateEditing()}
                            onClick={modifyUser}>
                            <MdSave className="mr-2"/>Save
                        </button> // TODO: Check if all fields are valid
                    )}
                </div>
            </div>
            {userDeleteContest && (
                <ContestModal title={"Are you sure you want to delete your account?"} actionYes={deleteUser} actionNo={() => setUserDeleteContest(false)}/>
            )}
        </div>
    );
}

export default Profile;