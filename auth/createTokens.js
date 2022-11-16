const { sign } = require("jsonwebtoken");

const createAccessToken = (user) => {
  let credentials = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["editor","user", "mod", "annonymous"],
      "x-hasura-default-role": "annonymous",
    }
  }
  if (user) {
    credentials = {
      "name": user.username,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin","editor","user", "mod", "annonymous"],
        "x-hasura-default-role": "admin",
        "x-hasura-user-id": user.id,
      }
    }
  }

  return sign(credentials, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};


const createRefreshToken = (user) => {
  return sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {createAccessToken, createRefreshToken};
