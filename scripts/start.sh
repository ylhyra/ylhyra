#!/bin/bash
cd ${BASH_SOURCE%/*}/../
new_tab='tell application "System Events" to tell process "Terminal" to keystroke "t" using command down'

osascript -e 'tell application "Terminal" to activate' \
  -e "tell application \"Terminal\" to do script \"cd $(pwd); npm run start\" in selected tab of the front window" \
  -e "${new_tab}" \
  -e "tell application \"Terminal\" to do script \"cd $(pwd); npm run server\" in selected tab of the front window" \
  -e "${new_tab}" \
  -e "tell application \"Terminal\" to do script \"cd $(pwd)\" in selected tab of the front window"
