import * as dotenv from 'dotenv';
dotenv.config();

import { config } from './development';

const environment = process.env.NODE_ENV;
const filePath = `./${environment}`;
let currentConfig = null;

try {
  const { config } = require(filePath);
  currentConfig = config;
} catch (err) {
  throw new Error('path not found');
}
const current = currentConfig || config;

export default [config, current];
