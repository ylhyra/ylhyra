# Webstorm - run importjs on file save
# Install https://plugins.jetbrains.com/plugin/7177-file-watchers/
#
# Settings:
#    Script: $ProjectFileDir$/scripts/fixImports2.sh
#    Args: $FilePathRelativeToProjectRoot$

#npx import-js fix --overwrite "$1"
#npx prettier "$1" --write

echo "$1"
