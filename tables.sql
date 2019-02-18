DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;


CREATE TABLE signatures (
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    signature TEXT not null
    -- modify signatures table to have a column for user id
);

CREATE TABLE users (
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    eMail VARCHAR (255) not null unique,
    password VARCHAR (255) not null
);
--'unique' will display error if any user tries to register with an already existing email addres in the db.
