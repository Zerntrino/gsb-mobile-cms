#!/bin/sh

# Substitute environment variables in the Nginx template and save as the final config
envsubst '$API_BACKEND' < /app/nginx.conf > /app/nginx.default.conf

envsubst '$OAUTH2_ISSUER' < /app/src/environments/environment.prod.ts > /app/src/environments/environment.prod.ts
envsubst '$OAUTH2_CLIENT_ID' < /app/src/environments/environment.prod.ts > /app/src/environments/environment.prod.ts
envsubst '$OAUTH2_REDIRECT_URI' < /app/src/environments/environment.prod.ts > /app/src/environments/environment.prod.ts

# Start Nginx
# exec "$@"
