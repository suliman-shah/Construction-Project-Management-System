// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";
// import { getAllEmployees } from "../../services/employeeService";
// import { getTaskById, updateTask } from "../../services/taskService";
// import { useNavigate, useParams } from "react-router-dom";
// // import DatePicker from "react-datepicker";

// const TaskUpdate = () => {
//   //task form

//   const [task, setTask] = useState({
//     //task object that store new task data
//     name: "",
//     project_id: null,
//     assigned_to: null, //if there is no employess set the assigned to null value
//     description: "",
//     start_date: "",
//     end_date: "", //if end date is not expecetd then store it null
//     status: "",
//     priority: "",
//   });

//   const [project, SetProject] = useState([]); //dropdown of  projects name stored here

//   const [employees, setEmployees] = useState([]); //dropdown of employees to which task will be assigend stored here

//   const { id } = useParams(); //get id of given task

//   useEffect(() => {
//     //get task by id
//     getTaskById(id)
//       .then((res) => {
//         console.log("task", res.data);
//         setTask((currentTask) => {
//           return {
//             ...currentTask,

//             name: res.data[0].name,
//             project_id: res.data[0].project_id,
//             assigned_to: res.data[0].assigned_to, //if there is no employess set the assigned to null value
//             description: res.data[0].description,
//             start_date: res.data[0].start_date,
//             end_date: res.data[0].end_date, //if end date is not expecetd then store it null
//             status: res.data[0].status,
//             priority: res.data[0].priority,
//           };
//         });
//       })
//       .catch((err) => console.log(err));

//     //fetch all projects

//     getAllProjects()
//       .then((res) => {
//         const projectsOption = res.data.map((project) => {
//           return {
//             value: project.id,
//             label: project.name,
//           };
//         });
//         SetProject(projectsOption); //set project state
//       })
//       .catch((err) => console.log(err));

//     //get all employees

//     getAllEmployees()
//       .then((res) => {
//         const employeeOptions = res.data.map((employees) => {
//           return {
//             value: employees.id,
//             label: employees.first_name + " " + employees.last_name,
//           };
//         });

//         setEmployees(employeeOptions); //set employess
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const statusOPtions = [
//     //status dropdown store here
//     {
//       value: "In-Progress",
//       label: "In-Progress",
//     },
//     {
//       value: "Not-Started",
//       label: "Not-Started",
//     },
//     {
//       value: "Completed",
//       label: "Completed",
//     },
//   ];

//   const priorityOPtions = [
//     //priority dropdown store here
//     {
//       value: "High",
//       label: "High",
//     },
//     {
//       value: "Medium",
//       label: "Medium",
//     },
//     {
//       value: "Low",
//       label: "Low",
//     },
//   ];
//   // input event handlers
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value);
//     setTask({ ...task, [name]: value });
//   };
//   const handleStatusChange = (statusOptions) => {
//     console.log(statusOptions);
//     setTask({ ...task, status: statusOptions.value });
//   };
//   const handlePriorityChange = (priorityOptions) => {
//     console.log(priorityOptions);
//     setTask({ ...task, priority: priorityOptions.value });
//   };
//   const handleProjectChange = (projectOPtion) => {
//     console.log(projectOPtion);
//     setTask({ ...task, project_id: projectOPtion.value });
//   };
//   const handleEmployessChange = (employessOPtion) => {
//     console.log(employessOPtion);
//     setTask({ ...task, assigned_to: employessOPtion.value });
//   };

//   const navigate = useNavigate();
//   //submit the form
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateTask(id, task)
//       .then((res) => {
//         console.log(res);
//         navigate("/tasks");
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     //form

//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>
//           task name:<span>*</span>
//           <input
//             type="text"
//             name="name"
//             value={task.name}
//             onChange={handleInputChange}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           project name:<span>*</span>
//           <Select
//             options={project}
//             onChange={handleProjectChange}
//             value={project.find((option) => option.value === task.project_id)}
//             placeholder="select project for task"
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           assigned to:
//           <Select
//             options={employees}
//             onChange={handleEmployessChange}
//             value={employees.find(
//               (option) => option.value === task.assigned_to
//             )}
//             placeholder="select task manger"
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           description:<span>*</span>
//           <br />
//           <textarea
//             name="description"
//             rows={10}
//             cols={10}
//             value={task.description}
//             onChange={handleInputChange}
//           ></textarea>
//         </label>
//       </div>

