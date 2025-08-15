import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import "./Breadcrumb.css";

const TransparentBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Skip breadcrumbs for these paths
  if (["login", "signup"].includes(pathnames[0])) {
    return null;
  }

  // Custom breadcrumb names mapping
  const breadcrumbNameMap = {
    projects: "Projects",
    tasks: "Tasks",
    employees: "Employees",
    expenses: "Expenses",
    inventory: "Inventory",
    suppliers: "Suppliers",
    ProjectResources: "Project Resources",
    new: "Create New",
    update: "Update",
    detail: "Details",
  };

  // Function to check if a segment is an ID (numeric)
  const isID = (segment) => /^\d+$/.test(segment);

  return (
    <div className="transparent-breadcrumbs">
      <Breadcrumb className="bg-transparent p-2 m-0">
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: "/" }}
          className="text-white"
        >
          <i className="bi bi-house-check"></i> Dashboard
        </Breadcrumb.Item>

        {pathnames.map((name, index) => {
          // Skip numeric IDs from breadcrumbs
          if (isID(name)) return null;

          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNameMap[name] || name;

          return isLast ? (
            <Breadcrumb.Item
              active
              key={name}
              className="text-white" // Slightly muted for current page
            >
              {displayName}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: routeTo }}
              key={name}
              className="text-white"
            >
              {displayName}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default TransparentBreadcrumbs;
