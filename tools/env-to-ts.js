const fs = require("fs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

// Load and expand .env
const env = dotenv.config();
dotenvExpand.expand(env);

// Generate TS content
const envVars = env.parsed;
console.log(envVars);
let content = `export const environment = {\n  production: true,\n`;

for (const key in envVars) {
  content += `  ${key}: '${envVars[key]}',\n`;
}

content += "};\n";

// Write to Angular env file
fs.writeFileSync("./src/environments/environment.ts", content);
console.log("✔ Environment file generated.");
