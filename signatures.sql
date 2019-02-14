DROP TABLE IF EXISTS signatures;


CREATE TABLE signatures (
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    signature VARCHAR(25555555555555)
);
