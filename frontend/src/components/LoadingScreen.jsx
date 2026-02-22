import { useEffect, useState, useRef } from "react";

const STEPS = [
  { icon: "📂", label: "Collecte des données", from: 0,  to: 18 },
  { icon: "👥", label: "Regroupement des tickets par collaborateur", from: 18, to: 40 },
  { icon: "🔥", label: "Création & priorisation des tickets", from: 40, to: 65 },
  { icon: "✉️", label: "Génération des mails automatiques", from: 65, to: 88 },
  { icon: "✅", label: "Finalisation", from: 88, to: 100 },
];

const TOTAL_MS = 10000;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min((elapsed / TOTAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const activeStep = STEPS.findIndex((s) => progress < s.to);
  const currentStep = activeStep === -1 ? STEPS.length - 1 : activeStep;

  return (
    <div className="loading-screen">
      <div className="loading-card-v2">

        {/* Icon pulse */}
        <div className="loading-icon-wrap">
          <span className="loading-icon-emoji">{STEPS[currentStep].icon}</span>
        </div>

        <h2 className="loading-title">Analyse en cours…</h2>

        {/* Current step label */}
        <p className="loading-current-label">{STEPS[currentStep].label}</p>

        {/* Progress bar */}
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-pct">{Math.round(progress)}%</div>

        {/* Step list */}
        <div className="loading-steps-v2">
          {STEPS.map((step, i) => {
            const done = progress >= step.to;
            const active = i === currentStep;
            return (
              <div
                key={i}
                className={`loading-step-v2 ${done ? "step-done" : ""} ${active ? "step-active" : ""}`}
              >
                <span className="step-dot" />
                <span className="step-icon">{step.icon}</span>
                <span className="step-label">{step.label}</span>
                {done && <span className="step-check">✓</span>}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
