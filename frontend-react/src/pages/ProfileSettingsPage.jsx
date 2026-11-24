import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Building,
  ShieldCheck,
  Lock,
  Bell,
  Sliders,
  LogOut,
  CheckCircle2,
  Save,
  AlertCircle,
  Eye,
  KeyRound
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, updateProfile, changePassword, logout, showToast } = useAuth();
  const navigate = useNavigate();

  // Active tab state: "profile" | "security" | "preferences"
  const [activeTab, setActiveTab] = useState("profile");

  // Edit profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [institution, setInstitution] = useState(user?.institution || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [license, setLicense] = useState(user?.license || "");

  // Change password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmNewPwd, setConfirmNewPwd] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Clinical preferences state
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [defaultEye, setDefaultEye] = useState("OD");
  const [autoGradCam, setAutoGradCam] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [exportAnonymized, setExportAnonymized] = useState(true);

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Full name cannot be blank.", "error");
      return;
    }
    updateProfile({
      name,
      email,
      institution,
      department,
      license
    });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPwdError("");

    if (!currentPwd) {
      setPwdError("Please enter your current password.");
      return;
    }

    if (!newPwd || newPwd.length < 8) {
      setPwdError("New password must be at least 8 characters long.");
      return;
    }

    if (newPwd !== confirmNewPwd) {
      setPwdError("New passwords do not match.");
      return;
    }

    changePassword(currentPwd, newPwd);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmNewPwd("");
  };

  const handleSavePreferences = () => {
    showToast("Screening workstation preferences saved.", "success");
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-page-wrap">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <span className="page-kicker">CLINICIAN SETTINGS</span>
          <h1>User Profile & Workstation Preferences</h1>
          <p>
            Manage your ophthalmologist credentials, screening safety thresholds, and account security.
          </p>
        </div>

        <button
          type="button"
          className="action-btn secondary text-danger"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="profile-layout-grid">
        {/* Left Sidebar: Profile Card & Tab Navigation */}
        <div className="profile-sidebar-col">
          <div className="profile-badge-card">
            <div className="profile-avatar-giant">
              <span>{user?.avatar || "MD"}</span>
            </div>
            <h3>{user?.name}</h3>
            <span className="profile-title-chip">{user?.title || "Ophthalmologist"}</span>
            <p className="profile-inst-text">{user?.institution}</p>

            <div className="profile-meta-list">
              <div className="p-meta-item">
                <Mail size={14} />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="p-meta-item">
                <ShieldCheck size={14} />
                <span>{user?.license || "MD-LIC-VERIFIED"}</span>
              </div>
            </div>
          </div>

          <div className="profile-nav-menu">
            <button
              type="button"
              className={`p-nav-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={17} />
              <span>Clinician Details</span>
            </button>
            <button
              type="button"
              className={`p-nav-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <KeyRound size={17} />
              <span>Password & Security</span>
            </button>
            <button
              type="button"
              className={`p-nav-btn ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <Sliders size={17} />
              <span>Workstation Settings</span>
            </button>
          </div>
        </div>

        {/* Right Area: Active Tab Body */}
        <div className="profile-main-col">
          {activeTab === "profile" && (
            <div className="settings-panel-card">
              <div className="panel-header">
                <h3>Personal & Professional Credentials</h3>
                <p>Information displayed on generated clinical PDF reports and audit trails</p>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Legal Name (with Credentials)</label>
                    <div className="input-wrapper">
                      <User size={17} className="field-icon" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <Mail size={17} className="field-icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Healthcare Institution</label>
                    <div className="input-wrapper">
                      <Building size={17} className="field-icon" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Department / Clinic</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Medical Practitioner License / ID</label>
                  <div className="input-wrapper">
                    <ShieldCheck size={17} className="field-icon" />
                    <input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                    />
                  </div>
                </div>

                <div className="panel-footer-actions">
                  <button type="submit" className="action-btn primary">
                    <Save size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-panel-card">
              <div className="panel-header">
                <h3>Security & Password Management</h3>
                <p>Ensure your clinical account has a resilient, multi-factor credential</p>
              </div>

              <form onSubmit={handleSavePassword} className="settings-form">
                {pwdError && (
                  <div className="form-error-banner">
                    <AlertCircle size={16} />
                    <span>{pwdError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-wrapper">
                    <Lock size={17} className="field-icon" />
                    <input
                      type="password"
                      placeholder="Enter existing password"
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                      <Lock size={17} className="field-icon" />
                      <input
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-wrapper">
                      <Lock size={17} className="field-icon" />
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmNewPwd}
                        onChange={(e) => setConfirmNewPwd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="panel-footer-actions">
                  <button type="submit" className="action-btn primary">
                    <KeyRound size={16} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="settings-panel-card">
              <div className="panel-header">
                <h3>Screening Workstation Configuration</h3>
                <p>Adjust DenseNet121 inference thresholds and automated report settings</p>
              </div>

              <div className="preferences-body">
                <div className="pref-row">
                  <div className="pref-info">
                    <strong>Model Confidence Alert Threshold</strong>
                    <p>Highlight cases when DenseNet121 classification probability exceeds this level</p>
                  </div>
                  <div className="pref-control">
                    <span className="slider-val-tag">{confidenceThreshold}%</span>
                    <input
                      type="range"
                      min="70"
                      max="98"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(e.target.value)}
                      className="custom-range"
                    />
                  </div>
                </div>

                <div className="pref-row">
                  <div className="pref-info">
                    <strong>Automatic Grad-CAM Overlay Generation</strong>
                    <p>Precompute layer conv5_block16_2_conv heatmap immediately during inference</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={autoGradCam}
                      onChange={(e) => setAutoGradCam(e.target.checked)}
                    />
                    <span className="slider-toggle round" />
                  </label>
                </div>

                <div className="pref-row">
                  <div className="pref-info">
                    <strong>High-Severity DR Notification Banner</strong>
                    <p>Display urgent referral visual banners for Severe (Stage 3) and Proliferative (Stage 4) DR</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                    />
                    <span className="slider-toggle round" />
                  </label>
                </div>

                <div className="pref-row">
                  <div className="pref-info">
                    <strong>Anonymize Exported Research Reports</strong>
                    <p>Strip patient full legal names and exact DOB in public CSV/PDF research summaries</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={exportAnonymized}
                      onChange={(e) => setExportAnonymized(e.target.checked)}
                    />
                    <span className="slider-toggle round" />
                  </label>
                </div>
              </div>

              <div className="panel-footer-actions">
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={handleSavePreferences}
                >
                  <Save size={16} />
                  <span>Save Workstation Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-dialog small-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Sign Out</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to end this clinical workstation session? Your local audit history will remain saved on this browser.
              </p>
              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="action-btn secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="action-btn primary text-danger"
                  onClick={handleConfirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
