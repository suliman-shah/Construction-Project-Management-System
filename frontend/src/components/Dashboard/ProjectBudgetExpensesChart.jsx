// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import "chartjs-plugin-datalabels";
// import { Link } from "react-router-dom";
// function ProjectBudgetExpensesChart() {
//   const [chartData, setChartData] = useState(null);
//   const [chartOptions, setChartOptions] = useState({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         title: { display: true, text: "Projects", color: "red" },
//       },
//       y: {
//         title: { display: true, text: "Amount ( PKR )", color: "red" },
//         beginAtZero: true,
//       },
//     },
//     plugins: {
//       legend: { display: true, position: "top" },
//       datalabels: {
//         display: true,
//         color: "black",
//         align: "end",
//         anchor: "end",
//         formatter: (value) => `$${value.toLocaleString()}`,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => {
//             const label = context.dataset.label || "";
//             const value = context.raw || 0;
//             return `${label}: $${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//     animation: { duration: 2000, easing: "easeInOutBounce" },
//   });

//   useEffect(() => {
//
//       .then((response) => response.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           const labels = data.map((project) => project.project_name);
//           const budgets = data.map((project) => project.budget);
//           const expenses = data.map((project) => project.total_expenses);

//           const budgetColors = budgets.map(() => "rgba(75, 192, 192, 1)");
//           const expenseColors = expenses.map((expense, index) =>
//             expense > budgets[index]
//               ? "rgba(255, 99, 132, 1)"
//               : "rgba(54, 162, 235, 1)"
//           );

//           setChartData({
//             labels: labels,
//             datasets: [
//               {
//                 label: "Budget",
//                 data: budgets,
//                 backgroundColor: budgetColors,
//                 borderColor: budgetColors,
//                 borderWidth: 1,
//               },
//               {
//                 label: "Expenses",
//                 data: expenses,
//                 backgroundColor: expenseColors,
//                 borderColor: expenseColors,
//                 borderWidth: 1,
//               },
//             ],
//           });
//         } else {
//           console.error("No data available or data is not in expected format.");
//         }
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   if (!chartData)
//     return (
//       <Link to="/Project/new" className="btn">
//         Add New Project
//       </Link>
//     );

//   return (
//     <div
//       style={{
//         padding: "20px",
//         maxWidth: "1000px",
//         margin: "0 auto",
//         height: "500px",
//         width: "600px",
//         // backgroundColor: "#2c3e50",
//         // backgroundColor: "rgba(0, 0, 0, 0.3",
//         // borderRadius: " 10px",
//         // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
//         borderRadius: "10px",
//         boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
//         color: " #ecf0f1",
//         backgroundColor: "transparent",
//         marginBottom: "50px",
//       }}
//     >
//       <h2 style={{ textAlign: "center", color: "#61dafb" }}>
//         Budget vs Expenses for All Projects
//       </h2>
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// }

// export default ProjectBudgetExpensesChart;
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import { Link } from "react-router-dom";
import "./ProjectBudgetExpensesChart.css"; // Import your custom styles

function ProjectBudgetExpensesChart() {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Projects", color: "white" },
      },
      y: {
        title: { display: true, text: "Amount ( PKR )", color: "white" },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        anchor: "end",
        formatter: (value) => `$${value.toLocaleString()}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    animation: { duration: 2000, easing: "easeInOutBounce" },
  });

  useEffect(() => {
    fetch(`/projects-budget-expenses`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const labels = data.map((project) => project.project_name);
          const budgets = data.map((project) => project.budget);
          const expenses = data.map((project) => project.total_expenses);

          const budgetColors = budgets.map(() => "rgba(75, 192, 192, 1)");
          const expenseColors = expenses.map((expense, index) =>
            expense > budgets[index]
              ? "rgba(255, 99, 132, 1)"
              : "rgba(54, 162, 235, 1)"
          );

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Budget",
                data: budgets,
                backgroundColor: budgetColors,
                borderColor: budgetColors,
                borderWidth: 1,
              },
              {
                label: "Expenses",
                data: expenses,
                backgroundColor: expenseColors,
                borderColor: expenseColors,
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("No data available or data is not in expected format.");
        }
      })
      .catch((error) => console.error("Error fetching project data:", error));
  }, []);

  if (!chartData)
    return (
      <Link to="/Project/new" className="btn">
        Add New Project
      </Link>
    );

  return (
    <div
      className="chart-container"
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        height: "500px",
        width: "100%",
        borderRadius: "10px",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.5)", // Increased box shadow
        // color: "#ecf0f1",
        // backgroundColor: "transparent",
        marginBottom: "50px",
        animation: "fadeIn 1s ease-in-out, pulse 2s infinite alternate", // Added animations
        backgroundColor: "rgb(0,0,0,0.5",
        color: "white",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#61dafb" }}>
        Budget vs Expenses for All Projects
      </h2>
      <div style={{ height: "100%", width: "100%" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ProjectBudgetExpensesChart;

// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import "chartjs-plugin-datalabels";

// function ProjectBudgetExpensesChart() {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });
//   const [chartOptions, setChartOptions] = useState({
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: { title: { display: true, text: "Projects" } },
//       y: { title: { display: true, text: "Amount ($)" }, beginAtZero: true },
//     },
//     plugins: {
//       legend: { display: true, position: "top" },
//       datalabels: {
//         display: true,
//         color: "black",
//         align: "end",
//         anchor: "end",
//         formatter: (value) => `$${value.toLocaleString()}`,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => {
//             const label = context.dataset.label || "";
//             const value = context.raw || 0;
//             return `${label}: $${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//     animation: { duration: 2000, easing: "easeInOutBounce" },
//   });

//   useEffect(() => {
//
//       .then((response) => response.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           const labels = data.map((project) => project.project_name);
//           const budgets = data.map((project) => project.budget);
//           const expenses = data.map((project) => project.total_expenses);

//           const gradient = (ctx, color) => {
//             const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//             gradient.addColorStop(0, color);
//             gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
//             return gradient;
//           };

//           const expenseColors = expenses.map((expense, index) =>
//             expense > budgets[index]
//               ? "rgba(255, 99, 132, 1)"
//               : "rgba(54, 162, 235, 1)"
//           );

//           setChartData({
//             labels: labels,
//             datasets: [
//               {
//                 label: "Budget",
//                 data: budgets,
//                 backgroundColor: (context) => {
//                   const ctx = context.chart.ctx;
//                   return gradient(ctx, "rgba(75, 192, 192, 1)");
//                 },
//               },
//               {
//                 label: "Expenses",
//                 data: expenses,
//                 backgroundColor: (context) => {
//                   const ctx = context.chart.ctx;
//                   const index = context.dataIndex;
//                   return gradient(ctx, expenseColors[index]);
//                 },
//               },
//             ],
//           });
//         } else {
//           console.error("No data available or data is not in expected format.");
//         }
//       })
//       .catch((error) => console.error("Error fetching project data:", error));
//   }, []);

//   return (
//     <div
//       style={{
//         padding: "20px",
//         maxWidth: "1000px",
//         margin: "0 auto",
//         height: "500px",
//       }}
//     >
//       <h2 style={{ textAlign: "center" }}>
//         Budget vs Expenses for All Projects
//       </h2>
//       <Bar data={chartData} options={chartOptions} />
//     </div>
//   );
// }

// export default ProjectBudgetExpensesChart;
