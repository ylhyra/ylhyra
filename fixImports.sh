#!/bin/bash
set -e

# A script to automatically fix all missing imports in a JavaScript project.
#

folder="src"

files="$(eslint "$folder" --format unix |\
  grep 'Error/no-undef' |\
  awk -F  ":" '{print $1}' |\
  sort -u)"

for file in $files
do
  npx importjs fix --overwrite "$file"
  npx prettier "$file" --write
done

