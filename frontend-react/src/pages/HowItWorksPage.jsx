import React from "react";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  Cpu,
  BrainCircuit,
  ScanEye,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Optical Retinal Image Ingestion",
      icon: UploadCloud,
      summary: "Acquiring fundus photography from digital desktop or handheld retinal cameras.",
      details: [
        "Standard 45° or 50° macula/disc-centered retinal photographs are accepted in JPG, JPEG, or PNG formats.",
        "Non-mydriatic or mydriatic pupil dilation captures are supported.",
        "Integrates directly with hospital PACS or local clinician upload."
      ]
    },
    {
      num: "02",
      title: "Automated Preprocessing & Normalization",
      icon: Layers,
      summary: "Standardizing illumination variance and focal dimensions before neural inference.",
      details: [
        "Automatic background border detection and circular bounding box cropping.",
        "Rescaling to standardized 384 × 384 pixel resolution matching DenseNet121 receptive fields.",
        "Contrast Limited Adaptive Histogram Equalization (CLAHE) to reveal subtle microaneurysms hidden in dark retinal periphery.",
        "Tensor normalization of pixel floats to [-1, 1] range."
      ]
    },
    {
      num: "03",
      title: "DenseNet121 Multi-Scale Feature Extraction",
      icon: BrainCircuit,
      summary: "Processing through 121 dense layers with direct feature reuse connections.",
      details: [
        "DenseBlock 1 & 2: Low-level edge, curvature, and vessel branch identification.",
        "DenseBlock 3: Intermediate lesion detection (lipid exudates, dot hemorrhages).",
        "DenseBlock 4: High-level semantic disease pattern recognition (neovascularization, venous beading).",
        "Trained for 50 epochs on the APTOS 2019 Blindness Detection dataset."
      ]
    },
    {
      num: "04",
      title: "Grad-CAM Saliency Map Generation",
      icon: ScanEye,
      summary: "Extracting gradient attribution from layer conv5_block16_2_conv.",
      details: [
        "Backpropagates class gradients to compute spatial importance weights α_k for every feature channel.",
        "Applies ReLU rectification to eliminate negative gradients (features favoring alternate classes).",
        "Generates a 2D coarse activation heatmap resized to 384 × 384.",
        "Converts activation intensities into an OpenCV JET color spectrum for immediate clinician inspection."
      ]
    },
    {
      num: "05",
      title: "Five-Class Clinical Risk Stratification",
      icon: FileText,
      summary: "Delivering calibrated probabilities, ICDR severity stage, and comprehensive reports.",
      details: [
        "Softmax output assigns exact probability percentages to all 5 stages (No DR, Mild, Moderate, Severe, Proliferative DR).",
        "Actionable ICDR follow-up intervals recommended for each stage.",
        "Instant one-click generation of printable clinical PDF reports complete with patient details and legal disclaimers."
      ]
    }
  ];

  return (
    <div className="informative-page-wrap">
      <div className="info-hero-header">
        <span className="page-kicker">SYSTEM METHODOLOGY</span>
        <h1>How RetinaVision Works</h1>
        <p className="lead-text">
          A step-by-step breakdown of how deep learning and gradient-weighted class activation mapping work together to transform raw retinal fundus imagery into explainable diagnostic insights.
        </p>
      </div>

      <div className="how-steps-timeline">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="step-timeline-card">
              <div className="step-badge-col">
                <div className="step-big-circle">
                  <span>{s.num}</span>
                </div>
                {idx < steps.length - 1 && <div className="step-connector-line" />}
              </div>

              <div className="step-content-col">
                <div className="step-header">
                  <div className="step-icon-box">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3>{s.title}</h3>
                    <p className="step-summary">{s.summary}</p>
                  </div>
                </div>

                <div className="step-details-box">
                  <ul>
                    {s.details.map((d, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} className="text-blue" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="info-cta-box">
        <h3>Ready to Test the Workflow?</h3>
        <p>Experience the entire process from image upload to Grad-CAM heatmap visualization.</p>
        <div className="cta-btn-group">
          <Link to="/screening" className="primary-btn">
            <span>Upload Retinal Image</span>
            <ArrowUpRight size={17} />
          </Link>
          <Link to="/gradcam-studio" className="secondary-btn">
            <span>Inspect Grad-CAM Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
