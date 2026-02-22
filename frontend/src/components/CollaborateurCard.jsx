import { useState } from "react";
import QuickWinCard from "./QuickWinCard";

export default function CollaborateurCard({ name, data }) {
  const { summary, message, top_priorities, quick_wins } = data;
  const [messageVisible, setMessageVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format message text: bold **text** and newlines
  const formatMessage = (text) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          <br />
        </span>
      );
    });

  return (
    <div className="collab-card">
      {/* Header */}
      <div className="collab-header">
        <div className="collab-avatar">{initials}</div>
        <div className="collab-info">
          <h2 className="collab-name">{name}</h2>
          <span className="collab-total">{summary.total} ticket(s) au total</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi kpi-high">
          <span className="kpi-value">{summary.high}</span>
          <span className="kpi-label">Urgents</span>
        </div>
        <div className="kpi kpi-medium">
          <span className="kpi-value">{summary.medium}</span>
          <span className="kpi-label">Moyens</span>
        </div>
        <div className="kpi kpi-low">
          <span className="kpi-value">{summary.low}</span>
          <span className="kpi-label">Faibles</span>
        </div>
        <div className="kpi kpi-quickwins">
          <span className="kpi-value">{quick_wins.length}</span>
          <span className="kpi-label">Relances</span>
        </div>
      </div>

      {/* Top priorities */}
      {top_priorities.length > 0 && (
        <div className="section">
          <h3 className="section-title">🔥 Top priorités</h3>
          <div className="priority-list">
            {top_priorities.map((ticket, i) => (
              <div key={ticket.ticket_id ?? i} className="priority-item">
                <span className="priority-rank">#{i + 1}</span>
                <div className="priority-info">
                  <span className="priority-id">Ticket #{ticket.ticket_id}</span>
                  <span className="priority-client">{ticket.client}</span>
                </div>
                <div className="priority-tags">
                  <span className={`tag tag-${(ticket.priorite || "").toLowerCase()}`}>
                    {ticket.priorite}
                  </span>
                  <span className="tag tag-statut">{ticket.statut}</span>
                  {ticket.age_days > 5 && (
                    <span className="tag tag-age">{ticket.age_days}j</span>
                  )}
                </div>
                <span className="priority-score">{ticket.computed_score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {quick_wins.length > 0 && (
        <div className="section">
          <h3 className="section-title">⚡ Relances clients à faire</h3>
          <div className="quickwins-list">
            {quick_wins.map((ticket, i) => (
              <QuickWinCard key={ticket.ticket_id ?? i} ticket={ticket} />
            ))}
          </div>
        </div>
      )}

      {/* Personal message */}
      <div className="section">
        <div className="message-header">
          <h3 className="section-title">✉️ Ton message personnalisé</h3>
          <div className="message-actions">
            <button
              className="btn-ghost"
              onClick={() => setMessageVisible((v) => !v)}
            >
              {messageVisible ? "Masquer" : "Afficher"}
            </button>
            <button className="btn-ghost" onClick={handleCopy}>
              {copied ? "✓ Copié !" : "Copier"}
            </button>
            <button className="btn-email" disabled title="Fonctionnalité email à venir">
              📧 Envoyer par email
            </button>
          </div>
        </div>
        {messageVisible && (
          <div className="message-box">
            {formatMessage(message)}
          </div>
        )}
      </div>
    </div>
  );
}
