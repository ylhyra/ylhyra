#!/bin/bash
trap "kill 0" SIGINT
cd "${BASH_SOURCE%/*}"/../ || exit
export $(cat .env)
export NODE_ENV=production

if webpack --config ./scripts/webpack/app.webpack.js; then
  rm -rf build/app_old
  [ -d ./build/app ] && mv ./build/app ./build/app_old
  mv ./build/app_tmp ./build/app

  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '.bak' 's/http:\/\/localhost:3000//g' "build/app/main.css"
  else
    sed -i 's/http:\/\/localhost:3000//g' "build/app/main.css"
  fi

  rm -f build/app/main.css.bak

  rm -rf  build/app_old
fi
