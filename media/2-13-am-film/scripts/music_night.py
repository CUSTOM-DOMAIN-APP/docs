# Score for "2:13 AM" → audio/music.wav. Synthesized and seeded, at timeline.bpm (80).
# night: a quiet clock tick on every beat and a cold, low-passed pad in D minor; a low double pulse while the queue
# floods → a beat of near silence before "So we shipped" → morning: a warm plucked figure in D major over an open pad →
# the next night: the tick returns, slower and softer, under a resolved D major chord → end: the chord rings with a
# last plucked phrase.
import json, numpy as np, soundfile as sf
from scipy import signal
TL = json.load(open('timeline.json'))
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM; N = int(SR * DUR); M = TL['marks']; T = lambda b: b * BEAT
W = json.load(open('audio/vo_words.json'))
def w(i, word):
    hits = [x for x in W[i] if x[0] == word]
    return hits[0][1] if hits else M['vo_' + i]
rng = np.random.default_rng(213)
def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def add(dst, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N: return
    if i < 0: x = x[-i:]; i = 0
    x = x[: N - i] * g
    dst[i:i + len(x), 0] += x * np.sqrt((1 - pan) / 2) * 1.414; dst[i:i + len(x), 1] += x * np.sqrt((1 + pan) / 2) * 1.414
def tick(hi=True):
    t = tt(0.05); return filt(rng.standard_normal(len(t)), 'bandpass', [3000, 6500] if hi else [1500, 3500]) * np.exp(-t * 140)
def pulse():
    t = tt(0.4); f = 46 + 30 * np.exp(-t * 25); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
def pad(ms, d, lp, att=1.2):
    t = tt(d); x = np.zeros_like(t)
    for m in ms:
        for dv in (-0.004, 0.004): x += (2 * ((hz(m) * (1 + dv) * t + rng.random()) % 1) - 1) * 0.15
    return filt(x * np.minimum(t / att, 1) * np.clip((d - t) / 1.0, 0, 1), 'lowpass', lp)
def pluck(m, d=1.6):
    t = tt(d); f = hz(m)
    x = sum(np.sin(2 * np.pi * k * f * t + rng.random()) * np.exp(-t * (2.2 + 1.7 * k)) / k ** 1.15 for k in range(1, 9))
    return filt(x * np.minimum(t / 0.002, 1), 'lowpass', 4200)
def sub(m, d):
    t = tt(d); return np.sin(2 * np.pi * hz(m) * t) * np.minimum(t / 0.6, 1) * np.clip((d - t) / 0.8, 0, 1)

b_flood0, b_flood1 = M['vo_b3'] - 0.2, M['vo_b3_end']
b_hush = M['vo_c1'] - 1.1                      # a beat of near silence before "So we shipped"
b_turn = w('c1', 'shipped')                     # the first plucked note
b_day = float(np.ceil(M['vo_c1_end'] + 0.2))                    # the appearance switch
b_sleep = float(np.floor(M['vo_e1']))
b_end = M['vo_f1'] - 0.4
NIGHT = [[50, 57, 62, 64, 65], [46, 57, 62, 65, 69], [43, 57, 62, 65, 70], [45, 57, 62, 64, 67]]   # Dm9 Bbmaj7 Gm9 A7sus4
DAY = [[50, 57, 61, 64, 66], [43, 59, 62, 64, 66], [47, 57, 62, 66, 69], [45, 57, 61, 64, 66]]      # Dmaj9 G6 Bm7 A6sus
FIG = [[62, 66, 69, 73, 69, 66, 64, 66], [62, 67, 71, 74, 71, 67, 66, 67], [62, 66, 69, 74, 69, 66, 64, 62], [61, 64, 69, 73, 69, 64, 66, 64]]
ticks = np.zeros((N, 2)); pads = np.zeros((N, 2)); keys = np.zeros((N, 2)); low = np.zeros((N, 2))
NB = int(DUR / BEAT) + 2
for b in range(NB):
    bar, beat = divmod(b, 4)
    if b < b_hush:
        add(ticks, tick(beat % 2 == 0), T(b), 0.07, 0.35 if beat % 2 else -0.35)
        if beat == 0:
            add(pads, pad(NIGHT[bar % 4], 4 * BEAT + 1.0, 750), T(b), 0.11)
            add(low, sub(NIGHT[bar % 4][0] - 12, 4 * BEAT + 0.6), T(b), 0.10)
        if b_flood0 <= b < b_flood1:
            add(low, pulse(), T(b), 0.45); add(low, pulse(), T(b + 0.3), 0.25)
    elif b_day - 4 <= b < b_sleep:
        di = (bar - int(b_day) // 4) % 4
        if beat == 0 and b >= b_day - 0.5:
            add(pads, pad(DAY[di], 4 * BEAT + 1.2, 2200, 0.5), T(b), 0.07)
            add(low, sub(DAY[di][0] - 12, 4 * BEAT + 0.6), T(b), 0.08)
        if b >= b_day - 0.01:
            for e in range(2):
                n = FIG[di][(beat * 2 + e) % 8]
                add(keys, pluck(n), T(b + e * 0.5), 0.13 if e == 0 else 0.09, -0.25 + 0.5 * ((beat * 2 + e) % 3) / 2)
    elif b_sleep <= b < b_end:
        if (b - int(b_sleep)) % 2 == 0: add(ticks, tick(True), T(b), 0.045, -0.2)
# the turn: one plucked note under "shipped", then the figure starts with the switch
add(keys, pluck(74, 2.4), T(b_turn), 0.16)
add(keys, pluck(69, 2.0), T(b_turn + 1.0), 0.10, 0.2)
# the next night: a resolved, quiet chord (no more minor)
add(pads, pad([50, 57, 62, 66, 69], T(b_end - b_sleep) + 1.5, 900, 1.0), T(b_sleep), 0.11)
add(low, sub(38, T(b_end - b_sleep) + 1.0), T(b_sleep), 0.08)
# end: the chord rings, a last plucked phrase
add(pads, pad([50, 57, 62, 64, 66, 69], DUR - T(b_end) + 0.5, 2600, 0.4), T(b_end), 0.10)
add(low, sub(38, DUR - T(b_end)), T(b_end), 0.09)
for i, (db, m) in enumerate([(0, 74), (0.5, 69), (1.0, 66), (1.5, 62), (3.0, 64), (3.5, 66), (6.0, 69), (10.0, 62)]):
    add(keys, pluck(m, 2.6), T(b_end + db), 0.13 - 0.008 * i, -0.2 + 0.1 * (i % 4))
mix = ticks + pads + keys + low
ir = np.exp(-np.arange(int(2.2 * SR)) / (0.55 * SR)) * rng.standard_normal(int(2.2 * SR)) * 0.02
wet = keys + pads * 0.5 + ticks * 0.6
mix += np.stack([signal.fftconvolve(wet[:, c], ir)[:N] for c in range(2)], 1) * 0.55
mix = filt(mix, 'highpass', 28)
fade = int(2.0 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
mix /= np.abs(mix).max() / 10 ** (-1 / 20)
sf.write('audio/music.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav {DUR}s  night → b{b_hush:.1f}, turn b{b_turn:.1f}, day b{b_day:.1f} → b{b_sleep:.1f}, end b{b_end:.1f}')
