const { createProxyMiddleware } = require("http-proxy-middleware");

function proxyFactory(target, pathRewrite = {}) {
  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    timeout: parseInt(process.env.PROXY_TIMEOUT) || 30000, // 30 seconds default
    onProxyReq: (proxyReq, req, res) => {
      // Set user info from auth middleware (req.authUserId and req.role set by userAuthToken/adminAuth)
      // Headers are already set in the wrapper, but ensure they're on proxyReq as well
      if (req.authUserId) {
        proxyReq.setHeader("x-user-id", String(req.authUserId));
        if (req.role) {
          proxyReq.setHeader("x-user-role", String(req.role));
        }
      } else if (req.headers["x-user-id"]) {
        // Use headers if authUserId not available
        proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
        if (req.headers["x-user-role"]) {
          proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
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
  
  // Wrap the proxy middleware to set headers from auth middleware
  return (req, res, next) => {
    // Set headers directly on req from auth middleware values
    // This ensures headers are available when proxy forwards the request
    if (req.authUserId) {
      req.headers["x-user-id"] = String(req.authUserId);
      if (req.role) {
        req.headers["x-user-role"] = String(req.role);
      }
    }
    
    return proxyMiddleware(req, res, next);
  };
}

module.exports = proxyFactory;
