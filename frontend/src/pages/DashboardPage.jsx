import React from "react";
import ProjectBudgetExpensesChart from "../components/Dashboard/ProjectBudgetExpensesChart";
import TaskStatusBarChart from "../components/Dashboard/TaskStatusBarChart";
import ProjectSummery from "../components/Dashboard/ProjectSummery";

function DashboardPage() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Project Summary Widget */}
        <div className="col-12 mb-4">
          <ProjectSummery />
        </div>

        {/* Project Budget and Expenses Chart Widget */}
        <div className="col-12 mb-4">
          <ProjectBudgetExpensesChart />
        </div>

        {/* Task Status Bar Chart Widget */}
        <div className="col-12 mb-4">
          <TaskStatusBarChart />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
