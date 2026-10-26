#!/bin/sh
# Two mixes from the same stems: with the voiceover (music ducked low under it) and without (music carries the film).
# → audio/mix_vo.wav, audio/mix_novo.wav  (each -14 LUFS, true peak under -1 dBTP after AAC)
set -e
node -e "const f='timeline.json',T=require('./'+f);T.mix={music:-13,sfx:-9,vo:0,duck:true};require('fs').writeFileSync(f,JSON.stringify(T,null,1))"
python3 scripts/mix.py && cp audio/mix.wav audio/mix_vo.wav
mv audio/vo.wav audio/vo.hold.wav
node -e "const f='timeline.json',T=require('./'+f);T.mix={music:-3,sfx:-8,vo:0,duck:false};require('fs').writeFileSync(f,JSON.stringify(T,null,1))"
python3 scripts/mix.py && cp audio/mix.wav audio/mix_novo.wav
mv audio/vo.hold.wav audio/vo.wav
cp audio/mix_vo.wav audio/mix.wav
