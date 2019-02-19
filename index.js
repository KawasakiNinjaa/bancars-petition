// here I summon my server
//setup
const express = require("express");
const app = express();
const db = require("./db");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const bcrypt = require("./bcrypt.js");

//handlebars//
var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
  cookieSession({
    //name: session
    secret: `I'm always horny.`,
    maxAge: 1000 * 60 * 60 * 24 * 14 //cookies last two weeks
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

//app.get("/", (req, res) => res.redirect("/petition")); I want to redirect from 8080 to 8080/petition

// renders petition main page
app.get("/petition", (req, res) => {
  res.render("petition", {
    layout: "main"
  });
});
/*  POST/petition.
- needs all form values to be entered. if not, send error message
- insert data into table into signatures, set a cookie, redirect to thanks page
*/
app.post(`/petition`, (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.signature) {
    console.log("req.body: ", req.body);
    res.render("petition", {
      layout: "main",
      error: "error" //error message is on template
    });
  } else {
    return db
      .submitSignature(
        //insert data into table signatures.
        req.body.firstName,
        req.body.lastName,
        req.body.signature
      )
      .then(results => {
        //set cookies, then redirect to thanks page.
        req.session.firstName = req.body.firstName;
        req.session.lastName = req.body.lastName;
        req.session.signerID = results.rows[0].id;
        //console.log("cookieSession: ", req.session);
        res.redirect("/thanks");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

//renders thanks page
app.get("/thanks", (req, res) => {
  let mySignature = req.session.signerID;
  //uses cookie to retrieve signature image from the database
  return db.getSignature(mySignature).then(results => {
    res //and serves it to the page
      .render("thanks", {
        layout: "main", // if getSignature works, then() will run. if it does not, catch() will run and handle the error.

        signImg: results.rows
      })
      .catch(err => {
        console.log(err);
      });
  });
});

//renders signers page
app.get("/signers", (req, res) => {
  return db.getSigners().then(results => {
    res.render("signers", {
      layout: "main",
      nameList: results.rows
    });
  });
});

//renders the registration template

app.get("/registration", (req, res) => {
  res.render("registration", {
    layout: "main"
  });
});

//renders the login template
app.get("/login", (req, res) => {
  res.render("login", {
    layout: "main"
  });
});

/*
POST/registration
- if INSERT fails re-render register template with an error message */
app.post("/registration", (req, res) => {
  let first = req.body.firstName;
  let last = req.body.lastName;
  let email = req.body.eMail;
  let psswd = req.body.password;

  //first must hash the password using bcrypt
  bcrypt.hashPassword(psswd).then(hashedPsswd => {
    //- call function to insert first, last, email and hashed psswd into db
    db.saveInfo(first, last, email, hashedPsswd)
      .then(result => {
        //if INSERT is succesful, log the user in by puttin their id in req.session
        req.session.userID = result.rows[0].id;
        res.redirect("/petition"); //and redirect to /petition
      })
      .catch(err => {
        console.log("error catched: ", err);
        res.render("registration", {
          layout: "main",
          somethingWrong: "somethingWrong" // if INSERT fails, re-render registration template with an error message
        });
      });
  });
});

app.listen(8080, () => console.log("say something i'm listening"));
