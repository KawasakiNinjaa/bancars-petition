// here I summon my server
//setup
const express = require("express");
const app = express();
const db = require("./db");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./wintergreen-petition"));
app.use(express.static("./public"));

app.listen(8080, () => console.log("say something i'm listening"));
