
import React, { createContext, useContext, useState } from "react";
import { DR_CLASSES } from "../data/clinicalData";
import { apiRequest, API_BASE_URL } from "../services/api";

const ScreeningContext = createContext(null);

export function ScreeningProvider({ children }) {
  const [screenings, setScreenings] = useState([]);
  const [currentScreening, setCurrentScreening] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);

  const setPendingImage = (file, dataUrl) => {
    setUploadedFile(file);
    setImagePreviewUrl(dataUrl);

    if (file) {
      setImageMeta({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type,
        dimensions: "384 × 384 px (Target)",
        uploadedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      });
    } else {
      setImageMeta(null);
    }
  };

  const clearPendingImage = () => {
    setUploadedFile(null);
    setImagePreviewUrl(null);
    setImageMeta(null);
  };

  const runScreeningAnalysis = async ({
    patientId = "",
    patientName = "Anonymous Patient",
    patientAge = 54,
    eye = "Right Eye (OD)",
    notes = ""
  }) => {
    if (!uploadedFile) {
      throw new Error("Please select a retinal image first.");
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const response = await apiRequest("/screenings/predict", {
      method: "POST",
      body: formData
    });

    const classId = Number(response.class_id);
    const drMeta = DR_CLASSES[classId] || DR_CLASSES[0];

    const newRecord = {
      id: String(response.screening_id),
      patientId,
      patientName: patientName || "Anonymous Patient",
      patientAge: Number(patientAge) || null,
      eye,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),

      image: `${API_BASE_URL}${response.original_image}`,
      gradcamImage: `${API_BASE_URL}${response.gradcam_image}`,

      classId,
      className: response.prediction,
      confidence: Number(response.confidence),

      // The backend currently returns only the predicted class score.
      // Do not invent probabilities for the other four classes.
      probabilities: null,

      gradcamLayer: "conv5_block16_2_conv",
      findings: drMeta.clinicalFindings,
      recommendation: drMeta.recommendation,
      notes: notes || "",
      model: "DenseNet121"
    };

    setScreenings((previous) => [newRecord, ...previous]);
    setCurrentScreening(newRecord);

    clearPendingImage();

    return newRecord;
  };

  const getScreeningById = (id) => {
    return screenings.find(
      (screening) => String(screening.id) === String(id)
    ) || null;
  };

  const deleteScreening = (id) => {
    setScreenings((previous) =>
      previous.filter((screening) => String(screening.id) !== String(id))
    );

    if (String(currentScreening?.id) === String(id)) {
      setCurrentScreening(null);
    }
  };

  const resetToDefaultHistory = () => {
    setScreenings([]);
    setCurrentScreening(null);
  };

  return (
    <ScreeningContext.Provider
      value={{
        screenings,
        currentScreening,
        setCurrentScreening,
        uploadedFile,
        imagePreviewUrl,
        imageMeta,
        setPendingImage,
        clearPendingImage,
        runScreeningAnalysis,
        getScreeningById,
        deleteScreening,
        resetToDefaultHistory
      }}
    >
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  const context = useContext(ScreeningContext);

  if (!context) {
    throw new Error("useScreening must be used within a ScreeningProvider");
  }

  return context;
}
