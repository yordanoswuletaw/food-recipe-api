require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const axios = require("axios").default;
const { StatusCodes } = require("http-status-codes");
const router = express.Router();

const {
  createAccessToken,
} = require("../auth/createTokens");

//signout route
router.get("/", async (req, res) => {
    const accessToken = createAccessToken(null);
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(StatusCodes.OK).json({ success: true, user: null, accessToken });
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    
    res.status(StatusCodes.OK).json({ success: true, user: null, accessToken });
  });

module.exports = router  