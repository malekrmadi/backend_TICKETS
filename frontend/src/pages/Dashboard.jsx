import CollaborateurCard from "../components/CollaborateurCard";

export default function Dashboard({ data, onReset }) {
  const collaborateurs = Object.entries(data);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span>🎫</span>
          <h1>Tickets Assistant</h1>
        </div>
        <div className="dashboard-meta">
          <span className="badge">{collaborateurs.length} collaborateur(s)</span>
          <button className="btn-secondary" onClick={onReset}>
            ↩ Nouvel import
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {collaborateurs.map(([name, collab]) => (
          <CollaborateurCard key={name} name={name} data={collab} />
        ))}
      </main>
    </div>
  );
}
