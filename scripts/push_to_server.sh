#!/bin/bash
export $(cat .env)

# scp -P "${SERVER_SSH_PORT}" build/prerender/frontpage.html ${SERVER_IP_AND_FOLDER}/build/prerender/frontpage.html

# scp -P "${SERVER_SSH_PORT}" build/app/ylhyra.main.js ${SERVER_IP_AND_FOLDER}/build/app/ylhyra.main.js

rsync --recursive --compress -e "ssh -p ${SERVER_SSH_PORT}" ./build/ ${SERVER_IP_AND_FOLDER}/build
