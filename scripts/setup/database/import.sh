# #!/bin/bash
#
# RED="\033[1;31m"
# YELLOW="\033[1;33m"
# CYAN="\033[1;36m"
# NO_COLOR="\033[0m"
#
# # Download and import 'punktur_maker' data
# echo -e "${YELLOW}Do you want to download and import the data for 'punktur_maker'?${NO_COLOR}"
# read -p "[y/n] " input
# if [[ $input == "Y" || $input == "y" ]]; then
#   # Download
#   curl -o ${BASH_SOURCE%/*}/punktur_maker.sql.bz2 https://punktur.is/files/database/punktur_maker.sql.bz2
#   # Import
#   echo
#   echo -e "${RED}Importing...${NO_COLOR} (this will take a while)"
#   bunzip2 < ${BASH_SOURCE%/*}/punktur_maker.sql.bz2 | mysql -u root -D punktur_maker &&
#   echo -e "${CYAN}Importing finished :)${NO_COLOR}"
#   # Remove database file
#   rm ${BASH_SOURCE%/*}/punktur_maker.sql.bz2
# fi



# source /home/egill/punktur/project/tagger/server/datasets/sounds/icelandic/islex_sound_library.sql
