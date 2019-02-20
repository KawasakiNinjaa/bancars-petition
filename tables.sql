DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE signatures (
    id SERIAL primary key, --Part 4: chang signatures table to exclude first and last.
    --firstName VARCHAR(255) not null,
    --lastName VARCHAR(255) not null,
    signature TEXT not null,
    userID text REFERENCES users(id)-- modify signatures table to have a column for user id
);


---First name, last name, email address, and password should all be required fields. Email addresses must be unique. This should be enforced by a constraint (not null) on the column.
CREATE TABLE users (
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    eMail VARCHAR (255) not null unique,
    password VARCHAR (255) not null --optional timestamp
);
--'unique' will display error if any user tries to register with an already existing email addres in the db.

--PART4. new user_profiles table
CREATE TABLE user_profiles (
    id SERIAL primary KEY,
    age INT,
    city VARCHAR(255),
    url VARCGAR (255),
    user_id INT REFERENCES users(id) NOT NULL UNIQUE);
