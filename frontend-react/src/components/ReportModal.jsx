import React from "react";
import { X, Printer, Download, Eye, FileText, CheckCircle2, ShieldAlert } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import { DR_CLASSES } from "../data/clinicalData";

export default function ReportModal({ screening, isOpen, onClose }) {
  if (!isOpen || !screening) return null;

  const drMeta = DR_CLASSES[screening.classId] || DR_CLASSES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog report-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <FileText size={20} className="modal-header-icon" />
            <div>
              <h3>Clinical Screening Report</h3>
              <span className="modal-subtitle">Report ID: {screening.id}</span>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="action-btn secondary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print / Save PDF</span>
            </button>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="modal-body printable-report" id="clinical-report-content">
          {/* Institution Header */}
          <div className="report-institution-header">
            <div className="report-brand">
              <span className="brand-logo-icon"><Eye size={24} /></span>
              <div>
                <h2>RETINAVISION CLINICAL AI</h2>
                <p>Ophthalmic Image Analysis & Explainable AI Screening</p>
              </div>
            </div>
            <div className="report-meta">
              <div><strong>Date:</strong> {screening.date}</div>
              <div><strong>Time:</strong> {screening.time}</div>
              <div><strong>System:</strong> DenseNet121 APTOS-50</div>
            </div>
          </div>

          <div className="report-divider" />

          {/* Patient Information Section */}
          <div className="report-section">
            <h4 className="section-title">1. Patient & Examination Details</h4>
            <div className="report-grid-3">
              <div className="info-cell">
                <span className="cell-label">Patient Name:</span>
                <span className="cell-value">{screening.patientName}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">Patient ID:</span>
                <span className="cell-value">{screening.patientId}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">Patient Age:</span>
                <span className="cell-value">{screening.patientAge} Years</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">Examined Eye:</span>
                <span className="cell-value">{screening.eye}</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">Image Format:</span>
                <span className="cell-value">Digital Fundus Photography (RGB 384×384)</span>
              </div>
              <div className="info-cell">
                <span className="cell-label">Assigned Clinician:</span>
                <span className="cell-value">Dr. Sarah Jenkins, MD</span>
              </div>
            </div>
          </div>

          {/* AI Model Output Section */}
          <div className="report-section">
            <h4 className="section-title">2. DenseNet121 Model Classification</h4>
            <div className="diagnosis-highlight-card" style={{ borderColor: drMeta.borderColor }}>
              <div className="diag-main">
                <span className="diag-label">Predicted Retinopathy Severity:</span>
                <div className="diag-title">
                  <span className="diag-name">{screening.className}</span>
                  <SeverityBadge classId={screening.classId} size="lg" />
                </div>
                <p className="diag-desc">{drMeta.description}</p>
              </div>
              <div className="diag-stat">
                <span className="stat-label">Model Confidence</span>
                <span className="stat-number" style={{ color: drMeta.color }}>
                  {screening.confidence}%
                </span>
                <span className="stat-layer">Layer: {screening.gradcamLayer}</span>
              </div>
            </div>
          </div>

          {/* Five Class Probabilities Table */}
          <div className="report-section">
            <h4 className="section-title">3. Multi-Class Probability Distribution</h4>
            <table className="report-table">
              <thead>
                <tr>
                  <th>DR Stage</th>
                  <th>Clinical Classification</th>
                  <th>ICDR Description</th>
                  <th>Model Probability</th>
                </tr>
              </thead>
              <tbody>
                {screening.probabilities?.map((p) => {
                  const meta = DR_CLASSES[p.classId] || DR_CLASSES[0];
                  const isCurrent = p.classId === screening.classId;
                  return (
                    <tr key={p.classId} className={isCurrent ? "active-row" : ""}>
                      <td><strong>{meta.shortName}</strong></td>
                      <td>
                        <span className="table-stage-dot" style={{ backgroundColor: meta.color }} />
                        {p.className}
                      </td>
                      <td>{meta.severity}</td>
                      <td>
                        <strong style={{ color: isCurrent ? meta.color : "inherit" }}>
                          {p.probability.toFixed(1)}%
                        </strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Photographic & Grad-CAM Evidence */}
          <div className="report-section">
            <h4 className="section-title">4. Retinal Imaging & Grad-CAM Saliency Maps</h4>
            <div className="report-images-pair">
              <div className="report-img-box">
                <img src={screening.image} alt="Original Retinal Fundus" />
                <span className="img-caption">Figure 1: Original Digital Fundus Photography</span>
              </div>
              <div className="report-img-box">
                <img src={screening.gradcamImage} alt="Grad-CAM Saliency Overlay" />
                <span className="img-caption">Figure 2: DenseNet121 Grad-CAM Feature Map ({screening.gradcamLayer})</span>
              </div>
            </div>
          </div>

          {/* Clinical Findings & Recommendations */}
          <div className="report-section">
            <h4 className="section-title">5. AI Interpretations & Clinical Guidance</h4>
            <div className="findings-box">
              <p><strong>Clinical Findings:</strong> {screening.findings || drMeta.clinicalFindings}</p>
              <p className="rec-text"><strong>Recommendation:</strong> {screening.recommendation || drMeta.recommendation}</p>
            </div>
          </div>

          {/* Signature & Legal Disclaimer */}
          <div className="report-footer-sign">
            <div className="disclaimer-note">
              <strong>Medical Disclaimer:</strong> This automated screening evaluation was generated by the RetinaVision academic research prototype (DenseNet121). It is intended solely for clinical decision support and investigational use, not as a standalone medical diagnosis. All findings must be clinically verified by a licensed ophthalmologist or retina specialist.
            </div>
            <div className="signature-area">
              <div className="sig-line" />
              <span>Reviewing Clinician / Licensed Specialist</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
