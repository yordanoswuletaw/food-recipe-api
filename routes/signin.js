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

const {
    GET_USER_GQL,
    SET_REFRESH_TOKEN_GQL,
    resolve,
  } = require("../graphql/resolver");

//signin route
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    let accessToken = createAccessToken(null);
    const { data, errors } = await resolve(
      {
        email,
      },
      GET_USER_GQL
    )
  
    if(errors){
      return res.json({
        success: false,
        error: errors,
        msg: "Something went wrong please try agin!",
        user: null,
        accessToken
      })
    }
  
     // if user does not exist
    if (data.users.length > 0) {
      const result = bcrypt.compareSync(password, data.users[0].password);
      if (result) {
        const refreshToken = createRefreshToken({
          username: data.users[0].username,
          email: data.users[0].email,
        });
  
        res.cookie("jwt", refreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        await resolve(
          {
            id: data.users[0].id,
            refreshToken,
          },
          SET_REFRESH_TOKEN_GQL
        )
  
        if(errors){
          return res.json({
            success: false,
            error: errors,
            msg: "Something went wrong please try agin!",
            user: null,
            accessToken
          })
        }
        
        accessToken = createAccessToken({
          username: data.users[0].username,
          id: data.users[0].id,
        });
  
        return res.json({
          success: true,
          user: {
            id: data.users[0].id,
            username: data.users[0].username,
            email: data.users[0].email,
          },
          accessToken,
        });
      }
      return res.json({
        success: false,
        error: "errors",
        msg: "Incorrect password or email address!",
        user: null,
        accessToken
      });
    }
    res.json({
      success: false,
      error: "UNAUTHORIZED USER",
      msg: "Please Signup first!",
      user: null,
      accessToken
    });
  });

  module.exports = router
  
  