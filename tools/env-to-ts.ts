import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// Load and expand .env
const env = dotenv.config();
dotenvExpand.expand(env);

if (!env.parsed) {
  console.error(
    '❌ Failed to load .env file. Make sure it exists and is valid.'
  );
  process.exit(1);
}

const envVars = env.parsed;
let content = `export const environment = {\n  production: true,\n`;

for (const key in envVars) {
  const value = envVars[key]?.replace(/'/g, "\\'"); // escape single quotes
  content += `  ${key}: '${value}',\n`;
}

content += '};\n';

// Write to Angular env file
fs.writeFileSync('./src/environments/environment.prod.ts', content);
console.log('✔ Environment file generated.');
