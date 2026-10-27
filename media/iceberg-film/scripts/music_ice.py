# Score for "Under the Button" → audio/music.wav. Synthesized and seeded; runs on timeline.bpm (72).
# Sections follow the voice marks: surface (warm felt piano, D major) → descent (a filtered pad and low drone in D minor,
# sparse high piano, the pad darkening with depth) → bottom (almost nothing: drone and a slow low pulse) → ascent
# (a rising D-major arpeggio and a riser) → end (a held D major add9, a short piano motif that resolves).
import json, numpy as np, soundfile as sf
from scipy import signal

TL = json.load(open('timeline.json'))
SR, DUR, BPM = 48000, float(TL['duration']), float(TL['bpm'])
BEAT = 60 / BPM; N = int(SR * DUR); M = TL['marks']
T = lambda b: b * BEAT
rng = np.random.default_rng(72)
def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def filt(x, kind, f, order=2): return signal.sosfilt(signal.butter(order, f, kind, fs=SR, output='sos'), x, axis=0)
def add(dst, x, t0, g=1.0, pan=0.0):
    i = int(round(t0 * SR))
    if i >= N or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[: N - i] * g
    dst[i:i + len(x), 0] += x * np.sqrt((1 - pan) / 2) * 1.414
    dst[i:i + len(x), 1] += x * np.sqrt((1 + pan) / 2) * 1.414

def piano(m, d=3.0, bright=1.0):     # felt piano: slightly inharmonic partials, soft hammer, warm low-pass
    t = tt(d); f = hz(m); x = np.zeros_like(t)
    for k, a in enumerate([1, 0.42, 0.2, 0.12, 0.06, 0.03], 1):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k); x += a * np.sin(2 * np.pi * fk * t) * np.exp(-t * (0.9 + 0.55 * k))
    x *= np.minimum(t / 0.006, 1) * np.exp(-t * 0.35)
    return filt(x, 'lowpass', min(9000, 1800 + 2600 * bright))
def pad(ms, d, lp=900, att=1.2, rel=1.6, det=0.004):   # soft detuned saw pad, low-passed
    t = tt(d); x = np.zeros_like(t)
    for m in ms:
        for dv in (-det, 0, det):
            ph = (hz(m) * (1 + dv) * t + rng.random()) % 1.0; x += (2 * ph - 1) * 0.18
    env = np.minimum(t / att, 1) * np.clip((d - t) / rel, 0, 1)
    return filt(x * env, 'lowpass', lp, 2)
def drone(m, d):
    t = tt(d); f = hz(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 1.5 * t) + 0.2 * np.sin(2 * np.pi * f * 2 * t)
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * t / 7.3)
    return x * lfo * np.minimum(t / 2.5, 1) * np.clip((d - t) / 2.5, 0, 1)
def rumble(d):
    t = tt(d); x = filt(rng.standard_normal(len(t)), 'lowpass', 160, 4)
    return x * (0.6 + 0.4 * np.sin(2 * np.pi * t / 5.1)) * np.minimum(t / 3, 1) * np.clip((d - t) / 3, 0, 1)
def riser(d):
    t = tt(d); u = t / d; x = filt(rng.standard_normal(len(t)), 'bandpass', [500, 6000]) * u ** 2.6
    return x * 0.6 + 0.25 * np.sin(2 * np.pi * (220 + 660 * u ** 2) * t) * u ** 2

b_dive, b_bot, b_up, b_end = M['vo_b1'] - 1.0, M['vo_c1'] - 0.5, M['vo_d1'] - 0.2, M['vo_e1'] - 0.3
keys = np.zeros((N, 2)); pads = np.zeros((N, 2)); low = np.zeros((N, 2)); fx = np.zeros((N, 2))
# surface: D major 9, slow quarter-note piano
for bar in range(int(np.ceil(b_dive / 4))):
    b0 = bar * 4
    for i, m in enumerate([62, 69, 76, 78] if bar % 2 == 0 else [62, 69, 74, 81]):
        if b0 + i < b_dive - 0.25: add(keys, piano(m, 3.2, 0.8), T(b0 + i), 0.16, (i - 1.5) * 0.25)
