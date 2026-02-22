const express = require("express");
const multer = require("multer");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("file"), ticketController.processFile);

module.exports = router;