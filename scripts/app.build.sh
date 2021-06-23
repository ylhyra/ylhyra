#!/bin/bash
cd ${BASH_SOURCE%/*}/../
export NODE_ENV=production

rm -f build/app/*

if webpack --config ./scripts/app.webpack.js; then
  # [ -d ./build ] && mv ./build ./build_old
  # mv ./build_temp ./build
  # [ -d ./build_old ] && rm -rf ./build_old
  sed -i '.bak' 's/http:\/\/localhost:3000//g' "build/app/main.css"
  rm -f build/app/main.css.bak
fi
