import {Helmet} from "react-helmet";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import AdminUserEditModal from "../components/AdminUserEditModal";
import ContestModal from "../components/ContestModal";

import { FaBan, FaTrash, FaCheck, FaEdit } from "react-icons/fa";

const AdminPanel = () => {
    const [users, setUsers] = React.useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const usersResponse = await axios.get("http://localhost:8080/api/admin/get-users/", {withCredentials: true});
            setUsers(usersResponse.data.users);
        }

        fetchData();
    }, []);

    const formatDate = (date) => {
        return format(new Date(date), "dd.MM.yyyy HH:MM:SS");
    }

    const negateBanned = (isBanned) => {
        return isBanned === 0 ? 1 : 0;
    }

    const editUserBan = async(userId, banInformation) => {
        await axios.post("http://localhost:8080/api/admin/edit-user/", {id: userId, data: banInformation}, {withCredentials: true});

        navigate(0);
    }

    const deleteUser = async(userId) => {
        await axios.post("http://localhost:8080/api/admin/delete-user/", {id: userId}, {withCredentials: true});

        navigate(0);
    }

    return (
        <div className={"text-center bg-zinc-900 min-h-screen p-4"}>
            <Helmet>
                <title>Personal Calendar | Admin Panel</title>
            </Helmet>

            <h1 className={"text-5xl text-white font-bold pt-24"}>Admin Panel</h1>
            <h2 className={"mt-6 text-lg text-white"}>This is the admin panel for the Personal Calendar application. You can manage all the users here.</h2>
            <p className={"mt-2 text-white"}>To edit, unban, ban, delete the user, use the actions tab.</p>

            {users.length === 0 ? (
                <p className={"mt-8 text-white"}>No users found.</p>
            ) : (
                <div className="mt-8 overflow-x-auto">
                    <p className={"mb-2 text-white"}>Users found: {users.length}</p>
                    <table className="min-w-full divide-y divide-gray-500">
                        <thead className="bg-zinc-600">
                        <tr>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Username
                            </th>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Email
                            </th>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Full Name
                            </th>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Created At
                            </th>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Banned
                            </th>
                            <th className="px-2 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider w-1/6">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-zinc-700 divide-y divide-gray-600">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">{user.username}</span>
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">{user.email}</span>
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">{user.fullname}</span>
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">{formatDate(user.createdAt)}</span>
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <span
                                        className={`text-sm text-gray-200 font-bold p-2 px-6 rounded ${user.isBanned === 1 ? "bg-red-500" : "bg-green-500"} hover:cursor-pointer`}>{user.isBanned === 1 ? "Yes" : "No"}</span>
                                </td>
                                <td className="px-2 py-4 whitespace-nowrap">
                                    <div className={"space-x-4"}>
                                        <button onClick={() => setShowEditModal(true)}
                                                className={"text-blue-500 hover:text-blue-400"}><FaEdit/></button>
                                        <button
                                            onClick={() => editUserBan(user.id, {"isBanned": negateBanned(user.isBanned)})}
                                            className={`text-green-500 hover:text-green-400 ${user.isBanned === 0 ? "cursor-not-allowed" : ""}`}>
                                            <FaCheck/></button>
                                        <button
                                            onClick={() => editUserBan(user.id, {"isBanned": negateBanned(user.isBanned)})}
                                            className={`text-red-500 hover:text-red-400 ${user.isBanned === 1 ? "cursor-not-allowed" : ""}`}>
                                            <FaBan/></button>
                                        <button onClick={() => setShowDeleteModal(true)}
                                                className={"text-red-500 hover:text-red-400"}><FaTrash/></button>
                                    </div>
                                    {showDeleteModal && (
                                        <ContestModal title={"Are you sure you want to delete this user?"}
                                                      actionYes={() => deleteUser(user.id)}
                                                      actionNo={() => setShowDeleteModal(false)}/>
                                    )}
                                    {showEditModal && (
                                        <AdminUserEditModal user={user} handleClose={() => setShowEditModal(false)}/>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div>
    );
}

export default AdminPanel;