function logger(req, res, next) {
  const method = req.method;
  const path = req.originalUrl;
  const time = new Date().toISOString();

  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(`[Gateway] ${req.method} ${fullUrl}`);
  next();
}

module.exports = logger;
