import { readFileSync } from 'fs';
import { MissingConfigurationVariable } from './errors';
import { PlayfulbotConfig } from './playfulbotConfig'

export async function loadConfig() {
  const PLAYFULBOT_CONFIG = process.env.PLAYFULBOT_CONFIG;

  if (!PLAYFULBOT_CONFIG) {
    throw new MissingConfigurationVariable();
  }
  const fileContent = readFileSync(PLAYFULBOT_CONFIG);

  return JSON.parse(fileContent.toString('utf8')) as PlayfulbotConfig;
}