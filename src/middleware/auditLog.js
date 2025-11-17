const axios = require("axios");
const services = require("../config/services");

/**
 * @description Middleware to log all API requests for audit purposes
 * This middleware captures request/response data and saves it to the audit log
 * It runs asynchronously to avoid blocking the request flow
 */
function auditLog(req, res, next) {
  const startTime = Date.now();

  // Skip audit logging for internal service calls
  if (req.headers["x-internal-call"] === "true") {
    return next();
  }

  // Skip audit logging for health checks or static assets
  if (
    req.path === "/" ||
    req.path.startsWith("/health") ||
    req.path.startsWith("/static")
  ) {
    return next();
  }

  // Capture initial request data
  // Note: userId and role will be captured later after auth middleware runs
  const auditData = {
    method: req.method,
    endpoint: req.path,
    fullUrl: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    requestBody: req.body ? sanitizeRequestBody(req.body) : null,
    queryParams: req.query || null,
    ipAddress: getClientIp(req),
    userAgent: req.get("user-agent") || null,
  };

  // Function to capture final audit data and save
  const captureAndSaveAuditLog = () => {
    const duration = Date.now() - startTime;
    
    // Capture userId and role at response time (after auth middleware has run)
    auditData.userId = req.authUserId || req.headers["x-user-id"] || null;
    auditData.userRole = req.role || req.headers["x-user-role"] || null;
    auditData.responseStatus = res.statusCode || 500;
    auditData.duration = duration;

    // Save audit log asynchronously (don't wait for it)
    saveAuditLog(auditData).catch((err) => {
      console.error("Failed to save audit log:", err.message);
    });
  };

  // Override res.json to capture response status
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    captureAndSaveAuditLog();
    return originalJson(data);
  };

  // Override res.send to capture response status
  const originalSend = res.send.bind(res);
  res.send = function (data) {
    captureAndSaveAuditLog();
    return originalSend(data);
  };

  // Handle errors and ensure we capture data even if response methods aren't called
  res.on("finish", () => {
    if (!auditData.responseStatus) {
      captureAndSaveAuditLog();
    }
  });

  next();
}

/**
 * @description Save audit log to admin-service
 * This is called asynchronously and doesn't block the request
 */
async function saveAuditLog(auditData) {
  try {
    await axios.post(
      `${services.adminService}/audit-logs`,
      auditData,
      {
        headers: {
          "x-internal-call": "true",
        },
        timeout: 5000, // 5 second timeout
      }
    );
  } catch (error) {
    // Log error but don't throw - audit logging should never break the app
    if (error.code !== "ECONNABORTED") {
      console.error("Audit log save error:", error.message);
    }
  }
}

/**
 * @description Sanitize request body to remove sensitive information
 */
function sanitizeRequestBody(body) {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sensitiveFields = ["password", "token", "secret", "apiKey", "authorization"];
  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = "***REDACTED***";
    }
  }

  return sanitized;
}

/**
 * @description Get client IP address from request
 */
function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
}

module.exports = auditLog;

