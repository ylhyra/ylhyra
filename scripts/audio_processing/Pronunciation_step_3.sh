#!/bin/bash
cd ${BASH_SOURCE%/*}/../../
INPUT=/Users/egill/ylhyra_content/not_data/files/audio/
OUTPUT=/Users/egill/ylhyra_content/not_data/files/audio/pronunciation/older

trap "kill 0" SIGINT
set -e

# STEP 3 - Fjarlægja þögn
find "${INPUT}" -name "*.wav" | while read filename; do
  basename=$(basename "$filename" .wav)
  echo "$basename"

  ffmpeg -nostdin -y -i "${INPUT}/${basename}.wav" -hide_banner -loglevel error -af "
    aexciter=
      amount=5:
      drive=2:
      ceil=12000
  " \
    "${OUTPUT}/${basename}.mp3"
done

#loudnorm=I=-18:LRA=11:TP=-1.5
