#!/bin/bash

RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
NO_COLOR="\033[0m"


# Start database
# ${BASH_SOURCE%/*}/start.sh


# Create database: punktur
DOES_DATABASE_EXIST=`mysqlshow -u root | grep punktur`
if [ "$DOES_DATABASE_EXIST" == "" ]; then
  mysql -u root -p --execute "CREATE DATABASE IF NOT EXISTS punktur;"
  mysql -u root -p -D punktur < ${BASH_SOURCE%/*}/../../../project/server/settings/database.sql
  echo -e "${RED}Created database 'punktur'.${RED}"
else
  echo -e "${YELLOW}The database 'punktur' already exists. Do you want to reset it?${NO_COLOR}"
  read -p "[y/n] " input
  if [[ $input == "Y" || $input == "y" ]]; then
    mysql -u root -p -D punktur < ${BASH_SOURCE%/*}/../../../project/server/settings/database.sql
  fi
fi



# # Check if database user is set
# while [[ -z "$YLHYRA_DATABASE_USER" ]]
# do
#   echo -e "${RED}Please select a USERNAME for this database:${NO_COLOR}"
#   read YLHYRA_DATABASE_USER
#   # Append variable to .env
#   echo -e "YLHYRA_DATABASE_USER=\"${YLHYRA_DATABASE_USER}\"" >> ${BASH_SOURCE%/*}/../../.env
# done
#
# # Check if database password is set
# while [[ -z "$YLHYRA_DATABASE_PASSWORD" ]]
# do
#   echo -e "${RED}Please select a PASSWORD for this database:${NO_COLOR}"
#   read -s YLHYRA_DATABASE_PASSWORD
#   # Append variable to .env
#   echo -e "YLHYRA_DATABASE_PASSWORD=\"${YLHYRA_DATABASE_PASSWORD}\"" >> ${BASH_SOURCE%/*}/../../.env
# done


# Download and import data
# ${BASH_SOURCE%/*}/import.sh



# mysql -u root -p${MYSQL_ROOT_PASSWORD} -D lba < /usr/sql/sources.sql && \
