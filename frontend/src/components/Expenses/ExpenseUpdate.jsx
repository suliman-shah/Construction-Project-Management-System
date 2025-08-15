import React, { useEffect, useState } from "react";
import {
  getExpensesById,
  updateExpenses,
} from "../../services/expensesService";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";

const ExpenseUpdate = () => {
  // Expenses state
  // const [expenses, setExpenses] = useState({
  //   project_id: "",
  //   amount: "",
  //   description: "",
  //   date: "",
  // });

  // // Validation state
  // const [errors, setErrors] = useState({});

  // // Project options
  // const [projects, SetProjects] = useState([]);

  // // ID from useParams
  // const { id } = useParams();

  // useEffect(() => {
  //   // Get the expense by ID
  //   getExpensesById(id)
  //     .then((res) => {
  //       setExpenses({
  //         project_id: res.data[0].project_id,
  //         amount: res.data[0].amount,
  //         description: res.data[0].description,
  //         date: res.data[0].date,
  //       });
  //     })
  //     .catch((err) => console.log(err));

  //   // Get all projects
  //   getAllProjects()
  //     .then((res) => {
  //       const projectOptions = res.data.map((project) => ({
  //         value: project.id,
  //         label: project.name,
  //       }));
  //       SetProjects(projectOptions);
  //     })
  //     .catch((err) => console.log(err));
  // }, [id]);

  // const navigate = useNavigate();

  // // Event handlers
  // const handleProjectOptions = (projectOption) => {
  //   setExpenses({ ...expenses, project_id: projectOption.value });
  //   validateField("project_id", projectOption.value);
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setExpenses({ ...expenses, [name]: value });
  //   validateField(name, value);
  // };

  // // Validation
  // const validateField = (name, value) => {
  //   let errorMsg = {};
  //   if (name === "project_id" && !value) {
  //     errorMsg.project_id = "Project name is required.";
  //   }
  //   if (name === "amount" && (!value || isNaN(value))) {
  //     errorMsg.amount = "Amount must be a number.";
  //   }
  //   if (name === "description" && !value.trim()) {
  //     errorMsg.description = "Description is required.";
  //   }
  //   if (name === "date" && !value) {
  //     errorMsg.date = "Date is required.";
  //   }
  //   setErrors((prev) => ({ ...prev, ...errorMsg }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const validationErrors = {};
  //   if (!expenses.project_id)
  //     validationErrors.project_id = "Project name is required.";
  //   if (!expenses.amount || isNaN(expenses.amount))
  //     validationErrors.amount = "Amount must be a number.";
  //   if (!expenses.description.trim())
  //     validationErrors.description = "Description is required.";
  //   if (!expenses.date) validationErrors.date = "Date is required.";

  //   setErrors(validationErrors);
  //   if (Object.keys(validationErrors).length === 0) {
  //     updateExpenses(id, expenses)
  //       .then((res) => navigate("/expenses"))
  //       .catch((err) => console.log(err));
  //   }
  // };
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
  const [expenses, setExpenses] = useState({
    project_id: "",
    amount: "",
    description: "",
    date: "",
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ID from useParams
  const { id } = useParams();
  useEffect(() => {
    // Get the expense by ID

    getExpensesById(id)
      .then((res) => {
        setExpenses({
          project_id: res.data.project_id,
          amount: res.data.amount,
          description: res.data.description,
          date: res.data.date,
        });
      })
      .catch((err) => console.log(err));

    // Get all projects
    getAllProjects()
      .then((res) => {
        const projectOptions = res.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        setProjects(projectOptions);
      })
      .catch((err) => console.log(err));
  }, []);

  // Validate fields on the fly
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "project_id" && !value) {
      errorMsg = "Project name is required.";
    } else if (name === "amount" && (!value || isNaN(value))) {
      errorMsg = "Amount must be a valid number.";
    } else if (name === "description" && value.trim() === "") {
      errorMsg = "Description is required.";
    } else if (name === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      errorMsg = "Please enter a valid date.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handelProjectOptions = (projectOption) => {
    const newProjectId = projectOption ? projectOption.value : "";
    setExpenses({ ...expenses, project_id: newProjectId });
    validateField("project_id", newProjectId);
  };

  const handelInputChange = (e) => {
    const { name, value } = e.target;
    setExpenses({ ...expenses, [name]: value });
    validateField(name, value);
  };

  // Validate on form submission
  const validateForm = () => {
    const newErrors = {};
    if (!expenses.project_id)
      newErrors.project_id = "Project name is required.";
    if (!expenses.amount || isNaN(expenses.amount))
      newErrors.amount = "Amount must be a valid number.";
    if (!expenses.description)
      newErrors.description = "Description is required.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expenses.date))
      newErrors.date = "Please enter a valid date.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      updateExpenses(id, expenses)
        .then((res) => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/expenses", {
              state: { success: true, type: "update", project_id: id },
            });
          }, 10);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Edit Expense</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#ff8528" }}>
            the filed followed by asterisk ( <span> * </span>) are necessary to
            filed.
          </h6>
          <div className="mb-3">
            <label className="form-label">
              Expenses incurred by project:<span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={projects}
              onChange={handelProjectOptions}
              value={projects.find(
                (option) => option.value === expenses.project_id
              )}
              placeholder="&nbsp;&nbsp;&nbsp;Select project"
              className={errors.project_id ? "is-invalid" : ""}
              isClearable
            />
            {errors.project_id && (
              <div className="text-danger">{errors.project_id}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Amount:<span> * </span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.amount ? "is-invalid" : ""}`}
              name="amount"
              value={expenses.amount}
              onChange={handelInputChange}
              placeholder="Total amount of expense"
            />
            {errors.amount && (
              <div className="text-danger">{errors.amount}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Description:<span> * </span>
            </label>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              name="description"
              rows={4}
              value={expenses.description}
              onChange={handelInputChange}
              placeholder="Enter expense details"
            ></textarea>
            {errors.description && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Date:<span> * </span>
            </label>
            <input
              type="date"
              className={`custom-date-input form-control ${
                errors.date ? "is-invalid" : ""
              }`}
              name="date"
              value={expenses.date}
              onChange={handelInputChange}
            />
            {errors.date && <div className="text-danger">{errors.date}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseUpdate;

// import React, { useEffect, useState } from "react";
// import {
//   getExpensesById,
//   updateExpenses,
// } from "../../services/expensesService";
// import { useParams, useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";

// const ExpenseUpdate = () => {
//   //expenses stored here
//   const [expenses, setExpenses] = useState({
//     project_id: "",
//     amount: "",
//     description: "",
//     date: "",
//   });

//   // project option stored here
//   const [projects, SetProjects] = useState([]);

//   //id from useParams
//   const { id } = useParams();

//   useEffect(() => {
//     //get expenses By ID to be updating

//     getExpensesById(id)
//       .then((res) => {
//         console.log("res.data=", res.data);
//         setExpenses((currentExpenses) => {
//           return {
//             ...currentExpenses,
//             project_id: res.data[0].project_id,
//             amount: res.data[0].amount,
//             description: res.data[0].description,
//             date: res.data[0].date,
//           };
//         });
//       })
//       .catch((err) => console.log(err));

//     //get all project and stored them in the project state variable
//     getAllProjects()
//       .then((res) => {
//         console.log("project", res.data);
//         const projectOptions = res.data.map((project) => {
//           return {
//             value: project.id,
//             label: project.name,
//           };
//         });
//         console.log("project options", projectOptions);
//         SetProjects(projectOptions); //store option in the project state variable instead of objects
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   //event handler

//   const navigate = useNavigate();

//   const handelProjectOptions = (projectOption) => {
//     console.log(projectOption);
//     setExpenses({ ...expenses, project_id: projectOption.value });
//   };

//   const handelInputChange = (e) => {
//     const { value, name } = e.target;
//     console.log(name, value);
//     setExpenses({ ...expenses, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     updateExpenses(id, expenses)
//       .then((res) => {
//         console.log(res);
//         navigate("/expenses");
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {/* project id */}
//         <div>
//           <label>
//             project name:*
//             <Select
//               options={projects}
//               onChange={handelProjectOptions}
//               value={projects.find(
//                 (option) => option.value === expenses.project_id
//               )}
//               required
//               placeholder="Expense incurred by which  project"
//             />
//           </label>
//         </div>
//         {/* amount */}
//         <div>
//           <label>
//             amount:*
//             <input
//               type="number"
//               name="amount"
//               value={expenses.amount}
//               onChange={handelInputChange}
//               required
//               placeholder="Total amount of expense"
//             />
//           </label>
//         </div>
//         {/* description */}
//         <div>
//           <label>
//             {" "}
//             description:* <br />
//             <textarea
//               name="description"
//               rows={10}
//               cols={10}
//               value={expenses.description}
//               onChange={handelInputChange}
//               required
//               placeholder="expense details"
//             >
//               {" "}
//             </textarea>
//           </label>
//         </div>
//         {/* date */}
//         <div>
//           <label>
//             {" "}
//             date:*
//             <input
//               type="date"
//               name="date"
//               value={expenses.date}
//               onChange={handelInputChange}
//               required
//             />
//           </label>
//         </div>
//         <button type="submit" className="btn">
//           update expense
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ExpenseUpdate;
