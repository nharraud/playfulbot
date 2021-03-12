CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(15) NOT NULL UNIQUE,
  password BYTEA NOT NULL
);


CREATE TABLE tournaments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(15) NOT NULL UNIQUE
);


CREATE TABLE teams (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id uuid NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
  name VARCHAR(15) NOT NULL UNIQUE
);


CREATE TABLE team_memberships (
  user_id uuid REFERENCES users (id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams (id) ON DELETE CASCADE,

  PRIMARY KEY (user_id, team_id)
);
