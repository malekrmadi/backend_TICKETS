const dayjs = require("dayjs");

exports.applyScoring = (tickets) => {
  return tickets.map(ticket => {
    let score = 0;

    // Priority — maps your 'priorite' column values
    const priorityMap = {
      Critique: 50,
      Critical: 50,
      Haute: 35,
      High: 35,
      Moyenne: 20,
      Medium: 20,
      Basse: 5,
      Low: 5
    };
    score += priorityMap[ticket.priorite] || 0;

    // Complexity bonus — 'complexite' column: Haute complexity = more urgent
    const complexityMap = {
      Haute: 15,
      High: 15,
      Moyenne: 8,
      Medium: 8,
      Basse: 0,
      Low: 0
    };
    score += complexityMap[ticket.complexite] || 0;

    // Age — based on 'date_creation' column
    const ageDays = dayjs().diff(dayjs(ticket.date_creation), "day");
    if (ageDays > 7) score += 15;
    else if (ageDays > 3) score += 8;

    // Status bonus — 'statut' column: open/pending tickets are more urgent
    const statutMap = {
      Ouvert: 10,
      Open: 10,
      "En cours": 5,
      "In progress": 5,
      Resolu: 0,
      Resolved: 0,
      Ferme: 0,
      Closed: 0
    };
    score += statutMap[ticket.statut] || 0;

    return {
      ...ticket,
      computed_score: score,
      age_days: ageDays
    };
  });
};
