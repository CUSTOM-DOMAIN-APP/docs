# Sound cues for "Three Calls", from the same beat formulas as film/film.js (BT), so every click lands on its press:
# key ticks while code types, a click as each file opens and on each press, pops as panels and terminal lines appear,
# the webhook's pop, a tick for propagating, a chime on live, a whoosh into the outro, a thump with the end card.
import json
TL = json.load(open('timeline.json')); W = json.load(open('audio/vo_words.json')); M = TL['marks']
def w(i, word, n=0):
    hits = [x for x in W[i] if x[0] == word]
    return hits[min(n, len(hits) - 1)][1] if hits else M['vo_' + i]
V = lambda i: M['vo_' + i]; V1 = lambda i: M['vo_' + i + '_end']
BT = dict(tabs=w('a1', 'three') - 0.2, type1=(2.0, V1('b1') - 0.2), type2=(V1('b1') + 1.0, V('c2') - 0.15), type3=(V1('c2') + 0.15, V('d2') + 0.6),
          open=V('c2') + 0.1, signin=w('c2', 'signs') + 0.2, approve=w('c2', 'approves') + 0.1,
          prop=w('d2', 'records'), hook=w('d2', 'care') - 1.1, live=w('d2', 'care') + 0.5, fan=V('e1') - 0.6, end=V('f1') - 0.4)
BT['popOpen'] = BT['signin'] + 0.4; BT['wShut'] = BT['approve'] + 1.1
S = []
def add(at, typ, gain, what, **k): S.append({'at': round(at, 3), 'type': typ, 'gain': gain, 'what': what, **k})
for k in range(3): add(BT['tabs'] + k * 0.25, 'tick', 0.3, f'tab {k + 1} appears')
for i, (b0, b1) in enumerate([BT['type1'], BT['type2'], BT['type3']]):
    if i: add(b0 - 0.3, 'click', 0.35, f'file {i + 1} opens')
    n = int((b1 - b0) / 0.25)
    for j in range(n): add(b0 + j * 0.25 + (0.06 if j % 3 == 1 else 0), 'tick', 0.11, f'typing {i + 1}', pan=-0.2 + 0.4 * ((j * 7) % 5) / 4)
t1 = BT['type1'][1] - 0.4
add(t1, 'pop', 0.0, 'the terminal prints the token (silent: off-frame in 16:9)')
add(BT['open'] - 0.15, 'click', 0.5, 'Connect domain'); add(BT['open'] + 0.1, 'pop', 0.3, 'the widget opens')
add(BT['signin'], 'click', 0.5, 'Sign in with Cloudflare'); add(BT['popOpen'], 'pop', 0.26, "the provider's page")
add(BT['approve'], 'click', 0.55, 'Allow'); add(BT['wShut'], 'pop', 0.24, 'pending')
add(BT['prop'], 'tick', 0.32, 'propagating')
add(BT['hook'], 'pop', 0.4, 'the webhook lands')
add(BT['live'], 'chime', 0.36, 'live')
add(BT['fan'], 'whoosh', 0.35, 'the three files fan out')
add(BT['end'] - 0.35, 'thump', 0.5, 'the end card')
TL['sfx'] = sorted(S, key=lambda e: e['at'])
json.dump(TL, open('timeline.json', 'w'), indent=1, ensure_ascii=False)
print(len(S), 'sfx cues')
