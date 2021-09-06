#!/bin/bash
set -e

#cd src

eslint src --format unix |\
grep 'Error/no-undef' |\
awk -F  ":" '{print $1}' |\
sort -u |\
while read -r filename ; do
  npx importjs fix --overwrite "${filename}"
  echo $filename
  echo "haha"
#  npx prettier "$filename" --write
done

#cd ..

