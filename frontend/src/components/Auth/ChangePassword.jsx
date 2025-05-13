import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add this import
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
          userId: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Password changed successfully");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="change-password-container">
      <h2 className="change-password-title">Change Password</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword" className="form-label">
            Current Password
          </label>
          <div className="password-input-group">
            <input
              type={showOldPassword ? "text" : "password"}
              className="form-control"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <div className="password-input-group">
            <input
              type={showNewPassword ? "text" : "password"}
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <div className="password-input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
