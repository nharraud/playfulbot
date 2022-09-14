/*
 * Configuration Errors
 */

export class MissingConfigurationVariable extends Error {
  constructor() {
    super('PLAYFULBOT_CONFIG environment variable is not set');
  }
}