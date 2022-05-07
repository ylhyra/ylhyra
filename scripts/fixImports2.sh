#!/bin/bash
#{
#    sleep 3
#    kill $$
#} &

# Webstorm - run importjs on file save
# Install https://plugins.jetbrains.com/plugin/7177-file-watchers/
# Run:
# npm i -g import-js
#
# Settings:
#    Program: $ProjectFileDir$/scripts/fixImports2.sh
#    Args: $FilePathRelativeToProjectRoot$
#    Working directory: $ProjectFileDir$

#ps -ef | grep "importjs start"

#npx eslint --no-eslintrc  --rule "no-undef: error" --rule "no-unused-vars: error" /Users/egill/ylhyra/src/flashcards/flashcards/make/format/tmp.ts

#cat "$1" | npx import-js fix --overwrite "$1"


#/Users/egill/ylhyra/src/flashcards/flashcards/make/format/tmp.ts
#cat "$1" | prettierd file.ts --write


# npm install -g @fsouza/prettierd
# npm install -g eslint_d

cat "$1" | npx import-js fix --overwrite "$1"

#hasErrors="$(eslint_d --rule "no-undef: error" --rule "no-unused-vars: error" "$1" | grep -q "no-undef\|no-unused")"
#if [ "$hasErrors" ]; then
#  cat "$1" | npx import-js fix --overwrite "$1"
#fi;
#
#prettified="$(cat "$1" | prettierd "$1")"
#echo "$prettified" >| "$1"

#>| "$1"

# npx prettier "$1" --write
#exit 1
