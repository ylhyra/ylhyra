#!/bin/bash
cd ${BASH_SOURCE%/*}/../../
INPUT=./../ylhyra_content/not_data/files/audio/pronunciation
OUTPUT=./build/images/audio
mkdir "${OUTPUT}/tmp/"

# STEP 1 - Undirbúa til að senda í hljóðvinnslu
# Það er nauðsynlegt að keyra ffmpeg á þessum wav fælum
# vegna þess að Chrome upptökurnar eru á einhverju óstöðluðu formatti
find "${INPUT}" -name "*.wav" | while read filename; do
  basename=$(basename "$filename" .wav)
  ffmpeg -i "${INPUT}/${basename}.wav" "${OUTPUT}/tmp/${basename}.wav"
done
