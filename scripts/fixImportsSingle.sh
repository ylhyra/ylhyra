#!/bin/bash
# Webstorm - run importjs on file save
# Install https://plugins.jetbrains.com/plugin/7177-file-watchers/
#
# Settings:
#    Program: $ProjectFileDir$/scripts/fixImportsSingle.sh
#    Args: $FilePath$
#    File type: any

# npm i -g import-js
# npm install -g eslint_d
# brew install pcregrep

echo "$1";


if echo "$1" | grep -q "\.tsx\?"; then
#  content=$(cat "$1")

#  # Add space before exports
#  perl -i -p0e 's/([^\n])\nexport/$1\n\nexport/g' "$1"

#  if (eslint_d --rule "no-undef: error" "$1" | grep -q "no-undef"); then
#    echo "hahah: $1";
    # Necessary due to TTY-detection in import-js
    cat "$1" | importjs fix --overwrite "$1"
#  fi;
fi;
