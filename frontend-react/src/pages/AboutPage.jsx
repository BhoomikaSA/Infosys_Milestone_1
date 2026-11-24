import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  BrainCircuit,
  ScanEye,
  ShieldCheck,
  Layers,
  Database,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  Heart
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="informative-page-wrap">
      {/* Header */}
      <div className="info-hero-header">
        <span className="page-kicker">ABOUT RETINAVISION</span>
        <h1>Explainable Artificial Intelligence for Diabetic Retinopathy</h1>
        <p className="lead-text">
          RetinaVision is an academic research platform designed to automate retinal fundus assessment while demystifying the deep neural decision process through spatial gradient activations.
        </p>
      </div>

      {/* Grid of Core Pillars */}
      <div className="pillars-grid">
        <div className="pillar-card">
          <div className="pillar-icon"><BrainCircuit size={24} /></div>
          <h3>DenseNet121 Backbone</h3>
          <p>
            Unlike traditional convolutional networks with simple residual skips, DenseNet connects every layer to every subsequent layer in a feed-forward fashion, preserving feature maps and maximizing gradient flow across 121 layers.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon"><ScanEye size={24} /></div>
          <h3>Grad-CAM Interpretability</h3>
          <p>
            By backpropagating the gradients of the predicted class score into the final convolutional layer (conv5_block16_2_conv), the platform produces coarse 2D saliency maps that highlight the exact pathological lesions.
          </p>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon"><Database size={24} /></div>
          <h3>APTOS 2019 Benchmark</h3>
          <p>
            Trained and evaluated on the APTOS 2019 Blindness Detection dataset—comprising thousands of clinically verified fundus photographs from diverse clinics across India and international screening programs.
          </p>
        </div>
      </div>

      {/* Deep Architecture Breakdown */}
      <section className="architecture-detail-section">
        <div className="section-heading">
          <span className="section-kicker">TECHNICAL SPECIFICATIONS</span>
          <h2>DenseNet121 Architecture & Pipeline Details</h2>
        </div>

        <div className="spec-table-card">
          <div className="spec-row">
            <span className="spec-k">Backbone Architecture:</span>
            <span className="spec-v">Densely Connected Convolutional Networks (DenseNet121)</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">Input Tensor Dimensions:</span>
            <span className="spec-v">384 × 384 × 3 RGB Digital Fundus Imagery</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">Preprocessing Pipeline:</span>
            <span className="spec-v">Circular cropping, Gaussian illumination leveling, CLAHE contrast enhancement, [-1, 1] scaling</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">Explainability Hook:</span>
            <span className="spec-v">conv5_block16_2_conv (Final convolutional layer in DenseBlock 4)</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">Classification Head:</span>
            <span className="spec-v">GlobalAveragePooling2D → BatchNorm → Dropout(0.4) → Dense(256) → Dropout(0.3) → Dense(5, Softmax)</span>
          </div>
          <div className="spec-row">
            <span className="spec-k">Trained Weights File:</span>
            <span className="spec-v code-font">densenet121_aptos_50ep_best.keras</span>
          </div>
        </div>
      </section>

      {/* Clinical Motivation */}
      <section className="clinical-motivation-section">
        <div className="motivation-card">
          <div className="mot-header">
            <Heart size={22} className="text-danger" />
            <h3>Why Diabetic Retinopathy Screening Matters</h3>
          </div>
          <p>
            Diabetic Retinopathy (DR) remains one of the leading causes of preventable blindness among working-age adults worldwide. Over 100 million people with diabetes are affected. When detected in its early stages (Mild to Moderate NPDR), vision loss can be prevented in up to 90% of cases through laser photocoagulation, anti-VEGF injections, and rigorous glycemic management.
          </p>
          <p>
            However, in rural and underserved communities, ophthalmologists and retinal specialists are scarce. RetinaVision demonstrates how AI can empower primary care clinics, telemedicine nodes, and mobile screening vans to deliver rapid, explainable triage.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="info-cta-box">
        <h3>Experience the Platform in Action</h3>
        <p>Explore our interactive tools or upload a retinal fundus image for automated analysis.</p>
        <div className="cta-btn-group">
          <Link to="/screening" className="primary-btn">
            <span>Start Retinal Screening</span>
            <ArrowUpRight size={17} />
          </Link>
          <Link to="/gradcam-studio" className="secondary-btn">
            <span>Open Grad-CAM Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
