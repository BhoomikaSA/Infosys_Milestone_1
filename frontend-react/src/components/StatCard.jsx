import React from "react";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "var(--blue)",
  bgTint = "rgba(104, 170, 255, 0.1)"
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon-wrap" style={{ background: bgTint, color }}>
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <div className="stat-trend">
            <TrendingUp size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="stat-body">
        <span className="stat-title">{title}</span>
        <div className="stat-value">{value}</div>
        {subtitle && <p className="stat-sub">{subtitle}</p>}
      </div>

      <div className="stat-glow" style={{ background: color }} />
    </div>
  );
}
