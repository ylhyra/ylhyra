#!/bin/bash

RED="\033[1;31m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
NO_COLOR="\033[0m"
ENV_FILE=${BASH_SOURCE%/*}/../../../.env

# Load env file if it exists
if test -f "$ENV_FILE"; then
  source ${ENV_FILE}
fi

# Start database
# ${BASH_SOURCE%/*}/start.sh


# Create database: ylhyra
DOES_DATABASE_EXIST=`mysqlshow -u root | grep ylhyra`
if [ "$DOES_DATABASE_EXIST" == "" ]; then
  echo -e "${CYAN}\nCreating database.\nYou may need to enter your MySQL database root password:${NO_COLOR}"
  mysql -u root -p --execute "CREATE DATABASE IF NOT EXISTS ylhyra;" || { echo 'Could not create database' ; exit 1; }
  echo -e "${CYAN}\nDone.\nYou may need to enter your MySQL database root password again:${NO_COLOR}"
  mysql -u root -p -D ylhyra < ${BASH_SOURCE%/*}/../../../project/server/database/ylhyra.sql || { echo 'Import failed' ; exit 1; }
  echo -e "${RED}Created database 'ylhyra'.${NO_COLOR}"
else
  echo -e "${CYAN}The database 'ylhyra' already exists. Do you want to reset it?${NO_COLOR}"
  read -p "[y/n] " input
  if [[ $input == "Y" || $input == "y" ]]; then
    echo -e "${CYAN}\nCreating database.\nYou may need to enter your MySQL database root password:${NO_COLOR}"
    mysql -u root -p -D ylhyra < ${BASH_SOURCE%/*}/../../../project/server/database/ylhyra.sql || { echo 'Import failed' ; exit 1; }
  else
    echo -e "${CYAN}Exiting.${NO_COLOR}"
    exit;
  fi
fi




# Check if database user is set
while [[ -z "$YLHYRA_DATABASE_USER" ]]
do
  echo -e "${CYAN}Please select a USERNAME for this database:${NO_COLOR}"
  read YLHYRA_DATABASE_USER
  # Append variable to .env
  echo -e "YLHYRA_DATABASE_USER=\"${YLHYRA_DATABASE_USER}\"" >> ${ENV_FILE}
done

# Check if database password is set
while [[ -z "$YLHYRA_DATABASE_PASSWORD" ]]
do
  echo -e "${CYAN}Please select a PASSWORD for this database:${NO_COLOR}"
  read -s YLHYRA_DATABASE_PASSWORD
  # Append variable to .env
  echo -e "YLHYRA_DATABASE_PASSWORD=\"${YLHYRA_DATABASE_PASSWORD}\"" >> ${ENV_FILE}

  echo -e "${CYAN}Granting rights to user...${NO_COLOR}"
  echo -e "${CYAN}You may need to enter your root password:${NO_COLOR}"
  mysql -u root -p --execute "GRANT ALL ON ylhyra.* TO '${YLHYRA_DATABASE_USER}'@'localhost' IDENTIFIED BY '${YLHYRA_DATABASE_PASSWORD}'; " || { echo 'Could not create database' ; exit 1; }
done







# Download and import data
# ${BASH_SOURCE%/*}/import.sh



# mysql -u root -p${MYSQL_ROOT_PASSWORD} -D lba < /usr/sql/sources.sql && \
