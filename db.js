var spicedPg = require("spiced-pg");

var db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/wintergreen-petition"
);

//use $ to avoid sql injections

module.exports.submitSignature = function submitSignature(signature, userID) {
  return db.query(
    "INSERT INTO signatures (signature, userID) VALUES ($1, $2) RETURNING id",
    [signature, userID]
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
//inserts data into DB
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

//gets user info by the submitted email address
//part4. modify this query to get data from signatures table
module.exports.getUserInfobyEmail = function getUserInfobyEmail(userEmail) {
  return db.query(
    `SELECT firstname, lastname, password, users.id AS userid, signatures.id AS sigid FROM users
      LEFT JOIN signatures ON users.id = signatures.userid WHERE email = $1`,
    [userEmail]
  );
};

module.exports.getSigID = function getSigID(userID) {
  return db.query("SELECT id FROM signatures WHERE id= $1", [userID]);
};

module.exports.profile = function saveProfileInfo(age, city, url, userid) {
  return db.query(
    "INSERT INTO user_profiles(age, city, url, userid) VALUES ($1, $2, $3, $4)",
    [age, city, url, userid]
  );
};

// module.exports.getByCity = function getByCity(city) {
//   return db.query("SELECT fir);

// };
