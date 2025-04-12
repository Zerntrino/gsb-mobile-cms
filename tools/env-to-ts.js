"use strict";
var _a;
exports.__esModule = true;
var fs = require("fs");
var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
// Load and expand .env
var env = dotenv.config();
dotenvExpand.expand(env);
if (!env.parsed) {
    console.error('❌ Failed to load .env file. Make sure it exists and is valid.');
    process.exit(1);
}
var envVars = env.parsed;
var content = "export const environment = {\n  production: true,\n";
for (var key in envVars) {
    var value = (_a = envVars[key]) === null || _a === void 0 ? void 0 : _a.replace(/'/g, "\\'"); // escape single quotes
    content += "  ".concat(key, ": '").concat(value, "',\n");
}
content += '};\n';
// Write to Angular env file
fs.writeFileSync('./src/environments/environment.prod.ts', content);
console.log('✔ Environment file generated.');
