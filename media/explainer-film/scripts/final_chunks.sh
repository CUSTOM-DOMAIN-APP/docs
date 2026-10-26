#!/bin/sh
# Resumable final render: 6 s chunks (60 fps, motion blur), skipped when already complete, then a lossless concat + mux.
# Usage (from the project root): sh scripts/final_chunks.sh 16x9
set -e
FMT="$1"; DUR=42; STEP=6
mkdir -p renders/chunks
a=0
while [ $a -lt $DUR ]; do
  b=$((a + STEP)); [ $b -gt $DUR ] && b=$DUR
  out="renders/chunks/${FMT}_$(printf %02d $a).mp4"
  if [ ! -s "$out" ]; then
    node scripts/render.mjs --fmt "$FMT" --range "$a,$b"
    mv "renders/clip_${FMT}_${a}-${b}.mp4" "$out"
  fi
  a=$b
done
ls renders/chunks/${FMT}_*.mp4 | sed "s#^renders/chunks/#file '#; s#\$#'#" > renders/chunks/${FMT}.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i renders/chunks/${FMT}.txt -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest -movflags +faststart "renders/${FMT}.mp4"
echo "done renders/${FMT}.mp4"
