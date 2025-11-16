const { createProxyMiddleware } = require("http-proxy-middleware");

function proxyFactory(target, pathRewrite = {}) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    timeout: parseInt(process.env.PROXY_TIMEOUT) || 30000, // 30 seconds default
    onProxyReq: (proxyReq, req) => {
      // Set user info from req.user (if available) or from auth middleware
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user._id || req.user.id);
        proxyReq.setHeader("x-user-email", req.user.email);
        proxyReq.setHeader("x-user-role", req.user.role);
      } else if (req.authUserId) {
        // Support for adminAuth/userAuthToken middleware which sets req.authUserId
        proxyReq.setHeader("x-user-id", req.authUserId);
        if (req.role) {
          proxyReq.setHeader("x-user-role", req.role);
        }
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
        res.status(504).send("Gateway timeout. Service did not respond in time.");
      } else {
        res.status(500).send("Proxy failed.");
      }
    },
  });
}

module.exports = proxyFactory;
