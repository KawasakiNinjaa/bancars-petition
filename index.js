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

//handlebars
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

app.get("/", (req, res) => {
  res.redirect("registration");
});
//renders the login template
app.get("/login", (req, res) => {
  res.render("login", {
    layout: "main"
  });
});

//POST/login
app.post("/login", (req, res) => {
  let userPsswd = req.body.password;
  let userEmail = req.body.eMail;
  db.getUserInfobyEmail(userEmail) //db query to get user info with email
    .then(results => {
      console.log("results: ", results);
      let psswdOnDb = results.rows[0].password;
      let userID = results.rows[0].userid; //compare passwords
      bcrypt.checkPassword(userPsswd, psswdOnDb).then(itsAMatch => {
        if (itsAMatch) {
          req.session.userID = userID;
          req.session.sigID = results.rows[0].sigid;
          db.getSigID(userID).then(results => {});
          //if checkPassword is successful, set cookie

          if (!results.rows[0].sigid) {
            res.redirect("/petition");
          } else {
            res.redirect("/thanks");
          }
          //db.getSigID(userID); // db query to get the signature id //part4. remove query to get signatur ID
          //res.redirect("/petition"); // and redirect to petition
        } else {
          res.render("login", {
            // if checkPassword is unsucessful, re-render login with err
            layout: "main",
            somethingWrong: "somethingWrong"
          });
        }
      });
    })
    .catch(err => {
      console.log("err; ", err);
      //if there is no matching Email, re-render login with an error message.
      res.render("login", {
        layout: "main",
        somethingWrong: "somethingWrong"
      });
    });
});

//renders the registration template
app.get("/registration", (req, res) => {
  res.render("registration", {
    layout: "main"
  });
});

//POST/registration
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
        res.redirect("/profile"); //and redirect to /petition //part4: redirect to /profile
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
//renders profile form
app.get("/profile", (req, res) => {
  res.render("profile", {
    layout: "main"
  });
});
//saves data to db, later can be edited
app.post("/profile", (req, res) => {
  let userAge = req.body.age;
  let userCity = req.body.city;
  let userURL = req.body.url;
  let userID = req.session.userID;
  db.saveProfileInfo(userAge, userCity, userURL, userID)
    .then(() => {
      res.redirect("/petition"); //REDIRECT TO THANKS OR PETITION???
    })
    .catch(err => {
      console.log("Error: ", err);
      res.render("profile", {
        layout: "main",
        somethingWrong: "somethingWrong"
      });
    });
});
app.listen(process.env.PORT || 8080, () =>
  console.log("say something i'm listening")
);

// pre-populates the input fields with data from the logged-in user
app.get("/profile/edit", (req, res) => {
  return db
    .getProfileInfo(req.session.userID)
    .then(results => {
      console.log("results: ", results);
      res.render("edit", {
        layout: "main",
        firstname: results.rows[0].firstname,
        lastname: results.rows[0].lastname,
        age: results.rows[0].age,
        email: results.rows[0].email,
        city: results.rows[0].city,
        url: results.rows[0].url
      });
    })
    .catch(err => {
      console.log(err);
    });
});
// allows users update their profile
app.post("/profile/edit", (req, res) => {
  let userName = req.body.firstname;
  let userLast = req.body.lastname;
  let userEmail = req.body.email;
  let userPsswd = req.body.password;
  let sessionID = req.session.userID;
  let userAge = req.body.age;
  let userCity = req.body.city;
  let userURL = req.body.url;

  if (!userPsswd) {
    db.updateWithNoPass(userName, userLast, userEmail, sessionID)
      .then(() => {
        db.update_user_profiles(userAge, userCity, userURL, sessionID);
      })
      .then(results => {
        res.redirect("/thanks");
      })
      .catch(err => {
        console.log(err);
        res.render("edit", {
          layout: "main",
          somethingWrong: "somethingWrong"
        });
      });
  } else {
    bcrypt.hashPassword(userPsswd).then(hashedPsswd => {
      console.log("hashedPsswd: ", hashedPsswd);
      db.updateWithPass(userName, userLast, userEmail, hashedPsswd, sessionID)
        .then(() => {
          db.update_user_profiles(userAge, userCity, userURL, sessionID);
        })
        .then(() => {
          res.redirect("/thanks");
        })
        .catch(err => {
          console.log("error in updateWithPass: ", err);
          res.render("edit", {
            layout: "main",
            somethingWrong: "somethingWrong"
          });
        });
    });
  }
});

// renders petition main page
app.get("/petition", (req, res) => {
  res.render("petition", {
    layout: "main"
  });
});

// POST/petition
app.post(`/petition`, (req, res) => {
  if (
    // !req.body.firstName || !req.body.lastName ||-- PART 3: Only use signature from req.body
    !req.body.signature
  ) {
    console.log("req.body: ", req.body);
    res.render("petition", {
      layout: "main",
      error: "error" //error message is on template
    });
  } else {
    return db
      .submitSignature(
        //insert data into table signatures.
        // req.body.firstName,
        // req.body.lastName,
        req.body.signature,
        req.session.userID
      )
      .then(results => {
        //set cookies, then redirect to thanks page.
        // req.session.firstName = req.body.firstName;n PART 3: only use req.body.signature
        // req.session.lastName = req.body.lastName;
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
  let mySignature = req.session.userID;
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

app.post("/thanks", (req, res) => {
  db.deleteSig(req.session.userID)
    .then(results => {
      !req.session.sigID;
      res.redirect("/petition");
    })
    .catch(err => {
      console.log("ERR", err);
      res.render("/thanks");
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

app.get("/signers/:city", (req, res) => {
  db.getByCity(req.params.city).then(results => {
    res.render("signers", {
      layout: "main",
      nameList: results.rows
    });
  });
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/registration");
});
