import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Experiences from "./pages/Experiences";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <PrivateRoute>
                <ApplicationDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/experiences"
            element={
              <PrivateRoute>
                <Experiences />
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <Stats />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/applications" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
