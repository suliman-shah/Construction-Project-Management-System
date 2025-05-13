import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  getAllProjects,
  getProjectEmployees,
} from "../../services/projectService";
import { getAllEmployees } from "../../services/employeeService";
import { getTaskById, updateTask } from "../../services/taskService";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

const TaskUpdate = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
      borderRadius: "15px",
      border: "none",
      boxShadow: state.isFocused
        ? "0 0 8px rgba(255, 255, 255, 0.8); "
        : "none",
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

  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  const [task, setTask] = useState({
    name: "",
    project_id: null,
    assigned_to: null,
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    priority: "",
  });

  const [project, SetProject] = useState([]);
  const [projectEmployees, setProjectEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTaskById(id).then((res) => {
      setTask(res.data[0]);
      if (res.data[0].project_id) {
        getProjectEmployees(res.data[0].project_id)
          .then((employeeRes) => {
            setProjectEmployees(employeeRes.data);
          })
          .catch((err) =>
            console.error("Error fetching project employees:", err)
          );
      }
    });
    getAllProjects().then((res) => {
      SetProject(
        res.data.map((project) => ({ value: project.id, label: project.name }))
      );
    });
  }, [id]);

  const statusOptions = [
    { value: "In-Progress", label: "In-Progress" },
    { value: "Not-Started", label: "Not-Started" },
    { value: "Completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = "Task name is required";
      } else if (/\d/.test(value)) {
        error = "Task name must not contain numbers";
      }
    } else if (name === "assigned_to" && !value) {
      error = "Assigned employee is required";
    } else if (name === "project_id" && !value) {
      error = "Project is required";
    } else if (name === "description" && !value.trim()) {
      error = "Description is required";
    } else if (name === "start_date" && !value) {
      error = "Start date is required";
    } else if (name === "end_date" && !value) {
      error = "End date is required";
    } else if (name === "status" && !value) {
      error = "Please select a status";
    } else if (name === "priority" && !value) {
      error = "Please select a priority";
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(task).forEach((field) => {
      const error = validateField(field, task[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setTask({ ...task, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSelectChange = async (name, option) => {
    const value = option ? option.value : null;
    const error = validateField(name, value);

    if (name === "project_id") {
      setTask((prev) => ({
        ...prev,
        [name]: value,
        assigned_to: null,
      }));

      if (value) {
        try {
          const response = await getProjectEmployees(value);
          console.log("Project employees:", response.data);
          setProjectEmployees(response.data);
        } catch (error) {
          console.error("Error fetching project employees:", error);
          setProjectEmployees([]);
        }
      } else {
        setProjectEmployees([]);
      }
    } else {
      setTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateTask(id, task)
        .then(() => {
          setShowSuccessAlert(true);
          setTimeout(() => {
            {
              project_id
                ? navigate(`/projects/detail/${project_id}`, {
                    state: { success: true, type: "add" },
                  })
                : navigate("/tasks", {
                    state: { success: true, type: "update" },
                  });
            }
          }, 10);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Update Task</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#ff8528" }}>
            the filed followed by asterisk ( <span> * </span>) are necessary to
            filed.
          </h6>
          <div className="mb-3">
            <label className="form-label">
              Task name <span> * </span>
            </label>
            <input
              type="text"
              name="name"
              value={task.name}
              onChange={handleInputChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="&nbsp;&nbsp;&nbsp;enter task name "
            />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Chose project for the task <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={project}
              onChange={(option) => handleSelectChange("project_id", option)}
              value={project.find((opt) => opt.value === task.project_id)}
              placeholder="&nbsp;&nbsp;&nbsp;select project for the task"
              className={errors.project_id ? "is-invalid" : ""}
              isClearable
            />
            {errors.project_id && (
              <div className="text-danger">{errors.project_id}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">
              Assigned to <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={projectEmployees}
              onChange={(option) => handleSelectChange("assigned_to", option)}
              value={projectEmployees.find(
                (opt) => opt.value === task.assigned_to
              )}
              className={errors.assigned_to ? "is-invalid" : ""}
              placeholder={
                task.project_id ? "select employee" : "First select a project"
              }
              isClearable
              isDisabled={!task.project_id}
            />
            {errors.assigned_to && (
              <div className="text-danger">{errors.assigned_to}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Description <span> * </span>
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleInputChange}
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              rows={3}
              placeholder="&nbsp;&nbsp;&nbsp;enter task details"
            ></textarea>
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Start date <span> * </span>
              </label>
              <input
                type="date"
                name="start_date"
                value={task.start_date}
                onChange={handleInputChange}
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
                End date <span> * </span>
              </label>
              <input
                type="date"
                name="end_date"
                value={task.end_date}
                onChange={handleInputChange}
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
              options={statusOptions}
              onChange={(option) => handleSelectChange("status", option)}
              value={statusOptions.find((opt) => opt.value === task.status)}
              className={errors.status ? "is-invalid" : ""}
              placeholder="&nbsp;&nbsp;&nbsp;status of the task"
              isClearable
            />
            {errors.status && (
              <div className="text-danger">{errors.status}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Priority <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={priorityOptions}
              onChange={(option) => handleSelectChange("priority", option)}
              value={priorityOptions.find((opt) => opt.value === task.priority)}
              className={errors.priority ? "is-invalid" : ""}
              placeholder="&nbsp;&nbsp;&nbsp;priority of the task"
              isClearable
            />
            {errors.priority && (
              <div className="text-danger">{errors.priority}</div>
            )}
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskUpdate;
