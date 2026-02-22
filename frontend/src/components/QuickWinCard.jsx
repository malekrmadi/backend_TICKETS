import { useState } from "react";

export default function QuickWinCard({ ticket }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.suggested_client_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="quickwin-card">
      <div className="quickwin-header">
        <div className="quickwin-info">
          <span className="quickwin-id">#{ticket.ticket_id}</span>
          <span className="quickwin-client">{ticket.client}</span>
          <span className="tag tag-age">{ticket.age_days} jours</span>
          <span className="tag tag-statut">{ticket.statut}</span>
        </div>
        <div className="quickwin-actions">
          <button className="btn-ghost-sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Masquer le message" : "Voir le message"}
          </button>
          <button className="btn-email-sm" disabled title="Fonctionnalité email à venir">
            📧 Envoyer
          </button>
        </div>
      </div>

      {open && (
        <div className="quickwin-message">
          <div className="message-box message-box-sm">
            {formatMessage(ticket.suggested_client_message)}
          </div>
          <button className="btn-ghost" onClick={handleCopy}>
            {copied ? "✓ Copié !" : "Copier le message"}
          </button>
        </div>
      )}
    </div>
  );
}
