#!/bin/sh
yarn prebuild
(yarn build-prod | cp -r /app/dist/* /etc/nginx/html) &

./docker-entrypoint.sh

nginx -g 'daemon off;'