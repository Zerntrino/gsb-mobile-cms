#!/bin/sh
set -e

yarn prebuild
yarn build-prod &
exec ./docker-entrypoint.sh