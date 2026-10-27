#!/bin/sh
# Render one final chunk (60 fps, motion blur) unless it already exists: sh scripts/chunk_one.sh <fmt> <a> <b>
FMT=$1; A=$2; B=$3; OUT="renders/chunks/${FMT}_$(printf %03d $A).mp4"
[ -s "$OUT" ] && exit 0
node scripts/render.mjs --fmt "$FMT" --range "$A,$B" > "renders/chunks/${FMT}_${A}.log" 2>&1 && mv "renders/clip_${FMT}_${A}-${B}.mp4" "$OUT" && echo "ok $OUT"
