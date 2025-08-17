const express = require('express');
const app = express();
const http = require("http");
require('dotenv').config();

const port = process.env.PORT || 8080;

app.use(express.json({ limit: "10mb" }));

const indexRoutes = require("./src/routes/index");

app.use("/", indexRoutes);


app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running.... for GATEWAY ",
  });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT} for GATEWAY`
  );
});