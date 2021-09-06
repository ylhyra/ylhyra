#!/bin/bash
set -e

eslint src/maker/editor/Short_audio/ --format unix |\
grep 'Error/no-undef' |\
awk -F  ":" '{print $1}' |\
sort -u |\
while read -r filename ; do
  echo $line
  npx importjs fix --overwrite "$line"
done