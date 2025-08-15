import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getAllProjects } from "../../services/projectService";
import { getAllInventory } from "../../services/inventoryServices";
import {
  getProjectResourcesById,
  updateProjectResources,
} from "../../services/projectResources";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const ProjectResourcesUpdate = () => {
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

  const [projectResources, setProjectResources] = useState({
    project_id: "",
    resource_id: "",
    quantity_used: 0, // Initialize with zero or existing quantity
  });
  const [initialQuantityUsed, setInitialQuantityUsed] = useState(0); // Track original quantity used
  const [project, setProject] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // Track validation errors for each field
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch project resource by id
    getProjectResourcesById(id)
      .then((res) => {
        console.log("project resourses api=", res.data);
        const resourceData = res.data;
        setProjectResources({
          project_id: resourceData.project_id,
          resource_id: resourceData.resource_id,
          quantity_used: resourceData.quantity_used,
        });
        setInitialQuantityUsed(resourceData.quantity_used); // Store initial quantity used for later comparison
      })
      .catch((err) => console.log(err));

    // Fetch all projects
    getAllProjects()
      .then((res) => {
        const projectOptions = res.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        setProject(projectOptions);
      })
      .catch((err) => console.log(err));

    // Fetch all inventory items
    getAllInventory()
      .then((res) => {
        const inventoryOptions = res.data.map((inventory) => ({
          value: inventory.id,
          label: inventory.item_name,
          quantity: inventory.quantity, // Track inventory quantity for validation
        }));
        setInventory(inventoryOptions);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Set initial inventory selection after inventory is updated
  useEffect(() => {
    if (inventory.length > 0) {
      const initialInventory = inventory.find(
        (option) => option.value === projectResources.resource_id
      );
      setSelectedInventory(initialInventory);
    }
  }, [inventory, projectResources.resource_id]);

  const handleProjectChange = (projectOption) => {
    setProjectResources({
      ...projectResources,
      project_id: projectOption ? projectOption.value : "",
    });
    setFieldErrors((prev) => ({
      ...prev,
      project_id: !projectOption ? "Project is required" : "",
    }));
  };

  const handleResourceChange = (resourceOption) => {
    setProjectResources({
      ...projectResources,
      resource_id: resourceOption ? resourceOption.value : "",
    });
    const selected = inventory.find(
      (item) => item.value === (resourceOption ? resourceOption.value : null)
    );
    setSelectedInventory(selected);

    // Validate immediately after selecting resource
    setFieldErrors((prev) => ({
      ...prev,
      resource_id: !resourceOption ? "Resource is required" : "",
    }));

    validateQuantity(projectResources.quantity_used, selected);
  };

  const validateQuantity = (quantity, inventoryItem) => {
    const enteredQuantity = parseInt(quantity, 10) || 0;
    const quantityDifference = enteredQuantity - initialQuantityUsed; // Calculate adjustment

    if (inventoryItem && quantityDifference > inventoryItem.quantity) {
      setErrorMessage(
        `Entered quantity exceeds available quantity of ${inventoryItem.label}. Available quantity: ${inventoryItem.quantity}`
      );
    } else if (enteredQuantity <= 0) {
      setErrorMessage("Quantity used must be greater than 0.");
    } else {
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10) || 0;

    setProjectResources({ ...projectResources, [name]: value });

    // Real-time validation for empty fields
    setFieldErrors((prev) => ({
      ...prev,
      [name]: !value ? `${name.replace("_", " ")} is required` : "",
    }));

    // Validate quantity on change
    if (name === "quantity_used" && selectedInventory) {
      validateQuantity(numericValue, selectedInventory);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for any empty fields before submission
    let errors = {};
    if (!projectResources.project_id) {
      errors.project_id = "Project is required";
    }
    if (!projectResources.resource_id) {
      errors.resource_id = "Resource is required";
    }
    if (!projectResources.quantity_used) {
      errors.quantity_used = "Quantity used is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return; // Stop form submission if there are errors
    }

    const quantityDifference =
      parseInt(projectResources.quantity_used, 10) - initialQuantityUsed;

    if (quantityDifference > selectedInventory?.quantity) {
      setErrorMessage(
        `Entered quantity exceeds available quantity of ${selectedInventory.label}. Available quantity: ${selectedInventory.quantity}`
      );
      return; // Prevent form submission
    }

    // Submit form if validation passes
    updateProjectResources(id, projectResources)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          {
            project_id
              ? navigate(`/projects/detail/${project_id}`, {
                  state: { success: true, type: "update" },
                })
              : navigate("/ProjectResources", {
                  state: { success: true, type: "update" },
                });
          }

          // navigate("/ProjectResources", {
          //   state: { success: true, type: "update" },
          // });
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="task-form-wrapper shadow p-4 rounded">
        <h3 className="text-center mb-4">Edit Project Resource</h3>

        <form onSubmit={handleSubmit}>
          <h6 style={{ color: "#ff8528" }}>
            Fields marked with asterisk (<span>*</span>) are required.
          </h6>

          <div className="mb-3">
            <label className="form-label">
              Project name<span> * </span>
            </label>
            <Select
              styles={customSelectStyles}
              options={project}
              onChange={handleProjectChange}
              value={project.find(
                (option) => option.value === projectResources.project_id
              )}
              placeholder="Select project"
              required
              isClearable
            />
            {fieldErrors.project_id && (
              <p
                style={{
                  color: "#FF885B",
                  fontStyle: "italic",
                  fontWeight: "500",
                }}
              >
                {fieldErrors.project_id}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Inventory Item <span>*</span>
            </label>
            <Select
              styles={customSelectStyles}
              options={inventory}
              onChange={handleResourceChange}
              value={selectedInventory}
              placeholder="Select resource"
              required
              isClearable
            />
            {fieldErrors.resource_id && (
              <p
                style={{
                  color: "#FF885B",
                  fontStyle: "italic",
                  fontWeight: "500",
                }}
              >
                {fieldErrors.resource_id}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">
              Quantity Used <span>*</span>
            </label>
            <input
              type="number"
              name="quantity_used"
              value={projectResources.quantity_used}
              onChange={handleInputChange}
              className="form-control"
              required
              min="0"
            />
            {fieldErrors.quantity_used && (
              <p
                style={{
                  color: "#FF885B",
                  fontStyle: "italic",
                  fontWeight: "500",
                }}
              >
                {fieldErrors.quantity_used}
              </p>
            )}
            {errorMessage && (
              <p
                style={{
                  color: "#FF885B",
                  fontStyle: "italic",
                  fontWeight: "500",
                }}
              >
                {errorMessage}
              </p>
            )}
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary w-100 mt-3">
              {success ? (
                <>
                  <Spinner animation="border" size="sm" /> Updating...
                </>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectResourcesUpdate;

//  no styling but accurate and vaildated form///////////////
// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllProjects } from "../../services/projectService";
// import { getAllInventory } from "../../services/inventoryServices";
// import {
//   getProjectResourcesById,
//   updateProjectResources,
// } from "../../services/projectResources";
// import { useNavigate, useParams } from "react-router-dom";
// import { Spinner } from "react-bootstrap";
// const ProjectResourcesUpdate = () => {
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
//   // States
//   const [projectResources, setProjectResources] = useState({
//     project_id: "",
//     resource_id: "",
//     quantity_used: 0, // Initialize with zero or existing quantity
//   });
//   const [initialQuantityUsed, setInitialQuantityUsed] = useState(0); // Track original quantity used
//   const [project, setProject] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [selectedInventory, setSelectedInventory] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   useEffect(() => {
//     // Fetch project resource by id
//     getProjectResourcesById(id)
//       .then((res) => {
//         const resourceData = res.data[0];
//         setProjectResources({
//           project_id: resourceData.project_id,
//           resource_id: resourceData.resource_id,
//           quantity_used: resourceData.quantity_used,
//         });
//         setInitialQuantityUsed(resourceData.quantity_used); // Store initial quantity used for later comparison
//       })
//       .catch((err) => console.log(err));

//     // Fetch all projects
//     getAllProjects()
//       .then((res) => {
//         const projectOptions = res.data.map((project) => ({
//           value: project.id,
//           label: project.name,
//         }));
//         setProject(projectOptions);
//       })
//       .catch((err) => console.log(err));

//     // Fetch all inventory items
//     getAllInventory()
//       .then((res) => {
//         const inventoryOptions = res.data.map((inventory) => ({
//           value: inventory.id,
//           label: inventory.item_name,
//           quantity: inventory.quantity, // Track inventory quantity for validation
//         }));
//         setInventory(inventoryOptions);
//       })
//       .catch((err) => console.log(err));
//   }, [id]);

//   // Set initial inventory selection after inventory is updated
//   useEffect(() => {
//     if (inventory.length > 0) {
//       const initialInventory = inventory.find(
//         (option) => option.value === projectResources.resource_id
//       );
//       setSelectedInventory(initialInventory);
//     }
//   }, [inventory, projectResources.resource_id]);

//   const handleProjectChange = (projectOption) => {
//     setProjectResources({
//       ...projectResources,
//       project_id: projectOption.value,
//     });
//   };

//   const validateQuantity = (quantity, inventoryItem) => {
//     const enteredQuantity = parseInt(quantity, 10) || 0;
//     const quantityDifference = enteredQuantity - initialQuantityUsed; // Calculate adjustment

//     if (inventoryItem && quantityDifference > inventoryItem.quantity) {
//       setErrorMessage(
//         `Entered quantity exceeds available quantity of ${inventoryItem.label}. Available quantity: ${inventoryItem.quantity}`
//       );
//     } else {
//       setErrorMessage(""); // Clear error message if valid
//     }
//   };

//   const handleResourceChange = (resourceOption) => {
//     setProjectResources({
//       ...projectResources,
//       resource_id: resourceOption.value,
//     });

//     // Set selected inventory to track its quantity
//     const selected = inventory.find(
//       (item) => item.value === resourceOption.value
//     );
//     setSelectedInventory(selected);

//     // Validate quantity immediately if a resource is selected
//     validateQuantity(projectResources.quantity_used, selected);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     const numericValue = parseInt(value, 10) || 0;

//     setProjectResources({ ...projectResources, [name]: value });

//     // Validate the quantity against the selected inventory
//     if (name === "quantity_used" && selectedInventory) {
//       validateQuantity(numericValue, selectedInventory);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate before submission
//     const quantityDifference =
//       parseInt(projectResources.quantity_used, 10) - initialQuantityUsed;

//     if (quantityDifference > selectedInventory?.quantity) {
//       setErrorMessage(
//         `Entered quantity exceeds available quantity of ${selectedInventory.label}. Available quantity: ${selectedInventory.quantity}`
//       );
//       return; // Prevent form submission
//     }

//     // Submit form if validation passes
//     updateProjectResources(id, projectResources)
//       .then(() => {
//         setSuccess(true);
//         setTimeout(() => {
//           navigate("/ProjectResources", {
//             state: { success: true, type: "update" },
//           });
//         }, 1000);
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="container mt-4 d-flex justify-content-center">
//       <div className="task-form-wrapper shadow p-4 rounded">
//         <h3 className="text-center mb-4">Edit Project Resource</h3>

//         <form onSubmit={handleSubmit}>
//           <h6 style={{ color: "#ff8528" }}>
//             Fields marked with asterisk (<span>*</span>) are required.
//           </h6>
//           <div className="mb-3">
//             <label className="form-label">
//               Project name<span> * </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={project}
//               onChange={handleProjectChange}
//               value={project.find(
//                 (option) => option.value === projectResources.project_id
//               )}
//               placeholder="Select project"
//               required
//               isClearable
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Resource<span> * </span>
//             </label>
//             <Select
//               styles={customSelectStyles}
//               options={inventory}
//               onChange={handleResourceChange}
//               value={inventory.find(
//                 (option) => option.value === projectResources.resource_id
//               )}
//               placeholder="Select inventory"
//               required
//               isClearable
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">
//               Quantity Used<span> * </span>
//             </label>
//             <input
//               type="number"
//               name="quantity_used"
//               value={projectResources.quantity_used}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           {/* Display error message if any */}
//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//           <div className="d-flex justify-content-center">
//             <button type="submit" className="btn btn-primary w-100 mt-3">
//               {success ? (
//                 <>
//                   <Spinner animation="border" size="sm" /> Updating...
//                 </>
//               ) : (
//                 <>Update</>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectResourcesUpdate;
