const messageService = require("./messageService");

// Tickets that are old AND still open/in-progress are at risk of client follow-up.
// We surface these as "quick wins" — not because they're easy to solve,
// but because a short notification to the client buys time and preserves trust.
const QUICK_WIN_AGE_THRESHOLD = 5; // days — ticket older than this qualifies
const OPEN_STATUSES = ["Ouvert", "Open", "En cours", "In progress"];

const isAtRiskOfClientFollowUp = (ticket) => {
  const isStillOpen = OPEN_STATUSES.includes(ticket.statut);
  const isOldEnough = ticket.age_days >= QUICK_WIN_AGE_THRESHOLD;
  return isStillOpen && isOldEnough;
};

exports.categorize = (groupedTickets) => {
  const result = {};

  for (const user in groupedTickets) {
    const sorted = [...groupedTickets[user]]
      .sort((a, b) => b.computed_score - a.computed_score);

    const topPriorities = sorted.slice(0, 3);

    // Quick wins = old open tickets at risk of client follow-up,
    // sorted by age descending (oldest = most at risk first)
    const quickWins = sorted
      .filter(isAtRiskOfClientFollowUp)
      .sort((a, b) => b.age_days - a.age_days)
      .map(ticket => ({
        ...ticket,
        suggested_client_message: messageService.buildClientReminderMessage(ticket)
      }));

    const summary = {
      total: sorted.length,
      high: sorted.filter(t => t.computed_score >= 60).length,
      medium: sorted.filter(t => t.computed_score >= 30 && t.computed_score < 60).length,
      low: sorted.filter(t => t.computed_score < 30).length
    };

    const collaborateurMessage = messageService.buildCollaborateurMessage(
      user,
      summary,
      topPriorities,
      quickWins
    );

    result[user] = {
      message: collaborateurMessage,
      summary,
      top_priorities: topPriorities,
      quick_wins: quickWins
    };
  }

  return result;
};
