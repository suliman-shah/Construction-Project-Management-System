import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";
import { getAllEmployees } from "../../services/employeeService";
import { createTask } from "../../services/taskService";
import { useNavigate, useSearchParams } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";

const TaskForm = () => {
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
  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log(Object.fromEntries([...searchParms]));
  const [task, setTask] = useState({
    name: "",
    project_id: "",
    assigned_to: null,
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    priority: "",
  });
  useEffect(() => {
    setTask({
      ...task,
      project_id: Object.fromEntries([...searchParms])?.project_id
        ? Object.fromEntries([...searchParms])?.project_id
        : null,
    });
  }, [Object.fromEntries([...searchParms])?.project_id]);

  const [project, setProject] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects().then((res) => {
      const projectsOption = res.data.map((project) => ({
        value: project.id,
        label: project.name,
      }));
      setProject(projectsOption);
    });

    getAllEmployees().then((res) => {
      const employeeOptions = res.data.map((employees) => ({
        value: employees.id,
        label: employees.first_name + " " + employees.last_name,
      }));
      setEmployees(employeeOptions);
    });
  }, []);

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
      error = "Assigned employee is  required";
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
    console.log(name, value);
    const error = validateField(name, value);
    setTask({ ...task, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSelectChange = (name, option) => {
    const value = option ? option.value : null;
    const error = validateField(name, value);
    setTask({ ...task, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("validateForm", validateForm());
    if (validateForm()) {
      createTask(task)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            {
              project_id
                ? navigate(`/projects/detail/${project_id}`, {
                    state: { success: true, type: "add" },
                  })
                : navigate("/tasks", { state: { success: true, type: "add" } });
            }
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">New Task</h3>
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
              value={
                task.project_id
                  ? project.find((opt) => opt.value == task.project_id)
                  : project.find((opt) => opt.value === task.project_id)
              }
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
              options={employees}
              onChange={(option) => handleSelectChange("assigned_to", option)}
              value={employees.find((opt) => opt.value === task.assigned_to)}
              className={errors.assigned_to ? "is-invalid" : ""}
              placeholder="&nbsp;&nbsp;&nbsp;select employee"
              isClearable
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
              <SaveIcon className="me-2" />
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import { createTask } from "../../services/taskService";
// import { useNavigate } from "react-router-dom";
// import SaveIcon from "@mui/icons-material/Save"; // Material UI icon
// // import "bootstrap/dist/css/bootstrap.min.css";
// // import "./FormStyling.css"; // For additional styling

// const TaskForm = () => {
//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background like other fields
//       color: "white",
//       borderRadius: "15px", // Rounded corners
//       // border: "1px solid rgba(255, 255, 255, 0.4)", // Light white border
//       border: "none",
//       boxShadow: state.isFocused
//         ? "0 0 8px rgba(255, 255, 255, 0.8); "
//         : "none", // White glow on focus
//       transition: "all 0.3s ease-in-out",
//       backdropFilter: "blur(20px)", // Optional glass-like effect
//       padding: "15px", // Padding to match other inputs
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: "rgba(255, 255, 255, 0.6)", // Light white placeholder like other fields
//       fontStyle: "italic", // Italic placeholder styling
//       fontSize: "16px", // Same size as other inputs
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: "white", // Selected text color white
//     }),
//     input: (provided) => ({
//       ...provided,
//       color: "white", // Input text color white
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent dropdown menu background
//       backdropFilter: "blur(20px)", // Optional glass-like effect
//       borderRadius: "10px", // Rounded corners for the dropdown
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused
//         ? "rgba(41, 49, 255, 0.9)"
//         : "transparent", // Light background on hover
//       color: state.isFocused ? "white" : "#000", // White text on hover, black otherwise
//       padding: "10px", // Option padding for better readability
//       borderRadius: "5px", // Rounded corners for options
//     }),
//   };

//   const [task, setTask] = useState({
//     name: "",
//     project_id: null,
//     assigned_to: null,
//     description: "",
//     start_date: "",
//     end_date: "",
//     status: "",
//     priority: "",
//   });

//   const [project, setProject] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false); // For success alert
//   const navigate = useNavigate(); // Moved outside to prevent unnecessary re-instantiation

//   useEffect(() => {
//     getAllProjects().then((res) => {
//       const projectsOption = res.data.map((project) => ({
//         value: project.id,
//         label: project.name,
//       }));
//       setProject(projectsOption);
//     });

//     getAllEmployees().then((res) => {
//       const employeeOptions = res.data.map((employees) => ({
//         value: employees.id,
//         label: employees.first_name + " " + employees.last_name,
//       }));
//       setEmployees(employeeOptions);
//     });
//   }, []);

//   const statusOptions = [
//     { value: "In-Progress", label: "In-Progress" },
//     { value: "Not-Started", label: "Not-Started" },
//     { value: "Completed", label: "Completed" },
//   ];

//   const priorityOptions = [
//     { value: "High", label: "High" },
//     { value: "Medium", label: "Medium" },
//     { value: "Low", label: "Low" },
//   ];

//   const validate = () => {
//     let tempErrors = {};
//     if (!task.name) tempErrors.name = "Task name is required";
//     if (/\d/.test(task.name))
//       tempErrors.name = "Task name should not contain numbers";
//     if (!task.project_id) tempErrors.project_id = "Please select a project";
//     if (!task.assigned_to) tempErrors.assigned_to = "Please assign the task";
//     if (!task.description) tempErrors.description = "Description is required";
//     if (!task.start_date) tempErrors.start_date = "Start date is required";
//     if (!task.end_date) tempErrors.end_date = "End date is required";
//     if (!task.status) tempErrors.status = "Please select a status";
//     if (!task.priority) tempErrors.priority = "Please select a priority";
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTask({ ...task, [name]: value });
//   };

//   const handleProjectChange = (option) =>
//     setTask({ ...task, project_id: option?.value });
//   const handleEmployeeChange = (option) =>
//     setTask({ ...task, assigned_to: option?.value });
//   const handleStatusChange = (option) =>
//     setTask({ ...task, status: option?.value });
//   const handlePriorityChange = (option) =>
//     setTask({ ...task, priority: option?.value });

//   // Inside handleSubmit function in TaskForm.jsx
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       createTask(task)
//         .then(() => {
//           setSuccess(true);
//           setTimeout(() => {
//             navigate("/tasks", { state: { success: true, type: "add" } }); // Pass success state
//           }, 10); // Show success message for 1 second before navigating
//         })
//         .catch((err) => console.log(err));
//     }
//   };
//   return (
//     <div className="container mt-4 d-flex justify-content-center">
//       <div className="task-form-wrapper shadow p-4 rounded">
//         <h3 className="text-center mb-4">New Task</h3>

//         <form onSubmit={handleSubmit} className="">
//           <h6 style={{ color: "#ff8528" }}>
//             the filed followed by asterisk ( <span> <span> * </span> </span> ) are necessary to
//             filed.
//           </h6>

//           <div className="mb-3">
//             <label className="form-label">
//               Task name <span> <span> * </span> </span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={task.name}
//               onChange={handleInputChange}
//               placeholder="&nbsp;&nbsp;&nbsp;enter task name "
//               className={`form-control ${errors.name ? "is-invalid" : ""}`}
//             />
//             {errors.name && <div className="text-danger">{errors.name}</div>}
//           </div>

//           <div className="mb-3">
//             <label className="form-label">
//               Chose project for the task <span> <span> * </span> </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={project}
//               onChange={handleProjectChange}
//               value={project.find((opt) => opt.value === task.project_id)}
//               placeholder="&nbsp;&nbsp;&nbsp;select project for the task"
//               className={errors.project_id ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.project_id && (
//               <div className="text-danger">{errors.project_id}</div>
//             )}
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Assigned to<span> <span> * </span> </span>
//             </label>

//             <Select
//               // classNamePrefix="custom"
//               styles={customSelectStyles}
//               options={employees}
//               onChange={handleEmployeeChange}
//               value={employees.find(
//                 (option) => option.value === task.assigned_to
//               )}
//               placeholder="&nbsp;&nbsp;&nbsp;select employee"
//               className={errors.assigned_to ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.assigned_to && (
//               <div className="text-danger">{errors.assigned_to}</div>
//             )}
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Description <span> <span> * </span> </span>
//             </label>
//             <textarea
//               name="description"
//               className={`form-control ${
//                 errors.description ? "is-invalid" : ""
//               }`}
//               value={task.description}
//               onChange={handleInputChange}
//               placeholder="&nbsp;&nbsp;&nbsp;enter task description"
//               rows={3}
//             ></textarea>
//             {errors.description && (
//               <div className="text-danger">{errors.description}</div>
//             )}
//           </div>
//           <div className="row">
//             <div className="col-md-6  mb-3">
//               <label className="form-label">
//                 Start date <span> <span> * </span> </span>
//               </label>
//               <input
//                 type="date"
//                 className={` custom-date-input form-control ${
//                   errors.start_date ? "is-invalid" : ""
//                 }`}
//                 name="start_date"
//                 value={task.start_date}
//                 onChange={handleInputChange}
//               />
//               {errors.start_date && (
//                 <div className="text-danger">{errors.start_date}</div>
//               )}
//             </div>

//             <div className="col-md-6  mb-3">
//               <label className="form-label">
//                 End date <span> <span> * </span> </span>
//               </label>
//               <input
//                 type="date"
//                 className={`custom-date-input form-control ${
//                   errors.end_date ? "is-invalid" : ""
//                 }`}
//                 name="end_date"
//                 value={task.end_date}
//                 onChange={handleInputChange}
//               />
//               {errors.end_date && (
//                 <div className="text-danger">{errors.end_date}</div>
//               )}
//             </div>
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Status <span> <span> * </span> </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={statusOptions}
//               value={statusOptions.find(
//                 (option) => option.value === task.status
//               )}
//               onChange={handleStatusChange}
//               placeholder="&nbsp;&nbsp;&nbsp;current status of the task"
//               className={errors.status ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.status && (
//               <div className="text-danger">{errors.status}</div>
//             )}
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Priority <span> <span> * </span> </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={priorityOptions}
//               value={priorityOptions.find(
//                 (option) => option.value === task.priority
//               )}
//               onChange={handlePriorityChange}
//               placeholder="&nbsp;&nbsp;&nbsp;priority of the task"
//               className={errors.priority ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.priority && (
//               <div className="text-danger">{errors.priority}</div>
//             )}
//           </div>
//           <button type="submit" className="btn btn-primary w-100 mt-3">
//             Add Task
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskForm;
