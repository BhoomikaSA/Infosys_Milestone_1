
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useScreening } from "../context/ScreeningContext";
import { DR_CLASSES } from "../data/clinicalData";
import { apiRequest, API_BASE_URL } from "../services/api";

import SeverityBadge from "../components/SeverityBadge";
import ClassProbabilityBar from "../components/ClassProbabilityBar";
import GradCamViewer from "../components/GradCamViewer";
import ReportModal from "../components/ReportModal";

import {
  FileText,
  ScanEye,
  Sparkles,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Info,
  RefreshCw,
  AlertCircle
} from "lucide-react";

export default function PredictionResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentScreening, getScreeningById } = useScreening();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [fetchedScreening, setFetchedScreening] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // First check whether the screening is already in frontend memory
  const localScreening = id
    ? getScreeningById(id) ||
      (String(currentScreening?.id) === String(id)
        ? currentScreening
        : null)
    : currentScreening;

  // Fetch from backend when the record is not available in memory
  useEffect(() => {
    let cancelled = false;

    const fetchScreening = async () => {
      if (!id || localScreening) {
        setFetchedScreening(null);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await apiRequest(`/history/${id}`);

        if (cancelled) return;

        const classId = Number(response.class_id);
        const drMeta = DR_CLASSES[classId] || DR_CLASSES[0];

        const createdAt = new Date(response.created_at);

        const record = {
          id: String(response.id),

          classId,
          className: response.prediction,
          confidence: Number(response.confidence),

          image: `${API_BASE_URL}${response.original_image}`,
          gradcamImage: `${API_BASE_URL}${response.gradcam_image}`,

          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),

          patientId: "",
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

        setFetchedScreening(record);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to retrieve this screening record."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchScreening();

    return () => {
      cancelled = true;
    };
  }, [id, localScreening]);

  const screening = localScreening || fetchedScreening;

  // Loading state
  if (loading) {
    return (
      <div className="not-found-container">
        <RefreshCw size={42} className="text-muted" />
        <h2>Loading Screening Results...</h2>
        <p>Retrieving your screening record from the database.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="not-found-container">
        <AlertCircle size={48} className="text-muted" />
        <h2>Unable to Load Screening</h2>
        <p>{error}</p>

        <Link to="/history" className="primary-btn">
          Return to Screening History
        </Link>
      </div>
    );
  }

  // Record not found
  if (!screening) {
    return (
      <div className="not-found-container">
        <ScanEye size={48} className="text-muted" />

        <h2>Screening Record Not Found</h2>

        <p>
          This screening record could not be found.
          Please perform a new screening or open a record from history.
        </p>

        <Link to="/screening" className="primary-btn">
          Perform a Screening
        </Link>
      </div>
    );
  }

  const drMeta = DR_CLASSES[screening.classId] || DR_CLASSES[0];

  const modelScore = Number(screening.confidence);

  const formattedScore = Number.isFinite(modelScore)
    ? modelScore.toFixed(2)
    : "N/A";

  return (
    <div className="results-page-wrap">

      {/* Top Navigation Bar */}
      <div className="results-top-nav">
        <button
          type="button"
          className="back-nav-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="results-nav-actions">
          <button
            type="button"
            className="action-btn secondary"
            onClick={() => setIsReportOpen(true)}
          >
            <Printer size={16} />
            <span>Clinical PDF Report</span>
          </button>

          <Link to="/screening" className="action-btn primary">
            <ScanEye size={16} />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {/* Hero Classification Banner */}
      <div
        className="results-hero-banner"
        style={{ borderColor: drMeta.borderColor }}
      >
        <div className="banner-left">
          <div className="banner-badge-row">
            <span className="examination-id-tag">
              EXAMINATION ID: {screening.id}
            </span>

            <SeverityBadge
              classId={screening.classId}
              size="lg"
            />

            <span
              className="risk-level-tag"
              style={{
                color: drMeta.color,
                borderColor: drMeta.borderColor
              }}
            >
              {drMeta.riskLevel}
            </span>
          </div>

          <h1 className="predicted-title">
            Predicted DR Stage: <span>{screening.className}</span>
          </h1>

          <p className="prediction-clinical-summary">
            {screening.findings || drMeta.clinicalFindings}
          </p>

          <div className="patient-inline-meta">
            <span>
              <strong>Patient:</strong>{" "}
              {screening.patientName || "Anonymous Patient"}
              {screening.patientId
                ? ` (${screening.patientId})`
                : ""}
            </span>

            <span>•</span>

            <span>
              <strong>Eye:</strong>{" "}
              {screening.eye || "Not recorded"}
            </span>

            <span>•</span>

            <span>
              <strong>Date:</strong>{" "}
              {screening.date || "Not available"}
              {screening.time ? ` at ${screening.time}` : ""}
            </span>
          </div>
        </div>

        <div className="banner-confidence-box">
          <span className="conf-label">Model Output Score</span>

          <div
            className="conf-value"
            style={{ color: drMeta.color }}
          >
            {formattedScore}
            {formattedScore !== "N/A" ? "%" : ""}
          </div>

          <span className="conf-sub">
            Score returned by DenseNet121
          </span>

          <div className="layer-tag">
            <span>
              Layer: {screening.gradcamLayer || "Not available"}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Diagnostic Section */}
      <div className="results-grid">

        {/* Left Column */}
        <div className="results-left-col">
          <div className="prob-card-wrap">
            <ClassProbabilityBar
              probabilities={screening.probabilities}
              predictedClassId={screening.classId}
              confidence={screening.confidence}
            />
          </div>

          {/* Clinical Findings & Recommendations */}
          <div className="clinical-guidance-card">
            <div className="card-top-title">
              <div className="cg-header">
                <ShieldCheck size={20} className="text-blue" />
                <h4>Ophthalmic Clinical Recommendations</h4>
              </div>
            </div>

            <div className="guidance-body">
              <div className="guidance-block">
                <h5>ICDR Clinical Criteria:</h5>
                <p>{drMeta.description}</p>
              </div>

              <div
                className="guidance-block highlight-block"
                style={{ borderLeftColor: drMeta.color }}
              >
                <h5>Actionable Follow-Up Protocol:</h5>

                <p>
                  {screening.recommendation ||
                    drMeta.recommendation}
                </p>
              </div>

              {screening.notes && (
                <div className="guidance-block">
                  <h5>Examination Notes:</h5>
                  <p className="notes-text">{screening.notes}</p>
                </div>
              )}
            </div>

            <div className="guidance-footer">
              <div className="disclaimer-mini">
                <Info size={14} />

                <span>
                  AI-generated screening output is for research and
                  screening assistance only. It is not a medical
                  diagnosis. An ophthalmologist must review the
                  retinal image and findings before clinical decisions.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Grad-CAM Explainability */}
        <div className="results-right-col">
          <GradCamViewer
            originalImage={screening.image}
            gradcamImage={screening.gradcamImage}
            layerName={screening.gradcamLayer}
            predictedClass={screening.className}
            confidence={screening.confidence}
            title="Grad-CAM Spatial Explainability"
          />

          <div className="explainability-actions-bar">
            <Link
              to="/gradcam-studio"
              className="action-btn secondary full-width"
            >
              <Sparkles size={16} />
              <span>Deep-Dive in Grad-CAM Studio</span>
            </Link>

            <button
              type="button"
              className="action-btn primary full-width"
              onClick={() => setIsReportOpen(true)}
            >
              <FileText size={16} />
              <span>Generate Printable Clinical Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <ReportModal
          screening={screening}
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </div>
  );
}
