const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const logger = require("./src/middleware/logger");
app.use(logger);

// Audit logging middleware (captures all API requests)
const auditLog = require("./src/middleware/auditLog");
app.use(auditLog);

const indexRoutes = require("./src/routes/index");
app.use("/", indexRoutes);

app.get("/", (req, res) => {
  return res.json({ success: true, message: "Gateway is running" });
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Gateway running at http://localhost:${port}`);
});
