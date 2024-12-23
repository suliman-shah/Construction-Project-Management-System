// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";
// import {
//   getAllEmployees,
//   updateEmployee,
// } from "../../services/employeeService";
// import { format, isValid } from "date-fns"; // Import isValid to check date validity
// import { getAllProjects } from "../../services/projectService";
// import {
//   Alert,
//   Button,
//   Spinner,
//   Form,
//   FormControl,
//   Row,
//   Col,
// } from "react-bootstrap"; // Bootstrap components
// import { CheckCircleOutline, AddCircleOutline } from "@mui/icons-material"; // Material UI Icons

// const EmployeeUpdate = () => {
//   const [projects, setProjects] = useState([]);
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
//   const [submitted, setSubmitted] = useState(false);
//   const { id } = useParams();

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

//     getAllEmployees()
//       .then((res) => {
//         const foundEmployee = res.data.find((e) => e.id == id);
//         setEmployees({
//           ...employees,
//           ...foundEmployee,
//         });
//       })
//       .catch((err) => console.log(err));
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmployees({ ...employees, [name]: value });
//   };

//   const handleSelectChange = (selectedOption) => {
//     setEmployees({ ...employees, project_id: selectedOption.value });
//   };

//   const validateForm = () => {
//     const validationErrors = {};
//     const namePattern = /^[a-zA-Z]+$/;
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!employees.first_name || !namePattern.test(employees.first_name)) {
//       validationErrors.first_name =
//         "First name is required and should not contain numbers.";
//     }
//     if (!employees.last_name || !namePattern.test(employees.last_name)) {
//       validationErrors.last_name =
//         "Last name is required and should not contain numbers.";
//     }
//     if (!employees.role) {
//       validationErrors.role = "Role is required.";
//     }
//     if (!employees.phone) {
//       validationErrors.phone = "Phone number is required.";
//     }
//     if (!employees.email || !emailPattern.test(employees.email)) {
//       validationErrors.email = "Valid email is required.";
//     }
//     if (!employees.address) {
//       validationErrors.address = "Address is required.";
//     }
//     if (!employees.salary) {
//       validationErrors.salary = "Salary is required.";
//     }
//     if (!employees.project_id) {
//       validationErrors.project_id = "Project must be selected.";
//     }
//     if (!employees.date_hired || !isValid(new Date(employees.date_hired))) {
//       validationErrors.date_hired = "Valid hiring date is required.";
//     }

//     setErrors(validationErrors);
//     return Object.keys(validationErrors).length === 0;
//   };

//   const navigate = useNavigate();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       updateEmployee(id, employees)
//         .then((res) => {
//           setSubmitted(true);
//           navigate("/employees", { state: { success: true } });
//         })
//         .catch((err) => console.log(err));
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="task-form-wrapper shadow p-4 rounded">

//        </div>
//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>First Name*</Form.Label>
//               <FormControl
//                 type="text"
//                 name="first_name"
//                 onChange={handleInputChange}
//                 value={employees.first_name}
//                 isInvalid={!!errors.first_name}
//               />
//               {errors.first_name && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.first_name}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>

//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Last Name*</Form.Label>
//               <FormControl
//                 type="text"
//                 name="last_name"
//                 onChange={handleInputChange}
//                 value={employees.last_name}
//                 isInvalid={!!errors.last_name}
//               />
//               {errors.last_name && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.last_name}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Role*</Form.Label>
//               <FormControl
//                 type="text"
//                 name="role"
//                 onChange={handleInputChange}
//                 value={employees.role}
//                 isInvalid={!!errors.role}
//               />
//               {errors.role && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.role}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>

//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Phone*</Form.Label>
//               <FormControl
//                 type="number"
//                 name="phone"
//                 value={employees.phone}
//                 onChange={handleInputChange}
//                 isInvalid={!!errors.phone}
//               />
//               {errors.phone && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.phone}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Email*</Form.Label>
//               <FormControl
//                 type="email"
//                 name="email"
//                 value={employees.email}
//                 onChange={handleInputChange}
//                 isInvalid={!!errors.email}
//               />
//               {errors.email && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.email}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>

//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Address*</Form.Label>
//               <FormControl
//                 as="textarea"
//                 rows={3}
//                 name="address"
//                 value={employees.address}
//                 onChange={handleInputChange}
//                 isInvalid={!!errors.address}
//               />
//               {errors.address && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.address}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Salary*</Form.Label>
//               <FormControl
//                 type="number"
//                 name="salary"
//                 value={employees.salary}
//                 onChange={handleInputChange}
//                 isInvalid={!!errors.salary}
//               />
//               {errors.salary && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.salary}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>

//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Working Project*</Form.Label>
//               <Select
//                 options={projects}
//                 onChange={handleSelectChange}
//                 placeholder="Select project"
//                 value={projects.find(
//                   (options) => options.value === employees.project_id
//                 )}
//               />
//               {errors.project_id && (
//                 <div className="text-danger">{errors.project_id}</div>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Date Hired*</Form.Label>
//               <FormControl
//                 type="date"
//                 name="date_hired"
//                 value={employees.date_hired}
//                 onChange={handleInputChange}
//                 isInvalid={!!errors.date_hired}
//               />
//               {errors.date_hired && (
//                 <Form.Control.Feedback type="invalid">
//                   {errors.date_hired}
//                 </Form.Control.Feedback>
//               )}
//             </Form.Group>
//           </Col>
//         </Row>

//         <Button
//           type="submit"
//           variant="success"
//           className="mt-3"
//           style={{ display: "flex", alignItems: "center" }}
//         >
//           <AddCircleOutline style={{ marginRight: "8px" }} />
//           Update Employee
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default EmployeeUpdate;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Select from "react-select";
import {
  getAllEmployees,
  updateEmployee,
} from "../../services/employeeService";
import { getAllProjects } from "../../services/projectService";
import { format } from "date-fns"; // Import format
import { Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "./FormStyling.css"; // For additional styling

const EmployeeUpdate = () => {
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

  const [projects, setProjects] = useState([]);
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
  const [success, setSuccess] = useState(false); // State for success alert
  const { id } = useParams();
  const navigate = useNavigate();

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

    getAllEmployees()
      .then((res) => {
        const foundEmployee = res.data.find((e) => e.id == id);
        setEmployees(foundEmployee);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // const validate = () => {
  //   let tempErrors = {};
  //   const nameRegex = /^[A-Za-z\s]+$/;
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   // First Name & Last Name Validation
  //   if (!employees.first_name || !nameRegex.test(employees.first_name)) {
  //     tempErrors.first_name =
  //       "First Name is required and must not contain numbers.";
  //   }
  //   if (!employees.last_name || !nameRegex.test(employees.last_name)) {
  //     tempErrors.last_name =
  //       "Last Name is required and must not contain numbers.";
  //   }

  //   // Role, Project, Phone, Email, Address, Salary, and Date Hired Validation
  //   if (!employees.role) tempErrors.role = "Role is required.";
  //   if (!employees.project_id)
  //     tempErrors.project_id = "Project must be selected.";
  //   if (!employees.phone) tempErrors.phone = "Phone number is required.";
  //   if (!employees.email || !emailRegex.test(employees.email)) {
  //     tempErrors.email = "Valid email is required.";
  //   }
  //   if (!employees.address) tempErrors.address = "Address is required.";
  //   if (!employees.salary) tempErrors.salary = "Salary is required.";
  //   if (!employees.date_hired)
  //     tempErrors.date_hired = "Date hired is required.";

  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setEmployees({ ...employees, [name]: value });
  // };

  // const handleSelectChange = (selectedOption) => {
  //   const { value } = selectedOption;
  //   setEmployees({ ...employees, project_id: value });
  // };
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
      updateEmployee(id, employees)
        .then((res) => {
          setSuccess(true); // Show success alert
          {
            project_id
              ? navigate(`/projects/detail/${project_id}`, {
                  state: { success: true, type: "update" },
                })
              : navigate("/employees", {
                  state: { success: true, type: "update" },
                }); // Pass success state to EmployeeList.jsx
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Edit Employee</h3>
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
            Update
          </button>
        </form>
      </div>
    </div>

    //   <div className="container mt-4 d-flex justify-content-center">
    //     <div className="task-form-wrapper shadow p-4 rounded">
    //       <h3 className="text-center mb-4">Edit Employee</h3>

    //       <form onSubmit={handleSubmit}>
    //         <h6>the filed followed by asterisk( * ) are necessary to filed.</h6>
    //         {/* First Name */}
    //         <div className="mb-3">
    //           <label>
    //             First Name: <span>*</span>
    //           </label>
    //           <input
    //             type="text"
    //             name="first_name"
    //             onChange={handleInputChange}
    //             value={employees.first_name}
    //             className="form-control"
    //           />
    //           {errors.first_name && (
    //             <div className="text-danger">{errors.first_name}</div>
    //           )}
    //         </div>
    //         {/* Last Name */}
    //         <div className="mb-3">
    //           <label>
    //             Last Name: <span>*</span>
    //           </label>
    //           <input
    //             type="text"
    //             name="last_name"
    //             onChange={handleInputChange}
    //             value={employees.last_name}
    //             className="form-control"
    //           />
    //           {errors.last_name && (
    //             <div className="text-danger">{errors.last_name}</div>
    //           )}
    //         </div>
    //         {/* Role */}
    //         <div className="mb-3">
    //           <label>
    //             Role: <span>*</span>
    //           </label>
    //           <input
    //             type="text"
    //             name="role"
    //             onChange={handleInputChange}
    //             value={employees.role}
    //             className="form-control"
    //           />
    //           {errors.role && <div className="text-danger">{errors.role}</div>}
    //         </div>
    //         {/* Phone */}
    //         <div className="mb-3">
    //           <label>
    //             Phone: <span>*</span>
    //           </label>
    //           <input
    //             type="number"
    //             name="phone"
    //             onChange={handleInputChange}
    //             value={employees.phone}
    //             className="form-control"
    //           />
    //           {errors.phone && <div className="text-danger">{errors.phone}</div>}
    //         </div>
    //         {/* Email */}
    //         <div className="mb-3">
    //           <label>
    //             Email: <span>*</span>
    //           </label>
    //           <input
    //             type="email"
    //             name="email"
    //             onChange={handleInputChange}
    //             value={employees.email}
    //             className="form-control"
    //           />
    //           {errors.email && <div className="text-danger">{errors.email}</div>}
    //         </div>
    //         {/* Address */}
    //         <div className="mb-3">
    //           <label>
    //             Address: <span>*</span>
    //           </label>
    //           <textarea
    //             name="address"
    //             onChange={handleInputChange}
    //             value={employees.address}
    //             rows={3}
    //             className="form-control"
    //           ></textarea>
    //           {errors.address && (
    //             <div className="text-danger">{errors.address}</div>
    //           )}
    //         </div>
    //         {/* Salary */}
    //         <div className="mb-3">
    //           <label>
    //             Salary: <span>*</span>
    //           </label>
    //           <input
    //             type="number"
    //             name="salary"
    //             onChange={handleInputChange}
    //             value={employees.salary}
    //             className="form-control"
    //           />
    //           {errors.salary && (
    //             <div className="text-danger">{errors.salary}</div>
    //           )}
    //         </div>
    //         {/* Project */}
    //         <div className="mb-3">
    //           <label>
    //             Working Project: <span>*</span>
    //           </label>
    //           <Select
    //             styles={customSelectStyles}
    //             options={projects}
    //             onChange={handleSelectChange}
    //             value={projects.find(
    //               (option) => option.value === employees.project_id
    //             )}
    //             isClearable
    //           />
    //           {errors.project_id && (
    //             <div className="text-danger">{errors.project_id}</div>
    //           )}
    //         </div>
    //         {/* Date Hired */}
    //         <div className="mb-3">
    //           <label>
    //             Date Hired: <span>*</span>
    //           </label>
    //           <input
    //             type="date"
    //             name="date_hired"
    //             onChange={handleInputChange}
    //             value={employees.date_hired}
    //             className="custom-date-input form-control"
    //           />

    //           {errors.date_hired && (
    //             <div className="text-danger">{errors.date_hired}</div>
    //           )}
    //         </div>
    //         {/* Submit Button */}
    //         <Button type="submit" className="btn btn-primary w-100 mt-3">
    //           Update Employee
    //         </Button>
    //       </form>
    //     </div>
    //   </div>
  );
};

export default EmployeeUpdate;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import Select from "react-select";
// import {
//   getAllEmployees,
//   updateEmployee,
// } from "../../services/employeeService";

// import { format, isValid } from "date-fns"; // Import isValid to check date validity
// import { getAllProjects } from "../../services/projectService";

// const EmployeeUpdate = () => {
//   const [projects, setProjects] = useState([]);
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
//   const { id } = useParams();
//   console.log("id", id);
//   useEffect(() => {
//     //fetch all projects
//     getAllProjects()
//       .then((res) => {
//         console.log("projects", res.data);
//         const projectOptions = res.data.map((project) => {
//           return { label: project.name, value: project.id };
//         });
//         console.log("projects options", projectOptions);
//         setProjects(projectOptions);
//       })
//       .catch((err) => console.log(err));

//     //fetch all employess
//     getAllEmployees()
//       .then((res) => {
//         console.log("res.data=", res.data);
//         const foudEmployees = res.data.find((e) => e.id == id);
//         console.log("found employees with id'", id, "'", foudEmployees);

//         setEmployees((employees) => {
//           return {
//             ...employees,
//             first_name: foudEmployees.first_name,
//             last_name: foudEmployees.last_name,
//             role: foudEmployees.role,
//             phone: foudEmployees.phone,
//             email: foudEmployees.email,
//             address: foudEmployees.address,
//             salary: foudEmployees.salary,
//             project_id: foudEmployees.project_id,
//             date_hired: foudEmployees.date_hired,
//           };
//         });
//       })
//       .catch((err) => console.log(err));
//   }, []);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log(name, value);
//     setEmployees({ ...employees, [name]: value });
//   };
//   const navigate = useNavigate();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateEmployee(id, employees)
//       .then((res) => {
//         console.log(res);
//         navigate("/employees");
//       })
//       .catch((err) => console.log(err));
//   };
//   const handleSelectChange = (selectedOption) => {
//     console.log(selectedOption);
//     const { value } = selectedOption;
//     setEmployees({ ...employees, project_id: value });
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         {" "}
//         <label>
//           First Name:*
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
//           Role:*
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
//           phone:*
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
//           Email:*
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
//           Address:*
//           <textarea
//             name="address"
//             value={employees.address}
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
//           Salary:*
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
//           date_hired:*
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
//         update Employee
//       </button>
//     </form>
//   );
// };

// export default EmployeeUpdate;
