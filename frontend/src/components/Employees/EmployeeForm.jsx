// import React, { useEffect, useState } from "react";
// import { createEmployee } from "../../services/employeeService";
// import { useNavigate } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import Select from "react-select";
// import { Alert } from "react-bootstrap";
// import "./EmployeeForm.css";

// const EmployeeForm = () => {
//   const [employees, setEmployees] = useState({
//     first_name: "",
//     last_name: "",
//     role: "",
//     phone: "",
//     email: "",
//     address: "",
//     salary: "",
//     project_id: null,
//     date_hired: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [projects, setProjects] = useState([]);
//   const [success, setSuccess] = useState(false); // For success alert
//   const navigate = useNavigate(); // Moved outside to prevent unnecessary re-instantiation

//   useEffect(() => {
//     getAllProjects()
//       .then((res) => {
//         const projectOptions = res.data.map((project) => ({
//           label: project.name,
//           value: project.id,
//         }));
//         setProjects(projectOptions);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployees({ ...employees, [name]: value });
//     validateField(name, value);
//   };

//   const handleSelectChange = (selectedOption) => {
//     setEmployees({ ...employees, project_id: selectedOption.value });
//     validateField("project_id", selectedOption.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       createEmployee(employees)
//         .then(() => {
//           setSuccess(true);
//           setTimeout(() => {
//             navigate("/employees", { state: { success: true, type: "add" } }); // Pass success state
//           }, 10); // Show success message for 1 second before navigating
//         })
//         .catch((err) => console.log(err));
//     }
//   };

//   const validateField = (name, value) => {
//     let error = "";
//     if (["first_name", "last_name"].includes(name) && /\d/.test(value)) {
//       error = "No numbers allowed";
//     } else if (
//       name === "email" &&
//       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
//     ) {
//       error = "Invalid email format";
//     } else if (!value) {
//       error = "This field is required";
//     }

//     setErrors({ ...errors, [name]: error });
//     return error === "";
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       "first_name",
//       "last_name",
//       "role",
//       "phone",
//       "email",
//       "address",
//       "salary",
//       "project_id",
//       "date_hired",
//     ];
//     let valid = true;

//     requiredFields.forEach((field) => {
//       const value = employees[field];
//       if (!validateField(field, value)) {
//         valid = false;
//       }
//     });

//     return valid;
//   };

//   return (
//     <div className="container mt-4 d-flex justify-content-center">
//       <div className="task-form-wrapper shadow p-4 rounded">
//         <h3 className="text-center mb-4">Add New Employee</h3>
//         <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
//           <div className="mb-3">
//             <label>First Name<span> * </span></label>
//             <input
//               type="text"
//               name="first_name"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.first_name}
//             />
//             {errors.first_name && (
//               <div className="text-danger">{errors.first_name}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Last Name<span> * </span></label>
//             <input
//               type="text"
//               name="last_name"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.last_name}
//             />
//             {errors.last_name && (
//               <div className="text-danger">{errors.last_name}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Role<span> * </span></label>
//             <input
//               type="text"
//               name="role"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.role}
//             />
//             {errors.role && (
//               <div className="text-danger">{errors.role}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Phone<span> * </span></label>
//             <input
//               type="text"
//               name="phone"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.phone}
//             />
//             {errors.phone && (
//               <div className="text-danger">{errors.phone}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Email<span> * </span></label>
//             <input
//               type="email"
//               name="email"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.email}
//             />
//             {errors.email && (
//               <div className="text-danger">{errors.email}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Address<span> * </span></label>
//             <textarea
//               name="address"
//               className="form-control"
//               rows={3}
//               onChange={handleInputChange}
//               value={employees.address}
//             />
//             {errors.address && (
//               <div className="text-danger">{errors.address}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Salary<span> * </span></label>
//             <input
//               type="number"
//               name="salary"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.salary}
//             />
//             {errors.salary && (
//               <div className="text-danger">{errors.salary}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Working Project<span> * </span></label>
//             <Select
//               options={projects}
//               onChange={handleSelectChange}
//               placeholder="Select project"
//               value={projects.find(
//                 (option) => option.value === employees.project_id
//               )}
//             />
//             {errors.project_id && (
//               <div className="text-danger">{errors.project_id}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label>Date Hired<span> * </span></label>
//             <input
//               type="date"
//               name="date_hired"
//               className="form-control"
//               onChange={handleInputChange}
//               value={employees.date_hired}
//             />
//             {errors.date_hired && (
//               <div className="text-danger">{errors.date_hired}</div>
//             )}
//           </div>

