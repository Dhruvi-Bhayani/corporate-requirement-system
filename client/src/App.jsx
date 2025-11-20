import { Routes, Route } from "react-router-dom";
import TopNavbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/home";
import JobsList from "./pages/Jobs/JobList";
import JobDetail from "./pages/Jobs/JobDetail";
import CreateJob from "./pages/Jobs/CreateJob";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import OrgDashboard from "./pages/Organization/OrgDashboard";
import SeekerDashboard from "./pages/Seeker/SeekerDashboard";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import JobServices from "./pages/JobServices";
import About from "./pages/About";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyResetOtp from "./pages/Auth/VerifyResetOtp";
import ResetPassword from "./pages/Auth/ResetPassword";
import ContactUs from "./pages/Contact/ContactUs";
import Feedback from "./pages/Feedback/Feedback";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Disclaimer from "./pages/Disclaimer";
import JobApplications from "./pages/Organization/JobApplications";
import EditJob from "./pages/Jobs/EditJob";

// ⭐ ADD THESE LINES
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <TopNavbar />

      <div className="app-content">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<About />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/job-services"
            element={
              <PrivateRoute>
                <JobServices />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs/create"
            element={
              <PrivateRoute allowedRoles={["org_admin", "hr", "manager"]}>
                <CreateJob />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/org"
            element={
              <PrivateRoute allowedRoles={["org_admin", "hr", "manager", "recruiter"]}>
                <OrgDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/contact" element={<ContactUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          <Route path="/org/job/:jobId/applications" element={<JobApplications />} />
          <Route path="/jobs/edit/:id" element={<EditJob />} />
          <Route path="/org/dashboard" element={<OrgDashboard />} />

          <Route
            path="/seeker"
            element={
              <PrivateRoute allowedRoles={["job_seeker"]}>
                <SeekerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      <Footer />

      {/* ⭐ Toast Component (Globally Available) */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
