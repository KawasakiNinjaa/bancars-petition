var spicedPg = require("spiced-pg");

var db = spicedPg(
  "postgres:postgres:postgres@localhost:5432/wintergreen-petition"
);

// THIS QUERY WON'T WORK BECAUSE I DON'T HAVE A TABLE CALLED CITIES
// THIS QUERY IS JUST FOR DEMO PURPOSES
module.exports.getAllCities = function getAllCities() {
  return db.query("SELECT * FROM cities");
};

module.exports.addCity = function addCity(city, state, country) {
  db.query("INSERT INTO cities (city, state, country) VALUES ($1, $2, $3)", [
    city,
    state,
    country
  ]);
};
