// here I summon my server
//setup
const express = require("express");
const app = express();
const db = require("./db");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const csurf = require("csurf");

//handlebars//
var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
///////////SECURITY
app.use(cookieParser());
app.use(
  cookieSession({
    secret: `I'm always horny.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
  })
);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(csurf());
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.locals.csrfToken = req.csrfToken();
  next();
});
//////////////////////////////////////////////
app.use(express.static("./wintergreen-petition"));

//connecting with public folder= css, html, client-side JS
app.use(express.static("./public"));

//app.get("/", (req, res) => res.redirect("/petition")); I want to redirect from 8080 to 8080/

// renders petition main page
app.get("/petition", (req, res) => {
  res.render("petition", {
    layout: "main"
  });
});
//renders thanks page
app.get("/thanks", (req, res) => {
  res.render("thanks", {
    layout: "main"
  });
});

//renders signers page
app.get("/signers", (req, res) => {
  res.render("signers", {
    layout: "main"
  });
});

//I will place the POST request here

app.listen(8080, () => console.log("say something i'm listening"));
