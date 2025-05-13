import { StrictMode } from "react";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/Auth/AuthContext";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
  // </StrictMode>
);
