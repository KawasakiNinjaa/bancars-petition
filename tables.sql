DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;


CREATE TABLE signatures (
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
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
