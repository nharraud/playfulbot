CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
  username VARCHAR(15) NOT NULL UNIQUE,
  password BYTEA NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE tournaments (
  id uuid DEFAULT uuid_generate_v4() NOT NULL UNIQUE,
  name VARCHAR(15) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);
