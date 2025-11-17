import { Routes, Route } from "react-router-dom";
import TopNavbar from "./components/Navbar";
import Home from "./pages/home";
import JobsList from "./pages/Jobs/JobsList";
import JobDetail from "./pages/Jobs/JobDetail";
import CreateJob from "./pages/Jobs/CreateJob";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import OrgDashboard from "./pages/Org/OrgDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import SearchResults from "./pages/SearchResults";
import JobServices from "./pages/JobServices";
import VerifyOtp from "./pages/Auth/VerifyOtp";



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
          <Route path="/search" element={<SearchResults />} />
          <Route path="/job-services" element={<JobServices />} />
          <Route
            path="/jobs/create"
            element={
              <PrivateRoute allowedRoles={['org_admin', 'hr', 'manager']}>
                <CreateJob />
              </PrivateRoute>
            }
          />

          <Route path="/verify-otp" element={<VerifyOtp />} />


          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Dashboards */}
          <Route
            path="/org"
            element={
              <PrivateRoute allowedRoles={['org_admin', 'hr', 'manager', 'recruiter']}>
                <OrgDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/seeker"
            element={
              <PrivateRoute allowedRoles={['job_seeker']}>
                <SeekerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
