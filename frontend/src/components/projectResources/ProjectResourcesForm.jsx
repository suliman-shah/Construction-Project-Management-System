import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";
import { getAllInventory } from "../../services/inventoryServices";
import { createProjectResources } from "../../services/projectResources";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import SaveIcon from "@mui/icons-material/Save";

const ProjectResourcesForm = () => {
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
  console.log("project_id=", project_id);
  // States
  const [projectResources, setProjectResources] = useState({
    project_id: "",
    resource_id: "",
    quantity_used: "",
  });
  const [project, SetProject] = useState([]);
  const [inventory, SetInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    Promise.all([getAllProjects(), getAllInventory()])
      .then(([projectRes, inventoryRes]) => {
        const projectOptions = projectRes.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        const inventoryOptions = inventoryRes.data.map((inventory) => ({
          value: inventory.id,
          label: inventory.item_name,
          quantity: inventory.quantity, // For quantity validation
        }));
        SetProject(projectOptions);
        SetInventory(inventoryOptions);
      })
      .catch((err) => console.log(err));
  }, []);

  // Single validation function
  const validateField = (name, value) => {
    switch (name) {
      case "project_id":
        return value ? "" : "Project is required";
      case "resource_id":
        return value ? "" : "Resource is required";
      case "quantity_used":
        if (!value) return "Quantity is required";
        if (selectedInventory && parseInt(value) > selectedInventory.quantity) {
          return `Entered quantity exceeds available stock (${selectedInventory.quantity})`;
        }
        return "";
      default:
        return "";
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(projectResources).forEach((field) => {
      const error = validateField(field, projectResources[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle select changes
  const handleSelectChange = (name, option) => {
    const value = option ? option.value : "";
    setProjectResources({ ...projectResources, [name]: value });

    if (name === "resource_id") setSelectedInventory(option); // Save inventory for validation
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // Handle input change for quantity
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectResources({ ...projectResources, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submission if form is invalid

    createProjectResources(projectResources)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          {
            project_id
              ? navigate(`/projects/detail/${project_id}`, {
                  state: { success: true, type: "add" },
                })
              : navigate("/ProjectResources", {
                  state: { success: true, type: "add" },
                });
          }

          // navigate("/ProjectResources", {
          //   state: { success: true, type: "add" },
          // });
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">New Project Resource</h3>
        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#FFFDB5" }}>
            Fields marked with asterisk (<span> * </span>) are required.
          </h6>

          <div className="mb-3">
            <label className="form-label">
              Project Name <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={project}
              onChange={(option) => handleSelectChange("project_id", option)}
              value={project.find(
                (option) => option.value === projectResources.project_id
              )}
              placeholder="&nbsp;&nbsp; Choose a project"
              className={errors.project_id ? "is-invalid" : ""}
              isClearable
            />
            {errors.project_id && (
              <div className="text-danger">{errors.project_id}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Resource <span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={inventory}
              onChange={(option) => handleSelectChange("resource_id", option)}
              value={inventory.find(
                (option) => option.value === projectResources.resource_id
              )}
              placeholder="&nbsp;&nbsp; Choose an inventory item"
              className={errors.resource_id ? "is-invalid" : ""}
              isClearable
            />
            {errors.resource_id && (
              <div className="text-danger">{errors.resource_id}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Quantity <span> * </span>
            </label>
            <br />
            <input
              type="number"
              name="quantity_used"
              value={projectResources.quantity_used}
              onChange={handleInputChange}
              placeholder="&nbsp;&nbsp; Amount allocated to project"
              className={`form-control ${
                errors.quantity_used ? "is-invalid" : ""
              }`}
            />
            {errors.quantity_used && (
              <p className="text-danger">{errors.quantity_used}</p>
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

export default ProjectResourcesForm;
// no styling but accurate and vaildated form///////////////
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";
// import { getAllInventory } from "../../services/inventoryServices";
// import { createProjectResources } from "../../services/projectResources";
// import { useNavigate } from "react-router-dom";
// import { Spinner } from "react-bootstrap";
// import SaveIcon from "@mui/icons-material/Save";

// const ProjectResourcesForm = () => {
//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       backgroundColor: "rgba(255, 255, 255, 0.1)",
//       color: "white",
//       borderRadius: "15px",
//       border: "none",
//       boxShadow: state.isFocused ? "0 0 8px rgba(255, 255, 255, 0.8);" : "none",
//       transition: "all 0.3s ease-in-out",
//       backdropFilter: "blur(20px)",
//       padding: "15px",
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: "rgba(255, 255, 255, 0.6)",
//       fontStyle: "italic",
//       fontSize: "16px",
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: "white",
//     }),
//     input: (provided) => ({
//       ...provided,
//       color: "white",
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       backdropFilter: "blur(20px)",
//       borderRadius: "10px",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused
//         ? "rgba(41, 49, 255, 0.9)"
//         : "transparent",
//       color: state.isFocused ? "white" : "#000",
//       padding: "10px",
//       borderRadius: "5px",
//     }),
//   };

//   //states
//   const [projectResources, setProjectResources] = useState({
//     project_id: "",
//     resource_id: "",
//     quantity_used: "",
//   });

//   const [project, SetProject] = useState([]);
//   const [inventory, SetInventory] = useState([]);
//   const [selectedInventory, setSelectedInventory] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch all projects
//     getAllProjects()
//       .then((res) => {
//         const projectOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         SetProject(projectOptions);
//       })
//       .catch((err) => console.log(err));

//     // Fetch all inventory
//     getAllInventory()
//       .then((res) => {
//         console.log("get all inventory:", res.data);
//         const inventoryOptions = res.data.map((inventory) => ({
//           value: inventory.id,
//           label: inventory.item_name,
//           quantity: inventory.quantity, // Add quantity field for validation
//         }));
//         console.log("invet option:=", inventoryOptions);
//         SetInventory(inventoryOptions);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const validateField = (name, value) => {
//     let error = "";

//     if (name === "project_id" && !value) {
//       error = "Project name is required";
//     } else if (name === "resource_id" && !value) {
//       error = "Inventory name is required";
//     } else if (name === "quantity_used" && !value) {
//       error = "Quantity amount  is required";
//     }
//     return error;
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     Object.keys(projectResources).forEach((field) => {
//       const error = validateField(field, projectResources[field]);
//       if (error) {
//         newErrors[field] = error;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   // Event handlers
//   const handleProjectChange = (name, option) => {
//     const value = option ? option.value : null;
//     const error = validateField(name, value);
//     setProjectResources({
//       ...projectResources,
//       [name]: value,
//     });
//     setErrors({ ...errors, [name]: error });
//   };

//   const handleResourceChange = (name, option) => {
//     const value = option ? option.value : null;
//     const error = validateField(name, value);
//     console.log(option);
//     setSelectedInventory(option); // Save the selected inventory item for validation
//     setProjectResources({
//       ...projectResources,
//       [name]: value,
//     });
//     setErrors({ ...errors, [name]: error });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProjectResources({ ...projectResources, [name]: value });
//     setErrors({ ...errors, [name]: validateField(name, value) });

//     // Vaildate quantity-used  against avilable quantity for the item in the inventory
//     if (name === "quantity_used" && selectedInventory) {
//       const enteredQuantity = parseInt(value, 10);
//       if (enteredQuantity > selectedInventory.quantity) {
//         setErrorMessage(
//           // `Entered quantity exceeds available inventory. Available: ${selectedInventory.quantity}`
//           `Entered quantity exceeds available quantity of  ${selectedInventory.label} " Available  quantity : ${selectedInventory.quantity} "`
//         );
//       } else {
//         setErrorMessage("");
//       }
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Prevent form submission if validation fails
//     console.log("vaildateForm=", validateForm());
//     if (
//       !validateForm() ||
//       parseInt(projectResources.quantity_used, 10) > selectedInventory?.quantity
//     ) {
//       if (
//         parseInt(projectResources.quantity_used, 10) >
//         selectedInventory?.quantity
//       ) {
//         setErrorMessage(
//           // `Entered quantity exceeds available inventory. Available: ${selectedInventory.quantity}`
//           `Entered quantity exceeds available quantity of  ${selectedInventory?.label} " Available  quantity : ${selectedInventory?.quantity} "`
//         );
//       }

//       return;
//     }
//     // Submit form
//     createProjectResources(projectResources)
//       .then((res) => {
//         setSuccess(true);
//         setTimeout(() => {
//           navigate("/ProjectResources", {
//             state: { success: true, type: "add" },
//           });
//         }, 1000);
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="container mt-4 d-flex justify-content-center">
//       <div className="task-form-wrapper shadow p-4 rounded">
//         <h3 className="text-center mb-4">New Project Resource</h3>
//         <form onSubmit={handleSubmit}>
//           <h6 style={{ color: "#ff8528" }}>
//             the filed followed by asterisk ( <span> * </span>) are necessary to
//             filed.
//           </h6>
//           <div className="row"></div>

//           <div>
//             <label className="form-label">
//               Project name <span> * </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={project}
//               onChange={(option) => {
//                 handleProjectChange("project_id", option);
//               }}
//               value={project.find(
//                 (option) => option.value === projectResources.project_id
//               )}
//               placeholder="&nbsp;&nbsp; chose project"
//               className={errors.project_id ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.project_id && (
//               <div className="text-danger">{errors.project_id}</div>
//             )}
//           </div>

//           <div>
//             <label className="form-label">
//               Resource <span> * </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={inventory}
//               onChange={(option) => {
//                 handleResourceChange("resource_id", option);
//               }}
//               value={inventory.find(
//                 (option) => option.value === projectResources.resource_id
//               )}
//               placeholder="&nbsp;&nbsp; chose inventory"
//               className={errors.resource_id ? "is-invalid" : ""}
//               isClearable
//             />
//             {errors.resource_id && (
//               <div className="text-danger">{errors.resource_id}</div>
//             )}
//           </div>

//           <div>
//             <label className="form-label">
//               Quantity <span> * </span>{" "}
//             </label>
//             <br />
//             <input
//               type="number"
//               name="quantity_used"
//               value={projectResources.quantity_used}
//               onChange={handleInputChange}
//               placeholder="&nbsp;&nbsp; amount of the quantity allocated to the project"
//               className={`form-control ${
//                 errors.quantity_used ? "is-invalid" : ""
//               }`}
//             />
//           </div>

//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//           {errors.quantity_used && (
//             <div className="text-danger">{errors.quantity_used}</div>
//           )}

//           <div className="d-flex justify-content-center">
//             <button
//               type="submit"
//               className="btn btn-primary w-100 mt-3"
//               // disabled={errorMessage !== ""}
//             >
//               {success ? (
//                 <>
//                   <Spinner animation="border" size="sm" /> Adding...
//                 </>
//               ) : (
//                 <>
//                   <SaveIcon /> Add
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectResourcesForm;
