#!/bin/bash
set -e

export $(cat .env)
cd ${BASH_SOURCE%/*}/../

echo "Running rsync..."
rsync \
  --recursive \
  --compress \
  --exclude ./build/server/development \
  --exclude ./build/images/audio/tmp \
  --exclude ./build/images/audio/tmp_ffmpeg \
  --exclude ./build/images/audio/tmp_processed \
  -e "ssh -p ${SERVER_SSH_PORT}" \
  ./build/ \
  ${SERVER_IP_AND_FOLDER}/build

# Start PM2
# pm2 start build/server/ylhyra_server.js --name ylhyra_new --log-date-format 'DD-MM HH:mm:ss.SSS' -i 1
# Restart PM2
# pm2 reload ylhyra_new
ssh -p "${SERVER_SSH_PORT}" ${SERVER_IP} "cd /home/egill/ylhyra_new && git pull origin master &> /dev/null"
ssh -p "${SERVER_SSH_PORT}" ${SERVER_IP} "cd /home/egill/ylhyra_content && git pull  origin content &> /dev/null"
ssh -p "${SERVER_SSH_PORT}" ${SERVER_IP} pm2 reload ylhyra_new
