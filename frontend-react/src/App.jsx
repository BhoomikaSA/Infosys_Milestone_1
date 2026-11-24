import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ScreeningProvider } from "./context/ScreeningContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WorkspaceLayout from "./components/WorkspaceLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ScreeningUploadPage from "./pages/ScreeningUploadPage";
import PredictionResultPage from "./pages/PredictionResultPage";
import GradCamStudioPage from "./pages/GradCamStudioPage";
import ScreeningHistoryPage from "./pages/ScreeningHistoryPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import HelpSupportPage from "./pages/HelpSupportPage";
import PrivacyPage from "./pages/PrivacyPage";
import DisclaimerPage from "./pages/DisclaimerPage";

// Lucide icons
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

import "./App.css";

// Automatically scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Global Toast Banner
function GlobalToast() {
  const { toast, dismissToast } = useAuth();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-danger" />,
    info: <Info size={18} className="text-blue" />
  };

  return (
    <div className={`global-toast-banner ${toast.type || "info"}`}>
      {icons[toast.type] || icons.info}
      <span className="toast-msg">{toast.message}</span>
      <button type="button" className="toast-dismiss" onClick={dismissToast}>
        <X size={15} />
      </button>
    </div>
  );
}

// Layout wrapper for workspace pages (renders WorkspaceLayout with Sidebar)
function WorkspaceRoute({ children }) {
  return (
    <WorkspaceLayout>
      {children}
    </WorkspaceLayout>
  );
}

function MainApp() {
  const location = useLocation();

  // Certain workspace pages have their own integrated workspace layout
  const isWorkspacePath = [
    "/dashboard",
    "/screening",
    "/results",
    "/gradcam-studio",
    "/history",
    "/profile"
  ].some((prefix) => location.pathname.startsWith(prefix));

  return (
    <div className="app-root-container">
      <ScrollToTop />
      <GlobalToast />

      {/* Navbar is rendered on all pages */}
      <Navbar />

      <div className="main-content-flow">
        <Routes>
          {/* Public / Marketing / Explanatory Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Authenticated Clinician Workspace Pages */}
          <Route
            path="/dashboard"
            element={
              <WorkspaceRoute>
                <DashboardPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/screening"
            element={
              <WorkspaceRoute>
                <ScreeningUploadPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <WorkspaceRoute>
                <PredictionResultPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/results"
            element={
              <WorkspaceRoute>
                <PredictionResultPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/gradcam-studio"
            element={
              <WorkspaceRoute>
                <GradCamStudioPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/history"
            element={
              <WorkspaceRoute>
                <ScreeningHistoryPage />
              </WorkspaceRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <WorkspaceRoute>
                <ProfileSettingsPage />
              </WorkspaceRoute>
            }
          />

          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Render bottom footer on public pages */}
      {!isWorkspacePath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScreeningProvider>
          <MainApp />
        </ScreeningProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
