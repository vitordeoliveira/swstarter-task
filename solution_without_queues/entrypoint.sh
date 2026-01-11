#!/bin/sh
set -e

pnpm db:generate
pnpm db:migrate

exec "$@"