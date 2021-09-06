#!/bin/bash
set -e

# A script to automatically fix all missing imports in a JavaScript project.
# Passes files with missing variables to ImportJS
# (which is by itself too slow to run on an
#  entire project through the command line)
#
# Prerequesites:
# - Add ImportJS (https://github.com/Galooshi/import-js) to your project.

#folder="src"
#
#files="$(eslint "$folder" --format unix |\
#  grep 'Error/no-undef' |\
#  awk -F  ":" '{print $1}' |\
#  sort -u)"
#
#for file in $files
#do
#  npx importjs fix --overwrite "$file"
#  npx prettier "$file" --write
#done

find ./src/app -name "**.js*" -exec npx importjs fix --overwrite {} \;