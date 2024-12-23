import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createProjects } from "../../services/projectService";
import Select from "react-select";
import { Spinner } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

const ProjectForm = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      borderRadius: "15px",
      border: "none",
      boxShadow: state.isFocused ? "0 0 8px rgba(255, 255, 255, 0.8);" : "none",
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(20px)",
      padding: "15px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.6)",
      fontStyle: "italic",
      fontSize: "16px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: "10px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(41, 49, 255, 0.9)"
        : "transparent",
      color: state.isFocused ? "white" : "#000",
      padding: "10px",
      borderRadius: "5px",
    }),
  };

  // new project form
  let [project, setProject] = useState({
    name: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    status: "",
    budget: "",
    expenses: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  //status options
  const statusOption = [
    { value: "Ongoing", label: "Ongoing" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return !value.trim() ? "Project name is required" : "";
      case "description":
        return !value.trim() ? "Project details is required" : "";
      case "location":
        return !value.trim() ? "Project location is required" : "";
      case "start_date":
        return !value ? "project start date is required" : "";
      case "end_date":
        return !value ? "Project end data is required" : "";
      case "status":
        return !value ? "Project status is required" : "";
      case "budget":
        return !value ? "Project budget is required" : "";
      // case "expenses":
      //   return !value ? "Project expenses is required" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(project).forEach((field) => {
      const err = validateField(field, project[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  //event handlers
  const handleSelectChange = (name, option) => {
    const value = option ? option.value : null;
    const err = validateField(name, value);
    setProject({ ...project, [name]: value });
    setErrors({ ...errors, [name]: err });
  };
  function handleInputChange(e) {
    const { name, value } = e.target;
    const err = validateField(name, value);

    setProject((current) => {
      return { ...current, [name]: value };
    });
    setErrors({ ...errors, [name]: err });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("validateForm", validateForm());
    if (validateForm()) {
      createProjects(project)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/projects", { state: { success: true, type: "add" } });
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  //ui

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">New Project</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#FFFDB5" }}>
            Fields marked with asterisk (<span> * </span>) are required.
          </h6>

          <div className="mb-3">
            <label className="form-label">
              Name <span> * </span>
            </label>

            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              value={project.name}
              placeholder="&nbsp;&nbsp;&nbsp;enter project name"
              autoFocus
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Start Date <span> * </span>
              </label>

              <input
                type="date"
                name="start_date"
                onChange={handleInputChange}
                value={project.start_date}
                placeholder="&nbsp;&nbsp;&nbsp;starting date of the project"
                className={`custom-date-input form-control ${
                  errors.start_date ? "is-invalid" : ""
                }`}
              />
              {errors.start_date && (
                <div className="text-danger">{errors.start_date}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Expected end date <span> * </span>
              </label>

              <input
                type="date"
                name="end_date"
                onChange={handleInputChange}
                value={project.end_date}
                placeholder="&nbsp;&nbsp;&nbsp;expected end date of the project"
                className={`custom-date-input form-control ${
                  errors.end_date ? "is-invalid" : ""
                }`}
              />
              {errors.end_date && (
                <div className="text-danger">{errors.end_date}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Status <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={statusOption}
              onChange={(option) => {
                handleSelectChange("status", option);
              }}
              value={statusOption.find(
                (option) => option.value === project.status
              )}
              placeholder="&nbsp;&nbsp;&nbsp;enter project status"
              isClearable
              className={errors.status ? "is-invalid" : ""}
            />
            {errors.status && (
              <div className="text-danger">{errors.status}</div>
            )}
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Budget <span> * </span>
              </label>

              <input
                type="number"
                name="budget"
                onChange={handleInputChange}
                value={project.budget}
                placeholder="&nbsp;&nbsp;&nbsp; enter allocated bugdet for project"
                className={`form-control ${errors.budget ? "is-invalid" : ""}`}
              />
              {errors.budget && (
                <div className="text-danger">{errors.budget}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                {/* Expenses <span> * </span> */}
                Expenses
              </label>

              <input
                type="number"
                name="expenses"
                onChange={handleInputChange}
                value={project.expenses}
                disabled
                placeholder="net expenses incured by project is calculated automatically "
                className={`form-control ${
                  errors.expenses ? "is-invalid" : ""
                }`}
              />
              {errors.expenses && (
                <div className="text-danger">{errors.expenses}</div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Location <span> * </span>
            </label>
            <textarea
              name="location"
              rows={3}
              cols={3}
              onChange={handleInputChange}
              value={project.location}
              placeholder="&nbsp;&nbsp;&nbsp;enter project location"
              className={`form-control ${errors.location ? "is-invalid" : ""}`}
            ></textarea>

            {errors.location && (
              <div className="text-danger">{errors.location}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Description <span> * </span>
            </label>

            <textarea
              name="description"
              onChange={handleInputChange}
              value={project.description}
              placeholder="&nbsp;&nbsp;&nbsp;enter project details"
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
            ></textarea>
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              {success ? (
                <>
                  <Spinner animation="border" size="sm" /> Adding...
                </>
              ) : (
                <>
                  <SaveIcon /> Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
