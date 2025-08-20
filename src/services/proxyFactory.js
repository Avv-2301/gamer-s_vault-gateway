const { createProxyMiddleware } = require("http-proxy-middleware");

function proxyFactory(target, pathRewrite = {}) {
  console.log(target,"targets")
  console.log(pathRewrite)
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: (proxyReq, req) => {
      const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
      console.log(`[Proxy] Forwarding ${req.method} ${fullUrl} -> ${target}${req.url}`);
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-email", req.user.email);
        proxyReq.setHeader("x-user-role", req.user.role);
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy failed.");
    },
  });
}

module.exports = proxyFactory;
