import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NoPage from "./pages/NoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext.jsx";
import "./index.css";
import MovieDetails from "./pages/MovieDetails.jsx";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Home />} />
        <Route path="/register" element={!user ? <Register /> : <Home />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <MovieDetails />
          }
        />



        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
};

export default App;