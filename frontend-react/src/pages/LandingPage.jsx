import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Activity,
  Eye,
  ShieldCheck,
  BrainCircuit,
  ScanEye,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
  TrendingUp,
  Cpu
} from "lucide-react";
import { DR_CLASSES } from "../data/clinicalData";
import SeverityBadge from "../components/SeverityBadge";

const features = [
  {
    icon: BrainCircuit,
    title: "DenseNet121 Deep Backbone",
    description: "Trained on the APTOS 2019 Blindness Detection dataset with 50-epoch fine-tuning, leveraging dense feature-reuse connections for subtle lesion extraction."
  },
  {
    icon: ScanEye,
    title: "Grad-CAM Explainability",
    description: "Computes gradient-weighted activation maps from convolutional layer conv5_block16_2_conv, pinpointing the exact microaneurysms and exudates driving each classification."
  },
  {
    icon: ShieldCheck,
    title: "5-Stage ICDR Classification",
    description: "Standardized multi-class stratification across International Clinical Diabetic Retinopathy stages: from No DR through Proliferative DR."
  },
  {
    icon: Layers,
    title: "Dual-Modal Inspection",
    description: "Inspect fundus photography via interactive alpha-blended overlays, split-screen sliding comparisons, and synchronized side-by-side diagnostic panels."
  }
];

const workflowSteps = [
  {
    step: "01",
    title: "Retinal Image Ingestion",
    description: "High-resolution digital fundus photography is ingested and normalized to standard 384×384 px RGB tensors with CLAHE color calibration."
  },
  {
    step: "02",
    title: "DenseNet121 Inference",
    description: "Densely connected convolutional blocks extract high-level multi-scale retinal features without vanishing gradient degradation."
  },
  {
    step: "03",
    title: "Grad-CAM Saliency Extraction",
    description: "Gradients of the winning class score flow back into layer conv5_block16_2_conv to generate a normalized 2D spatial importance heatmap."
  },
  {
    step: "04",
    title: "Clinical Decision Support",
    description: "Ophthalmologists receive calibrated risk probabilities, ICDR classification, and visual evidence with one-click comprehensive PDF reports."
  }
];

const explainabilityBenefits = [
  {
    title: "Eliminating the 'Black-Box' Barrier",
    desc: "Clinicians can directly verify whether the neural network focused on genuine retinal lesions rather than camera artifacts or illumination glare."
  },
  {
    title: "Subtle Microaneurysm Localization",
    desc: "Highlights early Stage 1 dot-and-blot microaneurysms that might be overlooked during rapid initial ophthalmic triaging."
  },
  {
    title: "Enhanced Patient Communication",
    desc: "Allows clinicians to show patients visual heatmaps of their own retina, improving adherence to diabetic glycemic and lifestyle regimens."
  },
  {
    title: "Seamless Quality Auditing",
    desc: "Ensures institutional compliance and transparency required by emerging healthcare AI safety and governance standards."
  }
];

