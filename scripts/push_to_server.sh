#!/bin/bash
export $(cat .env)

echo "Running rsync..."
rsync --recursive --compress -e "ssh -p ${SERVER_SSH_PORT}" ./build/ ${SERVER_IP_AND_FOLDER}/build

# Start PM2
# pm2 start build/server/ylhyra_server.js --name ylhyra_new --log-date-format 'DD-MM HH:mm:ss.SSS' -i 1
# Restart PM2
# pm2 reload ylhyra_new
ssh -p "${SERVER_SSH_PORT}" ${SERVER_IP} pm2 reload ylhyra_new
