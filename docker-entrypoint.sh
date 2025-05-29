#!/bin/sh

# Substitute environment variables in the Nginx template and save as the final config
envsubst '$API_BACKEND' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

cp -r /app/dist/* /etc/nginx/html

# Start Nginx
exec "$@"
