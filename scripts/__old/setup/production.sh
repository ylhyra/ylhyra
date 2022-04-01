#!/bin/bash

#
#  svona gerir maður git executable:
#  git update-index --chmod=+x scripts/database/start.sh
#

RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
NO_COLOR="\033[0m"


# Homebrew (on MacOS)
if ! [ -x "$(command -v brew)" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Installing Homebrew${NO_COLOR}"
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi
fi

# Node (on MacOS)
if ! [ -x "$(command -v node)" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Installing Node${NO_COLOR}"
    brew install node
  else
    echo -e "${RED}Please install Node.js${RED}"
    exit
  fi
fi

# # Nodemon
# if ! [ -x "$(command -v nodemon)" ]; then
#   echo -e "${YELLOW}Installing Nodemon${NO_COLOR}"
#   sudo npm i nodemon -g
# fi

# pm2
if ! [ -x "$(command -v pm2)" ]; then
  echo -e "${YELLOW}Installing pm2${NO_COLOR}"
  sudo npm i pm2 -g
fi

# Package.json
cd ${BASH_SOURCE%/*}/../ && npm i
cd -

# Setup database
${BASH_SOURCE%/*}/database/create.sh

echo -e "${YELLOW}~ Dependencies installed ~${NO_COLOR}"
