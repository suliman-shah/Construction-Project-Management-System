// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import "./TaskStatusBarChart.css"; // Import your amazing styling here
// import { Link } from "react-router-dom";
// const TaskStatusBarChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch project task status data from the API
//
//       .then((response) => response.json())
//       .then((data) => {
//         // Transform the data into the format needed for the bar chart
//         const chartData = data.flatMap((project) =>
//           project.tasks.map((task) => ({
//             projectName: project.name,
//             taskName: task.name,
//             status: task.status,
//             completed: task.status === "Completed" ? 1 : 0,
//             inProgress: task.status === "In-Progress" ? 1 : 0,
//             notStarted: task.status === "Not-Started" ? 1 : 0,
//             startDate: task.start_date,
//             endDate: task.end_date,
//             assignedTo: task.assigned_to,
//           }))
//         );
//         setData(chartData);
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const { projectName, taskName, status, startDate, endDate, assignedTo } =
//         payload[0].payload;
//       return (
//         <div className="custom-tooltip">
//           <p className="label">
//             <strong>Task:</strong> {taskName}
//           </p>
//           <p className="intro">
//             <strong>Project:</strong> {projectName}
//           </p>
//           <p className="intro">
//             <strong>Status:</strong> {status}
//           </p>
//           <p className="intro">
//             <strong>Start Date:</strong> {startDate}
//           </p>
//           <p className="intro">
//             <strong>End Date:</strong> {endDate}
//           </p>
//           <p className="intro">
//             <strong>Assigned To:</strong> {assignedTo}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!data.length)
//     return (
//       <Link to={"/tasks/new"} className="btn">
//         Add New Task
//       </Link>
//     );
//   return (
//     <div
//       className="bar-chart-container"
//       style={{ maxWidth: "600px", margin: "0 auto" }}
//     >
//       <h3
//         style={{ textAlign: "center", fontSize: "1.2em", marginBottom: "10px" }}
//       >
//         Task Status Overview
//       </h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           data={data}
//           margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
//           layout="vertical"
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" hide={true} /> {/* Hiding the X-axis numbers */}
//           <YAxis dataKey="taskName" type="category" width={120} />
//           <Tooltip content={<CustomTooltip />} />
//           {/* Bar for Completed Tasks */}
//           <Bar
//             dataKey="completed"
//             fill="#00C49F"
//             stackId="a"
//             name="Completed"
//             barSize={15}
//           />
//           {/* Bar for In-Progress Tasks */}
//           <Bar
//             dataKey="inProgress"
//             fill="#FFBB28"
//             stackId="a"
//             name="In-Progress"
//             barSize={15}
//           />
//           {/* Bar for Not-Started Tasks */}
//           <Bar
//             dataKey="notStarted"
//             fill="#FF8042"
//             stackId="a"
//             name="Not-Started"
//             barSize={15}
//           />
//         </BarChart>
//       </ResponsiveContainer>

//       {/* Legend for the colors, displayed in a row */}
//       <div
//         className="legend-container"
//         style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}
//       >
//         <p style={{ marginRight: "10px", fontSize: "0.9em" }}>
//           <span style={{ color: "#00C49F" }}>■</span> Completed
//         </p>
//         <p style={{ marginRight: "10px", fontSize: "0.9em" }}>
//           <span style={{ color: "#FFBB28" }}>■</span> In-Progress
//         </p>
//         <p style={{ fontSize: "0.9em" }}>
//           <span style={{ color: "#FF8042" }}>■</span> Not-Started
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TaskStatusBarChart;

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./TaskStatusBarChart.css"; // Import your amazing styling here
import { Link } from "react-router-dom";
import { getAllProject_Tasks_status } from "../../services/dashboardServices";

const TaskStatusBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch project task status data from the API
    getAllProject_Tasks_status()
      // .then((response) => response.json())

      .then((res) => {
        // Transform the data into the format needed for the bar chart
        const chartData = res.data.flatMap((project) =>
          project.tasks.map((task) => ({
            projectName: project.name,
            taskName: task.name,
            status: task.status,
            completed: task.status === "Completed" ? 1 : 0,
            inProgress: task.status === "In-Progress" ? 1 : 0,
            notStarted: task.status === "Not-Started" ? 1 : 0,
            startDate: task.start_date,
            endDate: task.end_date,
            assignedTo: task.assigned_to,
          }))
        );
        setData(chartData);
      })
      .catch((error) => console.error("Error fetching project data:", error));
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { projectName, taskName, status, startDate, endDate, assignedTo } =
        payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">
            <strong>Task:</strong> {taskName}
          </p>
          <p className="intro">
            <strong>Project:</strong> {projectName}
          </p>
          <p className="intro">
            <strong>Status:</strong> {status}
          </p>
          <p className="intro">
            <strong>Start Date:</strong> {startDate}
          </p>
          <p className="intro">
            <strong>End Date:</strong> {endDate}
          </p>
          <p className="intro">
            <strong>Assigned To:</strong> {assignedTo}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data.length)
    return (
      // <Link to={"/tasks/new"} className="btn btn-primary ">
      //   <i className="bi bi-plus-square me-2"></i>
      //   Add New Task
      // </Link>

      <Link
        to={"/tasks/new"}
        className="btn btn-primary d-block w-100 w-md-auto"
      >
        <i className="bi bi-plus-square me-2"></i>
        Add New Task
      </Link>
    );

  return (
    <div
      className="bar-chart-container"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
        animation: "fadeIn 1s ease-in-out, pulse 2s infinite alternate",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "1.5em",
          marginBottom: "10px",
          color: "#61dafb",
        }}
      >
        Task Status Overview
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide={true} />
          <YAxis dataKey="taskName" type="category" width={120} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="completed"
            fill="#00C49F"
            stackId="a"
            name="Completed"
            barSize={15}
          />
          <Bar
            dataKey="inProgress"
            fill="#FFBB28"
            stackId="a"
            name="In-Progress"
            barSize={15}
          />
          <Bar
            dataKey="notStarted"
            fill="#FF8042"
            stackId="a"
            name="Not-Started"
            barSize={15}
          />
        </BarChart>
      </ResponsiveContainer>

      <div
        className="legend-container"
        style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}
      >
        <p style={{ marginRight: "10px", fontSize: "0.9em" }}>
          <span style={{ color: "#00C49F" }}>■</span> Completed
        </p>
        <p style={{ marginRight: "10px", fontSize: "0.9em" }}>
          <span style={{ color: "#FFBB28" }}>■</span> In-Progress
        </p>
        <p style={{ fontSize: "0.9em" }}>
          <span style={{ color: "#FF8042" }}>■</span> Not-Started
        </p>
      </div>
    </div>
  );
};

export default TaskStatusBarChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import "./TaskStatusBarChart.css"; // Import your amazing styling here

// const TaskStatusBarChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch project task status data from the API
//
//       .then((response) => response.json())
//       .then((data) => {
//         // Transform the data into the format needed for the bar chart
//         const chartData = data.flatMap((project) =>
//           project.tasks.map((task) => ({
//             projectName: project.name,
//             taskName: `${task.name} (${project.name})`, // Combine task name with project name
//             status: task.status,
//           }))
//         );
//         setData(chartData);
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Completed":
//         return "#00C49F"; // Green
//       case "In-Progress":
//         return "#FFBB28"; // Yellow
//       case "Not-Started":
//         return "#FF8042"; // Orange
//       default:
//         return "#8884d8"; // Default color
//     }
//   };

