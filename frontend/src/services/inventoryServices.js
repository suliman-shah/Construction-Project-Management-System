import axios from "axios";
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/inventory`;
export const getAllInventory = () => {
  console.log("get all Inventory are called!!");
  return axios.get(API_BASE_URL);
};
export const getInventoryById = (id) => {
  console.log(`get Inventory by id is called ??`);
  return axios.get(`${API_BASE_URL}/${id}`);
};
export const updateInventory = (id, InventoryData) => {
  return axios.put(`${API_BASE_URL}/${id}`, InventoryData);
};
export const deleteInventory = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};
export const createInventory = (InventoryData) => {
  return axios.post(API_BASE_URL, InventoryData);
};
