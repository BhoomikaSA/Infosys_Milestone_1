import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useScreening } from "../context/ScreeningContext";
import { DR_CLASSES } from "../data/clinicalData";
import SeverityBadge from "../components/SeverityBadge";
import StatCard from "../components/StatCard";
import ReportModal from "../components/ReportModal";
import {
  ScanEye,
  Activity,
  History,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { screenings, setCurrentScreening } = useScreening();
  const navigate = useNavigate();

  const [selectedReportScreening, setSelectedReportScreening] = useState(null);

  const totalScreenings = screenings.length;
  const latestScreening = screenings[0] || null;

  // Breakdown of screenings by class
  const classCounts = DR_CLASSES.map((c) => ({
    ...c,
    count: screenings.filter((s) => s.classId === c.id).length
  }));

  const abnormalCount = screenings.filter((s) => s.classId > 0).length;
  const avgConfidence = totalScreenings > 0
    ? (screenings.reduce((acc, s) => acc + (s.confidence || 90), 0) / totalScreenings).toFixed(1)
    : 94.2;

  const handleViewResult = (screening) => {
    setCurrentScreening(screening);
    navigate(`/results/${screening.id}`);
  };

  const handleOpenReport = (screening, e) => {
    e.stopPropagation();
    setSelectedReportScreening(screening);
  };

  return (
    <div className="dashboard-content-wrap">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <div className="welcome-eyebrow">
            <span className="live-status-dot" />
            <span>CLINICAL SCREENING PORTAL • ACTIVE SESSION</span>
          </div>
          <h1>Welcome back, {user?.name || "Dr. Jenkins"}</h1>
          <p>
            {user?.institution || "Vision Sciences Medical Center"} • {user?.department || "Retina Subspecialty Clinic"}
          </p>
        </div>

        <div className="welcome-actions-col">
          <Link to="/screening" className="primary-btn pulse-glow">
            <ScanEye size={19} />
            <span>Start New Screening</span>
          </Link>
          <Link to="/gradcam-studio" className="secondary-btn">
            <Sparkles size={17} />
            <span>Open Grad-CAM Studio</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-stats-grid">
        <StatCard
          title="Total Screenings Conducted"
          value={totalScreenings}
          subtitle="Indexed in local audit trail"
          icon={ScanEye}
          trend="+12% this week"
          color="#68aaff"
          bgTint="rgba(104, 170, 255, 0.12)"
        />
        <StatCard
          title="Pathologies Detected"
          value={abnormalCount}
          subtitle={`DR Stages 1–4 (${((abnormalCount / Math.max(totalScreenings, 1)) * 100).toFixed(0)}% positivity rate)`}
          icon={AlertTriangle}
          trend="Clinical triage"
          color="#f59e0b"
          bgTint="rgba(245, 158, 11, 0.12)"
        />
        <StatCard
          title="Mean Model Confidence"
          value={`${avgConfidence}%`}
          subtitle="DenseNet121 Softmax certainty"
          icon={ShieldCheck}
          trend="High reliability"
          color="#10b981"
          bgTint="rgba(16, 185, 129, 0.12)"
        />
        <StatCard
          title="Avg Inference Latency"
          value="< 850 ms"
          subtitle="384×384 tensor pipeline"
          icon={Activity}
          trend="GPU / Neural Engine"
          color="#a58aff"
          bgTint="rgba(165, 138, 255, 0.12)"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column: Latest Screening Spotlight & Five-Class Stratification */}
        <div className="dashboard-left-col">
          {latestScreening ? (
            <div className="spotlight-card">
              <div className="spotlight-header">
                <div>
                  <span className="spotlight-badge">MOST RECENT SCREENING</span>
                  <h3>Patient {latestScreening.patientId}</h3>
                  <span className="spotlight-meta">
                    {latestScreening.patientName} • {latestScreening.eye} • {latestScreening.date} at {latestScreening.time}
                  </span>
                </div>
                <SeverityBadge classId={latestScreening.classId} size="lg" />
              </div>

              <div className="spotlight-body">
                <div className="spotlight-image-pair">
                  <div className="spot-img-wrap">
                    <img src={latestScreening.image} alt="Fundus Image" />
                    <span className="spot-img-tag">Digital Fundus</span>
                  </div>
                  <div className="spot-img-wrap">
                    <img src={latestScreening.gradcamImage} alt="Grad-CAM Heatmap" />
                    <span className="spot-img-tag gradcam">Grad-CAM Heatmap</span>
                  </div>
                </div>

                <div className="spotlight-details">
                  <div className="spot-detail-row">
                    <span className="sd-label">Model Classification:</span>
                    <strong className="sd-val">{latestScreening.className} ({latestScreening.confidence}%)</strong>
                  </div>
                  <div className="spot-detail-row">
                    <span className="sd-label">Target Convolutional Layer:</span>
                    <span className="sd-val code-font">{latestScreening.gradcamLayer}</span>
                  </div>
                  <p className="spot-findings">
                    {latestScreening.findings}
                  </p>
                </div>
              </div>

              <div className="spotlight-footer">
                <button
                  type="button"
                  className="spot-btn primary"
                  onClick={() => handleViewResult(latestScreening)}
                >
                  <Eye size={16} />
                  <span>View Full Analysis</span>
                </button>
                <button
                  type="button"
                  className="spot-btn secondary"
                  onClick={(e) => handleOpenReport(latestScreening, e)}
                >
                  <FileText size={16} />
                  <span>Clinical Report</span>
                </button>
                <Link to="/gradcam-studio" className="spot-btn secondary">
                  <Sparkles size={16} />
                  <span>Explain Heatmap</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="empty-dashboard-card">
              <ScanEye size={36} className="text-muted" />
              <h3>No screening conducted yet</h3>
              <p>Upload a retinal fundus photograph to see instant predictions.</p>
              <Link to="/screening" className="primary-btn">Start First Screening</Link>
            </div>
          )}

          {/* DR Severity Stratification Progress Bars */}
          <div className="severity-distribution-card">
            <div className="card-top-title">
              <div>
                <h4>ICDR Severity Breakdown</h4>
                <p>Distribution of all recorded screenings across the 5 clinical stages</p>
              </div>
              <span className="dist-total">{totalScreenings} Screenings</span>
            </div>

            <div className="dist-list">
              {classCounts.map((cls) => {
                const pct = totalScreenings > 0
                  ? ((cls.count / totalScreenings) * 100).toFixed(0)
                  : 0;
                return (
                  <div key={cls.id} className="dist-row">
                    <div className="dist-label-col">
                      <span className="dist-dot" style={{ backgroundColor: cls.color }} />
                      <span className="dist-name">{cls.name}</span>
                      <span className="dist-short">({cls.shortName})</span>
                    </div>

                    <div className="dist-bar-track">
                      <div
                        className="dist-bar-fill"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: cls.color
                        }}
                      />
                    </div>

                    <div className="dist-count-col">
                      <span className="dist-count">{cls.count}</span>
                      <span className="dist-pct">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed & Quick Links */}
        <div className="dashboard-right-col">
          <div className="recent-activity-card">
            <div className="card-top-title">
              <div>
                <h4>Recent Screening Activity</h4>
                <p>Latest patient examinations in this workstation</p>
              </div>
              <Link to="/history" className="view-all-link">
                <span>View all</span>
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="activity-list">
              {screenings.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="activity-item-row"
                  onClick={() => handleViewResult(item)}
                >
                  <div className="activity-thumb">
                    <img src={item.image} alt="Fundus" />
                  </div>

                  <div className="activity-info">
                    <div className="act-top">
                      <strong className="patient-code">{item.patientId}</strong>
                      <span className="act-eye">{item.eye.includes("OD") ? "OD (Right)" : "OS (Left)"}</span>
                    </div>
                    <span className="act-name">{item.patientName}</span>
                    <div className="act-date">
                      <Clock size={12} />
                      <span>{item.date} • {item.time}</span>
                    </div>
                  </div>

                  <div className="activity-action-col">
                    <SeverityBadge classId={item.classId} size="sm" />
                    <span className="act-conf">{item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="activity-footer">
              <Link to="/history" className="full-history-btn">
                <History size={16} />
                <span>Open Full Screening History ({totalScreenings} Records)</span>
              </Link>
            </div>
          </div>

          {/* Helpful Guidelines Card */}
          <div className="clinical-tips-card">
            <div className="tips-header">
              <ShieldCheck size={18} className="tips-icon" />
              <h4>DenseNet121 Imaging Guidelines</h4>
            </div>
            <ul className="tips-list">
              <li>Use 45° or 50° macula-centered digital fundus photography.</li>
              <li>Ensure clear illumination without severe corneal reflex reflections.</li>
              <li>Grad-CAM heatmaps localize microaneurysms, blot hemorrhages, and lipid hard exudates.</li>
              <li>Clinical referral is advised for any patient scoring Stage 2 or above.</li>
            </ul>
            <Link to="/how-it-works" className="tips-more-link">
              <span>Read Full Screening Protocol</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Clinical Report Preview Modal */}
      {selectedReportScreening && (
        <ReportModal
          screening={selectedReportScreening}
          isOpen={!!selectedReportScreening}
          onClose={() => setSelectedReportScreening(null)}
        />
      )}
    </div>
  );
}
