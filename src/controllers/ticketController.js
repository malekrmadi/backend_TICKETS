const parserService = require("../services/parserService");
const scoringService = require("../services/scoringService");
const groupingService = require("../services/groupingService");
const categorizationService = require("../services/categorizationService");

exports.processFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please attach an Excel file with the field name 'file'." });
    }

    const rawTickets = parserService.parseExcel(req.file.path);

    if (!rawTickets || rawTickets.length === 0) {
      return res.status(400).json({ error: "The Excel file appears to be empty or could not be parsed." });
    }

    const scoredTickets = scoringService.applyScoring(rawTickets);
    const grouped = groupingService.groupByCollaborator(scoredTickets);
    const categorized = categorizationService.categorize(grouped);

    res.json(categorized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Processing failed", details: error.message });
  }
};
