import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center p-5 rounded shadow-lg bg-white">
          <h1
            className="navbar-brand logo mb-4"
            style={{
              fontSize: "2.8rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #2563eb, #1e40af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            VireoBuild
          </h1>

          <h2
            className="mb-4 text-primary"
            style={{
              fontSize: "1.8rem",
              fontWeight: "500",
              letterSpacing: "0.3px",
              opacity: "0.9",
            }}
          >
            Welcome to VireoBuild
          </h2>

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
