import React, { useState } from "react";
import {
  Layers,
  Columns,
  Sliders,
  Maximize2,
  Info,
  Sparkles,
  Download,
  Eye,
  CheckCircle2
} from "lucide-react";

export default function GradCamViewer({
  originalImage = "/sample-retina.png",
  gradcamImage = "/sample-gradcam.jpg",
  layerName = "conv5_block16_2_conv",
  predictedClass = "Moderate",
  confidence = 94.6,
  title = "Grad-CAM Spatial Explainability"
}) {
  const [viewMode, setViewMode] = useState("overlay"); // "overlay" | "side-by-side" | "split"
  const [overlayOpacity, setOverlayOpacity] = useState(0.65);
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (e) => {
    if (!isDragging && e.type !== "click") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSplitPos(percent);
  };

  return (
    <div className="gradcam-viewer-card">
      <div className="gradcam-header">
        <div className="gradcam-title-col">
          <div className="gradcam-tag">
            <Sparkles size={14} />
            <span>EXPLAINABLE AI ENGINE</span>
          </div>
          <h3>{title}</h3>
          <p>
            DenseNet121 convolutional gradient activation mapping for class:{" "}
            <strong>{predictedClass} ({confidence}%)</strong>
          </p>
        </div>

        <div className="gradcam-mode-selector">
          <button
            type="button"
            className={`mode-btn ${viewMode === "overlay" ? "active" : ""}`}
            onClick={() => setViewMode("overlay")}
          >
            <Layers size={15} />
            <span>Alpha Overlay</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === "split" ? "active" : ""}`}
            onClick={() => setViewMode("split")}
          >
            <Sliders size={15} />
            <span>Split Slider</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === "side-by-side" ? "active" : ""}`}
            onClick={() => setViewMode("side-by-side")}
          >
            <Columns size={15} />
            <span>Side by Side</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="gradcam-canvas-area">
        {viewMode === "overlay" && (
          <div className="overlay-stage">
            <div className="image-frame">
              <img
                src={originalImage}
                alt="Original Fundus Photography"
                className="base-fundus-img"
              />
              <img
                src={gradcamImage}
                alt="Grad-CAM Activation Heatmap"
                className="overlay-gradcam-img"
                style={{ opacity: overlayOpacity }}
              />
              <div className="canvas-badge top-left">
                <span>Fundus + Grad-CAM Heatmap ({Math.round(overlayOpacity * 100)}%)</span>
              </div>
              <div className="canvas-badge bottom-right">
                <span>DenseNet121 Target: {layerName}</span>
              </div>
            </div>

            <div className="opacity-slider-panel">
              <div className="slider-label">
                <span>Original Fundus (0%)</span>
                <span className="current-value">Heatmap Blend: {Math.round(overlayOpacity * 100)}%</span>
                <span>Full Activation (100%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                className="custom-range"
              />
            </div>
          </div>
        )}

        {viewMode === "split" && (
          <div className="split-stage">
            <div
              className="split-container"
              onMouseMove={handleSliderMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onClick={handleSliderMove}
            >
              <img
                src={originalImage}
                alt="Original Fundus"
                className="split-img-base"
              />
              <div
                className="split-clip-layer"
                style={{ clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)` }}
              >
                <img
                  src={gradcamImage}
                  alt="Grad-CAM"
                  className="split-img-overlay"
                />
              </div>

              {/* Divider Handle */}
              <div
                className="split-divider-line"
                style={{ left: `${splitPos}%` }}
              >
                <div className="split-handle">
                  <Sliders size={16} />
                </div>
              </div>

              <div className="canvas-badge top-left">
                <span>◀ Original Fundus</span>
              </div>
              <div className="canvas-badge top-right">
                <span>Grad-CAM Activation ▶</span>
              </div>
            </div>
            <p className="split-hint">Drag cursor horizontally across the retinal canvas to inspect focal features</p>
          </div>
        )}

        {viewMode === "side-by-side" && (
          <div className="side-by-side-stage">
            <div className="stage-card">
              <div className="card-top-header">
                <span className="card-tag">RAW INPUT</span>
                <h4>Original Retinal Fundus</h4>
              </div>
              <div className="image-frame mini">
                <img src={originalImage} alt="Raw Fundus" />
                <div className="canvas-badge bottom-left">RGB Color Fundus (384×384)</div>
              </div>
              <p className="card-caption">
                Raw digital fundus photograph capturing the fovea, optic disc, and macular vascular branches.
              </p>
            </div>

            <div className="stage-card">
              <div className="card-top-header">
                <span className="card-tag highlight">GRAD-CAM ATTENTION</span>
                <h4>DenseNet121 Saliency Map</h4>
              </div>
              <div className="image-frame mini">
                <img src={gradcamImage} alt="Grad-CAM Map" />
                <div className="canvas-badge bottom-left">Heatmap: {layerName}</div>
              </div>
              <p className="card-caption">
                Gradient-weighted class activation mapping (JET color spectrum) showing high-decision attention areas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grad-CAM Color Legend & Clinical Explanation */}
      <div className="gradcam-legend-bar">
        <div className="legend-title">
          <Info size={16} />
          <span>Activation Scale:</span>
        </div>
        <div className="legend-spectrum-track">
          <div className="spectrum-gradient" />
          <div className="spectrum-labels">
            <span>Low (Background)</span>
            <span>Moderate Context</span>
            <span>Critical Decision Pathology (High Weight)</span>
          </div>
        </div>
      </div>

      {/* Target Layer Details & Methodology */}
      <div className="gradcam-footer-details">
        <div className="detail-item">
          <span className="detail-key">Backbone Architecture:</span>
          <span className="detail-val">DenseNet121 (Dense Convolutional Network)</span>
        </div>
        <div className="detail-item">
          <span className="detail-key">Extracted Layer:</span>
          <span className="detail-val code-font">{layerName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-key">Colormap Representation:</span>
          <span className="detail-val">OpenCV JET Colormap (0.0 to 1.0 Normalized)</span>
        </div>
        <div className="detail-item">
          <span className="detail-key">Clinical Focus:</span>
          <span className="detail-val">Microaneurysms, Hard Exudates, Retinal Hemorrhages</span>
        </div>
      </div>
    </div>
  );
}
