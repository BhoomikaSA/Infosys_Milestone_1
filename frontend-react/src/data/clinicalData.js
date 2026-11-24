// Clinical standards, 5-stage Diabetic Retinopathy classifications, and default records

export const DR_CLASSES = [
  {
    id: 0,
    name: "No DR",
    shortName: "Stage 0",
    severity: "Normal",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    riskLevel: "Low Risk",
    description: "No clinical abnormalities, microaneurysms, or hemorrhages detected.",
    clinicalFindings: "Normal optic disc, healthy foveal avascular zone, intact retinal vasculature without microvascular lesions.",
    recommendation: "Routine annual diabetic eye screening. Maintain standard glycemic and blood pressure control."
  },
  {
    id: 1,
    name: "Mild",
    shortName: "Stage 1",
    severity: "Mild NPDR",
    color: "#38bdf8",
    bgColor: "rgba(56, 189, 248, 0.12)",
    borderColor: "rgba(56, 189, 248, 0.3)",
    riskLevel: "Mild Risk",
    description: "Presence of isolated microaneurysms only. Early non-proliferative changes.",
    clinicalFindings: "Isolated tiny red capillary outpouchings (microaneurysms) predominantly in the macula or mid-periphery.",
    recommendation: "Follow-up comprehensive dilated retinal examination in 9–12 months. Optimize diabetes metabolic parameters."
  },
  {
    id: 2,
    name: "Moderate",
    shortName: "Stage 2",
    severity: "Moderate NPDR",
    color: "#fbbf24",
    bgColor: "rgba(251, 191, 36, 0.12)",
    borderColor: "rgba(251, 191, 36, 0.3)",
    riskLevel: "Moderate Risk",
    description: "More than microaneurysms: dot-and-blot hemorrhages, venous beading, or hard exudates present.",
    clinicalFindings: "Multiple intraretinal hemorrhages, lipid-rich hard exudates forming circinate rings, occasional cotton-wool spots.",
    recommendation: "Referral for ophthalmological evaluation within 3–6 months. Evaluate macular thickness via OCT."
  },
  {
    id: 3,
    name: "Severe",
    shortName: "Stage 3",
    severity: "Severe NPDR",
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.12)",
    borderColor: "rgba(249, 115, 22, 0.3)",
    riskLevel: "High Risk",
    description: "Extensive retinal ischemia fulfilling the 4-2-1 international clinical grading rule.",
    clinicalFindings: "Severe hemorrhages in 4 quadrants, definite venous beading in 2+ quadrants, or IRMA in 1+ quadrant.",
    recommendation: "Urgent referral to retinal specialist within 2–4 weeks. High risk of rapid progression to proliferative retinopathy."
  },
  {
    id: 4,
    name: "Proliferative DR",
    shortName: "Stage 4",
    severity: "PDR",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    riskLevel: "Critical Risk",
    description: "Neovascularization of the disc/retina, vitreous hemorrhage, or fibrovascular proliferation.",
    clinicalFindings: "New abnormal fragile blood vessels (NVD/NVE), preretinal/vitreous hemorrhage, risk of tractional retinal detachment.",
    recommendation: "Immediate referral to vitreoretinal surgeon. Urgent intervention required (Anti-VEGF therapy / Panretinal Photocoagulation)."
  }
];

