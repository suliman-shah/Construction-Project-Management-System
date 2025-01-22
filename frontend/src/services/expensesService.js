import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/expenses`;
export const getAllExpenses = () => {
  console.log(`get  All Expenses  : triggered??`);
  return axios.get(API_BASE_URL);
};
export const getExpensesById = (id) => {
  console.log(`get Expenses by id ${id} : triggered??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateExpenses = (id, expensesData) => {
  console.log(`update Expenses by id ${id} : triggered??`);
  return axios.put(`${API_BASE_URL}/${id}`, expensesData);
};
export const deleteExpenses = (id) => {
  console.log("delete expenses triggered??");
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createExpenses = (expensesdata) => {
  console.log(`create Expenses : triggered??`);
  return axios.post(API_BASE_URL, expensesdata);
};
