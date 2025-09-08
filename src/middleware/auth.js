const jwToken = require("../services/authJwt");
const Response = require("@avv-2301/gamers-vault-common");
const Constant = require("@avv-2301/gamers-vault-common");
const { callService } = require("@avv-2301/gamers-vault-common");

module.exports = {
  /**
   * @description This function is used to authenticate and authorize user
   * @param req
   * @param res
   * @param next
   */
  userAuthToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      // console.log(token,"token")

      // skip auth for trusted internal calls
      if (req.headers["x-internal-call"] === "true") {
        return next();
      }

      if (!token) {
        return Response.errorResponseWithoutData(
          res,
          "Token Not Found",
          Constant?.STATUS_CODES.UNAUTHORIZED
        );
      } else {
        const tokenData = await jwToken.decode(token);
        // console.log(tokenData,"TOKENDATAAA")
        if (tokenData) {
          const decode = await jwToken.verify(tokenData);

          if (decode.id) {
            (req.authUserId = decode.id), (req.role = decode.role);

            const user = await callService(
              "users",
              `/${req.authUserId}?projection=status,token`,
              {},
              { "x-internal-call": "true" },
              "GET"
            );

            // console.log(user, "MIDDLEWARE");

            let user_token = `Bearer ${user?.data?.token}`;
            // console.log(user_token, "USER_TOKENN")

            // console.log("STATUS FROM DB:", user.data?.status);
            // console.log("ACTIVE FLAG:", Constant.FLAGS.ACTIVE);

            if (user && user_token === token) {
              if (user?.data && user?.data?.status === Constant?.FLAGS?.INACTIVE) {
                return Response.errorResponseWithoutData(
                  res,
                  "User account is Inactive",
                  Constant?.STATUS_CODES?.UNAUTHORIZED
                );
              } else if (user && user?.data?.status === Constant?.FLAGS?.ACTIVE) {
                return next();
              } else {
                return Response.errorResponseWithoutData(
                  res,
                  "Account is blocked",
                  Constant?.STATUS_CODES?.FORBIDDEN
                );
              }
            } else {
              return Response.errorResponseWithoutData(
                res,
                "Invalid token 1",
                Constant.STATUS_CODES?.FORBIDDEN
              );
            }
          } else {
            return Response.errorResponseWithoutData(
              res,
              "Invalid token 2",
              Constant.STATUS_CODES?.FORBIDDEN
            );
          }
        } else {
          return Response.errorResponseWithoutData(
            res,
            "Invalid token 3",
            Constant.STATUS_CODES?.FORBIDDEN
          );
        }
      }
    } catch (error) {
      console.log(error);
      return Response.errorResponseData(
        res,
        "Internal server error",
        Constant?.STATUS_CODES?.INTERNAL_SERVER
      );
    }
  },
};
