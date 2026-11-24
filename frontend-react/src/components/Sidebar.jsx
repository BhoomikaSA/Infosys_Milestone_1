import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ScanEye,
  History,
  Sparkles,
  User,
  Settings,
  HelpCircle,
  FileCheck2,
  ShieldAlert,
  LogOut,
  Eye
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "New Screening", path: "/screening", icon: ScanEye, highlight: true },
    { name: "Screening History", path: "/history", icon: History },
    { name: "Grad-CAM Studio", path: "/gradcam-studio", icon: Sparkles },
    { name: "Profile & Settings", path: "/profile", icon: User }
  ];

  const secondaryItems = [
    { name: "How It Works", path: "/how-it-works", icon: FileCheck2 },
    { name: "About RetinaVision", path: "/about", icon: Eye },
    { name: "Help & Support", path: "/help", icon: HelpCircle },
    { name: "Medical Disclaimer", path: "/disclaimer", icon: ShieldAlert }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand-area">
        <Link to="/" className="sidebar-brand">
          <span className="brand-icon"><Eye size={20} /></span>
          <span className="sidebar-brand-name">RETINAVISION</span>
          <span className="sidebar-brand-badge">AI</span>
        </Link>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-kicker">CLINICAL WORKFLOW</span>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${active ? "active" : ""} ${item.highlight ? "cta-highlight" : ""}`}
              >
                <Icon size={18} className="item-icon" />
                <span className="item-label">{item.name}</span>
                {item.highlight && <span className="item-pulse-dot" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-kicker">DOCUMENTATION & PROTOCOL</span>
        <nav className="sidebar-nav">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${active ? "active" : ""}`}
              >
                <Icon size={17} className="item-icon" />
                <span className="item-label">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Model Status Card */}
      <div className="sidebar-model-badge">
        <div className="model-status-indicator">
          <span className="live-status-dot" />
          <span className="model-title">DenseNet121 • Ready</span>
        </div>
        <p className="model-sub">APTOS 2019 Weights • 384×384</p>
      </div>

      {/* User profile footer */}
      <div className="sidebar-user-footer">
        <div className="user-mini-chip">
          <div className="user-avatar-circle">{user?.avatar || "MD"}</div>
          <div className="user-text-meta">
            <span className="user-meta-name">{user?.name}</span>
            <span className="user-meta-role">Clinician</span>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={logout}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
