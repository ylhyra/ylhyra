#!/bin/bash
INPUT=./../ylhyra_content/not_data/files/audio/pronunciation
OUTPUT=./build/images/audio
mkdir "${OUTPUT}/tmp_ffmpeg/"

# STEP 1 - Undirbúa til að senda í hljóðvinnslu
# Það er nauðsynlegt að keyra ffmpeg á þessum wav fælum
# vegna þess að Chrome upptökurnar eru á einhverju óstöðluðu formatti
find "${INPUT}" -name "*.wav" | while read filename; do
  basename=$(basename "$filename" .wav)
  ffmpeg -hide_banner -loglevel error -i "${INPUT}/${basename}.wav" "${OUTPUT}/tmp_ffmpeg/${basename}.wav"
done
