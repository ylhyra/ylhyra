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
# Or, to only edit changed files:
#   ./scripts/fixImports.sh git
# Or:
#   ./scripts/fixImports.sh NameOfFolderInSrc

if [ "$1" == "git" ]; then
  files="$(git diff --name-only --diff-filter d | grep '\.tsx\?$' | xargs)"
else
  folder="src/$1"
  echo 'Starting eslint'
  files="$(eslint_d "$folder" --format unix  --rule "no-undef: error" |\
    grep 'Error/no-undef' |\
    awk -F  ":" '{print $1}' |\
    sort -u)"
  echo "$files"
  echo "are the files"
fi;



echo 'Starting importjs'
for file in $files
do
  npx import-js fix --overwrite "$file"
  npx prettier "$file" --write
done

#cd src
#find ./app -name "**.js*" -exec npx importjs fix --overwrite {} \;
