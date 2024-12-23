import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css"; // Add custom CSS for extra styling
import { Menu } from "@mui/icons-material";
import axios from "axios";

const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const getSerachProject = async (searchQuery) => {
    return await axios.get(
      `http://localhost:8080/projects?search=${searchQuery}`
    );
  };
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      console.log("Searching for:", searchQuery);
      getSerachProject(searchQuery)
        .then((project) => {
          console.log(project.data);
          navigate(`/projects/detail/${project.data[0].id}`);
        })
        .catch((err) =>
          console.log(`  err in fetchong project ${searchQuery} `)
        );
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary sticky-top shadow-sm ultra-navbar">
      {/* <div>
        <img src="/logo_transparent.png" alt="logo" width={100} height={100} />
      </div> */}

      <div className="container-fluid">
        <button className="btn btn-outline-light" onClick={toggleSidebar}>
          <Menu />
        </button>
        {/* <Link to="/" className="navbar-brand fw-bold ultra-brand">
          PMS
        </Link> */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-links">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                {/* <img
                  src="/logo_transparent.png"
                  alt="logo"
                  width={150}
                  height={80}
                /> */}
                DashBoard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link ultra-link">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks" className="nav-link ultra-link">
                Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/employees" className="nav-link ultra-link">
                Employees
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/expenses" className="nav-link ultra-link">
                Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/inventory" className="nav-link ultra-link">
                Inventory
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/suppliers" className="nav-link ultra-link">
                Suppliers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ProjectResources" className="nav-link ultra-link">
                Project Resources
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/auth" className="nav-link ultra-link special-link">
                Signup
              </Link>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              className="form-control me-2 rounded-pill"
              type="search"
              placeholder="Search project...."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-light rounded-pill" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
