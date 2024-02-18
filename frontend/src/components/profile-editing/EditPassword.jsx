import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const EditPassword = ({ newPassword, confirmPassword, onNewPasswordChange, onConfirmPasswordChange }) => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    }

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <>
            <div className="flex flex-col">
                <label className="text-white text-xl">New password:</label>
                <div className="relative">
                    <input type={showNewPassword ? "text" : "password"}
                           name="newPassword"
                           placeholder="Your new password."
                           value={newPassword}
                           className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={onNewPasswordChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                         onClick={toggleShowNewPassword}>
                        {showNewPassword ? (
                            <MdVisibility className="text-white" />
                        ) : (
                            <MdVisibilityOff className="text-white" />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <label className="text-white text-xl">Confirm password:</label>
                <div className="relative">
                    <input type="password"
                           name="confirmPassword"
                           placeholder="Confirm your new password."
                           value={confirmPassword}
                           className="my-2 p-2 rounded-md text-white text-xl w-72 bg-zinc-700 focus:outline-none focus:border-none caret-white"
                           onChange={onConfirmPasswordChange}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                         onClick={toggleShowConfirmPassword}>
                        {showConfirmPassword ? (
                            <MdVisibility className="text-white" />
                        ) : (
                            <MdVisibilityOff className="text-white" />
                        )}
                    </div>
                </div>
            </div>

            {newPassword.length > 0 && (
                <>
                    {newPassword !== confirmPassword && <small className="text-red-500">Passwords don't match.</small>}
                    {newPassword.length < 8 && <small className="text-red-500">Password must be at least 8 characters long.</small>}
                    {/[a-z]/.test(newPassword) === false && <small className="text-red-500">Password must contain at least one lowercase letter.</small>}
                    {/[A-Z]/.test(newPassword) === false && <small className="text-red-500">Password must contain at least one uppercase letter.</small>}
                    {/[0-9]/.test(newPassword) === false && <small className="text-red-500">Password must contain at least one digit.</small>}
                    {/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(newPassword) === false && <small className="text-red-500">Password must contain at least one special character.</small>}
                </>
            )}

        </>
    )
}

export default EditPassword;
