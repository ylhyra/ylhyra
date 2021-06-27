#!/bin/bash
export $(cat .env)

scp -P "${SERVER_SSH_PORT}" build/prerender/frontpage.html ${SERVER_IP_AND_FOLDER}/build/prerender/frontpage.html
