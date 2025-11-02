// src/App.jsx
import { Routes, Route } from "react-router-dom";
import TopNavbar from "./components/Navbar";
import Home from "./pages/home";
import JobsList from "./pages/Jobs/JobsList"; // new page for listing jobs
import JobDetail from "./pages/Jobs/JobDetail";
import CreateJob from "./pages/Jobs/CreateJob"; // optional page for org_admin/hr/manager
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import OrgDashboard from "./pages/Org/OrgDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <TopNavbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Jobs */}
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/create" element={
            <PrivateRoute allowedRoles={['org_admin','hr','manager']}>
              <CreateJob />
            </PrivateRoute>
          } />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile */}
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />

          {/* Dashboards */}
          <Route path="/org" element={
            <PrivateRoute allowedRoles={['org_admin','hr','manager','recruiter']}><OrgDashboard /></PrivateRoute>
          } />

          <Route path="/seeker" element={
            <PrivateRoute allowedRoles={['job_seeker']}><SeekerDashboard /></PrivateRoute>
          } />
        </Routes>
      </div>
    </>
  );
}
