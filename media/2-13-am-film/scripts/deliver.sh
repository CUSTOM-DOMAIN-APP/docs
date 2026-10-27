#!/bin/sh
# Mux the rendered pictures (renders/16x9.mp4, renders/9x16.mp4) with both mixes → the four deliverables in renders/out/.
set -e
mkdir -p renders/out
for F in 16x9 9x16; do
  for V in vo novo; do
    NAME="customdomain-2-13-am-${F}-$( [ $V = vo ] && echo voiceover || echo no-voiceover ).mp4"
    ffmpeg -y -loglevel error -i "renders/${F}.mp4" -i "audio/mix_${V}.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "renders/out/${NAME}"
    echo "renders/out/${NAME}"
  done
done