export const INITIAL_SCREENINGS = [
  {
    id: "SCN-2026-8841",
    patientId: "PT-9042",
    patientName: "Eleanor Vance",
    patientAge: 58,
    eye: "Right Eye (OD)",
    date: "2026-11-21",
    time: "10:45 AM",
    image: "/sample-retina.png",
    gradcamImage: "/sample-gradcam.jpg",
    classId: 2,
    className: "Moderate",
    confidence: 94.6,
    probabilities: [
      { classId: 0, className: "No DR", probability: 1.2 },
      { classId: 1, className: "Mild", probability: 2.8 },
      { classId: 2, className: "Moderate", probability: 94.6 },
      { classId: 3, className: "Severe", probability: 1.1 },
      { classId: 4, className: "Proliferative DR", probability: 0.3 }
    ],
    gradcamLayer: "conv5_block16_2_conv",
    findings: "DenseNet121 detected focal capillary dilations and scattered hard exudates in the superior-temporal arcade. Grad-CAM localized high activation weights over lipid clusters.",
    recommendation: "Schedule dilated fundoscopy and macular optical coherence tomography (OCT) within 90 days."
  },
  {
    id: "SCN-2026-8839",
    patientId: "PT-7719",
    patientName: "Robert Sterling",
    patientAge: 64,
    eye: "Left Eye (OS)",
    date: "2026-11-20",
    time: "03:15 PM",
    image: "/retina-hero.png",
    gradcamImage: "/sample-gradcam.jpg",
    classId: 0,
    className: "No DR",
    confidence: 98.2,
    probabilities: [
      { classId: 0, className: "No DR", probability: 98.2 },
      { classId: 1, className: "Mild", probability: 1.3 },
      { classId: 2, className: "Moderate", probability: 0.3 },
      { classId: 3, className: "Severe", probability: 0.1 },
      { classId: 4, className: "Proliferative DR", probability: 0.1 }
    ],
    gradcamLayer: "conv5_block16_2_conv",
    findings: "Uniform background luminescence, clear optic disc margins, sharp foveal depression with no vascular leakage or microaneurysms detected.",
    recommendation: "Routine annual diabetic retinal screening."
  },
  {
    id: "SCN-2026-8824",
    patientId: "PT-6104",
    patientName: "Amina Al-Mansoor",
    patientAge: 51,
    eye: "Right Eye (OD)",
    date: "2026-11-19",
    time: "11:30 AM",
    image: "/sample-retina.png",
    gradcamImage: "/sample-gradcam.jpg",
    classId: 3,
    className: "Severe",
    confidence: 91.8,
    probabilities: [
      { classId: 0, className: "No DR", probability: 0.2 },
      { classId: 1, className: "Mild", probability: 0.9 },
      { classId: 2, className: "Moderate", probability: 5.4 },
      { classId: 3, className: "Severe", probability: 91.8 },
      { classId: 4, className: "Proliferative DR", probability: 1.7 }
    ],
    gradcamLayer: "conv5_block16_2_conv",
    findings: "Multiple deep blot hemorrhages spanning all 4 quadrants with marked venous caliber variation and localized microvascular abnormalities.",
    recommendation: "Expedited retinal specialist consultation within 14–21 days for treatment planning."
  },
  {
    id: "SCN-2026-8805",
    patientId: "PT-4230",
    patientName: "Marcus Chen",
    patientAge: 46,
    eye: "Left Eye (OS)",
    date: "2026-11-17",
    time: "09:10 AM",
    image: "/retina-hero.png",
    gradcamImage: "/sample-gradcam.jpg",
    classId: 1,
    className: "Mild",
    confidence: 89.4,
    probabilities: [
      { classId: 0, className: "No DR", probability: 7.2 },
      { classId: 1, className: "Mild", probability: 89.4 },
      { classId: 2, className: "Moderate", probability: 2.7 },
      { classId: 3, className: "Severe", probability: 0.5 },
      { classId: 4, className: "Proliferative DR", probability: 0.2 }
    ],
    gradcamLayer: "conv5_block16_2_conv",
    findings: "Sparse microaneurysms detected in the temporal foveal periphery. No signs of macular edema or exudative deposits.",
    recommendation: "Follow-up retinal photographic examination in 9 months."
  }
];

export const DEMO_USER = {
  name: "Dr. Sarah Jenkins",
  title: "Lead Ophthalmologist & Clinical AI Fellow",
  email: "dr.jenkins@retinavision-health.org",
  institution: "Vision Sciences Institute & Medical Center",
  license: "MD-OPT-89420-US",
  department: "Retina & Vitreous Subspecialty Clinic",
  avatar: "SJ",
  joined: "March 2024",
  stats: {
    totalScreenings: 348,
    confirmedCases: 112,
    avgConfidence: 93.8,
    savedHours: 85
  }
};
