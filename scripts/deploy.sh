#!/bin/bash
set -e

trap "kill 0" SIGINT

cd ${BASH_SOURCE%/*}/../

npm run build_all &&
npm run prerender_only && 
npm run push_to_server