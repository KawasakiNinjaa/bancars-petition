var spicedPg = require("spiced-pg");

var db = spicedPg(
  "postgres:postgres:postgres@localhost:5432/wintergreen-petition"
);

//use $ to avoid sql injections

module.exports.submitSignature = function submitSignature(
  firstName,
  lastName,
  signature
) {
  return db.query(
    "INSERT INTO signatures (firstName, lastName, signature) VALUES ($1, $2,$3) RETURNING id",
    [firstName, lastName, signature]
  );
};
//shows signers
module.exports.getSigners = function getSigners() {
  return db.query("SELECT firstName, lastName FROM signatures");
};
//shows signature //
module.exports.getSignature = function getSignature(mySignature) {
  return db.query("SELECT signature FROM signatures WHERE id = $1", [
    mySignature
  ]);
};

module.exports.saveInfo = function saveInfo(
  firstName,
  lastName,
  eMail,
  password
) {
  return db.query(
    "INSERT INTO users (firstName, lastName, eMail, password) VALUES ($1, $2, $3, $4) RETURNING id",
    [firstName || null, lastName || null, eMail || null, password || null]
  );
};
