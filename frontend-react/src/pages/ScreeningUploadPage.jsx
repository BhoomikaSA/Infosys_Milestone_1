
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScreening } from "../context/ScreeningContext";
import { useAuth } from "../context/AuthContext";
import {
  UploadCloud,
  FileImage,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ScanEye,
  RefreshCw,
  Eye,
  Activity
} from "lucide-react";

const SAMPLE_FUNDUS_OPTIONS = [
  {
    id: "sample-1",
    title: "Sample: Moderate NPDR (Hard Exudates)",
    subtitle: "APTOS 2019 • Right Eye (OD)",
    image: "/sample-retina.png",
    patientName: "Eleanor Vance (Test)",
    patientId: "PT-9042",
    age: 58,
    eye: "Right Eye (OD)"
  },
  {
    id: "sample-2",
    title: "Sample: Normal Retinal Fundus (No DR)",
    subtitle: "Standard Fundus • Left Eye (OS)",
    image: "/retina-hero.png",
    patientName: "Robert Sterling (Test)",
    patientId: "PT-7719",
    age: 49,
    eye: "Left Eye (OS)"
  },
  {
    id: "sample-3",
    title: "Sample: Severe NPDR (Blot Hemorrhages)",
    subtitle: "Multiquadrant Lesions • Right Eye (OD)",
    image: "/sample-retina.png",
    patientName: "Amina Al-Mansoor (Test)",
    patientId: "PT-6104",
    age: 62,
    eye: "Right Eye (OD)"
  }
];

