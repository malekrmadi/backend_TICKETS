import { useState } from "react";
import CollaborateurCard from "../components/CollaborateurCard";

export default function Dashboard({ data, onReset }) {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const collaborateurs = Object.entries(data);

  const handleSendEmails = async () => {
    setStatus("sending");

    // Prepare JSON for n8n
    const payload = collaborateurs.map(([name, collab]) => ({
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@adptickets.com`,
      message: collab.message,
    }));

    const endpoint = "http://localhost:5678/webhook/send-multiple-emails";
    console.log("🚀 Pointing to endpoint:", endpoint);
    console.log("📦 Payload to send:", payload);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Failed to send emails:", error);
      setStatus("error");
    }

    // Reset status after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span>🎫</span>
          <h1>Tickets Assistant</h1>
        </div>
        <div className="dashboard-meta">
          <span className="badge">{collaborateurs.length} collaborateur(s)</span>
          <button
            className={`btn-primary ${status === "sending" ? "loading" : ""}`}
            onClick={handleSendEmails}
            disabled={status === "sending"}
          >
            {status === "idle" && "📧 Envoyer les emails"}
            {status === "sending" && "⏳ Envoi..."}
            {status === "success" && "✅ Emails envoyés !"}
            {status === "error" && "❌ Erreur d'envoi"}
          </button>
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
