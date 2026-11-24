
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  ArrowUpRight,
  Menu,
  X,
  ScanEye,
  LayoutDashboard,
  History,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get the actual logged-in user's name
  const fullName = (user?.full_name || user?.name || "").trim();
  const displayName = fullName || "User";

  // Generate initials dynamically from the user's name
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const avatarInitials = getInitials(displayName);
  const firstName = displayName.split(/\s+/)[0];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar">
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <span className="brand-icon">
            <Eye size={22} />
          </span>
          <span className="brand-text">RETINAVISION</span>
          <span className="brand-dot">.</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>

          <Link
            to="/how-it-works"
            className={`nav-link ${isActive("/how-it-works") ? "active" : ""}`}
          >
            How It Works
          </Link>

          <Link
            to="/gradcam-studio"
            className={`nav-link ${isActive("/gradcam-studio") ? "active" : ""}`}
          >
            Grad-CAM Studio
          </Link>

          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>

              <Link
                to="/history"
                className={`nav-link ${isActive("/history") ? "active" : ""}`}
              >
                History
              </Link>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="auth-user-bar">
              <Link to="/screening" className="nav-cta-screening">
                <ScanEye size={17} />
                <span>Screen Retina</span>
              </Link>

              <div className="user-dropdown-anchor">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar-badge">
                    {avatarInitials}
                  </div>

                  <span className="user-name-label">
                    {firstName}
                  </span>

                  <ChevronDown
                    size={14}
                    className={userDropdownOpen ? "rotate" : ""}
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className="user-dropdown-menu"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="dropdown-user-header">
                      <strong>{displayName}</strong>
                      <span>{user?.email}</span>
                      <span className="user-role-tag">
                        Clinician / Researcher
                      </span>
                    </div>

                    <div className="dropdown-divider" />

                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/screening"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <ScanEye size={16} />
                      <span>Start Screening</span>
                    </Link>

                    <Link
                      to="/history"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <History size={16} />
                      <span>Screening History</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile & Settings</span>
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="guest-nav-actions">
              <Link to="/login" className="login-link">
                Sign In
              </Link>

              <Link to="/register" className="nav-cta">
                <span>Create Account</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}

          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link to="/" className="mobile-link" onClick={closeMobileMenu}>
            Home
          </Link>

          <Link
            to="/how-it-works"
            className="mobile-link"
            onClick={closeMobileMenu}
          >
            How It Works
          </Link>

          <Link
            to="/gradcam-studio"
            className="mobile-link"
            onClick={closeMobileMenu}
          >
            Grad-CAM Studio
          </Link>

          <Link
            to="/about"
            className="mobile-link"
            onClick={closeMobileMenu}
          >
            About Project
          </Link>

          <Link
            to="/help"
            className="mobile-link"
            onClick={closeMobileMenu}
          >
            Help & Documentation
          </Link>

          {isAuthenticated ? (
            <>
              <div className="mobile-divider" />

              <Link
                to="/dashboard"
                className="mobile-link"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>

              <Link
                to="/screening"
                className="mobile-link highlight"
                onClick={closeMobileMenu}
              >
                Start New Screening
              </Link>

              <Link
                to="/history"
                className="mobile-link"
                onClick={closeMobileMenu}
              >
                Screening History
              </Link>

              <Link
                to="/profile"
                className="mobile-link"
                onClick={closeMobileMenu}
              >
                Profile & Settings
              </Link>

              <button
                type="button"
                className="mobile-link text-danger"
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-btns">
              <Link
                to="/login"
                className="mobile-btn secondary"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="mobile-btn primary"
                onClick={closeMobileMenu}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
