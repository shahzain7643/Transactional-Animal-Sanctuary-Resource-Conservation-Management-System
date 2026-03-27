import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import ApproveAdoption from "./pages/ApproveAdoption";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard (all roles) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ONLY ADMIN */}
        <Route
          path="/animals"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Animals />
            </ProtectedRoute>
          }
        />

        {/* ADMIN + VET */}
        <Route
          path="/approve"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Veterinarian"]}>
              <ApproveAdoption />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;