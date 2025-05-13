// import axios from "axios";
// const API_BASE_URL = `${
//   import.meta.env.VITE_BACKEND_BASE_URL
// }/http://localhost:8080`;
// // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// export const login = async (email, password) => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//     credentials: "include", // Important for cookies
//   });

//   if (!response.ok) {
//     throw new Error("Login failed");
//   }

//   return response.json();
// };

// export const signup = async (userData) => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(userData),
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Signup failed");
//   }

//   return response.json();
// };

// export const logout = async () => {
//   await fetch(`${API_BASE_URL}/api/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
// };

// export const checkAuthStatus = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
//     credentials: "include",
//   });
//   return response.json();
// };
