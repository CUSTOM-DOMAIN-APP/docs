# Voiceover: synthesize every line of vo_lines.json with Kokoro (local, kokoro-onnx), trim silence, place the lines one
# after another with their gaps, write audio/vo.wav + audio/vo_placed.json, and put each line's start into
# timeline.json as a mark ("vo_<id>", in beats) plus the total duration. The picture is then timed to the voice.
# Run from the project root:  python3 scripts/vo_build.py   (needs /home/user/tts/kokoro-v1.0.onnx + voices-v1.0.bin)
import json, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

V = json.load(open('vo_lines.json')); TL = json.load(open('timeline.json'))
SR = 48000; BPM = float(TL['bpm']); BEAT = 60 / BPM
k = Kokoro(os.environ.get('KOKORO_MODEL', '/home/user/tts/kokoro-v1.0.onnx'), os.environ.get('KOKORO_VOICES', '/home/user/tts/voices-v1.0.bin'))
os.makedirs('audio/vo', exist_ok=True)

def trim(a, sr, thr=0.012):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx): return a
    s, e = max(0, idx[0] - int(0.03 * sr)), min(len(a), idx[-1] + int(0.08 * sr))
    return a[s:e]

def resample(a, sr):
    if sr == SR: return a
    from scipy.signal import resample_poly
    from math import gcd
    g = gcd(SR, sr); return resample_poly(a, SR // g, sr // g)

t = V['lead_in']; placed = []; clips = []
for L in V['lines']:
    a, sr = k.create(L['say'], voice=V['voice'], speed=V['speed'], lang='en-us')
    a = resample(trim(np.asarray(a, dtype=np.float64), sr), sr)
    sf.write(f"audio/vo/{L['id']}.wav", a.astype(np.float32), SR)
    # snap each line start up to the next quarter-beat so marks sit on the grid
    t0 = np.ceil(t / (BEAT / 4) - 1e-9) * (BEAT / 4)   # never shortens a pause
    d = len(a) / SR
    placed.append({'id': L['id'], 'scene': L['scene'], 'text': L['say'], 't0': round(t0, 4), 't1': round(t0 + d, 4), 'beat0': round(t0 / BEAT, 3), 'beat1': round((t0 + d) / BEAT, 3)})
    clips.append((t0, a)); t = t0 + d + L['gap']
dur = round(t + V['tail'], 2)
N = int(dur * SR); out = np.zeros(N)
for t0, a in clips:
    i = int(round(t0 * SR)); out[i:i + len(a)] += a[: max(0, min(len(a), N - i))]
peak = np.abs(out).max(); out *= 0.89 / peak
sf.write('audio/vo.wav', out.astype(np.float32), SR)
json.dump(placed, open('audio/vo_placed.json', 'w'), indent=1)
TL['duration'] = dur
TL['marks'] = {**{k2: v for k2, v in TL.get('marks', {}).items() if not k2.startswith('vo_')}, **{f"vo_{p['id']}": p['beat0'] for p in placed}, **{f"vo_{p['id']}_end": p['beat1'] for p in placed}}
TL['marks']['done'] = round(dur / BEAT, 3)
json.dump(TL, open('timeline.json', 'w'), indent=1, ensure_ascii=False)
words = sum(len(p['text'].split()) for p in placed); speech = sum(p['t1'] - p['t0'] for p in placed)
print(f"audio/vo.wav  {len(placed)} lines  {words} words  duration {dur}s  speech {speech:.1f}s  ({words / speech * 60:.0f} wpm in-line, {words / dur * 60:.0f} wpm overall)")
for p in placed: print(f"  {p['id']}  {p['t0']:6.2f}–{p['t1']:6.2f}s  b{p['beat0']:7.2f}  {p['text']}")
