const express = require("express");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(express.json());
app.use("/api", ticketRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});