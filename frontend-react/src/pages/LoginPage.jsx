
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form validation
  const validate = () => {
    const errs = {};

    if (!email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Actual backend login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(email.trim(), password, rememberMe);
      navigate("/dashboard");
    } catch (error) {
      showToast(error.message || "Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password UI (backend functionality not implemented yet)
  const handleForgotSubmit = (e) => {
    e.preventDefault();

    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      showToast("Please provide a valid email address.", "error");
      return;
    }

    showToast(
      "Password reset functionality is not available yet.",
      "info"
    );
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap">

        <div className="auth-header-card">
          <Link to="/" className="brand">
            <span className="brand-icon"><Eye size={22} /></span>
            <span className="brand-text">RETINAVISION</span>
            <span className="brand-dot">.</span>
          </Link>

          <h2>Clinician Sign In</h2>
          <p>
            Access the Explainable AI screening workspace & audit records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="form-group">
            <label htmlFor="login-email">Medical Email Address</label>

            <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
              <Mail size={18} className="field-icon" />

              <input
                id="login-email"
                type="email"
                placeholder="clinician@hospital.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: null });
                  }
                }}
              />
            </div>

            {errors.email && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="label-with-action">
              <label htmlFor="login-password">Password</label>

              <button
                type="button"
                className="forgot-link"
                onClick={() => setIsForgotOpen(true)}
              >
                Forgot password?
              </button>
            </div>

            <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
              <Lock size={18} className="field-icon" />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your security password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
              />

              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {errors.password && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.password}
              </span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Keep me signed in on this workstation</span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">
                Verifying credentials...
              </span>
            ) : (
              <>
                <span>Sign In to Screening Portal</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </form>

        <div className="auth-card-footer">
          <span>Don't have an institutional account?</span>

          <Link to="/register" className="register-redirect-link">
            Register New Clinician
          </Link>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsForgotOpen(false)}
        >
          <div
            className="modal-dialog forgot-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Reset Your Password</h3>

              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsForgotOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {forgotSuccess ? (
                <div className="success-banner">
                  <CheckCircle2 size={24} className="text-success" />
                  <h4>Reset Link Dispatched</h4>
                  <p>
                    Check your inbox at <strong>{forgotEmail}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p className="forgot-instruction">
                    Enter your registered clinical email address.
                    Password reset is not connected to the backend yet.
                  </p>

                  <div className="form-group">
                    <label>Account Email</label>

                    <div className="input-wrapper">
                      <Mail size={18} className="field-icon" />

                      <input
                        type="email"
                        placeholder="doctor@hospital.org"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      className="action-btn secondary"
                      onClick={() => setIsForgotOpen(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="action-btn primary"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