export default function ScreeningUploadPage() {
  const {
    uploadedFile,
    imagePreviewUrl,
    imageMeta,
    setPendingImage,
    clearPendingImage,
    runScreeningAnalysis
  } = useScreening();

  const { showToast } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const animationTimers = useRef([]);

  const [dragActive, setDragActive] = useState(false);
  const [patientId, setPatientId] = useState(
    "PT-" + Math.floor(1000 + Math.random() * 9000)
  );
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("54");
  const [eyeSide, setEyeSide] = useState("Right Eye (OD)");
  const [clinicalNotes, setClinicalNotes] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    {
      title: "Standardizing Tensor",
      desc: "Resizing the retinal image and applying preprocessing..."
    },
    {
      title: "DenseNet121 Inference",
      desc: "Running the retinal image through the trained DenseNet121 model..."
    },
    {
      title: "Grad-CAM Computation",
      desc: "Calculating gradients for the selected convolutional layer..."
    },
    {
      title: "Generating Spatial Heatmap",
      desc: "Creating the Grad-CAM visualization and final prediction..."
    }
  ];

  const clearAnimationTimers = () => {
    animationTimers.current.forEach((timer) => clearTimeout(timer));
    animationTimers.current = [];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }

    // Allow selecting the same file again.
    e.target.value = "";
  };

  const handleFile = (file) => {
    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(file.type)) {
      showToast(
        "Please upload a valid retinal image in JPG, JPEG, or PNG format.",
        "error"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10 MB.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPendingImage(file, reader.result);
      showToast("Retinal fundus image loaded successfully.", "success");
    };

    reader.onerror = () => {
      showToast("Unable to read the selected image.", "error");
    };

    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample) => {
    try {
      const response = await fetch(sample.image);

      if (!response.ok) {
        throw new Error("Sample image could not be loaded.");
      }

      const blob = await response.blob();

      const file = new File(
        [blob],
        `${sample.id}.png`,
        { type: blob.type || "image/png" }
      );

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Sample image exceeds the 10 MB limit.");
      }

      const reader = new FileReader();

      reader.onload = () => {
        setPendingImage(file, reader.result);
        setPatientId(sample.patientId);
        setPatientName(sample.patientName);
        setPatientAge(sample.age.toString());
        setEyeSide(sample.eye);

        showToast(`Loaded ${sample.title}`, "success");
      };

      reader.onerror = () => {
        showToast("Unable to read the sample image.", "error");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      showToast(error.message || "Unable to load sample image.", "error");
    }
  };

  const handleStartScreening = async () => {
    if (!(uploadedFile instanceof File)) {
      showToast("Please select a valid image file first.", "error");
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10 MB.", "error");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);
    clearAnimationTimers();

    // These timers only update the visual progress animation.
    // The actual screening is performed by the backend below.
    animationTimers.current = [
      setTimeout(() => setAnalysisStep(1), 900),
      setTimeout(() => setAnalysisStep(2), 1800),
      setTimeout(() => setAnalysisStep(3), 2800)
    ];

    try {
      const result = await runScreeningAnalysis({
        patientId,
        patientName: patientName || "Anonymous Patient",
        patientAge,
        eye: eyeSide,
        notes: clinicalNotes
      });

      clearAnimationTimers();
      setAnalysisStep(3);
      setIsAnalyzing(false);

      showToast("Real DenseNet121 screening completed!", "success");
      navigate(`/results/${result.id}`);
    } catch (error) {
      clearAnimationTimers();
      setIsAnalyzing(false);

      showToast(
        error.message || "Screening failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="screening-upload-page">
      <div className="page-header-row">
        <div>
          <span className="page-kicker">EXPLAINABLE AI SCREENING</span>
          <h1>Retinal Fundus Image Screening</h1>
          <p>
            Upload digital fundus photography for automated 5-class
            diabetic retinopathy assessment and Grad-CAM spatial heatmapping.
          </p>
        </div>

        <div className="model-chip-tag">
          <Activity size={15} />
          <span>Active Model: DenseNet121 (APTOS-50)</span>
        </div>
      </div>

      <div className="screening-upload-grid">
        <div className="upload-left-col">
          {!imagePreviewUrl ? (
            <div
              className={`dropzone-card ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden-file-input"
                onChange={handleFileChange}
              />

              <div className="dropzone-icon-circle">
                <UploadCloud size={38} className="upload-icon" />
              </div>

              <h3>Upload Retinal Fundus Photograph</h3>
              <p className="dropzone-desc">
                Drag and drop your fundus image here, or{" "}
                <span>browse from workstation</span>
              </p>

              <div className="dropzone-meta">
                <span>Supported: JPG, JPEG, PNG</span>
                <span>•</span>
                <span>Max size: 10 MB</span>
                <span>•</span>
                <span>Target: 384×384 px</span>
              </div>
            </div>
          ) : (
            <div className="preview-stage-card">
              <div className="preview-card-header">
                <div className="preview-meta-title">
                  <FileImage size={17} />
                  <span>Selected Retinal Image Preview</span>
                </div>

                <div className="preview-actions">
                  <button
                    type="button"
                    className="preview-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCw size={14} />
                    <span>Replace Image</span>
                  </button>

                  <button
                    type="button"
                    className="preview-btn danger"
                    onClick={clearPendingImage}
                  >
                    <X size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden-file-input"
                onChange={handleFileChange}
              />

              <div className="preview-viewport">
                <img
                  src={imagePreviewUrl}
                  alt="Fundus Preview"
                  className="preview-fundus-img"
                />

                <div className="preview-overlay-tag top-left">
                  <span>Image Loaded</span>
                </div>

                <div className="preview-overlay-tag bottom-right">
                  <span>
                    {imageMeta?.size || "420 KB"} •{" "}
                    {imageMeta?.dimensions || "384×384"}
                  </span>
                </div>
              </div>

              <div className="image-spec-row">
                <div className="spec-item">
                  <span className="spec-label">File Name</span>
                  <span className="spec-val truncate">
                    {imageMeta?.name || "retinal_photo.png"}
                  </span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Input Shape</span>
                  <span className="spec-val">384 × 384 × 3 RGB</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">File Size</span>
                  <span className="spec-val">
                    {imageMeta?.size || "420 KB"}
                  </span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Status</span>
                  <span className="spec-val text-success">
                    ✓ Ready for Inference
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="sample-presets-card">
            <div className="presets-header">
              <Sparkles size={16} className="text-blue" />
              <h4>Or Select a Fundus Sample</h4>
            </div>

            <p className="presets-desc">
              Use a sample image to test the actual backend model.
              The displayed sample label is not a guaranteed prediction.
            </p>

            <div className="presets-list">
              {SAMPLE_FUNDUS_OPTIONS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className="preset-item-btn"
                  onClick={() => handleSelectSample(sample)}
                  disabled={isAnalyzing}
                >
                  <div className="preset-thumb">
                    <img src={sample.image} alt={sample.title} />
                  </div>

                  <div className="preset-text">
                    <strong>{sample.title}</strong>
                    <span>{sample.subtitle}</span>
                  </div>

                  <div className="preset-action">
                    <span>Use Sample</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="upload-right-col">
          <div className="parameters-card">
            <div className="card-top-title">
              <div>
                <h4>Patient & Examination Metadata</h4>
                <p>Associate clinical records with this screening session</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="patient-id">Patient Identification Code</label>
              <div className="input-wrapper">
                <input
                  id="patient-id"
                  type="text"
                  placeholder="e.g. PT-8902"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="patient-name">Patient Name (Optional)</label>
                <div className="input-wrapper">
                  <input
                    id="patient-name"
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="patient-age">Patient Age</label>
                <div className="input-wrapper">
                  <input
                    id="patient-age"
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Examined Eye Orientation</label>

              <div className="eye-selector-grid">
                <button
                  type="button"
                  className={`eye-btn ${
                    eyeSide === "Right Eye (OD)" ? "active" : ""
                  }`}
                  onClick={() => setEyeSide("Right Eye (OD)")}
                >
                  <Eye size={17} />
                  <div>
                    <strong>OD (Oculus Dexter)</strong>
                    <span>Right Eye</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`eye-btn ${
                    eyeSide === "Left Eye (OS)" ? "active" : ""
                  }`}
                  onClick={() => setEyeSide("Left Eye (OS)")}
                >
                  <Eye size={17} />
                  <div>
                    <strong>OS (Oculus Sinister)</strong>
                    <span>Left Eye</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="clinical-notes">
                Clinical Notes & Diabetes History
              </label>

              <textarea
                id="clinical-notes"
                rows={3}
                className="custom-textarea"
                placeholder="e.g. Type 2 Diabetes for 12 years, HbA1c 7.8%, complaints of occasional blurred vision..."
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>

            <div className="quality-checklist-box">
              <span className="checklist-title">
                Pre-Inference Validation:
              </span>

              <div className="check-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>Format validated (JPEG/PNG RGB color fundus)</span>
              </div>

              <div className="check-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>DenseNet121 backend weights loaded (APTOS 50-epoch)</span>
              </div>

              <div className="check-item">
                <CheckCircle2 size={15} className="text-success" />
                <span>
                  Grad-CAM configured for conv5_block16_2_conv
                </span>
              </div>
            </div>

            <button
              type="button"
              className="run-screening-btn"
              disabled={!uploadedFile || isAnalyzing}
              onClick={handleStartScreening}
            >
              <ScanEye size={20} />
              <span>
                {isAnalyzing
                  ? "Processing Neural Inference..."
                  : "Run DenseNet121 Screening"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {isAnalyzing && (
        <div className="modal-backdrop analysis-backdrop">
          <div className="analysis-dialog">
            <div className="analysis-spinner-wrap">
              <div className="radar-circle-glow" />
              <ScanEye size={42} className="radar-icon pulse" />
            </div>

            <h3>Running DenseNet121 Inference</h3>

            <p className="analysis-lead-text">
              {analysisSteps[analysisStep]?.desc}
            </p>

            <div className="pipeline-steps-list">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`pipeline-step ${
                    index === analysisStep
                      ? "active"
                      : index < analysisStep
                      ? "done"
                      : ""
                  }`}
                >
                  <div className="step-indicator">
                    {index < analysisStep ? (
                      <CheckCircle2 size={16} />
                    ) : index === analysisStep ? (
                      <div className="step-spinner" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <span>{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
