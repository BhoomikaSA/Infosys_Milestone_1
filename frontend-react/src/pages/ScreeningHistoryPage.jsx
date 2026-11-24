
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScreening } from "../context/ScreeningContext";
import { DR_CLASSES } from "../data/clinicalData";
import { apiRequest, API_BASE_URL } from "../services/api";
import SeverityBadge from "../components/SeverityBadge";
import ReportModal from "../components/ReportModal";

import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  ScanEye,
  AlertCircle
} from "lucide-react";

function mapHistoryRecord(record) {
  const classId = Number(record.class_id);
  const drMeta = DR_CLASSES[classId] || DR_CLASSES[0];

  const createdAt = new Date(record.created_at);

  return {
    id: String(record.id),

    classId,
    className: record.prediction,
    confidence: Number(record.confidence),

    image: `${API_BASE_URL}${record.original_image}`,
    gradcamImage: `${API_BASE_URL}${record.gradcam_image}`,

    date: createdAt.toLocaleDateString(),
    time: createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),

    createdAt: createdAt.getTime(),

    patientId: "Not recorded",
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
}

export default function ScreeningHistoryPage() {
  const { setCurrentScreening } = useScreening();
  const navigate = useNavigate();

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedReportScreening, setSelectedReportScreening] =
    useState(null);

  // Fetch actual screening history from the backend
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/history/");

      if (!Array.isArray(response)) {
        throw new Error("Invalid screening history response.");
      }

      const mappedRecords = response.map(mapHistoryRecord);

      setScreenings(mappedRecords);
    } catch (err) {
      setError(err.message || "Unable to load screening history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Search, filter and sort records
  const filteredScreenings = useMemo(() => {
    return screenings
      .filter((item) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch =
          item.id.toLowerCase().includes(query) ||
          item.className.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === "all" ||
          item.classId === parseInt(selectedCategory, 10);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return b.createdAt - a.createdAt;
        }

        if (sortBy === "date-asc") {
          return a.createdAt - b.createdAt;
        }

        if (sortBy === "conf-desc") {
          return b.confidence - a.confidence;
        }

        if (sortBy === "sev-desc") {
          return b.classId - a.classId;
        }

        return 0;
      });
  }, [screenings, searchQuery, selectedCategory, sortBy]);

  // Open a previous screening result
  const handleView = (item) => {
    setCurrentScreening(item);
    navigate(`/results/${item.id}`);
  };

  // Export actual backend records to CSV
  const handleExportCSV = () => {
    const headers = [
      "Screening ID",
      "Date",
      "Time",
      "Prediction",
      "Class ID",
      "Model Output Score (%)"
    ];

    const rows = filteredScreenings.map((item) => [
      item.id,
      item.date,
      item.time,
      item.className,
      item.classId,
      item.confidence
    ]);

    const csvContent = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `retinavision_history_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="history-page-wrap">

      {/* Page Header */}
      <div className="history-header-bar">
        <div>
          <span className="page-kicker">AUDIT TRAIL & LOGS</span>

          <h1>Retinal Screening History</h1>

          <p>
            Review previous diabetic retinopathy classifications,
            model output scores, and Grad-CAM activations.
          </p>
        </div>

        <div className="history-header-actions">
          <button
            type="button"
            className="action-btn secondary"
            onClick={handleExportCSV}
            disabled={filteredScreenings.length === 0}
            title="Download CSV Table"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            className="action-btn secondary"
            onClick={loadHistory}
            disabled={loading}
            title="Refresh History"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>

          <Link to="/screening" className="action-btn primary">
            <ScanEye size={16} />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="empty-history-card">
          <AlertCircle size={32} />
          <h3>Unable to load screening history</h3>
          <p>{error}</p>

          <button
            type="button"
            className="secondary-btn"
            onClick={loadHistory}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {!error && (
        <>
          {/* Search and Filters */}
          <div className="history-controls-card">
            <div className="search-input-box">
              <Search size={18} className="search-icon" />

              <input
                type="text"
                placeholder="Search by Screening ID or DR Prediction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="filters-row">
              <div className="filter-item">
                <Filter size={15} />
                <label>DR Severity:</label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="custom-select"
                >
                  <option value="all">All Stages (0–4)</option>

                  {DR_CLASSES.map((c) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.shortName}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <ArrowUpDown size={15} />
                <label>Sort By:</label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="custom-select"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="conf-desc">Highest Score</option>
                  <option value="sev-desc">Highest Severity Stage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="empty-history-card">
              <RefreshCw size={32} />
              <h3>Loading screening records...</h3>
              <p>Retrieving your records from the database.</p>
            </div>
          ) : filteredScreenings.length > 0 ? (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Fundus Photo</th>
                    <th>Screening Details</th>
                    <th>Exam Date & Time</th>
                    <th>Eye</th>
                    <th>DenseNet121 Prediction</th>
                    <th>Model Score</th>
                    <th>Grad-CAM Saliency</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredScreenings.map((item) => (
                    <tr
                      key={item.id}
                      className="history-row"
                      onClick={() => handleView(item)}
                    >
                      <td className="fundus-cell">
                        <div className="thumb-container">
                          <img
                            src={item.image}
                            alt="Original retinal fundus"
                            className="table-thumb"
                          />

                          <img
                            src={item.gradcamImage}
                            alt="Grad-CAM visualization"
                            className="table-thumb-overlay"
                          />
                        </div>
                      </td>

                      <td className="patient-cell">
                        <strong className="pid-badge">
                          Screening #{item.id}
                        </strong>

                        <span className="pname-text">
                          Patient details not stored
                        </span>
                      </td>

                      <td className="date-cell">
                        <div className="date-block">
                          <Calendar size={13} />
                          <span>{item.date}</span>
                        </div>

                        <div className="time-block">
                          <Clock size={12} />
                          <span>{item.time}</span>
                        </div>
                      </td>

                      <td className="eye-cell">
                        <span className="eye-pill">
                          Not recorded
                        </span>
                      </td>

                      <td className="classification-cell">
                        <SeverityBadge
                          classId={item.classId}
                          size="md"
                        />
                      </td>

                      <td className="conf-cell">
                        <span className="conf-percent-strong">
                          {item.confidence.toFixed(2)}%
                        </span>
                      </td>

                      <td className="gradcam-cell">
                        <span className="gradcam-layer-pill">
                          <Sparkles size={12} />
                          <span>conv5</span>
                        </span>
                      </td>

                      <td
                        className="actions-cell text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="row-action-btns">
                          <button
                            type="button"
                            className="btn-icon-action"
                            onClick={() => handleView(item)}
                            title="View Full Results"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn-icon-action"
                            onClick={() =>
                              setSelectedReportScreening(item)
                            }
                            title="Generate Clinical Report"
                          >
                            <FileText size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="history-footer-summary">
                <span>
                  Showing {filteredScreenings.length} of{" "}
                  {screenings.length} screening records
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-history-card">
              <History size={42} className="text-muted" />

              <h3>
                {screenings.length === 0
                  ? "No screening records yet"
                  : "No screening records match your criteria"}
              </h3>

              <p>
                {screenings.length === 0
                  ? "Your completed screenings will appear here."
                  : "Try clearing your search query or adjusting your severity filter."}
              </p>

              <div className="empty-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </button>

                <Link to="/screening" className="primary-btn">
                  Perform New Screening
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Clinical Report Modal */}
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
