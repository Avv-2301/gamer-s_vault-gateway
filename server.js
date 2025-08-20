const express = require("express");
const http = require("http");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.json({ limit: "10mb" }));
const logger = require("./src/middleware/logger");
app.use(logger);


const indexRoutes = require("./src/routes/index");
app.use("/", indexRoutes);

app.get("/", (req, res) => {
  return res.json({ success: true, message: "Gateway is running" });
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Gateway running at http://localhost:${port}`);
});
