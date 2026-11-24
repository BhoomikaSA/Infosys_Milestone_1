import React from "react";
import { DR_CLASSES } from "../data/clinicalData";
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldAlert, AlertOctagon } from "lucide-react";

const ICONS = [
  CheckCircle2,  // 0 - No DR
  AlertCircle,   // 1 - Mild
  AlertTriangle, // 2 - Moderate
  ShieldAlert,   // 3 - Severe
  AlertOctagon   // 4 - Proliferative DR
];

export default function SeverityBadge({ classId, size = "md", showIcon = true, customLabel }) {
  const meta = DR_CLASSES[classId] || DR_CLASSES[0];
  const Icon = ICONS[classId] || CheckCircle2;

  const sizeClasses = {
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg"
  }[size] || "badge-md";

  return (
    <span
      className={`severity-badge ${sizeClasses}`}
      style={{
        backgroundColor: meta.bgColor,
        borderColor: meta.borderColor,
        color: meta.color
      }}
    >
      {showIcon && <Icon size={size === "sm" ? 13 : size === "lg" ? 18 : 15} />}
      <span className="badge-text">{customLabel || meta.name}</span>
      {meta.shortName && size !== "sm" && (
        <span className="badge-stage" style={{ color: meta.color }}>
          ({meta.shortName})
        </span>
      )}
    </span>
  );
}
