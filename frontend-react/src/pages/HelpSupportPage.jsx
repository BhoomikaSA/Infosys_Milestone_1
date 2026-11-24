import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  Eye,
  Camera,
  AlertCircle,
  Mail,
  Send,
  CheckCircle2,
  FileQuestion,
  ScanEye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HelpSupportPage() {
  const { showToast } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    {
      q: "What types of fundus cameras and image formats are supported?",
      a: "RetinaVision accepts standard RGB digital fundus photographs in JPEG, JPG, and PNG formats up to 15 MB. It supports both tabletop optical fundus cameras (e.g. Topcon, Zeiss, Canon) and portable handheld ophthalmic screening devices with a 45° or 50° field of view centered on the macula or optic disc."
    },
    {
      q: "How does the Grad-CAM heatmap assist clinical diagnosis?",
      a: "Grad-CAM computes the spatial gradients of the winning DR stage score flowing back into the final convolutional layer (conv5_block16_2_conv) of DenseNet121. The resulting heatmap highlights the specific pixel regions—such as clusters of microaneurysms, blot hemorrhages, or hard exudates—that contributed most to the AI's classification. This eliminates black-box obscurity and allows ophthalmologists to confirm whether the model's rationale aligns with clinical anatomy."
    },
    {
      q: "What are the 5 Diabetic Retinopathy classes supported by DenseNet121?",
      a: "The model is trained on the standard International Clinical Diabetic Retinopathy (ICDR) scale: Stage 0: No DR (Normal fundus), Stage 1: Mild NPDR (Microaneurysms only), Stage 2: Moderate NPDR (Hemorrhages, hard exudates, cotton-wool spots), Stage 3: Severe NPDR (4-2-1 rule criteria fulfilled), and Stage 4: Proliferative DR (Neovascularization, vitreous hemorrhage)."
    },
    {
      q: "Can RetinaVision be used for standalone, autonomous medical diagnosis?",
      a: "No. RetinaVision is an academic research prototype developed to study deep learning interpretability in ophthalmology. It is strictly intended as a clinical decision support and educational research tool. All automated classifications must be reviewed and confirmed by a licensed ophthalmologist or retina specialist."
    },
    {
      q: "Where is patient data and screening history stored?",
      a: "In this prototype frontend environment, patient metadata and screening audit records are stored locally within your secure browser session storage (localStorage). No patient images are transmitted to unverified third-party public cloud endpoints."
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast("Please fill in all contact fields.", "error");
      return;
    }
    setMessageSent(true);
    showToast("Your inquiry has been submitted to the research team.", "success");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="informative-page-wrap">
      <div className="info-hero-header">
        <span className="page-kicker">DOCUMENTATION & SUPPORT</span>
        <h1>Help, Clinical FAQs & Support</h1>
        <p className="lead-text">
          Find answers to frequently asked questions about retinal fundus imaging, DenseNet121 interpretability, and screening protocols.
        </p>
      </div>

      <div className="help-layout-grid">
        {/* Left Column: FAQ Accordion */}
        <div className="help-faq-col">
          <div className="faq-section-header">
            <FileQuestion size={22} className="text-blue" />
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-card ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Photography Best Practices Card */}
          <div className="photography-tips-box">
            <div className="tips-title">
              <Camera size={20} className="text-purple" />
              <h3>Fundus Photography Best Practices</h3>
            </div>
            <ul className="photography-guidelines-list">
              <li>
                <strong>Macular Centering:</strong> Center the camera optic field midway between the fovea centralis and the temporal disc margin.
              </li>
              <li>
                <strong>Eliminate Corneal Reflections:</strong> Avoid bright crescent corneal flash halos obscuring the temporal arcade.
              </li>
              <li>
                <strong>Adequate Pupil Dilation:</strong> While non-mydriatic cameras are supported, a pupil diameter ≥ 4mm produces optimal signal-to-noise ratio.
              </li>
              <li>
                <strong>Clear Media:</strong> Severe cataracts or corneal scars may cause diffuse illumination attenuation; note this in patient clinical records.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Contact Research Team */}
        <div className="help-contact-col">
          <div className="contact-card">
            <div className="contact-header">
              <Mail size={22} className="text-blue" />
              <h3>Contact the Research Team</h3>
              <p>Have questions regarding model evaluation, weights integration, or clinical validation?</p>
            </div>

            {messageSent ? (
              <div className="contact-success-box">
                <CheckCircle2 size={32} className="text-success" />
                <h4>Inquiry Received</h4>
                <p>Thank you for reaching out. A research fellow will respond to your institutional email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name & Title</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jordan Lee, MD"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Institutional Email</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="jordan.lee@hospital.org"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject / Topic</label>
                  <select className="custom-select">
                    <option>Model Accuracy & Evaluation</option>
                    <option>Grad-CAM Layer Inspection</option>
                    <option>Clinical Screening Protocol</option>
                    <option>Bug Report / Technical Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    rows={4}
                    className="custom-textarea"
                    placeholder="Describe your question or observation..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="action-btn primary full-width">
                  <Send size={16} />
                  <span>Send Research Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
