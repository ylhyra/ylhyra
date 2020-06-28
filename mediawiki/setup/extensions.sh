#!/bin/bash
MEDIAWIKI_BRANCH=REL1_34

extensions=(
  BetaFeatures
  CategoryTree
  Cite
  CodeMirror
  ConfirmEdit
  Disambiguator
  ExternalData
  Gadgets
  InputBox
  Interwiki
  ParserFunctions
  Renameuser
  Scribunto
  StopForumSpam
  Lockdown
  TemplateData
  VisualEditor
  # WikiEditor
)

for i in "${extensions[@]}"
do
  git clone --depth 1 -b $MEDIAWIKI_BRANCH \
    https://gerrit.wikimedia.org/r/mediawiki/extensions/$i \
    /var/www/html/extensions/$i
done

git clone --depth 1 \
  https://gitlab.com/hydrawiki/extensions/EmbedVideo.git \
  /var/www/html/extensions/EmbedVideo

chmod a+x /var/www/html/extensions/Scribunto/includes/engines/LuaStandalone/binaries/lua*_linux_*/lua

cd /var/www/html/extensions/VisualEditor \
&& git submodule update --init \
&& cd /var/www/html
