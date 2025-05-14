import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center p-5 rounded shadow-lg bg-white">
          <img
            src="/logo_transparent.png"
            alt="Construction App Logo"
            className="mb-4"
            style={{ width: "150px", height: "auto" }}
          />
          <h1 className="mb-4 fw-bold text-primary">
            Welcome to Construction App
          </h1>
          <p className="text-muted mb-4">
            Manage your construction projects efficiently with our comprehensive
            project management solution
          </p>
          <div className="d-flex justify-content-center gap-4">
            <Link
              to="/login"
              className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
            >
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
