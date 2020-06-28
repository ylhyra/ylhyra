#!/bin/bash
cd ${BASH_SOURCE%/*}/../
export NODE_ENV=production
if node ./scripts/webpack/frontend/build.js; then
  [ -d ./build ] && mv ./build ./build_old
  mv ./build_temp ./build 
  [ -d ./build_old ] && rm -rf ./build_old
fi
