#!/bin/bash
cd ${BASH_SOURCE%/*}/../../
INPUT=./../ylhyra_content/not_data/files/audio/pronunciation
OUTPUT=./build/images/audio

# STEP 3 - Fjarlægja þögn
SILENCEREMOVE="silenceremove=
  start_periods=1:
  start_duration=1:
  start_threshold=-60dB:
  start_silence=0.3:
  detection=peak,
aformat=dblp,
areverse"
ffmpeg -y -i file-processed1.wav -af "
  aexciter=amount=6:drive=2,
  acontrast,
  ${SILENCEREMOVE},
  ${SILENCEREMOVE}
" \
  file-processed11.wav
