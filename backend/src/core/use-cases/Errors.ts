export class UnkownError extends Error {
  constructor(message: string, { cause }: { cause: Error }) {
    let finalMessage;
    if (message) {
      finalMessage = `Unknown Error: ${message}`;
    } else {
      finalMessage = 'Unknown Error';
    }
    super(finalMessage, { cause });
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class GameScheduleNotFoundError extends NotFoundError {
  constructor() {
    super('Game schedule not found');
  }
}

export class GameNotFoundError extends NotFoundError {
  constructor() {
    super('Game not found');
  }
}

export class RoundNotFoundError extends NotFoundError {
  constructor() {
    super('Round not found');
  }
}

export class TournamentNotFoundError extends NotFoundError {
  constructor() {
    super('Tournament not found');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}

export class DebugArenaNotFoundError extends NotFoundError {
  constructor() {
    super('Debug arena not found');
  }
}

export class PlayerNotFoundError extends NotFoundError {
  constructor() {
    super('Player not found');
  }
}

export class TeamNotFoundError extends NotFoundError {
  constructor() {
    super('Team not found');
  }
}

export class TournamentInvitationNotFound extends NotFoundError {
  constructor() {
    super('Invitation not found');
  }
}

export class InvalidRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidArgument extends Error {
  constructor(message: string, { cause }: { cause: Error }) {
    super(message, { cause });
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BotsForbiddenError extends ForbiddenError {
  constructor() {
    super('Bots are not allowed to perform this action');
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(msg: string, errors?: Record<string, string[]>) {
    super(msg);
    this.validationErrors = errors;
  }

  validationErrors: Record<string, string[]>;
}
