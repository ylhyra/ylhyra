#!/bin/bash
cd ${BASH_SOURCE%/*}/../
export NODE_ENV=production

npm run build_app &&
npm run build_server &&
npm run links_only &&
npm run vocabulary_only
