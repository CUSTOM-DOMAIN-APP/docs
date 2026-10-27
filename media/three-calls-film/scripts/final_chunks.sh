#!/bin/sh
# Resumable, parallel final render: 3 s chunks (60 fps, motion blur) for the given formats, 4 at a time. A chunk that
# already exists is skipped, so the command can simply be re-run after an interruption. Then a lossless concat + mux.
# Usage (from the project root): sh scripts/final_chunks.sh 16x9 9x16
set -e
DUR=$(node -p "require('./timeline.json').duration")
mkdir -p renders/chunks; : > renders/chunks/jobs.txt
for F in "$@"; do
  node -e "const d=$DUR;for(let a=0;a<d-1e-6;a+=3)console.log('$F',a,Math.min(d,+(a+3).toFixed(3)))" >> renders/chunks/jobs.txt
done
xargs -P4 -L1 sh scripts/chunk_one.sh < renders/chunks/jobs.txt
for F in "$@"; do
  ls renders/chunks/${F}_*.mp4 | sed "s#^renders/chunks/#file '#; s#\$#'#" > renders/chunks/${F}.txt
  ffmpeg -y -loglevel error -f concat -safe 0 -i renders/chunks/${F}.txt -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart "renders/${F}.mp4"
  echo "done renders/${F}.mp4"
done
