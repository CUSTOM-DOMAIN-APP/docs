# Score for "Three Calls" → audio/music.wav. Minimal house at timeline.bpm (118), synthesized and seeded.
# intro (pad, ticking hats) → groove from "One." (soft four-on-the-floor kick, off-beat hats, a syncopated bass line in
# A minor, felt chord stabs; the filter opens a little with each call) → a short riser into "No DNS code" → breakdown
# (no kick) → end (the chord rings, one last kick).
import json, numpy as np, soundfile as sf
from scipy import signal
TL = json.load(open('timeline.json'))
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM; N = int(SR * DUR); M = TL['marks']; T = lambda b: b * BEAT
rng = np.random.default_rng(118)
def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def add(dst, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N: return
    if i < 0: x = x[-i:]; i = 0
    x = x[: N - i] * g
    dst[i:i + len(x), 0] += x * np.sqrt((1 - pan) / 2) * 1.414; dst[i:i + len(x), 1] += x * np.sqrt((1 + pan) / 2) * 1.414
def kick(g=1.0):
    t = tt(0.32); f = 48 + 90 * np.exp(-t * 32); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * g
def hat(open_=False):
    t = tt(0.18 if open_ else 0.05); return filt(rng.standard_normal(len(t)), 'highpass', 7500) * np.exp(-t * (22 if open_ else 90))
def clap():
    t = tt(0.16); n = filt(rng.standard_normal(len(t)), 'bandpass', [900, 2600]); env = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.012, 0.024))
    return n * env * 0.5
def bass(m, d):
    t = tt(d); f = hz(m); x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sign(np.sin(2 * np.pi * f * t))
    return filt(x * np.minimum(t / 0.005, 1) * np.exp(-t * 3.5), 'lowpass', 700)
def stab(ms, d, lp):
    t = tt(d); x = sum(np.sin(2 * np.pi * hz(m) * t + 0.6 * np.sin(2 * np.pi * hz(m) * 2 * t) * np.exp(-t * 8)) for m in ms) / len(ms)
    return filt(x * np.minimum(t / 0.004, 1) * np.exp(-t * 5.5), 'lowpass', lp)
def pad(ms, d, lp):
    t = tt(d); x = np.zeros_like(t)
    for m in ms:
        for dv in (-0.005, 0.005): x += (2 * ((hz(m) * (1 + dv) * t + rng.random()) % 1) - 1) * 0.15
    return filt(x * np.minimum(t / 0.8, 1) * np.clip((d - t) / 0.8, 0, 1), 'lowpass', lp)
def riser(d):
    t = tt(d); u = t / d; return filt(rng.standard_normal(len(t)), 'bandpass', [600, 7000]) * u ** 2.5 * 0.6
b_in, b_bd, b_end = M['vo_b1'] - 0.5, M['vo_e1'] - 0.5, M['vo_f1'] - 0.5
CH = [(45, [57, 60, 64, 67, 71]), (41, [57, 60, 64, 65, 69]), (48, [55, 60, 64, 67, 71]), (43, [55, 59, 62, 64, 67])]   # Am9 Fmaj9 Cmaj7 G6
drums = np.zeros((N, 2)); bas = np.zeros((N, 2)); keys = np.zeros((N, 2)); fx = np.zeros((N, 2))
NB = int(DUR / BEAT) + 1
calls = [M['vo_b1'], M['vo_c1'], M['vo_d1']]
def lp_at(b): return 900 + 900 * sum(b >= c for c in calls) + (600 if b >= M['vo_d2'] else 0)
for b in range(NB):
    bar, beat = divmod(b, 4); root, tones = CH[bar % 4]
    if b < b_end:
        add(drums, hat(False), T(b + 0.5), 0.10 if b < b_in else 0.16, 0.3)
        if b >= b_in and b < b_bd:
            add(drums, kick(0.55), T(b))
            if beat in (1, 3): add(drums, clap(), T(b), 0.22, -0.1)
            add(drums, hat(True), T(b + 0.5), 0.05, -0.3)
            for s, dm in ((0, 0), (0.75, 12), (1.5, 0), (2.5, 7)) if beat == 0 else ():
                add(bas, bass(root + dm - 12 + 12, 0.35), T(b + s), 0.30)
        if beat == 0:
            if b >= b_in: add(keys, stab(tones[:4], 0.6, lp_at(b)), T(b + 0.5), 0.16, 0.2); add(keys, stab(tones[1:], 0.5, lp_at(b)), T(b + 2.75), 0.12, -0.2)
            add(keys, pad(tones, 4 * BEAT + 0.3, 1200 if b < b_in else lp_at(b)), T(b), 0.12 if b < b_in else 0.08)
add(fx, riser(T(b_bd - M['vo_d2'] - 0.5)), T(M['vo_d2'] + 0.5), 0.3)
# end: the chord rings, one last kick
add(keys, pad([57, 60, 64, 67, 71, 76], DUR - T(b_end) + 0.4, 3000), T(b_end), 0.16)
add(keys, stab([69, 72, 76, 79], 1.6, 3500), T(b_end), 0.2)
add(drums, kick(0.7), T(b_end))
mix = drums + bas + keys + fx
ir = np.exp(-np.arange(int(1.4 * SR)) / (0.35 * SR)) * rng.standard_normal(int(1.4 * SR)) * 0.02
mix += np.stack([signal.fftconvolve(keys[:, c], ir)[:N] for c in range(2)], 1) * 0.5
mix = filt(mix, 'highpass', 30)
fade = int(1.6 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
mix /= np.abs(mix).max() / 10 ** (-1 / 20)
sf.write('audio/music.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav {DUR}s  groove b{b_in:.1f}–b{b_bd:.1f}, breakdown → b{b_end:.1f}')