export default function LandingPage() {
  return (
    <div className="landing-page-wrap">
      {/* Hero Section */}
      <section className="hero">
        {/* Left Column: Vision, Headline & Actions */}
        <div className="hero-content">
          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero-status-pulse" />
            <span className="hero-eyebrow-text">AI-POWERED RETINAL SCREENING</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            See Beyond the Image.
            <br />
            <span className="hero-headline-accent">Understand the Retina.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            RetinaVision bridges deep neural intelligence with visual explainability.
            Empowering ophthalmologists and clinicians with transparent, stage-calibrated
            diabetic retinopathy screening through DenseNet121 classification and real-time
            Grad-CAM spatial heatmaps.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
          >
            <Link to="/screening" className="hero-primary-btn">
              <span>Get Started</span>
              <ArrowUpRight size={18} />
            </Link>
            <a href="#technology" className="hero-secondary-btn">
              <span>Explore Technology</span>
            </a>
          </motion.div>

          <motion.div
            className="hero-trust-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.38 }}
          >
            <ShieldCheck size={16} className="trust-icon" />
            <span>Academic Research Prototype • DenseNet121 APTOS-50 • Aligned with ICDR Standards</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Retinal Visual Centerpiece */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.15 }}
        >
          {/* Ambient Lighting & Glow Orbs */}
          <div className="retina-ambient-glow glow-blue" />
          <div className="retina-ambient-glow glow-purple" />
          <div className="retina-ambient-glow glow-core" />

          {/* Medical Glassmorphism Frame */}
          <div className="retina-glass-frame">
            {/* Corner Precision Reticles */}
            <span className="reticle reticle-tl" />
            <span className="reticle reticle-tr" />
            <span className="reticle reticle-bl" />
            <span className="reticle reticle-br" />

            {/* Top Telemetry Header */}
            <div className="frame-telemetry-header">
              <div className="telemetry-item">
                <span className="telemetry-dot" />
                <span className="telemetry-label">3D FUNDUS TOMOGRAPHY</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-badge">50° FOV • 384×384</span>
              </div>
            </div>

            {/* Subtle Crosshair & Depth Guidance */}
            <div className="optic-crosshair-h" />
            <div className="optic-crosshair-v" />
            <div className="optic-depth-ring" />

            {/* 3D Retinal Fundus Image Stage */}
            <div className="retina-render-stage">
              <img
                src="/retina-hero.png"
                alt="Detailed 3D Human Retinal Fundus Scan"
                className="retina-3d-model"
              />
              <div className="retina-specular-sheen" />
            </div>

            {/* Bottom Telemetry Footer */}
            <div className="frame-telemetry-footer">
              <div className="telemetry-coord">
                <span>MACULA: 0.00° / FOVEAL ALIGNED</span>
              </div>
              <div className="telemetry-coord text-right">
                <span>DENSENET121 READY</span>
              </div>
            </div>

            {/* Floating Information Panels */}
            {/* Panel 1: DenseNet121 AI Analysis (Top Right) */}
            <motion.div
              className="floating-panel panel-top-right"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="panel-icon-wrap icon-blue">
                <BrainCircuit size={16} />
              </div>
              <div className="panel-text-block">
                <span className="panel-title">DenseNet121 AI Analysis</span>
                <span className="panel-subtitle">5-Class Multi-Stage Scoring</span>
              </div>
            </motion.div>

            {/* Panel 2: Explainable AI (Bottom Left) */}
            <motion.div
              className="floating-panel panel-bottom-left"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="panel-icon-wrap icon-purple">
                <Eye size={16} />
              </div>
              <div className="panel-text-block">
                <span className="panel-title">Explainable AI</span>
                <span className="panel-subtitle">Spatial Lesion Attribution</span>
              </div>
            </motion.div>

            {/* Panel 3: Grad-CAM Visualization (Bottom Right) */}
            <motion.div
              className="floating-panel panel-bottom-right"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="panel-icon-wrap icon-cyan">
                <Sparkles size={16} />
              </div>
              <div className="panel-text-block">
                <span className="panel-title">Grad-CAM Visualization</span>
                <span className="panel-subtitle">conv5_block16_2_conv</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 5-Stage Classification Overview */}
      <section className="stages-overview-section">
        <div className="section-heading text-center">
          <span className="section-kicker">CLINICAL STANDARDIZATION</span>
          <h2>The 5 Stages of <span>Diabetic Retinopathy</span></h2>
          <p>
            Standardized multi-class severity classification aligned with the International Clinical Diabetic Retinopathy (ICDR) disease scale.
          </p>
        </div>

        <div className="stages-cards-grid">
          {DR_CLASSES.map((stage) => (
            <div
              key={stage.id}
              className="stage-card-item"
              style={{ borderTop: `3px solid ${stage.color}` }}
            >
              <div className="stage-top-meta">
                <span className="stage-id" style={{ color: stage.color }}>{stage.shortName}</span>
                <SeverityBadge classId={stage.id} size="sm" showIcon={false} />
              </div>
              <h3>{stage.name}</h3>
              <p className="stage-desc">{stage.description}</p>
              <div className="stage-footer">
                <span className="stage-rec-label">Clinical Action:</span>
                <p className="stage-rec-val">{stage.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section">
        <div className="section-heading">
          <span className="section-kicker">END-TO-END PIPELINE</span>
          <h2>How <span>RetinaVision</span> Works</h2>
          <p>
            From fundus camera capture to explainable diagnostic decision support in seconds.
          </p>
        </div>

        <div className="workflow-grid">
          {workflowSteps.map((step, idx) => (
            <div key={step.step} className="workflow-card">
              <div className="workflow-number">{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="workflow-line" />
            </div>
          ))}
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section className="technology-section" id="technology">
        <div className="section-heading">
          <span className="section-kicker">THE TECHNOLOGY</span>
          <h2>Intelligence with <span>explainability.</span></h2>
          <p>
            Combining deep learning with visual explanations to support diabetic retinopathy screening.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                className="feature-card"
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  <Icon size={23} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Why Grad-CAM Matters Section */}
      <section className="explainability-spotlight-section">
        <div className="spotlight-grid">
          <div className="spotlight-content">
            <span className="section-kicker">EXPLAINABLE AI IN MEDICINE</span>
            <h2>Why Grad-CAM is Essential for <span>Clinical Adoption</span></h2>
            <p>
              Conventional deep neural networks act as black boxes, providing predictions without justification. Grad-CAM visualizes the specific pathological features that led to the model's decision, enabling ophthalmologists to validate AI conclusions against medical findings.
            </p>

            <div className="benefits-list">
              {explainabilityBenefits.map((b, i) => (
                <div key={i} className="benefit-item">
                  <div className="benefit-bullet">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4>{b.title}</h4>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="spotlight-cta">
              <Link to="/gradcam-studio" className="primary-btn">
                <span>Try Interactive Grad-CAM Studio</span>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className="spotlight-visual">
            <div className="comparison-preview-card">
              <div className="cp-header">
                <span className="cp-title">Real-Time Heatmap Generation</span>
                <span className="cp-layer">conv5_block16_2_conv</span>
              </div>
              <div className="cp-images">
                <div className="cp-img-item">
                  <img src="/sample-retina.png" alt="Retinal Fundus" />
                  <span>Original Fundus</span>
                </div>
                <div className="cp-img-item">
                  <img src="/sample-gradcam.jpg" alt="Grad-CAM Overlay" />
                  <span>Grad-CAM Activation</span>
                </div>
              </div>
              <div className="cp-legend">
                <div className="legend-chip high">High Attention: Exudates & Hemorrhages</div>
                <div className="legend-chip low">Low: Retinal Background</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-card">
          <div className="cta-text">
            <h2>Ready to screen retinal images with Explainable AI?</h2>
            <p>
              Upload fundus photography, inspect DenseNet121 predictions, and interact with Grad-CAM saliency maps instantly.
            </p>
          </div>
          <div className="cta-buttons">
            <Link to="/screening" className="primary-btn">
              <span>Start Screening Now</span>
              <ArrowUpRight size={18} />
            </Link>
            <Link to="/register" className="secondary-btn">
              <span>Create Clinician Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
