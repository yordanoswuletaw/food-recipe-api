require("dotenv").config();
require("express-async-errors");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const axios = require("axios").default;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const router = express.Router();

const {
  createAccessToken,
  createRefreshToken,
} = require("../auth/createTokens");

const { GET_REFRESH_TOKEN_GQL, resolve } = require("../graphql/resolver");

//token refresh route
router.get("/", async (req, res) => {
  let accessToken = createAccessToken(null);
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.json({
      success: false,
      error: "UNAUTHORIZED USER",
      user: null,
      accessToken,
    });

  const refreshToken = cookies.jwt;
  const response = await resolve(
    {
      refreshToken,
    },
    GET_REFRESH_TOKEN_GQL
  )
    .then((data) => {
      if (!data) {
        return res.json({
          success: false,
          error: "something went wrong!",
          msg: "Something went wrong please try agin!",
          user: null,
          accessToken,
        });
      }

      //verify users claim
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });

            return res.json({
              success: false,
              error: "Cookie Expired",
              user: null,
              accessToken,
            });
          }
          accessToken = createAccessToken({
            username: data.data.users[0].username,
            id: data.data.users[0].id,
          });
          res.status(StatusCodes.OK).json({
            success: true,
            user: {
              id: data.data.users[0].id,
              username: data.data.users[0].username,
              email: data.data.users[0].email,
            },
            accessToken,
          });
        }
      );
    })
    .catch((errors) => {
      return res.json({
        success: false,
        error: errors,
        msg: "Something went wrong please try agin!",
        user: null,
        accessToken,
      });
    });
});

module.exports = router;
