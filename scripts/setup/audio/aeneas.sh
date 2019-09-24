#!/bin/bash

#  Install dependencies for [Aeneas](https://github.com/readbeyond/aeneas/), which synchronizes audio and text.

# LINUX
if [[ "$OSTYPE" == "linux"* ]]; then
  wget https://raw.githubusercontent.com/readbeyond/aeneas/master/install_dependencies.sh
  bash install_dependencies.sh
  rm install_dependencies.sh
fi

# MAC OS
if [[ "$OSTYPE" == "darwin"* ]]; then
  xcode-select --install
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  brew update
  brew install danielbair/tap/aeneas
fi
