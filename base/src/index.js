import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Убедись, что путь к App правильный
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
<AuthProvider>
    <App />
    <Toaster />
</AuthProvider>
  </React.StrictMode>
);
