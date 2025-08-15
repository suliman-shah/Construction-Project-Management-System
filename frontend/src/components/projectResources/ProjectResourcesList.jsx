import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Select from "react-select";
import {
  deleteProjectResources,
  getAllProjectResources,
} from "../../services/projectResources";
import { getAllProjects } from "../../services/projectService";
import { getAllInventory } from "../../services/inventoryServices";
import {
  Spinner,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Search } from "@mui/icons-material";
import { AddCircle, Visibility, Delete, Edit, Add } from "@mui/icons-material";
import ReactPaginate from "react-paginate"; // Import ReactPaginate
import { Alert } from "react-bootstrap"; // Import Alert for success message
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Import success icon from Material UI

const ProjectResourcesList = () => {
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background like other fields
      color: "white",
      borderRadius: "15px", // Rounded corners
      // border: "1px solid rgba(255, 255, 255, 0.4)", // Light white border
      border: "none",
      boxShadow: state.isFocused
        ? "0 0 8px rgba(255, 255, 255, 0.5); "
        : "none", // White glow on focus
      transition: "all 0.3s ease-in-out",
      backdropFilter: "blur(5px)", // Optional glass-like effect
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
      backdropFilter: "blur(50px)", // Optional glass-like effect
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

  const [projectResources, setprojectResources] = useState([]); // project resources stored here
  const [filteredProjectResources, setFilteredProjectResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedResources, setSelectedResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [projectResourcesToDelete, setprojectResourcesToDelete] =
    useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(location.state?.success || false);
  const [type, setType] = useState(location.state?.type || ""); // "add" or "update"console.log(location);

  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const projectResourcesPerPage = 3; // Number of ProjectResources per page
  const offset = currentPage * projectResourcesPerPage; // Calculate offset for pagination
  const pageCount = Math.ceil(
    filteredProjectResources.length / projectResourcesPerPage
  ); // Total page count

  //fetch project resources

  const fetchProjectResources = () => {
    setLoading(true);
    getAllProjectResources()
      .then((res) => {
        console.log("project Resources", res.data);

        setprojectResources(res.data);
        setFilteredProjectResources(res.data);
        setLoading(false);
      })
      .catch((err) => console.log("error fecthing Project Resoources", err));
  };

  const fetchProjects = () => {
    getAllProjects()
      .then((res) => {
        const projectsOptions = res.data.map((project) => ({
          value: project.id,
          label: project.name,
        }));
        console.log("projectsOptions", projectsOptions);
        setProjects(projectsOptions);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  };
  //fetch inventory
  const fetchInventory = () => {
    getAllInventory()
      .then((res) => {
        const inventoryOptions = res.data.map((inventory) => ({
          value: inventory.id,
          label: inventory.item_name,
        }));
        console.log("inventoryOptions", inventoryOptions);
        setResources(inventoryOptions);
      })
      .catch((err) => console.error("Error fetching Inventory:", err));
  };
  //useEffect

  useEffect(() => {
    fetchProjectResources();
    fetchInventory();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setType(""); // Clear type after alert is hidden
        navigate("/ProjectResources", { replace: true }); // Clear the success state from history
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleDelete = () => {
    deleteProjectResources(projectResourcesToDelete)
      .then(() => {
        fetchProjectResources();
        setShowModal(false);
      })
      .catch((err) => console.error("Error deleting project Resources:", err));
  };

  const confirmDelete = (id) => {
    setprojectResourcesToDelete(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleFilterChange = () => {
    let filtered = [...projectResources];

    if (selectedProject) {
      filtered = filtered.filter(
        (resources) => resources.name === selectedProject.label
      );
    }

    if (selectedResources) {
      filtered = filtered.filter(
        (resource) => resource.item_name === selectedResources.label
      );
    }

    setFilteredProjectResources(filtered);
    setCurrentPage(0); // Reset to the first page when filters are applied
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedProject, selectedResources]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  //event handlers

  return (
    <div className="container-fluid">
      {/* Conditionally show the appropriate alert based on "type" */}
      {success && type === "add" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>ProjectResources added successfully!</span>
        </Alert>
      )}

      {success && type === "update" && (
        <Alert
          variant="success"
          className="mt-4 d-flex align-items-center"
          style={{ backgroundColor: "#d4edda", color: "#155724" }}
        >
          <CheckCircleIcon style={{ marginRight: "10px", fontSize: "24px" }} />
          <span>ProjectResources updated successfully!</span>
        </Alert>
      )}

      <div className="row">
        <div className="col-12">
          {/* <h1 className="mt-3">ProjectResources List</h1> */}

          {/* Filters Section */}
          <div className="row mb-3">
            <div className="col-md-6 col-sm-12">
              <OverlayTrigger overlay={<Tooltip>Filter by Project</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Project"
                    options={projects}
                    value={selectedProject}
                    onChange={(selectedOption) =>
                      setSelectedProject(selectedOption)
                    }
                    isClearable
                    isSearchable
                  />
                </div>
              </OverlayTrigger>
            </div>
            <div className="col-md-6 col-sm-12">
              <OverlayTrigger overlay={<Tooltip>Filter by Inventory</Tooltip>}>
                <div className="filter-select">
                  <Select
                    styles={customSelectStyles}
                    // components={{
                    //   DropdownIndicator: () => (
                    //     <Search className="search-icon" />
                    //   ),
                    // }}
                    placeholder="Filter by Inventory"
                    options={resources}
                    value={selectedResources}
                    onChange={(selectedOption) =>
                      setSelectedResources(selectedOption)
                    }
                    isClearable
                    isSearchable
                  />
                </div>
              </OverlayTrigger>
            </div>
          </div>

          <div className="mb-3">
            <OverlayTrigger
              overlay={
                <Tooltip className="tooltip">Add New ProjectResources</Tooltip>
              }
            >
              <Link to="/ProjectResources/new" className="add-icon">
                <Add />
              </Link>
            </OverlayTrigger>
          </div>
          {/* ProjectResources Table */}
          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            // <>
            //   <Spinner animation="border" />

            // </>
            <>
              <div className="table-responsive ">
                <table className="table table-custom  ">
                  <thead>
                    <tr>
                      {/* <th>id</th> */}
                      <th>Project</th>
                      <th>Resources</th>
                      <th>Quantity used </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjectResources
                      .slice(offset, offset + projectResourcesPerPage)
                      .map((ProjectResources) => (
                        <tr
                          key={ProjectResources.id}
                          onDoubleClick={() =>
                            navigate(
                              `/ProjectResources/detail/${ProjectResources.id}`
                            )
                          } // Navigate to ProjectResources detail on row click
                          style={{ cursor: "pointer" }} // Add pointer to indicate it's clickable
                        >
                          {/* <td>{ProjectResources.id}</td> */}
                          <td>{ProjectResources.project_name}</td>
                          <td>{ProjectResources.item_name}</td>
                          <td>
                            <span style={{ color: "ompleted" }}>
                              {ProjectResources.quantity_used}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex justify-content-around">
                              {/* <OverlayTrigger overlay={<Tooltip>View</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/ProjectResources/detail/${ProjectResources.id}`}
                                  className="btn btn-info btn-sm  "
                                >
                                  <Visibility />
                                </Link>
                              </OverlayTrigger> */}
                              <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link
                                  style={{ borderRadius: "50%" }}
                                  to={`/ProjectResources/update/${ProjectResources.id}`}
                                  className="btn btn-warning btn-sm  "
                                >
                                  <Edit />
                                </Link>
                              </OverlayTrigger>
                              <OverlayTrigger
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <Button
                                  style={{ borderRadius: "50%" }}
                                  variant="danger"
                                  size="sm"
                                  onClick={() =>
                                    confirmDelete(ProjectResources.id)
                                  }
                                >
                                  <Delete />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"react-paginate"}
                activeClassName={"selected"}
                disabledClassName={"disabled"}
              />
            </>
          )}

          {/* Modal for Delete Confirmation */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this ProjectResources?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="Project-Resources-list">
  //     <h1>ProjectResources</h1>

  //     <Link to="/ProjectResources/new" className="btn">
  //       Add New Project Resources
  //     </Link>
  //     <br />
  //     <hr />

  //     <table>
  //       <thead>
  //         <tr>
  //           {/* <th>id</th> */}
  //           <th>project </th>
  //           <th>Resource</th>
  //           <th>quantity used</th>
  //           <th>Actions</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {projectResources.map((e) => {
  //           return (
  //             <tr key={e.id}>
  //               {/* <td>{e.id}</td> */}
  //               <td>{e.name}</td>
  //               <td>
  //                 {e.item_name != null ? (
  //                   e.item_name
  //                 ) : (
  //                   <span>resource is unavailable </span>
  //                 )}
  //               </td>
  //               <td>{e.quantity_used}</td>

  //               <td>
  //                 <Link to={`/projects/detail/${e.id}`} className="btn">
  //                   View
  //                 </Link>{" "}
  //                 &nbsp;
  //                 <button
  //                   onClick={() => {
  //                     handleDelete(e.id);
  //                   }}
  //                   className="btn"
  //                 >
  //                   delete
  //                 </button>{" "}
  //                 &nbsp;
  //                 <Link to={`/ProjectResources/update/${e.id}`} className="btn">
  //                   update
  //                 </Link>
  //               </td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //   </div>
  // );
};
export default ProjectResourcesList;
