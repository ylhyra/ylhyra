#!/bin/bash
# Webstorm - run importjs on file save
# Install https://plugins.jetbrains.com/plugin/7177-file-watchers/
#
# Settings:
#    Program: $ProjectFileDir$/scripts/fixImports3.sh
#    Args: $FilePathRelativeToProjectRoot$
#    Working directory: $ProjectFileDir$

# npm i -g import-js
# npm install -g eslint_d
# brew install pcregrep

if echo "$1" | grep -q "\.tsx\?"; then
  if (eslint_d --rule "no-undef: error" "$1" | grep -q "no-undef"); then
    cat "$1" | npx import-js fix --overwrite "$1"
  fi;

  # Add space before exports
  perl -i -p0e 's/([^\n])\nexport/$1\n\nexport/g' /Users/egill/ylhyra/src/flashcards/flashcards/actions/deck/_functions.ts
fi;
