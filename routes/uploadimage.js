require("dotenv").config();
require("express-async-errors");
const express = require("express");
const axios = require("axios").default;
const bodyParser = require("body-parser");
const imgbbUploader = require("imgbb-uploader");

const router = express.Router();

// image uploading route
router.post("/", async (req, res) => {
  try {
    const { filename, base64img } = req.body;

    const b64Resolver = () =>
      new Promise((resolve) => {
        return setTimeout(() => {
          resolve(base64img);
        }, 1000);
      });

    return await imgbbUploader({
      apiKey: process.env.IMGBB_API_KEY,
      base64string: await b64Resolver(),
      name: filename,
      timeout: 3000,
    })
      .then((result) => {
        return res.json({ success: true, url: result.url, msg:"image uploaded" });
      })
      .catch((e) => {
        // return Difault image in case of Time Out
        return res.json({
          success: false,
          url: "https://i.ibb.co/k2tfF5q/f624176b377d.jpg",
        });
      });
  } catch (error) {
    return res.json({
      success: false,
      url: "https://i.ibb.co/k2tfF5q/f624176b377d.jpg",
    });
  }
});

module.exports = router;
