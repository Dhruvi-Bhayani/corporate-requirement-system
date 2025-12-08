import { Routes, Route, useLocation } from "react-router-dom";
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
import FeedbackView from "./pages/FeedbackView";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UsersPage from "./admin/pages/UsersPage";
import JobsPage from "./admin/pages/JobsPage";
import OrganizationsPage from "./admin/pages/OrganizationsPage";
import ReportsPage from "./admin/pages/ReportsPage";
import ApplicationsPage from "./admin/pages/ApplicationsPage";
import AdminFeedback from "./admin/pages/AdminFeedback";

import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import { AdminAuthProvider } from "./admin/AdminAuthContext";

import EditProfile from "./pages/Profile/EditProfile";
import ProfileView from "./pages/Profile/ProfileView";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();

  // 🛑 Hide Navbar + Footer for Admin Panel
  const hideMainLayout = location.pathname.startsWith("/admin");

  return (
    <div className="app-wrapper">
      {!hideMainLayout && <TopNavbar />}

      <AdminAuthProvider>
        <div className="app-content">
          <Routes>
            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/feedback-view" element={<FeedbackView />} />

            {/* ---------- AUTH ROUTES ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ---------- USER PROTECTED ROUTES ---------- */}
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
                  <ProfileView />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <PrivateRoute>
                  <EditProfile />
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

            <Route
              path="/org/job/:jobId/applications"
              element={<JobApplications />}
            />

            <Route path="/jobs/edit/:id" element={<EditJob />} />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <AdminProtectedRoute>
                  <UsersPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <AdminProtectedRoute>
                  <JobsPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/organizations"
              element={
                <AdminProtectedRoute>
                  <OrganizationsPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <AdminProtectedRoute>
                  <ReportsPage />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/applications"
              element={
                <AdminProtectedRoute>
                  <ApplicationsPage />
                </AdminProtectedRoute>
              }
            />

            <Route path="/admin/feedback" element={<AdminFeedback />} />

          </Routes>
        </div>
      </AdminAuthProvider>

      {!hideMainLayout && <Footer />}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
