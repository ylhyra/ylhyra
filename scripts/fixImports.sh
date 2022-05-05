#!/bin/bash
set -e

# A script to automatically fix all missing imports in a JavaScript project.
# Passes files with missing variables to ImportJS
# (which is by itself too slow to run on an
#  entire project through the command line)
#
# Uses ImportJS (https://github.com/Galooshi/import-js)
#
# To run:
#   ./scripts/fixImports.sh
# Or:
#   ./scripts/fixImports.sh NameOfFolderInSrc

folder="src/$1"

echo 'Starting eslint'
files="$(eslint "$folder" --format unix |\
  grep 'Error/no-undef' |\
  awk -F  ":" '{print $1}' |\
  sort -u)"

echo 'Starting importjs'
for file in $files
do
  npx import-js fix --overwrite "$file"
  npx prettier "$file" --write
done

#cd src
#find ./app -name "**.js*" -exec npx importjs fix --overwrite {} \;
