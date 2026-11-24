
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useScreening } from "../context/ScreeningContext";
import { apiRequest, API_BASE_URL } from "../services/api";
import GradCamViewer from "../components/GradCamViewer";
import SeverityBadge from "../components/SeverityBadge";
import { DR_CLASSES } from "../data/clinicalData";

import {
  Sparkles,
  BrainCircuit,
  Eye,
  ScanEye,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export default function GradCamStudioPage() {
  const { currentScreening, setCurrentScreening } = useScreening();

  const [screenings, setScreenings] = useState([]);
  const [selectedScreeningId, setSelectedScreeningId] = useState(
    currentScreening?.id ? String(currentScreening.id) : ""
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real screening history
  const loadScreenings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/history/");

      if (!Array.isArray(response)) {
        throw new Error("Invalid screening history response.");
      }

      const records = response.map((item) => {
        const classId = Number(item.class_id);
        const drMeta = DR_CLASSES[classId] || DR_CLASSES[0];
        const createdAt = new Date(item.created_at);

        return {
          id: String(item.id),
          classId,
          className: item.prediction,
          confidence: Number(item.confidence),

          image: `${API_BASE_URL}${item.original_image}`,
          gradcamImage: `${API_BASE_URL}${item.gradcam_image}`,

          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),

          patientId: `Screening #${item.id}`,
          patientName: "Patient details unavailable",
          patientAge: null,
          eye: "Not recorded",
          notes: "",

          probabilities: null,
          gradcamLayer: "conv5_block16_2_conv",

          findings: drMeta.clinicalFindings,
          recommendation: drMeta.recommendation,
          model: "DenseNet121"
        };
      });

      setScreenings(records);

      // Keep the current selection if it exists in the backend records
      const currentId = String(currentScreening?.id || "");

      const validCurrentRecord = records.find(
        (record) => record.id === currentId
      );

      if (validCurrentRecord) {
        setSelectedScreeningId(validCurrentRecord.id);
        setCurrentScreening(validCurrentRecord);
      } else if (records.length > 0) {
        setSelectedScreeningId(records[0].id);
        setCurrentScreening(records[0]);
      } else {
        setSelectedScreeningId("");
        setCurrentScreening(null);
      }
    } catch (err) {
      setError(err.message || "Unable to load screening records.");
    } finally {
      setLoading(false);
    }
  }, [currentScreening?.id, setCurrentScreening]);

  useEffect(() => {
    loadScreenings();
  }, [loadScreenings]);

  const activeScreening = screenings.find(
    (screening) => screening.id === String(selectedScreeningId)
  ) || null;

  const handleSelectScreening = (screening) => {
    setSelectedScreeningId(screening.id);
    setCurrentScreening(screening);
  };

  return (
    <div className="studio-page-wrap">

      {/* Studio Header */}
      <div className="page-header-row">
        <div>
          <div className="page-eyebrow">
            <Sparkles size={15} />
            <span>NEURAL INTERPRETABILITY STUDIO</span>
          </div>

          <h1>Grad-CAM Explainability Studio</h1>

          <p>
            Interactive exploration of DenseNet121 spatial feature
            attribution. Explore the model's highlighted image regions
            through Grad-CAM visualizations.
          </p>
        </div>

        <div className="studio-target-chip">
          <BrainCircuit size={16} />
          <div>
            <strong>Layer conv5_block16_2_conv</strong>
            <span>DenseBlock 4 • 1024 Feature Channels</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="empty-studio-state">
          <RefreshCw size={32} />
          <h3>Loading Screening Records...</h3>
          <p>Fetching your retinal screening history.</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="empty-studio-state">
          <AlertCircle size={42} className="text-muted" />
          <h3>Unable to Load Screenings</h3>
          <p>{error}</p>

          <button
            type="button"
            className="primary-btn"
            onClick={loadScreenings}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loaded Content */}
      {!loading && !error && screenings.length > 0 && (
        <>
          {/* Screening Selector */}
          <div className="screening-selector-ribbon">
            <span className="ribbon-label">
              Select Screening Record:
            </span>

            <div className="ribbon-items-scroll">
              {screenings.map((screening) => {
                const isSelected =
                  screening.id === activeScreening?.id;

                return (
                  <button
                    key={screening.id}
                    type="button"
                    className={`ribbon-item-btn ${
                      isSelected ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSelectScreening(screening)
                    }
                  >
                    <div className="ribbon-thumb">
                      <img
                        src={screening.image}
                        alt="Retinal fundus"
                      />
                    </div>

                    <div className="ribbon-meta">
                      <strong>Screening #{screening.id}</strong>
                      <span>
                        {screening.className} (
                        {screening.confidence.toFixed(2)}%)
                      </span>
                    </div>

                    <SeverityBadge
                      classId={screening.classId}
                      size="sm"
                      showIcon={false}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Interactive Viewer */}
          {activeScreening ? (
            <div className="studio-main-grid">
              <div className="studio-viewer-container">
                <GradCamViewer
                  originalImage={activeScreening.image}
                  gradcamImage={activeScreening.gradcamImage}
                  layerName={
                    activeScreening.gradcamLayer ||
                    "conv5_block16_2_conv"
                  }
                  predictedClass={activeScreening.className}
                  confidence={activeScreening.confidence}
                  title={`Saliency Attribution — Screening #${activeScreening.id}`}
                />
              </div>

              {/* Sidebar */}
              <div className="studio-sidebar-col">

                {/* Grad-CAM Architecture */}
                <div className="deep-dive-card">
                  <div className="card-top-title">
                    <BrainCircuit
                      size={19}
                      className="text-blue"
                    />
                    <h4>How Grad-CAM Computes Saliency</h4>
                  </div>

                  <p className="deep-dive-intro">
                    Gradient-weighted Class Activation Mapping
                    (Grad-CAM) uses the gradients of the target
                    class score flowing into the final convolutional
                    layer.
                  </p>

                  <div className="math-pill">
                    <code>
                      L_Grad-CAM = ReLU( Σ α_k * A_k )
                    </code>
                  </div>

                  <div className="pipeline-steps-vertical">
                    <div className="p-step">
                      <span className="p-num">1</span>
                      <div>
                        <strong>Backprop Class Gradients:</strong>
                        <p>
                          Calculate gradients of the target class
                          score with respect to feature maps in
                          conv5_block16_2_conv.
                        </p>
                      </div>
                    </div>

                    <div className="p-step">
                      <span className="p-num">2</span>
                      <div>
                        <strong>Global Average Pooling:</strong>
                        <p>
                          Calculate importance weights across the
                          spatial dimensions of the feature maps.
                        </p>
                      </div>
                    </div>

                    <div className="p-step">
                      <span className="p-num">3</span>
                      <div>
                        <strong>Rectified Linear Activation:</strong>
                        <p>
                          Apply ReLU to retain positive
                          contributions to the target class score.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Retinal Anatomy */}
                <div className="anatomy-guide-card">
                  <div className="card-top-title">
                    <Eye size={19} className="text-purple" />
                    <h4>Retinal Anatomical Landmarks</h4>
                  </div>

                  <ul className="anatomy-list">
                    <li>
                      <strong>Macula &amp; Fovea:</strong>
                      <span>
                        Central retinal region responsible for
                        detailed vision. Macular abnormalities
                        require clinical assessment.
                      </span>
                    </li>

                    <li>
                      <strong>Optic Disc:</strong>
                      <span>
                        Region where retinal nerve fibers exit
                        the eye. Abnormal vessels around this
                        region require professional evaluation.
                      </span>
                    </li>

                    <li>
                      <strong>Temporal Vascular Arcades:</strong>
                      <span>
                        Major retinal blood vessels that can
                        exhibit changes associated with retinal
                        disease.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* New Screening */}
                <div className="studio-action-card">
                  <h4>Analyze Another Case</h4>

                  <p>
                    Upload a new fundus image to generate a
                    fresh screening and saliency visualization.
                  </p>

                  <Link
                    to="/screening"
                    className="action-btn primary full-width"
                  >
                    <ScanEye size={16} />
                    <span>Upload New Fundus Image</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-studio-state">
              <ScanEye size={42} className="text-muted" />
              <h3>No Screening Selected</h3>
              <p>Select a screening record to explore its Grad-CAM visualization.</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && screenings.length === 0 && (
        <div className="empty-studio-state">
          <ScanEye size={42} className="text-muted" />
          <h3>No screenings available</h3>
          <p>
            Complete a retinal screening first to inspect Grad-CAM
            visualizations.
          </p>

          <Link
            to="/screening"
            className="primary-btn"
          >
            Start Retinal Screening
          </Link>
        </div>
      )}
    </div>
  );
}
