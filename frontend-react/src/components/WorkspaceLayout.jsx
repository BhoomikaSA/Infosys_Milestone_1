import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  ChevronRight,
  ScanEye,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function WorkspaceLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Determine page title for breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/screening")) return "Retinal Image Screening";
    if (path.startsWith("/results")) return "Prediction Results & Saliency";
    if (path.startsWith("/gradcam-studio")) return "Grad-CAM Explainability Studio";
    if (path.startsWith("/history")) return "Screening Audit History";
    if (path.startsWith("/profile")) return "Profile & Workstation Settings";
    return "Workspace";
  };

  return (
    <div className="workspace-container">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop sticky, mobile sliding drawer) */}
      <div className={`workspace-sidebar-wrap ${mobileSidebarOpen ? "open" : ""}`}>
        <div className="mobile-close-bar">
          <button
            type="button"
            className="close-sidebar-btn"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={18} />
            <span>Close Navigation</span>
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main Workspace Area */}
      <main className="workspace-main-area">
        {/* Workspace Top Toolbar */}
        <div className="workspace-toolbar">
          <div className="toolbar-left">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              title="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="breadcrumb-trail">
              <Link to="/dashboard" className="bc-root">Workspace</Link>
              <ChevronRight size={14} className="bc-separator" />
              <span className="bc-current">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="toolbar-status-badge">
              <span className="live-status-dot" />
              <span>DenseNet121 v1.0.0</span>
            </div>
            <Link to="/screening" className="quick-screen-btn">
              <ScanEye size={15} />
              <span>Screen Retina</span>
            </Link>
          </div>
        </div>

        {/* Content Body */}
        <div className="workspace-body-content">
          {children}
        </div>
      </main>
    </div>
  );
}
