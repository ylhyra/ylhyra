#!/bin/bash
{
    sleep 3
    kill $$
} &

# Webstorm - run importjs on file save
# Install https://plugins.jetbrains.com/plugin/7177-file-watchers/
# npm i -g import-js
#
# Edit the following file:
#   > /usr/local/lib/node_modules/import-js/build/importjs.js
# Change
#     if (process.stdin.isTTY)
# to
#     if (true)
#
# Settings:
#    Program: $ProjectFileDir$/scripts/fixImports2.sh
#    Args: $FilePathRelativeToProjectRoot$

cat "$1" | npx import-js fix --overwrite "$1"
npx prettier "$1" --write
exit 0
