import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";
import { createExpenses } from "../../services/expensesService";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";

const ExpenseForm = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
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
      createExpenses(expenses)
        .then((res) => {
          setSuccess(true);
          setTimeout(() => {
            navigate("/expenses", { state: { success: true, type: "add" } });
          }, 10);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">New Expense</h3>
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
              placeholder="Select project"
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
            <SaveIcon /> Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;

// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";
// import { createExpenses } from "../../services/expensesService";
// import { useNavigate } from "react-router-dom";

// const ExpenseForm = () => {
//   //NEW  expenses stored here
//   const [expenses, setExpenses] = useState({
//     project_id: "",
//     amount: "",
//     description: "",
//     date: "",
//   });

//   // project option stored here
//   const [projects, SetProjects] = useState([]);

//   //get all project and stored them in the project state variable

//   useEffect(() => {
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
//     createExpenses(expenses)
//       .then((res) => {
//         console.log(res);
//         navigate("/expenses");
//       })
//       .catch((err) => console.log(err));
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {/<span> * </span> project id <span> * </span>/}
//         <div>
//           <label>
//             project name:<span> * </span>
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
//         {/<span> * </span> amount <span> * </span>/}
//         <div>
//           <label>
//             amount:<span> * </span>
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
//         {/<span> * </span> description <span> * </span>/}
//         <div>
//           <label>
//             {" "}
//             description:<span> * </span> <br />
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
//         {/<span> * </span> date <span> * </span>/}
//         <div>
//           <label>
//             {" "}
//             date:<span> * </span>
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
//           add expense
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ExpenseForm;
