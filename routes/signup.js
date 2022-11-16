require("dotenv").config();
require("express-async-errors");
const bcrypt = require("bcryptjs");
const express = require("express");
const axios = require("axios").default;
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const {
  createAccessToken,
  createRefreshToken,
} = require("../auth/createTokens");

const { CREATE_USER_GQL, resolve } = require("../graphql/resolver");

//signup route
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const refreshToken = createRefreshToken({
    username,
    email,
  });
 let accessToken = createAccessToken(null);
 
  const { data, errors } = await resolve(
    {
      username,
      email,
      password: hash,
      refreshToken,
    },
    CREATE_USER_GQL
  );

  if (errors) {
    let errMsg = "Something went wrong please try agin!---";
    if (
      errors[0]?.message?.includes(
        "Uniqueness violation. duplicate key value violates unique constraint"
      )
    )
      errMsg = "Account with this email address already exist!";
    return res.json({ success: false, error: errors, msg: errMsg, user: null, accessToken });
  }

  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

    accessToken = createAccessToken({
    username: data.insert_users_one.username,
    id: data.insert_users_one.id,
  });

  res
    .status(StatusCodes.OK)
    .json({
      success: true,
      user: {
        id: data.insert_users_one.id,
        username: data.insert_users_one.username,
        email: data.insert_users_one.email,
      },
      accessToken,
    });
});

module.exports = router;
