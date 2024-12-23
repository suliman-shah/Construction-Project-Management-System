// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function BudgetExpenseComparison({ projectId }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBudgetExpenses = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/project-budget-expenses/${projectId}`
//         );
//         console.log("expenses=", response.data);
//         setData(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBudgetExpenses();
//   }, [projectId]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   // Prepare data for the chart
//   const chartData = {
//     labels: ["Budget", "Expenses"],
//     datasets: [
//       {
//         label: "Amount (PKR)",
//         data: [data.budget, data.expenses],
//         backgroundColor: ["#36A2EB", "#FF6384"],
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Budget vs Expenses</h2>
//       <Bar
//         data={chartData}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: {
//               position: "top",
//             },
//             title: {
//               display: true,
//               text: "Budget vs Expenses Comparison",
//             },
//           },
//         }}
//       />
//     </div>
//   );
// }

// export default BudgetExpenseComparison;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./BudgetExpenseComparison.css"; // Import your custom CSS

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BudgetExpenseComparison({ projectId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgetExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/project-budget-expenses/${projectId}`
        );
        console.log("expenses=", response.data);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetExpenses();
  }, [projectId]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  // Prepare data for the chart
  const chartData = {
    labels: ["Budget", "Expenses"],
    datasets: [
      {
        label: "Amount (PKR)",
        data: [data.budget, data.expenses],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#1E90FF", "#FF5A5A"], // Hover effect for bars
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">Budget vs Expenses</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Budget vs Expenses Comparison",
            },
          },
          animation: {
            duration: 1500, // Animation duration for loading the chart
            easing: "easeInOutQuart",
          },
        }}
      />
    </div>
  );
}

export default BudgetExpenseComparison;
