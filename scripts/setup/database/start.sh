#!/bin/bash

RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
NO_COLOR="\033[0m"

# MySQL (on MacOS)
if ! [ -x "$(command -v mysql)" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Installing MySQL${NO_COLOR}"
    brew install mysql
  else
    echo -e "${RED}Please install MySQL${RED}"
    exit
  fi
fi

# Start MySQL (on MacOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  brew services list | grep 'mysql' &> /dev/null # Checks if MySQL is automatically started by Brew or not
  if [ $? != 0 ]; then
    echo
    echo -e "${RED}MySQL is not running. Do you want to:${NO_COLOR}"
    echo -e "   ${CYAN}1) Always start MySQL at login${NO_COLOR}"
    echo -e "   ${CYAN}2) Only start MySQL now${NO_COLOR}"
    read -p "Choose one of [1, 2]: " option
    case "$option" in
      "1") brew services start mysql ;; # Always start MySQL at login
      "2") mysql.server start        ;; # Only start MySQL now
    esac
  fi
fi

# Create database: ylhyra
DOES_DATABASE_EXIST=`mysqlshow -u root -p | grep ylhyra`
if [ "$DOES_DATABASE_EXIST" == "" ]; then
  echo -e "${YELLOW}Creating database${NO_COLOR}"
  mysql -u root -p --execute "CREATE DATABASE IF NOT EXISTS ylhyra;"
  mysql -u root -p -D ylhyra < ${BASH_SOURCE%/*}/../../../server/settings/database.sql
  echo -e "${RED}Created database 'ylhyra'.${RED}"
fi
