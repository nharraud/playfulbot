CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET timezone='UTC';

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(15) NOT NULL UNIQUE,
  password BYTEA NOT NULL
);


CREATE TABLE tournaments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(15) NOT NULL UNIQUE,
  started boolean NOT NULL DEFAULT false,
  ended boolean NOT NULL DEFAULT false,
  start_date timestamp NOT NULL,
  last_round_date timestamp NOT NULL,
  rounds_number smallint NOT NULL,
  minutes_between_rounds smallint NOT NULL,
  game_name VARCHAR(30) NOT NULL,

  CHECK (
    rounds_number > 1
    AND start_date < last_round_date - rounds_number * make_interval(mins := minutes_between_rounds)
  )
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


CREATE TABLE rounds (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  started boolean NOT NULL DEFAULT false,
  start_date timestamp NOT NULL,
  tournament_id uuid NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE
);


CREATE TABLE groups (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id uuid REFERENCES rounds (id) ON DELETE CASCADE,
  level smallint NOT NULL
);


CREATE TABLE group_members (
  group_id uuid REFERENCES groups (id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams (id) ON DELETE CASCADE,
  levelup boolean NOT NULL,

  PRIMARY KEY (group_id, team_id)
);


CREATE TABLE group_games (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id uuid REFERENCES groups (id) ON DELETE CASCADE
);


CREATE TABLE group_game_players (
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES group_games (id) ON DELETE CASCADE,
  winner boolean NOT NULL
);