//           <button type="submit" className="btn btn-primary w-100 mt-3">
//             Add Employee
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployeeForm;

import React, { useEffect, useState } from "react";
import { createEmployee } from "../../services/employeeService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllProjects } from "../../services/projectService";
import Select from "react-select";

const EmployeeForm = () => {
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

  const [employees, setEmployees] = useState({
    first_name: "",
    last_name: "",
    role: "",
    phone: "",
    email: "",
    address: "",
    salary: "",
    project_id: null,
    date_hired: "",
  });
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [success, setSuccess] = useState(false); // For success alert
  const navigate = useNavigate(); // Moved outside to prevent unnecessary re-instantiation

  useEffect(() => {
    getAllProjects()
      .then((res) => {
        const projectOptions = res.data.map((project) => ({
          label: project.name,
          value: project.id,
        }));
        setProjects(projectOptions);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployees({ ...employees, [name]: value });
    // Trigger validation as the user types
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSelectChange = (selectedOption) => {
    setEmployees({
      ...employees,
      project_id: selectedOption ? selectedOption.value : null, // Handle null when cleared
    });

    // Trigger validation for project_id on selection or clear
    setErrors({
      ...errors,
      project_id: validateField(
        "project_id",
        selectedOption ? selectedOption.value : null // Pass null if cleared
      ),
    });
  };

  const validateField = (name, value) => {
    let error = "";

    if (["first_name", "last_name"].includes(name) && /\d/.test(value)) {
      error = "No numbers allowed";
    } else if (
      name === "email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
    ) {
      error = "Invalid email format";
    } else if (name === "phone" && !/^\d+$/.test(value)) {
      error = "Phone number must contain only digits";
    } else if (name === "project_id" && !value) {
      error = "Please select a project";
    } else if (!value) {
      error = "This field is required";
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "first_name",
      "last_name",
      "role",
      "phone",
      "email",
      "address",
      "salary",
      "project_id",
      "date_hired",
    ];

    requiredFields.forEach((field) => {
      const value = employees[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    // Form is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      createEmployee(employees)
        .then(() => {
          setSuccess(true);
          setTimeout(() => {
            {
              project_id
                ? navigate(`/projects/detail/${project_id}`, {
                    state: { success: true, type: "add" },
                  })
                : navigate("/employees", {
                    state: { success: true, type: "add" },
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
        <h3 className="text-center mb-4">New Employee</h3>
        <form onSubmit={handleSubmit} className="">
          <div className="mb-3">
            <h6 style={{ color: "#ff8528" }}>
              the filed followed by asterisk <span> * </span> are necessary to
              filed.
            </h6>
            <label className="form-label">
              First name <span> * </span>
            </label>
            <input
              type="text"
              name="first_name"
              onChange={handleInputChange}
              value={employees.first_name}
              placeholder="employee first name"
              className={`form-control ${
                errors.first_name ? "is-invalid" : ""
              }`}
            />
            {errors.first_name && (
              <div className="text-danger">{errors.first_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Last name <span> * </span>
            </label>
            <input
              type="text"
              name="last_name"
              onChange={handleInputChange}
              value={employees.last_name}
              placeholder="employee last name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            />
            {errors.last_name && (
              <div className="text-danger">{errors.last_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Role <span> * </span>
            </label>
            <input
              type="text"
              name="role"
              onChange={handleInputChange}
              value={employees.role}
              placeholder="labour"
              className={`form-control ${errors.role ? "is-invalid" : ""}`}
            />
            {errors.role && <div className="text-danger">{errors.role}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Phone <span> * </span>
            </label>
            <input
              type="text"
              name="phone"
              onChange={handleInputChange}
              value={employees.phone}
              placeholder="03xxxxxxxx"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && <div className="text-danger">{errors.phone}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Email <span> * </span>
            </label>
            <input
              type="email"
              name="email"
              onChange={handleInputChange}
              value={employees.email}
              placeholder="employee@gmail.com"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Salary <span> * </span>
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleInputChange}
              value={employees.salary}
              placeholder="1234"
              className={`form-control ${errors.salary ? "is-invalid" : ""}`}
            />
            {errors.salary && (
              <div className="text-danger">{errors.salary}</div>
            )}
          </div>

          {/* <div className="mb-3">
            <label className="form-label">
              Working project <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={projects}
              onChange={handleSelectChange}
              placeholder="&nbsp;&nbsp;&nbsp; select project"
              value={projects.find(
                (option) => option.value === employees.project_id
              )}
              isClearable
            />
            {errors.project_id && (
              <div className="text-danger">{errors.project_id}</div>
            )}
          </div> */}
          <div className="mb-3">
            <label className="form-label">
              Working project <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={projects}
              onChange={handleSelectChange}
              placeholder="&nbsp;&nbsp;&nbsp; select project"
              value={
                projects.find(
                  (option) => option.value === employees.project_id
                ) || null
              }
              isClearable
            />
            {errors.project_id && (
              <div className="text-danger">{errors.project_id}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Date hired <span> * </span>
            </label>
            <input
              type="date"
              name="date_hired"
              onChange={handleInputChange}
              value={employees.date_hired}
              className={`custom-date-input form-control ${
                errors.date_hired ? "is-invalid" : ""
              }`}
            />
            {errors.date_hired && (
              <div className="text-danger">{errors.date_hired}</div>
            )}
          </div>
          <div className="mb-3">
            <label>
              Address <span> * </span>
            </label>
            <textarea
              name="address"
              rows={3}
              onChange={handleInputChange}
              value={employees.address}
              placeholder="xyz address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
            />
            {errors.address && (
              <div className="text-danger">{errors.address}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

// import React, { useEffect, useState } from "react";
// import { createEmployee } from "../../services/employeeService";
// import { useNavigate } from "react-router-dom";
// import { getAllProjects } from "../../services/projectService";
// import "./FormStyling.css";

// import Select from "react-select";
// import { Alert, Snackbar } from "@mui/material"; // You don't need this here for now.
// const EmployeeForm = () => {
//   const [employees, setEmployees] = useState({
//     first_name: "",
//     last_name: "",
//     role: "",
//     phone: "",
//     email: "",
//     address: "",
//     salary: "",
//     project_id: null,
//     date_hired: "",
//   });
//   const [projects, setProjects] = useState([]);
//   useEffect(() => {
//     getAllProjects()
//       .then((res) => {
//         console.log(res.data);

//         const projectOptions = res.data.map((project) => {
//           return {
//             label: project.name,
//             value: project.id,
//           };
//         });
//         console.log("projectoptions", projectOptions);
//         setProjects(projectOptions);
//       })
//       .catch((err) => console.log(err));
//   }, []);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, "and value ", value);

//     setEmployees({ ...employees, [name]: value });
//   };
//   const navigate = useNavigate();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     createEmployee(employees)
//       .then((res) => {
//         navigate("/employees", { state: { success: true } }); // Pass success state to the EmployeeList page
//       })
//       .catch((err) => console.log(err));
//   };
//   const handleSelectChange = (selectedoptions) => {
//     console.log(selectedoptions);
//     setEmployees({ ...employees, project_id: selectedoptions.value });
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         {" "}
//         <label>
//           First Name:<span> * </span>
//           <input
//             type="text"
//             name="first_name"
//             onChange={handleInputChange}
//             value={employees.first_name}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Last Name:
//           <input
//             type="text"
//             name="last_name"
//             onChange={handleInputChange}
//             value={employees.last_name}
//             placeholder="optional"
//           />
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           Role:<span> * </span>
//           <input
//             type="text"
//             name="role"
//             onChange={handleInputChange}
//             value={employees.role}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           phone:<span> * </span>
//           <input
//             type="number"
//             name="phone"
//             value={employees.phone}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           Email:<span> * </span>
//           <input
//             type="email"
//             name="email"
//             value={employees.email}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           Address:<span> * </span>
//           <textarea
//             name="address"
//             value={employees.addrees}
//             onChange={handleInputChange}
//             rows={10}
//             cols={10}
//             required
//           ></textarea>
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           Salary:<span> * </span>
//           <input
//             type="number"
//             name="salary"
//             value={employees.salary}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           working Project:
//           <Select
//             options={projects}
//             onChange={handleSelectChange}
//             placeholder="select projects"
//             value={projects.find((options) => {
//               return options.value === employees.project_id;
//             })}
//           />
//         </label>
//       </div>
//       <div>
//         {" "}
//         <label>
//           date_hired:<span> * </span>
//           <input
//             type="date"
//             name="date_hired"
//             value={employees.date_hired}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//       </div>
//       <button type="submit" className="btn">
//         add Employee
//       </button>
//     </form>
//   );
// };

// export default EmployeeForm;
