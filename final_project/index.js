const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const { jwt_secret, session_secret } = require("./config/auth.js");
const { appConfig } = require("./config/app.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
app.use(express.json());

app.use(
  "/customer",
  session({
    secret: session_secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;
  if (!token) {
    return res.status(401).send("Access Denied. No token provided");
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.user = user;
    next();
  });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(appConfig.port, () => console.log("Server is running"));
