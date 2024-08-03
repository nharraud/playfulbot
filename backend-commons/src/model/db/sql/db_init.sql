CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET timezone='UTC';

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(15) NOT NULL UNIQUE CHECK (length(username) >= 3),
  password BYTEA NOT NULL
);

CREATE TYPE tournament_status AS ENUM ('CREATED', 'STARTED', 'ENDED');

CREATE TABLE tournaments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(15) NOT NULL,
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
  name VARCHAR(15) NOT NULL CHECK (length(name) >= 3),
  UNIQUE(tournament_id, name)
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


/*
 * Game Logic
 */

CREATE TABLE game_runners (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY
);

CREATE TABLE arena (
  id VARCHAR(73) PRIMARY KEY
);

CREATE TYPE game_status AS ENUM ('pending', 'started', 'ended');

CREATE TABLE games (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  started_at timestamp DEFAULT NOW(),
  game_def_id VARCHAR(36) NOT NULL,
  players json[] NOT NULL,
  runner_id uuid REFERENCES game_runners(id) ON DELETE SET NULL,
  arena VARCHAR(73) NULL REFERENCES arena(id) ON DELETE CASCADE,
  status game_status DEFAULT 'pending'
);


CREATE FUNCTION fetch_game(calling_runner_id uuid) RETURNS games AS $$
DECLARE
    selected_game games;
BEGIN
    UPDATE games
      SET runner_id = calling_runner_id, status = 'started'
      WHERE id = (
          SELECT id
          FROM games
          WHERE runner_id IS NULL
          FOR UPDATE SKIP LOCKED
          LIMIT 1
      ) RETURNING * INTO selected_game;

    IF selected_game IS NULL THEN
        -- No game was found
        RETURN NULL;
    END IF;

    IF selected_game.arena IS NOT NULL THEN
      -- Send a NOTIFY message to the game_scheduler channel with the game.
      PERFORM pg_notify('arena_' || selected_game.arena, row_to_json(selected_game)::text);
    END IF;

    RETURN selected_game;
END;
$$ LANGUAGE plpgsql;


-- CREATE FUNCTION notify_arena_delete() RETURNS void AS $$
-- BEGIN
--     PERFORM pg_notify('arena_' || OLD.id, 'DELETED');
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER notify_arena_delete
--     AFTER DELETE ON arena
--     FOR EACH ROW
--     EXECUTE FUNCTION notify_arena_delete();

/*
 * FIXME
 */


CREATE TABLE game_summaries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  round_id uuid REFERENCES rounds (id) ON DELETE CASCADE
);


CREATE TABLE playing_teams (
  team_id uuid NOT NULL REFERENCES teams (id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES game_summaries (id) ON DELETE CASCADE,
  winner boolean NOT NULL
);


CREATE TYPE tournament_role_name AS ENUM ('ADMIN');

CREATE TABLE tournament_roles (
  tournament_id uuid REFERENCES tournaments (id) ON DELETE CASCADE,
  user_id uuid REFERENCES users (id) ON DELETE CASCADE,
  role tournament_role_name NOT NULL,
  PRIMARY KEY (tournament_id, user_id)
);


CREATE TABLE tournament_invitation_links (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id uuid NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE
);


CREATE TABLE tournament_invitations (
  tournament_id uuid REFERENCES tournaments (id) ON DELETE CASCADE,
  user_id uuid REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (tournament_id, user_id)
);