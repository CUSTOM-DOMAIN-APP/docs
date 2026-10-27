# Read the voiceover back with speech recognition (faster-whisper, small.en) and compare with the script, line by line.
# Flags any line whose transcript differs from the script beyond punctuation/case. Run from the project root.
import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
norm = lambda s: re.sub(r'[^a-z0-9 ]', '', s.lower().replace('-', ' ')).split()
bad = 0
for p in json.load(open('audio/vo_placed.json')):
    a48, sr = sf.read(f"audio/vo/{p['id']}.wav", dtype='float32')            # decode ourselves (PyAV-version proof)
    segs, _ = m.transcribe(resample_poly(a48, 1, 3).astype(np.float32), language='en', beam_size=5)
    heard = ' '.join(s.text.strip() for s in segs)
    a, b = norm(p['text']), norm(heard)
    ok = a == b
    bad += not ok
    print(('ok  ' if ok else 'DIFF') + f" {p['id']}: {heard}")
print('all lines match' if not bad else f'{bad} lines differ: listen and fix')
