export default function QuickWinCard({ ticket }) {
  return (
    <div className="quickwin-card">
      <div className="quickwin-info">
        <span className="quickwin-id">#{ticket.ticket_id}</span>
        {ticket.objet && (
          <span className="quickwin-objet">{ticket.objet}</span>
        )}
        <span className={`tag tag-${(ticket.priorite || "").toLowerCase()}`}>
          {ticket.priorite}
        </span>
        <span className="tag tag-age">{ticket.age_days}j</span>
      </div>
    </div>
  );
}
