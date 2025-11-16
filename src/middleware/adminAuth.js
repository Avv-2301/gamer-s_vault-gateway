const Response = require("@avv-2301/gamers-vault-common");
const Constant = require("@avv-2301/gamers-vault-common");
const { userAuthToken } = require("./auth");

/**
 * @description Middleware to check if user is admin
 * Must be used after userAuthToken middleware
 * @param req
 * @param res
 * @param next
 */
const adminAuth = (req, res, next) => {
  // First check if user is authenticated
  userAuthToken(req, res, () => {
    // Check if user has admin role
    if (req.role === Constant.ROLE.ADMIN) {
      return next();
    } else {
      return Response.errorResponseWithoutData(
        res,
        "Access denied. Admin privileges required.",
        Constant.STATUS_CODES.FORBIDDEN
      );
    }
  });
};

module.exports = {
  adminAuth,
};

