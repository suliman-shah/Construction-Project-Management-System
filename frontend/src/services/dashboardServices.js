import axios from "../api/axios";
export const getAllProject_Budget_vs_Expenses = () => {
  console.log(" get ALL project bugdet vs expenses  are called !!");
  return axios.get("/projects-budget-expenses");
};
export const getAllProject_Tasks_status = () => {
  console.log(" get ALL project tasks status   are called !!");
  return axios.get("/projects-task-status");
};
