export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="spinner" />
        <h2>Analyse en cours…</h2>
        <p>Calcul des scores de priorité et génération des messages personnalisés.</p>
        <div className="loading-steps">
          <div className="loading-step">📊 Lecture du fichier Excel</div>
          <div className="loading-step">⚡ Scoring des tickets</div>
          <div className="loading-step">✉️ Génération des messages</div>
        </div>
      </div>
    </div>
  );
}
