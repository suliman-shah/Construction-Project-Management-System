import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const getSerachProject = async (searchQuery) => {
    return await axios.get(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/projects?search=${searchQuery}`
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Only search if query is not empty
      getSerachProject(searchQuery)
        .then((project) => {
          if (project.data && project.data.length > 0) {
            navigate(`/projects/detail/${project.data[0].id}`);
          } else {
            // Handle no results found
            console.log("No projects found");
          }
        })
        .catch((err) => {
          console.log(`Error in fetching project: ${err}`);
        });
    }
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark bg-primary shadow-sm ${
        isVisible ? "navbar--visible" : "navbar--hidden"
      }`}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          DashBoard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
          id="navbarContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-links">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Projects
                <i className="bi bi-chevron-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/projects">
                    <i className="bi bi-kanban me-2"></i>
                    <span>View All Projects</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/projects/add">
                    <i className="bi bi-plus-circle me-2"></i>
                    <span>Add Project</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/projects/timeline">
                    <i className="bi bi-calendar-range me-2"></i>
                    <span>Project Timeline</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tasks
                <i className="bi bi-chevron-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/tasks">
                    <i className="bi bi-list-task me-2"></i>
                    <span>View All Tasks</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/tasks/add">
                    <i className="bi bi-plus-square me-2"></i>
                    <span>Add Task</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/tasks/calendar">
                    <i className="bi bi-calendar-check me-2"></i>
                    <span>Task Calendar</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Employees
                <i className="bi bi-chevron-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/employees">
                    <i className="bi bi-people me-2"></i>
                    <span>View All Employees</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/employees/add">
                    <i className="bi bi-person-plus me-2"></i>
                    <span>Add Employee</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/employees/schedule">
                    <i className="bi bi-calendar-week me-2"></i>
                    <span>Employee Schedule</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-1"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Resources
                <i className="bi bi-chevron-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/expenses">
                    <i className="bi bi-cash-coin me-2"></i>
                    <span>Expenses</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/inventory">
                    <i className="bi bi-box-seam me-2"></i>
                    <span>Inventory</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/suppliers">
                    <i className="bi bi-truck me-2"></i>
                    <span>Suppliers</span>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/ProjectResources">
                    <i className="bi bi-gear me-2"></i>
                    <span>Project Resources</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <div className="search-container">
                <form className="search-form" onSubmit={handleSearch}>
                  <div className="search-input-wrapper">
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Search projects..."
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch(e);
                        }
                      }}
                    />
                    <button className="search-button" type="submit">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </form>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </a>
              {user ? (
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <span className="dropdown-item-text">
                      <i className="bi bi-person me-2"></i>
                      {user.firstName}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/change-password">
                      <i className="bi bi-key me-2"></i>
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/login">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Login
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/signup">
                      <i className="bi bi-person-plus me-2"></i>Signup
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
