// Original file: src/infrastructure/grpc/proto/playfulbot_runner/v0/playfulbot_runner_v0.proto


export interface Game {
  'id'?: (string);
  'canceled'?: (boolean);
  'version'?: (number);
  'player'?: (number);
  'gameState'?: (string);
}

export interface Game__Output {
  'id': (string);
  'canceled': (boolean);
  'version': (number);
  'player': (number);
  'gameState': (string);
}
