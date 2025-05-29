#!/bin/sh
set -e

yarn prebuild
(yarn build-prod | cp -r /app/dist/* /etc/nginx/html) &

exec ./docker-entrypoint.sh