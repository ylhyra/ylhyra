#!/bin/bash
set -e

trap "kill 0" SIGINT

cd ${BASH_SOURCE%/*}/../

npm run build_all_and_prerender &&
npm run push_to_server
