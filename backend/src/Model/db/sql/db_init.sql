CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET timezone='UTC';

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(15) NOT NULL UNIQUE,
  password BYTEA NOT NULL
);

CREATE TYPE tournament_status AS ENUM ('CREATED', 'STARTED', 'ENDED');

CREATE TABLE tournaments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(15) NOT NULL UNIQUE,
  status tournament_status NOT NULL DEFAULT 'CREATED',
  start_date timestamp with time zone NOT NULL,
  last_round_date timestamp with time zone NOT NULL,
  rounds_number smallint NOT NULL CHECK (rounds_number > 1),
  minutes_between_rounds smallint NOT NULL,
  game_name VARCHAR(30) NOT NULL,

  CONSTRAINT first_round_after_tournament_start CHECK (
    start_date <= last_round_date - rounds_number * make_interval(mins := minutes_between_rounds)
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


CREATE TYPE round_status AS ENUM ('CREATED', 'STARTED', 'ENDED');

CREATE TABLE rounds (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  status round_status NOT NULL DEFAULT 'CREATED',
  start_date timestamp with time zone NOT NULL,
  tournament_id uuid NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE
);

CREATE TABLE round_players (
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  round_id uuid REFERENCES rounds (id) ON DELETE CASCADE,
  points smallint NOT NULL DEFAULT 0
);


CREATE TABLE game_summaries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id uuid REFERENCES rounds (id) ON DELETE CASCADE
);


CREATE TABLE playing_teams (
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES game_summaries (id) ON DELETE CASCADE,
  winner boolean NOT NULL
);