//   return (
//     <div className="bar-chart-container">
//       <h3>Task Status Overview</h3>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           layout="vertical" // Make bars horizontal
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" />
//           <YAxis dataKey="taskName" type="category" width={250} />
//           <Tooltip />
//           <Legend />
//           <Bar
//             dataKey="status"
//             barSize={20}
//             label={{ position: "insideLeft", fill: "#fff" }}
//           >
//             {/* { data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={getStatusColor(entry.status)} // Apply color based on task status
//               />
//             ))} */}
//             {data.map((entry, index) => {
//               console.log(
//                 `Task: ${entry.taskName}, Status: ${
//                   entry.status
//                 }, Color: ${getStatusColor(entry.status)}`
//               );
//               return (
//                 <Cell
//                   key={`cell-${index}`}
//                   // fill={getStatusColor(entry.status)}
//                   fill="#00C49F"
//                 />
//               );
//             })}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TaskStatusBarChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import "./TaskStatusBarChart.css"; // Import your amazing styling here

// const TaskStatusBarChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch project task status data from the API
//
//       .then((response) => response.json())
//       .then((data) => {
//         // Transform the data into the format needed for the bar chart
//         const chartData = data.flatMap((project) =>
//           project.tasks.map((task) => ({
//             projectName: project.name,
//             taskName: `${task.name} (${project.name})`, // Combine task name with project name
//             status: task.status,
//             Completed: task.status === "Completed" ? 1 : 0,
//             "In-Progress": task.status === "In-Progress" ? 1 : 0,
//             "Not-Started": task.status === "Not-Started" ? 1 : 0,
//           }))
//         );
//         setData(chartData);
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   return (
//     <div className="bar-chart-container">
//       <h3>Task Status Overview</h3>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           layout="vertical" // Make bars horizontal
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" />
//           <YAxis dataKey="taskName" type="category" width={250} />
//           <Tooltip />
//           <Bar dataKey="Completed" stackId="a" fill="#00C49F" barSize={20} />
//           <Bar dataKey="In-Progress" stackId="a" fill="#FFBB28" barSize={20} />
//           <Bar dataKey="Not-Started" stackId="a" fill="#FF8042" barSize={20} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TaskStatusBarChart;

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";
// import "./TaskStatusBarChart.css"; // Import your amazing styling here

// const TaskStatusBarChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // Fetch project task status data from the API
//
//       .then((response) => response.json())
//       .then((data) => {
//         // Transform the data into the format needed for the bar chart
//         const chartData = data.flatMap((project) =>
//           project.tasks.map((task) => ({
//             projectName: project.name,
//             taskName: task.name,
//             status: task.status,
//             startDate: task.start_date,
//             endDate: task.end_date,
//             assignedTo: task.assigned_to,
//           }))
//         );
//         setData(chartData);
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Completed":
//         return "#00C49F"; // Green
//       case "In-Progress":
//         return "#FFBB28"; // Yellow
//       case "Not-Started":
//         return "#FF8042"; // Orange
//       default:
//         return "#8884d8"; // Default color
//     }
//   };

//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const { projectName, taskName, status, startDate, endDate, assignedTo } =
//         payload[0].payload;
//       return (
//         <div className="custom-tooltip">
//           <p className="label">
//             <strong>Task:</strong> {taskName}
//           </p>
//           <p className="intro">
//             <strong>Project:</strong> {projectName}
//           </p>
//           <p className="intro">
//             <strong>Status:</strong> {status}
//           </p>
//           <p className="intro">
//             <strong>Start Date:</strong> {startDate}
//           </p>
//           <p className="intro">
//             <strong>End Date:</strong> {endDate}
//           </p>
//           <p className="intro">
//             <strong>Assigned To:</strong> {assignedTo}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bar-chart-container">
//       <h3>Task Status Overview</h3>
//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           layout="vertical"
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis type="number" />
//           <YAxis dataKey="taskName" type="category" width={150} />
//           <Tooltip content={<CustomTooltip />} />
//           <Bar
//             dataKey="status"
//             barSize={20}
//             label={{ position: "insideLeft", fill: "#fff" }}
//           >
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TaskStatusBarChart;
