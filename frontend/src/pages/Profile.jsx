import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import toastr from "toastr";

import { MdModeEditOutline, MdSave, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { FaArrowRotateLeft } from "react-icons/fa6";

import ContestModal from "../components/ContestModal";
import EditEmail from "../components/profile-editing/EditEmail";
import EditPassword from "../components/profile-editing/EditPassword";

const Profile = () => {
    const [error, setError] = useState("");

    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [ntfyTopic, setNtfyTopic] = useState("");
    const [profilePicture, setProfilePicture] = useState("");

    const [editOption, setEditOption] = useState("");

    const [newEmail, setNewEmail] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [cookies, setCookie] = useCookies(["isEditingProfile"]);
    const [isEditing, setIsEditing] = useState(cookies.isEditingProfile  || false);
    const [userDeleteContest, setUserDeleteContest] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (editOption === "") {
            setNewEmail("");
            setNewPassword("");
            setNewPasswordConfirm("");
        }
    }, [editOption]);

    useEffect(() => {
        async function fetchData() {
            const meResponse = await axios.get("http://localhost:8080/api/me");

            if (meResponse.status === 200) {
                const userData = meResponse.data.userInformation;

                setFullName(userData["fullname"]);
                setUserName(userData["username"]);
                setEmail(userData["email"]);
                setNtfyTopic(userData["topic"]);

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

    const modifyUser = async(e) => {
        try {
            const editUserResponse = await axios.post("http://localhost:8080/api/edit-user", { userName, fullName, newEmail, newPassword });
            const modifyNtfyTopicResponse = await axios.post("http://localhost:8080/api/modify-ntfy-topic", { ntfyTopic });

            if (editUserResponse.status === 201 && modifyNtfyTopicResponse.status === 201) {
                toastr.success("User information updated successfully.");

                toggleEditing();
                setNewEmail("");
                setNewPassword("");
                setNewPasswordConfirm("");
                setError("");
                navigate(0);
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
            const deleteUserResponse = await axios.post("http://localhost:8080/api/delete-user");
            if (deleteUserResponse.status === 201) {
                toastr.success("Your account and all of its associated information has been deleted successfully.");
                navigate(0);
            }
        } catch (error) {
            toastr.error("Something went wrong. Please try again later.");
        }
    }

    const fetchProfilePicture = async() => {
        try {
            const meProfilePictureResponse = await axios.get("http://localhost:8080/api/me-profile-picture", { responseType: "blob" });
            const profilePictureObjectUrl = URL.createObjectURL(meProfilePictureResponse.data)

            setProfilePicture(profilePictureObjectUrl);
        } catch (error) {
            setProfilePicture("https://robohash.org/noprofilepic.png")
        }
    }

    const handleProfilePictureChange = async(event) => {
        const targetFile = event.target.files[0];

        const formData = new FormData();
        formData.append("image", targetFile);

        try {
            const uploadProfilePictureResponse = await axios.post("http://localhost:8080/api/upload-profile-picture",
                formData,
                {
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

    const validateForm = () => {
        if (userName.length < 4 || fullName.length < 3 || ntfyTopic.length < 4) {
            return false;
        }

        if (editOption === "email") {
            if (newEmail === email) {
                return false;
            }

            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(newEmail) === false) {
                return false;
            }
        }

        if (editOption === "password") {
            if (newPassword.length < 8 || newPassword !== newPasswordConfirm) {
                return false;
            }
        }

        return true;
    }

    const toggleUserDeleteContest = () => {
        setUserDeleteContest(!userDeleteContest);
    }

    const toggleEditing = () => {
        setCookie("isEditingProfile", !isEditing);
        setIsEditing(!isEditing);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        switch (name) {
            case "fullName":
                setFullName(value);
                break;
            case "userName":
                setUserName(value);
                break;
            case "ntfyTopic":
                setNtfyTopic(value);
                break;
            case "editOption":
                setEditOption(value);
                break;
            case "newEmail":
                setNewEmail(value);
                break;
            case "newPassword":
                setNewPassword(value);
                break;
            case "confirmPassword":
                setNewPasswordConfirm(value);
                break;
            default:
                break;
        }
    }

    return (
        <div className="flex flex-col justify-center items-center bg-zinc-900 min-h-screen p-4 md:p-8">
            <div className="flex flex-col items-center bg-zinc-800 rounded-xl shadow-2xl p-4 md:p-8 w-full max-w-2xl">
                <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden group">
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover select-none"/>
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
                <p className="text-white text-sm my-4 md:my-6">Recommended size 128x128px.</p>

                <div className="flex flex-col items-start justify-center">
                    <label className="text-white text-xl">Username</label>
                    <input type="text"
                           name="userName"
                           placeholder="Your new username."
                           value={userName}
                           readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}
                    />
                    {userName.length < 4 && isEditing && userName.length !== 0 && (
                        <small className="text-red-500">Username must be at least 4 characters long.</small>
                    )}

                    <label className="text-white text-xl">Full name</label>
                    <input type="text"
                           name="fullName"
                            placeholder="Your new full name."
                           value={fullName}
                           readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}
                    />
                    {fullName.length < 3 && isEditing && fullName.length !== 0 && (
                        <small className="text-red-500">Full name must be at least 3 characters long.</small>
                    )}

                    <label className="text-white text-xl">Ntfy topic</label>
                    <input type="text"
                           name="ntfyTopic"
                           placeholder="Your ntfy topic name."
                           value={ntfyTopic}
                           readOnly={!isEditing}
                           className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={handleInputChange}/>
                    {ntfyTopic.length < 4 && isEditing && ntfyTopic.length !== 0 && (
                        <small className="text-red-500">Ntfy topic must be at least 4 characters long.</small>
                    )}

                    {isEditing === true && (
                        <>
                            <label className="text-white text-xl">New email or password</label>
                            <div className="flex flex-col items-start justify-center">
                                <select
                                    name="editOption"
                                    value={editOption}
                                    onChange={handleInputChange}
                                    className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white">
                                    <option value="">Select an option</option>
                                    <option value="email">Email</option>
                                    <option value="password">Password</option>
                                </select>
                            </div>

                            {editOption === "email" && (
                                <EditEmail
                                    isEditing={isEditing}
                                    currentEmail={email}
                                    newEmail={newEmail}
                                    onNewEmailChange={handleInputChange} />
                            )}
                            {editOption === "password" && (
                                <EditPassword
                                    isEditing={isEditing}
                                    newPassword={newPassword}
                                    confirmPassword={newPasswordConfirm}
                                    onNewPasswordChange={handleInputChange}
                                    onConfirmPasswordChange={handleInputChange}
                                />
                            )}
                        </>
                    )}
                </div>


                {error && isEditing && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                )}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
                    {isEditing ? (
                        <div className="flex flex-row items-center space-x-4">
                            <button
                                className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded"
                                onClick={toggleEditing}>
                                <FaArrowRotateLeft className="mr-2"/>Back
                            </button>
                            <button
                                className={`flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded ${!validateForm() && "cursor-not-allowed opacity-50"}`}
                                onClick={modifyUser}>
                                <MdSave className="mr-2"/>Save
                            </button>
                        </div>
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
                </div>
            </div>
            {userDeleteContest && (
                <ContestModal title={"Are you sure you want to delete your account?"} actionYes={deleteUser} actionNo={() => setUserDeleteContest(false)}/>
            )}
        </div>
    );
}

export default Profile;