//       <div>
//         <label>
//           start date:<span>*</span>
//           <input
//             type="date"
//             name="start_date"
//             value={task.start_date}
//             onChange={handleInputChange}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           end date:<span>*</span>
//           {/<span>*</span> <DatePicker /> <span>*</span>/}
//           <input
//             type="date"
//             name="end_date"
//             value={task.end_date}
//             onChange={handleInputChange}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           status:<span>*</span>
//           <Select
//             options={statusOPtions}
//             value={statusOPtions.find((option) => {
//               return option.value === task.status;
//             })}
//             onChange={handleStatusChange}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           priority:<span>*</span>
//           <Select
//             options={priorityOPtions}
//             value={priorityOPtions.find((option) => {
//               return option.value === task.priority;
//             })}
//             onChange={handlePriorityChange}
//           />
//         </label>
//       </div>
//       <button type="submit" className="btn">
//         update task
//       </button>
//     </form>
//   );
// };

// export default TaskUpdate;
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";
import { getAllEmployees } from "../../services/employeeService";
import { getTaskById, updateTask } from "../../services/taskService";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";

// import "./FormStyling.css"; // For additional styling

const TaskUpdate = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background like other fields
      color: "white",
      borderRadius: "15px", // Rounded corners
      // border: "1px solid rgba(255, 255, 255, 0.4)", // Light white border
      border: "none",
      boxShadow: state.isFocused
        ? "0 0 8px rgba(255, 255, 255, 0.8); "
        : "none", // White glow on focus
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(20px)", // Optional glass-like effect
      padding: "15px", // Padding to match other inputs
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.6)", // Light white placeholder like other fields
      fontStyle: "italic", // Italic placeholder styling
      fontSize: "16px", // Same size as other inputs
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Selected text color white
    }),
    input: (provided) => ({
      ...provided,
      color: "white", // Input text color white
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)", // Transparent dropdown menu background
      backdropFilter: "blur(20px)", // Optional glass-like effect
      borderRadius: "10px", // Rounded corners for the dropdown
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(41, 49, 255, 0.9)"
        : "transparent", // Light background on hover
      color: state.isFocused ? "white" : "#000", // White text on hover, black otherwise
      padding: "10px", // Option padding for better readability
      borderRadius: "5px", // Rounded corners for options
    }),
  };

  const [searchParms] = useSearchParams();
  const { project_id } = Object.fromEntries([...searchParms]);
  console.log(Object.fromEntries([...searchParms]));
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
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTaskById(id).then((res) => {
      setTask(res.data[0]);
    });
    getAllProjects().then((res) => {
      SetProject(
        res.data.map((project) => ({ value: project.id, label: project.name }))
      );
    });
    getAllEmployees().then((res) => {
      setEmployees(
        res.data.map((employee) => ({
          value: employee.id,
          label: `${employee.first_name} ${employee.last_name}`,
        }))
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
              {/* <SaveIcon className="me-2" /> */}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
    // <div className="container mt-4 d-flex justify-content-center">
    //   <div className="task-form-wrapper shadow p-4 rounded">
    //     <h3 className="text-center mb-4"> Edit Task</h3>
    //     <form onSubmit={handleSubmit}>
    //       <h6 style={{ color: "#ff8528" }}>
    //         the filed followed by asterisk( <span>*</span> ) are necessary to
    //         filed.
    //       </h6>
    //       <div className="mb-3">
    //         <label className="form-label">
    //           Task name <span>*</span>
    //         </label>
    //         <input
    //           type="text"
    //           className={`form-control ${errors.name ? "is-invalid" : ""}`}
    //           name="name"
    //           value={task.name}
    //           onChange={(e) => setTask({ ...task, name: e.target.value })}
    //         />
    //         {errors.name && (
    //           <div className="invalid-feedback text-danger">{errors.name}</div>
    //         )}
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">
    //           Chose project for the task <span>*</span>
    //         </label>
    //         <Select
    //           styles={customSelectStyles}
    //           options={project}
    //           onChange={(option) =>
    //             setTask({ ...task, project_id: option.value })
    //           }
    //           value={project.find((option) => option.value === task.project_id)}
    //           className={errors.project_id ? "is-invalid" : ""}
    //         />
    //         {errors.project_id && (
    //           <div className="invalid-feedback text-danger">
    //             {errors.project_id}
    //           </div>
    //         )}
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">
    //           Assigned to <span>*</span>
    //         </label>
    //         <Select
    //           styles={customSelectStyles}
    //           options={employees}
    //           onChange={(option) =>
    //             setTask({ ...task, assigned_to: option.value })
    //           }
    //           value={employees.find(
    //             (option) => option.value === task.assigned_to
    //           )}
    //           className={errors.assigned_to ? "is-invalid" : ""}
    //         />
    //         {errors.assigned_to && (
    //           <div className="invalid-feedback text-danger">
    //             {errors.assigned_to}
    //           </div>
    //         )}
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">
    //           Description <span>*</span>
    //         </label>
    //         <textarea
    //           className={`form-control ${
    //             errors.description ? "is-invalid" : ""
    //           }`}
    //           rows="5"
    //           name="description"
    //           value={task.description}
    //           onChange={(e) =>
    //             setTask({ ...task, description: e.target.value })
    //           }
    //         />
    //         {errors.description && (
    //           <div className="invalid-feedback text-danger">
    //             {errors.description}
    //           </div>
    //         )}
    //       </div>
    //       <div className="row">
    //         <div className="col-md-6 mb-3">
    //           <label className="form-label">
    //             Start date <span>*</span>
    //           </label>
    //           <input
    //             type="date"
    //             className={` custom-date-input form-control ${
    //               errors.dates ? "is-invalid" : ""
    //             }`}
    //             name="start_date"
    //             value={task.start_date}
    //             onChange={(e) =>
    //               setTask({ ...task, start_date: e.target.value })
    //             }
    //           />
    //         </div>

    //         <div className="col-md-6 mb-3">
    //           <label className="form-label">
    //             End date <span>*</span>
    //           </label>
    //           <input
    //             type="date"
    //             className={`custom-date-input form-control ${
    //               errors.dates ? "is-invalid" : ""
    //             }`}
    //             name="end_date"
    //             value={task.end_date}
    //             onChange={(e) => setTask({ ...task, end_date: e.target.value })}
    //           />
    //           {errors.dates && (
    //             <div className="invalid-feedback text-danger">
    //               {errors.dates}
    //             </div>
    //           )}
    //         </div>
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">
    //           Status <span>*</span>
    //         </label>
    //         <Select
    //           styles={customSelectStyles}
    //           options={[
    //             { value: "In-Progress", label: "In-Progress" },
    //             { value: "Not-Started", label: "Not-Started" },
    //             { value: "Completed", label: "Completed" },
    //           ]}
    //           onChange={(option) => setTask({ ...task, status: option.value })}
    //           value={{ value: task.status, label: task.status }}
    //           className={errors.status ? "is-invalid" : ""}
    //         />
    //         {errors.status && (
    //           <div className="invalid-feedback text-danger">
    //             {errors.status}
    //           </div>
    //         )}
    //       </div>

    //       <div className="mb-3">
    //         <label className="form-label">
    //           Priority <span>*</span>
    //         </label>
    //         <Select
    //           styles={customSelectStyles}
    //           options={[
    //             { value: "High", label: "High" },
    //             { value: "Medium", label: "Medium" },
    //             { value: "Low", label: "Low" },
    //           ]}
    //           onChange={(option) =>
    //             setTask({ ...task, priority: option.value })
    //           }
    //           value={{ value: task.priority, label: task.priority }}
    //           className={errors.priority ? "is-invalid" : ""}
    //         />
    //         {errors.priority && (
    //           <div className="invalid-feedback text-danger">
    //             {errors.priority}
    //           </div>
    //         )}
    //       </div>

    //       <button type="submit" className="btn btn-primary w-100">
    //         Update Task
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default TaskUpdate;
