# Sound cues for "2:13 AM", from the same beat formulas as film/film.js (B), so every sound is the device's own:
# a notification ping per ticket, a click on the notification, key ticks while Sam types, a soft send, a pop for each
# window, ticks as the activity feed fills, a chime on live, a thump with the end card. The night after is silent.
import json, math
TL = json.load(open('timeline.json')); W = json.load(open('audio/vo_words.json')); M = TL['marks']
def w(i, word, n=0):
    hits = [x for x in W[i] if x[0] == word]
    return hits[min(n, len(hits) - 1)][1] if hits else M['vo_' + i]
V = lambda i: M['vo_' + i]; V1 = lambda i: M['vo_' + i + '_end']
B = dict(toast=0.6, open=w('a1', 'another') + 0.2, hiDays=w('a2', 'three') - 0.1, hiLaunch=w('a2', 'launches') - 0.1, notConn=w('a2', 'maya') - 0.1,
         dns=V('b1') - 0.2, wrong=w('b1', 'name') - 0.2, type0=w('b1', 'course') - 0.3, type1=V1('b1') - 0.1, send=V1('b1') + 0.3,
         queue=V('b2') + 0.6, q=[w('b2', 'where') - 0.1, w('b2', 'which') - 0.1, w('b2', 'why') - 0.1], flood=V('b3') - 0.2,
         chat=w('b3', 'all') - 0.5, sam=(w('b3', 'all') - 0.1, V1('b3') - 0.2), sent=V1('b3') + 0.1, priya=w('c1', 'shipped') - 0.2,
         sw=math.ceil(V1('c1') + 0.2), day=w('d1', 'maya') - 0.3,
         ev=[w('d1', 'maya') - 0.2, w('d1', 'sign') - 0.3, w('d1', 'provider') - 0.2, w('d1', 'approve') - 0.2, w('d2', 'written') - 0.2, w('d2', 'checked') - 0.2, w('d3', 'live') - 0.3],
         kept=w('d2', 'kept') - 0.2, thanks=w('d3', 'while') - 0.1, sleep=math.floor(V('e1')), pill=V('e1'), asleep=w('e1', 'asleep') - 0.05, end=V('f1') - 0.4)
S = []
def add(at, typ, gain, what, **k): S.append({'at': round(at, 3), 'type': typ, 'gain': gain, 'what': what, **k})
def typing(b0, b1, what, g=0.10):
    n = int((b1 - b0) / 0.14)
    for j in range(n): add(b0 + j * 0.14 + (0.04 if j % 4 == 1 else 0), 'tick', g * (0.8 + 0.4 * ((j * 5) % 3) / 2), what, pan=-0.25 + 0.5 * ((j * 7) % 5) / 4)
add(B['toast'], 'ping', 0.42, "Maya's ticket arrives")
add(B['open'] - 0.7, 'whoosh', 0.2, 'the lock screen lifts')
add(B['notConn'], 'tick', 0.2, 'not connected')
add(B['dns'], 'pop', 0.22, 'the DNS check')
add(B['wrong'], 'tick', 0.32, 'the name, inverted'); add(B['wrong'] + 0.35, 'pop', 0.2, 'the label')
typing(B['type0'], B['type1'], 'the reply')
add(B['send'], 'click', 0.4, 'Send'); add(B['send'] + 0.1, 'whoosh', 0.16, 'sent')
for i, q in enumerate(B['q']): add(q, 'ping', 0.34 - 0.03 * i, f'question {i + 1}')
for i, d in enumerate((0.5, 1.0, 1.6, 2.2)): add(B['flood'] + d, 'ping', 0.24 - 0.03 * i, 'the queue fills', pan=-0.4 + 0.25 * i)
add(B['chat'] - 0.25, 'pop', 0.22, 'the team chat')
typing(B['sam'][0], B['sam'][1], "Sam's message", 0.09)
add(B['sent'], 'whoosh', 0.18, 'sent to #support'); add(B['sent'], 'tick', 0.16, 'Sent')
add(B['priya'], 'bubble', 0.3, "Priya's reply")
add(B['sw'], 'whoosh', 0.22, 'four weeks later')
add(B['day'], 'pop', 0.22, 'the connection page')
for i, e in enumerate(B['ev'][:6]): add(e, 'tick', 0.26, f'activity {i + 1}', pan=-0.2)
add(B['ev'][3], 'click', 0.3, 'approved')
add(B['ev'][4] + 0.25, 'tick', 0.2, 'second record')
add(B['kept'], 'tick', 0.2, 'hourly checks')
add(B['ev'][6], 'chime', 0.4, 'live')
add(B['thanks'], 'ping', 0.34, "Maya's note")
add(B['pill'], 'tick', 0.14, 'the Sleep pill')
add(B['asleep'], 'tick', 0.1, 'no new notifications')
add(B['end'] - 0.3, 'thump', 0.42, 'the end card')   # on the end card's first frame (the scene's pre-roll)
TL['sfx'] = sorted(S, key=lambda e: e['at'])
json.dump(TL, open('timeline.json', 'w'), indent=1, ensure_ascii=False)
print(len(S), 'sfx cues')
