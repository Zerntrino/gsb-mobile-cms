#!/bin/sh
cd /app

# Substitute environment variables in the Nginx template and save as the final config
envsubst '$API_BACKEND' < nginx.conf > nginx.default.conf

envsubst '$OAUTH2_ISSUER' < src/environments/environment.prod.ts > src/environments/environment.prod.ts
envsubst '$OAUTH2_CLIENT_ID' < src/environments/environment.prod.ts > src/environments/environment.prod.ts
envsubst '$OAUTH2_REDIRECT_URI' < src/environments/environment.prod.ts > src/environments/environment.prod.ts

exec "$@"
