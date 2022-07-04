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

#if [ "$1" == "git" ]; then
#  files="$(git diff --name-only --diff-filter d | grep '\.tsx\?$' | xargs)"
#else
folder="src/flashcards/flashcards"
echo 'Starting eslint'
files="$(eslint "$folder" --format unix  --rule "no-undef: error" |\
  grep 'Error/no-undef' |\
  awk -F  ":" '{print $1}' |\
  sort -u)"
echo "$files"
echo "are the files"
#fi;



echo 'Starting importjs'
for file in $files
do
  # Necessary due to TTY-detection in import-js
  cat "$file" | npx import-js fix --overwrite "$file"
  #  npx prettier "$file" --write
done

#cd src
#find ./app -name "**.js*" -exec npx importjs fix --overwrite {} \;