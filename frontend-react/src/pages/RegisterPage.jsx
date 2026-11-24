
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function RegisterPage() {
  const { register, login, showToast } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate password strength
  const calculateStrength = (pwd) => {
    let score = 0;

    if (!pwd) return 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    return score;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: "None", color: "var(--muted)" };
    if (score <= 25) return { label: "Weak", color: "#ef4444" };
    if (score <= 50) return { label: "Fair", color: "#f59e0b" };
    if (score <= 75) return { label: "Good", color: "#38bdf8" };

    return { label: "Strong", color: "#10b981" };
  };

  const strengthMeta = getStrengthLabel(strength);

  // Form validation
  const validate = () => {
    const errs = {};

    if (!fullName.trim()) {
      errs.fullName = "Please enter your full name.";
    } else if (fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errs.email = "Clinical email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email format.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      errs.agreeTerms = "You must accept the data privacy policy.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Register using the real backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });

      // Automatically log in after successful registration
      await login(email.trim(), password);

      showToast("Account created successfully!", "success");
      navigate("/dashboard");

    } catch (error) {
      showToast(error.message || "Registration failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrap register-wide">

        <div className="auth-header-card">
          <Link to="/" className="brand">
            <span className="brand-icon"><Eye size={22} /></span>
            <span className="brand-text">RETINAVISION</span>
            <span className="brand-dot">.</span>
          </Link>

          <h2>Create Clinician Account</h2>
          <p>
            Deploy AI-assisted diabetic retinopathy screening in your practice
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="form-grid-2">

            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>

              <div className={`input-wrapper ${errors.fullName ? "error" : ""}`}>
                <User size={18} className="field-icon" />

                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Dr. Alex Vance"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: null });
                    }
                  }}
                />
              </div>

              {errors.fullName && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Institutional Email</label>

              <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
                <Mail size={18} className="field-icon" />

                <input
                  id="reg-email"
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

          </div>

          <div className="form-group">
            <label htmlFor="reg-inst">
              Hospital / Healthcare Facility (Optional)
            </label>

            <div className="input-wrapper">
              <Building size={18} className="field-icon" />

              <input
                id="reg-inst"
                type="text"
                placeholder="e.g. National Eye Hospital"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>

              <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
                <Lock size={18} className="field-icon" />

                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
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

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>

              <div className={`input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
                <Lock size={18} className="field-icon" />

                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: null });
                    }
                  }}
                />

                <button
                  type="button"
                  className="toggle-pwd-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  title={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.confirmPassword}
                </span>
              )}
            </div>

          </div>

          {/* Password strength meter */}
          {password && (
            <div className="password-strength-widget">

              <div className="strength-header">
                <span>Security Strength:</span>
                <strong style={{ color: strengthMeta.color }}>
                  {strengthMeta.label}
                </strong>
              </div>

              <div className="strength-meter-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${strength}%`,
                    backgroundColor: strengthMeta.color
                  }}
                />
              </div>

              <div className="pwd-guidelines">
                <span className={password.length >= 8 ? "met" : ""}>✓ 8+ chars</span>
                <span className={/[A-Z]/.test(password) ? "met" : ""}>✓ Uppercase</span>
                <span className={/[0-9]/.test(password) ? "met" : ""}>✓ Number</span>
                <span className={/[^A-Za-z0-9]/.test(password) ? "met" : ""}>✓ Symbol</span>
              </div>

            </div>
          )}

          <div className="form-group terms-group">

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.agreeTerms) {
                    setErrors({ ...errors, agreeTerms: null });
                  }
                }}
              />

              <span>
                I agree to the <Link to="/privacy">Data Privacy Terms</Link> and
                understand that RetinaVision is an{" "}
                <Link to="/disclaimer">investigational research tool</Link>.
              </span>
            </label>

            {errors.agreeTerms && (
              <span className="field-error-msg">
                <AlertCircle size={13} /> {errors.agreeTerms}
              </span>
            )}

          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">
                Creating clinician profile...
              </span>
            ) : (
              <>
                <span>Complete Clinician Registration</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>

        </form>

        <div className="auth-card-footer">
          <span>Already registered in the system?</span>

          <Link to="/login" className="register-redirect-link">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
