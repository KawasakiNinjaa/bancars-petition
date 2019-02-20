DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE signatures (
    id SERIAL primary key,
    signature TEXT not null,
    userid INT REFERENCES users(id)
);


---First name, last name, email address, and password should all be required fields. Email addresses must be unique. This should be enforced by a constraint (not null) on the column.
CREATE TABLE users (
    id SERIAL primary key,
    firstname VARCHAR(255) not null,
    lastname VARCHAR(255) not null,
    email VARCHAR (255) not null unique,
    password VARCHAR (255) not null --optional timestamp
);
--'unique' will display error if any user tries to register with an already existing email addres in the db.

--PART4. new user_profiles table
CREATE TABLE user_profiles (
    id SERIAL primary KEY,
    age INT,
    city VARCHAR(255),
    url VARCHAR (255),
    userid INT REFERENCES users(id) NOT NULL UNIQUE);
