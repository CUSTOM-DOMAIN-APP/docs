# Sound cues for "Under the Button": timeline.json "sfx" from the voice's word timings (audio/vo_words.json) and VO marks.
# A sonar ping for each layer, a plunge at the dive, soft pops as glyph details land, bubbles on the climb, a chime on "live".
import json
TL = json.load(open('timeline.json')); W = json.load(open('audio/vo_words.json')); M = TL['marks']
def w(i, word, n=0):
    hits = [x for x in W[i] if x[0] == word]
    return hits[min(n, len(hits) - 1)][1] if hits else M['vo_' + i]
V = lambda i: M['vo_' + i]; V1 = lambda i: M['vo_' + i + '_end']
S = []
def add(at, typ, gain, what, **k): S.append({'at': round(at, 3), 'type': typ, 'gain': gain, 'what': what, **k})
add(w('a2', 'part') - 0.3, 'whoosh', 0.22, 'the ink rises under the waterline')
add(V('b1') - 1.0, 'plunge', 0.75, 'the dive')
for i, id_ in enumerate(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8']):
    add(V(id_) - 0.25, 'ping', 0.38, f'layer {i + 1}', pitch=1 - i * 0.035, pan=0.25)
add(w('b1', 'managed'), 'tick', 0.22, 'detection sweep')
for k, word in enumerate(['oauth', 'domain', 'scoped']): add(w('b2', word) + 0.1, 'pop', 0.22, f'door {k + 1}')
for k in range(3): add(w('b2', 'different') - 0.1 + k * 0.32, 'tick', 0.2, f'door {k + 1} lights')
for k in range(2): add(w('b3', 'checks') + k * 0.6 + 0.25, 'pop', 0.26, f'record {k + 1} ticks itself')
add(w('b5', 'deadline') + 0.17, 'pop', 0.24, 'the 24 h flag')
add(w('b6', 'renewed') + 0.05, 'pop', 0.26, 'renews early')
add(w('b7', 'never') + 0.05, 'shutter', 0.3, 'unknown host turned away')
add(V('c1') - 0.4, 'whoosh', 0.35, 'pull back to the whole iceberg')
add(V('d1') + 0.45, 'whoosh', 0.25, 'the bracket closes')
add(w('d1', 'ice') - 0.2, 'whoosh', 0.42, 'the climb')
for k in range(4): add(w('d1', 'ice') + k * 0.45, 'bubble', 0.32, f'bubbles {k + 1}', pan=-0.4 + k * 0.27)
add(w('d1', 'ice') + 1.15, 'click', 0.6, 'the button is pressed')
add(w('d1', 'ice') + 1.25, 'chime', 0.35, 'live')
add(V('e1') + 1.9, 'thump', 0.5, 'the camera settles on the end card')
TL['sfx'] = sorted(S, key=lambda e: e['at'])
json.dump(TL, open('timeline.json', 'w'), indent=1, ensure_ascii=False)
print(len(S), 'sfx cues')