add(pads, pad([62, 66, 69, 76], T(b_dive) + 1.0, lp=1800, att=2.0, rel=1.2), 0, 0.2)
# descent: D minor colours, two bars each, the pad closing down with depth; a high piano note on each bar
prog = [[50, 57, 62, 64, 65], [46, 53, 58, 62, 69], [41, 48, 57, 60, 64], [48, 52, 55, 62, 67]]
nb = int(np.ceil((b_bot - b_dive) / 8))
for k in range(nb):
    b0 = b_dive + k * 8; d = min(8, b_bot - b0) * BEAT + 1.8
    depth = k / max(1, nb - 1)
    add(pads, pad(prog[k % 4], d, lp=1100 - 600 * depth, att=1.8, rel=1.8), T(b0), 0.26)
    for j, m in enumerate([81, 77, 74, 76][k % 4: k % 4 + 1] + [69]):
        if b0 + j * 4 < b_bot: add(keys, piano(m, 4.0, 0.5), T(b0 + j * 4 + 0.02), 0.11, 0.35 * (1 if j else -1))
add(low, drone(38, T(b_bot - b_dive) + 3), T(b_dive), 0.22)
add(low, rumble(T(M['done']) - T(b_dive)), T(b_dive), 0.5)
# the dive: a sub swell
t = tt(2.2); add(low, np.sin(2 * np.pi * 36 * t) * np.sin(np.pi * t / 2.2) ** 2, T(b_dive) - 0.6, 0.5)
# bottom: near silence, a slow low pulse
for b in np.arange(b_bot + 0.5, b_up, 2):
    t = tt(0.9); add(low, np.sin(2 * np.pi * (48 + 12 * np.exp(-t * 18)) * t) * np.exp(-t * 6), T(b), 0.35)
add(pads, pad([38, 45, 50], T(b_up - b_bot) + 1.5, lp=380, att=1.0, rel=1.0), T(b_bot), 0.3)
# ascent: a rising arpeggio in D major, quickening, and a riser into the surface
arp = [50, 57, 62, 66, 69, 74, 78, 81, 86]
steps = np.linspace(0, b_end - b_up - 0.25, 14) ** 1.0
for i, sb in enumerate(steps):
    add(keys, piano(arp[min(len(arp) - 1, i * len(arp) // len(steps))], 2.2, 1.0), T(b_up + sb), 0.12 + 0.006 * i, (i % 3 - 1) * 0.3)
add(fx, riser(T(b_end - b_up)), T(b_up), 0.16)
# end: D major add9, held, and a motif that resolves
add(pads, pad([50, 62, 66, 69, 76], DUR - T(b_end) + 0.5, lp=2600, att=0.4, rel=2.4), T(b_end), 0.3)
for i, (m, db) in enumerate([(78, 0.0), (76, 1.0), (74, 2.0), (69, 3.5), (74, 5.0)]):
    add(keys, piano(m, 4.0, 0.9), T(b_end + 0.5 + db), 0.17, (i - 2) * 0.15)
add(low, np.sin(2 * np.pi * hz(38) * tt(6)) * np.exp(-tt(6) * 0.5) * np.minimum(tt(6) / 0.05, 1), T(b_end), 0.28)
# a long room on the keys and pads
ir = np.exp(-np.arange(int(2.6 * SR)) / (0.7 * SR)) * rng.standard_normal(int(2.6 * SR)) * 0.016
wet = np.stack([signal.fftconvolve((keys + pads * 0.5)[:, c], ir)[:N] for c in range(2)], 1)
mix = keys + pads + low + fx + wet * 0.7
mix = filt(mix, 'highpass', 28)
fade = int(2.0 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
mix /= np.abs(mix).max() / 10 ** (-1 / 20)
sf.write('audio/music.wav', mix.astype(np.float32), SR, subtype='FLOAT')
print(f'audio/music.wav {DUR}s  surface→b{b_dive:.1f} descent→b{b_bot:.1f} bottom→b{b_up:.1f} ascent→b{b_end:.1f}')
