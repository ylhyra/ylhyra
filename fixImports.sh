#!/bin/bash
set -e
cd ${BASH_SOURCE%/*}

#cd src

files="$(eslint src --format unix |\
  grep 'Error/no-undef' |\
  awk -F  ":" '{print $1}' |\
  sort -u)"

for file in $files
do
  echo "$file"
  npx importjs fix "$file"
  npx prettier "$file" --write
done

#cd ..

