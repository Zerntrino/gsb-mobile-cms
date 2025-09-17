#!/bin/sh
cd /app

# Substitute environment variables in the Nginx template and save as the final config
envsubst '$API_BACKEND' < nginx.conf > nginx.default.conf

envsubst '$APPLE_APP_ID' < .well-known/apple-app-site-association > .well-known/apple-app-site-association

envsubst '$OAUTH2_ISSUER $OAUTH2_CLIENT_ID $OAUTH2_REDIRECT_URI $XAPPID' < src/environments/environment-template.prod.ts > src/environments/environment.prod.ts

exec "$@"
