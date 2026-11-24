
import React from "react";
import { DR_CLASSES } from "../data/clinicalData";

export default function ClassProbabilityBar({
  probabilities,
  predictedClassId,
  confidence
}) {
  const predictedClass = DR_CLASSES[predictedClassId] || DR_CLASSES[0];

  return (
    <div className="probability-container">
      <div className="prob-header">
        <span className="prob-title">
          DenseNet121 Prediction Output
        </span>
        <span className="prob-subtitle">
          Model-reported score for the predicted class
        </span>
      </div>

      <div className="prob-list">
        <div className="prob-row prob-winner">
          <div className="prob-label-col">
            <span
              className="prob-indicator"
              style={{ backgroundColor: predictedClass.color }}
            />
            <span className="prob-name">
              {predictedClass.name}
            </span>
            <span className="prob-tag">Predicted</span>
          </div>

          <div className="prob-bar-wrapper">
            <div
              className="prob-bar-fill"
              style={{
                width: `${Math.min(Math.max(Number(confidence) || 0, 0), 100)}%`,
                backgroundColor: predictedClass.color,
                boxShadow: `0 0 12px ${predictedClass.color}80`
              }}
            />
          </div>

          <div className="prob-value-col">
            <span className="prob-pct highlight">
              {Number(confidence).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <p className="prob-subtitle">
        This is the score returned by the backend, not a clinically
        validated measure of diagnostic certainty. Other class scores
        are not provided by the current API.
      </p>
    </div>
  );
}
