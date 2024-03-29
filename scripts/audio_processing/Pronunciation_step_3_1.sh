#!/bin/bash
cd ${BASH_SOURCE%/*}/../../
INPUT=./build/images/audio/tmp_processed
OUTPUT=./build/images/audio

trap "kill 0" SIGINT
set -e

# STEP 3 - Fjarlægja þögn
find "${INPUT}" -name "*.wav" | while read filename; do
  basename=$(basename "$filename" .wav)
  echo "$basename"

  SILENCEREMOVE="silenceremove=
    start_periods=1:
    start_threshold=-60dB:
    start_silence=0.25:
    detection=peak,
  aformat=dblp,
  areverse"

  ffmpeg -nostdin -y -i "${INPUT}/${basename}.wav" -hide_banner -loglevel error -af "
    aexciter=
      amount=5:
      drive=2:
      ceil=12000,
    ${SILENCEREMOVE},
    ${SILENCEREMOVE}
  " \
    "${OUTPUT}/${basename}.mp3"
done

#loudnorm=I=-18:LRA=11:TP=-1.5
