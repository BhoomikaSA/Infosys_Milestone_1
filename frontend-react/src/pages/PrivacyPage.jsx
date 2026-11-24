import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="informative-page-wrap">
      <div className="info-hero-header">
        <span className="page-kicker">DATA PROTECTION & GOVERNANCE</span>
        <h1>Privacy & Patient Data Protection Policy</h1>
        <p className="lead-text">
          Our commitment to protecting ophthalmic imaging data, patient confidentiality, and adhering to international healthcare privacy standards.
        </p>
      </div>

      <div className="policy-document-card">
        <div className="policy-section">
          <h3>1. Local-First Processing Principle</h3>
          <p>
            In this prototype frontend environment, patient fundus images, clinical notes, and identification numbers are handled locally within your browser workstation session. Images uploaded during screening sessions are not transmitted to or stored on external commercial third-party cloud analytics servers.
          </p>
        </div>

        <div className="policy-section">
          <h3>2. Patient Anonymization & De-Identification</h3>
          <p>
            In alignment with HIPAA Privacy Rule Safe Harbor provisions and GDPR Article 9 requirements for special category healthcare data:
          </p>
          <ul className="policy-bullets">
            <li>Patient full legal names can be omitted or replaced with pseudonymous identifier codes (e.g., PT-9042).</li>
            <li>Direct geographic markers and non-essential demographic variables are excluded from automated model inferences.</li>
            <li>Exported PDF reports and CSV audit logs feature user-controlled toggles to mask identifiable patient information prior to academic sharing.</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>3. Model Weights & Inference Security</h3>
          <p>
            DenseNet121 weights (densenet121_aptos_50ep_best.keras) operate solely in inference mode. The neural model does not perform continuous unsupervised retraining on uploaded patient data, preventing any inadvertent patient data reconstruction or membership inference attacks.
          </p>
        </div>

        <div className="policy-section">
          <h3>4. User Control & Data Retention</h3>
          <p>
            Clinicians maintain complete authority over their screening audit trail. You can selectively delete individual examination records or reset the entire local history at any time through the Screening History interface.
          </p>
        </div>

        <div className="policy-section">
          <h3>5. Contacting the Data Protection Officer</h3>
          <p>
            For institutional data privacy audits, IRB review agreements, or research compliance inquiries, please contact our research ethics coordinator at:
            <br />
            <strong>privacy@retinavision-health.org</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
