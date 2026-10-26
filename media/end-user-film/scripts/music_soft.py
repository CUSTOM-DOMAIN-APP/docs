# A quiet score for a narrated explainer → audio/music.wav. Synthesized and seeded; runs at timeline.bpm.
# Sections follow the story (marks from the voiceover): open (warm, sparse) → the usual way (minor, a ticking pulse that
# tightens) → the turn (a short riser) → our way (major, a soft kick and brighter mallets) → resolve (held chord, rings out).
# No drums loud enough to fight the voice; the mix ducks it further under the narration.
import json, numpy as np, soundfile as sf
from scipy import signal

TL = json.load(open('timeline.json'))
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM; N = int(SR * DUR); M = TL['marks']
T = lambda b: b * BEAT
rng = np.random.default_rng(1207)

def tt(d): return np.arange(int(d * SR)) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def add(dst, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N: return
    x = x[: N - i] * g
    dst[i:i + len(x), 0] += x * np.sqrt((1 - pan) / 2) * 1.414
    dst[i:i + len(x), 1] += x * np.sqrt((1 + pan) / 2) * 1.414

def mallet(m, d=1.6, bright=0.8):     # soft FM keys, slow decay: a felt-piano feel
    t = tt(d); f = midi(m)
    x = np.sin(2 * np.pi * f * t + bright * np.exp(-t * 9) * np.sin(2 * np.pi * 2 * f * t))
    x += 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t * 9)
    return x * np.minimum(t / 0.004, 1) * np.exp(-t * 2.2)
def sub(m, d):
    t = tt(d); f = midi(m)
    return np.sin(2 * np.pi * f * t) * np.minimum(t / 0.03, 1) * np.clip((d - t) / 0.2, 0, 1) * np.exp(-t * 0.6)
def tick(g=1.0):                        # a soft clock tick
    t = tt(0.04); return filt(rng.standard_normal(len(t)), 'bandpass', [2500, 6000]) * np.exp(-t * 180) * g
def shaker(g=1.0):
    t = tt(0.09); return filt(rng.standard_normal(len(t)), 'highpass', 6000) * np.exp(-t * 60) * np.minimum(t / 0.01, 1) * g
def kick(g=1.0):
    t = tt(0.35); f = 45 + 60 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * g
def riser(d):
    t = tt(d); u = t / d; x = filt(rng.standard_normal(len(t)), 'bandpass', [400, 5000]) * u ** 3
    return x + 0.3 * np.sin(2 * np.pi * (200 + 600 * u ** 2) * t) * u ** 2

CH = {  # (bass root, chord tones) as midi notes
    'Fmaj7': (41, [65, 69, 72, 76]), 'Am7': (45, [64, 67, 69, 72]), 'Dm7': (38, [62, 65, 69, 72]), 'Cmaj7': (36, [64, 67, 71, 72]),
    'Am': (45, [64, 69, 72, 76]), 'F': (41, [65, 69, 72, 77]), 'Dm': (38, [62, 65, 69, 74]), 'E': (40, [64, 68, 71, 76]),
    'C': (36, [64, 67, 72, 76]), 'G': (43, [62, 67, 71, 74]), 'Gsus': (43, [62, 67, 72, 74]),
}
b_usual, b_turn, b_ours, b_cmp, b_end = M['vo_c1'] - 0.5, M['vo_d1'] - 1, M['vo_e1'] - 0.5, M['vo_f1'] - 0.5, M['vo_g1'] - 0.5
NB = int(np.ceil(DUR / BEAT))
L = np.zeros((N, 2)); keys = np.zeros((N, 2)); low = np.zeros((N, 2)); perc = np.zeros((N, 2))
prog = {'open': ['Fmaj7', 'Am7', 'Dm7', 'Cmaj7'], 'usual': ['Am', 'F', 'Dm', 'E'], 'ours': ['C', 'G', 'Am', 'F'], 'end': ['F', 'G', 'C', 'C']}
def section(b):
    if b < b_usual: return 'open'
    if b < b_turn: return 'usual'
    if b < b_ours: return 'turn'
    if b < b_end: return 'ours'
    return 'end'
bar = 0
for b in range(0, NB, 4):
    sec = section(b)
    if sec == 'turn': continue
    name = prog[sec][(b // 4) % 4] if sec != 'end' else prog['end'][min(3, (b - int(b_end)) // 4)]
    root, tones = CH[name]
    add(low, sub(root, T(4) * 0.98), T(b), 0.5)
    # arpeggio: open = slow quarter notes, usual = steady eighths (urgency), ours = gentle dotted pattern, end = held chord
    if sec == 'open':
        for i, s in enumerate([0, 1, 2, 3]): add(keys, mallet(tones[i % 4], 1.8, 0.6), T(b + s), 0.22, (i - 1.5) * 0.3)
    elif sec == 'usual':
        for i in range(8): add(keys, mallet(tones[[0, 2, 1, 3, 2, 1, 3, 2][i]], 0.9, 0.5), T(b + i * 0.5), 0.15, (i % 2 - 0.5) * 0.4)
    elif sec == 'ours':
        for i, s in enumerate([0, 0.75, 1.5, 2, 2.75, 3.5]): add(keys, mallet(tones[[0, 1, 2, 3, 2, 1][i]] + 12 * (i == 3), 1.4, 0.9), T(b + s), 0.17, (i % 3 - 1) * 0.35)
    else:
        for i, m in enumerate(tones): add(keys, mallet(m, 4.5, 0.7), T(b) + i * 0.03, 0.2, (i - 1.5) * 0.25)
for b in range(NB):
    sec = section(b)
    if sec == 'usual':                   # the clock: ticks on every beat, eighths in the last stretch
        add(perc, tick(0.35), T(b), 1, 0.2)
        if b > (b_usual + b_turn) / 2: add(perc, tick(0.2), T(b + 0.5), 1, -0.2)
    if sec == 'ours':
        if b % 2 == 0: add(perc, kick(0.45), T(b))
        add(perc, shaker(0.12), T(b + 0.5), 1, 0.3)
add(perc, riser(T(b_ours - b_turn)), T(b_turn), 0.35)
mix = keys + low * 0.9 + perc
# a little room
ir = np.exp(-np.arange(int(0.9 * SR)) / (0.25 * SR)) * rng.standard_normal(int(0.9 * SR)) * 0.02
for c in range(2): mix[:, c] += signal.fftconvolve(keys[:, c], ir)[:N] * 0.6
mix = filt(mix, 'highpass', 30)
fade = int(1.5 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
mix /= np.abs(mix).max() / 10 ** (-1 / 20)
sf.write('audio/music.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav {DUR}s {BPM:g} bpm  sections: usual b{b_usual:.1f}, turn b{b_turn:.1f}, ours b{b_ours:.1f}, end b{b_end:.1f}')
