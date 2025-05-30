#!/bin/sh

# Substitute environment variables in the Nginx template and save as the final config
envsubst '$API_BACKEND' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

# ENV
cat > src/environments/environment.prod.ts <<EOF
export const environment = {
    production: true,
    OAUTH2_ISSUER: '${OAUTH2_ISSUER}',
    OAUTH2_CLIENT_ID: '${OAUTH2_CLIENT_ID}',
    OAUTH2_REDIRECT_URI: '${OAUTH2_REDIRECT_URI}',
};
EOF


# Start Nginx
exec "$@"
