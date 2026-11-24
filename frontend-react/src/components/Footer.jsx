import React from "react";
import { Link } from "react-router-dom";
import { Eye, ShieldAlert, Heart, ExternalLink, Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-top-grid">
        <div className="footer-col brand-col">
          <Link to="/" className="brand">
            <span className="brand-icon"><Eye size={20} /></span>
            <span className="brand-text">RETINAVISION</span>
            <span className="brand-dot">.</span>
          </Link>
          <p className="brand-tagline">
            Explainable Artificial Intelligence for Diabetic Retinopathy Screening.
            Bridging deep learning feature maps with ophthalmic clinical trust.
          </p>
          <div className="system-chip">
            <Activity size={14} className="pulse-icon" />
            <span>DenseNet121 • APTOS 2019 Benchmark</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Screening & Tools</h4>
          <ul className="footer-links">
            <li><Link to="/screening">Retinal Image Upload</Link></li>
            <li><Link to="/gradcam-studio">Grad-CAM Explainability Studio</Link></li>
            <li><Link to="/dashboard">Clinician Dashboard</Link></li>
            <li><Link to="/history">Screening Audit Trail</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Research & Platform</h4>
          <ul className="footer-links">
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/about">About DenseNet121 Architecture</Link></li>
            <li><Link to="/help">Clinical FAQs & Capture Guide</Link></li>
            <li><Link to="/disclaimer">Medical Disclaimer</Link></li>
            <li><Link to="/privacy">Data Privacy & HIPAA Guidelines</Link></li>
          </ul>
        </div>

        <div className="footer-col disclaimer-col">
          <div className="footer-disclaimer-card">
            <div className="disclaimer-header">
              <ShieldAlert size={16} className="disclaimer-icon" />
              <span>Medical Research Notice</span>
            </div>
            <p>
              RetinaVision is an investigational academic research prototype. Outputs are intended solely for clinical decision support and educational research. Always confirm findings with a licensed ophthalmologist.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          © {new Date().getFullYear()} RetinaVision Research Project. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="separator">•</span>
          <Link to="/disclaimer">Clinical Disclaimer</Link>
          <span className="separator">•</span>
          <Link to="/help">Help & Support</Link>
        </div>
      </div>
    </footer>
  );
}
