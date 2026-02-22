exports.groupByCollaborator = (tickets) => {
  return tickets.reduce((acc, ticket) => {
    const name = ticket.collaborateur || "Non assigné";

    if (!acc[name]) acc[name] = [];

    acc[name].push(ticket);

    return acc;
  }, {});
};
