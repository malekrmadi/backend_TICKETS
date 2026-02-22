const dayjs = require("dayjs");

// Returns a short human label for a priority value
const priorityLabel = (priorite) => {
  const map = {
    Critique: "critique",
    Critical: "critique",
    Haute: "haute priorité",
    High: "haute priorité",
    Moyenne: "priorité moyenne",
    Medium: "priorité moyenne",
    Basse: "basse priorité",
    Low: "basse priorité"
  };
  return map[priorite] || "priorité inconnue";
};

// Returns a short human label for a status value
const statutLabel = (statut) => {
  const map = {
    Ouvert: "ouvert",
    Open: "ouvert",
    "En cours": "en cours de traitement",
    "In progress": "en cours de traitement",
    Resolu: "résolu",
    Resolved: "résolu",
    Ferme: "fermé",
    Closed: "fermé"
  };
  return map[statut] || statut;
};

// Greeting based on time of day (server time)
const greeting = () => {
  const hour = dayjs().hour();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
};

// Personal message shown at the top of each collaborateur's section
exports.buildCollaborateurMessage = (name, summary, topPriorities, quickWins) => {
  const firstName = name.split(" ")[0];
  const g = greeting();

  let msg = `${g} ${firstName} 👋\n\n`;

  msg += `Voici un résumé de ta file d'attente : tu as en ce moment **${summary.total} ticket(s)** à traiter`;

  const parts = [];
  if (summary.high > 0) parts.push(`**${summary.high} urgents**`);
  if (summary.medium > 0) parts.push(`**${summary.medium} moyens**`);
  if (summary.low > 0) parts.push(`**${summary.low} peu prioritaires**`);

  if (parts.length > 0) {
    msg += `, dont ${parts.join(", ")}`;
  }
  msg += ".\n\n";

  // Top priorities message
  if (topPriorities.length > 0) {
    msg += `🔥 **Tes priorités du moment :**\n`;
    topPriorities.forEach((t, i) => {
      msg += `  ${i + 1}. Ticket #${t.ticket_id}`;
      if (t.objet) msg += ` — « ${t.objet} »`;
      msg += ` (${t.client}) — ${priorityLabel(t.priorite)}, ${statutLabel(t.statut)}`;
      if (t.age_days > 7) msg += `, ouvert depuis **${t.age_days} jours**`;
      msg += "\n";
    });
    msg += "\nConcentre-toi sur ces tickets en premier, ils ont le plus d'impact.\n\n";
  }

  // Quick wins message
  if (quickWins.length > 0) {
    msg += `⚡ **Relances rapides à faire (${quickWins.length} ticket(s)) :**\n`;
    quickWins.forEach((t) => {
      msg += `  • Ticket #${t.ticket_id}`;
      if (t.objet) msg += ` — « ${t.objet} »`;
      msg += ` (${t.client}) — ouvert depuis **${t.age_days} jours**`;
      if (t.statut) msg += `, statut : ${statutLabel(t.statut)}`;
      msg += "\n";
    });
    msg += "\nCes tickets n'ont pas forcément besoin d'une résolution immédiate, mais un petit message au client pour lui dire que sa demande est bien prise en compte ferait toute la différence. 🙏\n\n";
  }

  msg += `Bon courage pour cette journée ! 💪`;

  return msg;
};

// Short suggested message the collaborateur can send to the client for a quick-win ticket
exports.buildClientReminderMessage = (ticket) => {
  const firstName = ticket.client ? ticket.client.split(" ")[0] : "cher client";
  const objetLine = ticket.objet
    ? `au sujet de votre demande **« ${ticket.objet} »** (réf. #${ticket.ticket_id})`
    : `au sujet de votre demande (réf. #${ticket.ticket_id})`;

  return (
    `Bonjour ${firstName},\n\n` +
    `Je me permets de vous contacter ${objetLine}.\n` +
    `Sachez qu'elle est bien enregistrée dans notre système et qu'elle est actuellement **${statutLabel(ticket.statut)}**.\n` +
    `Nous faisons notre maximum pour y apporter une réponse dans les meilleurs délais.\n\n` +
    `N'hésitez pas à nous contacter si vous avez des questions.\n\n` +
    `Cordialement`
  );
};
