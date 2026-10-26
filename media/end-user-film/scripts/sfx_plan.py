# Sound cues on the voice: writes timeline.json "sfx" from the word timings (audio/vo_words.json) and VO marks.
# Soft by design: pencil ticks while drawings appear, clicks on presses, pops on checks, a shutter on the failure.
import json
TL = json.load(open('timeline.json')); W = json.load(open('audio/vo_words.json')); M = TL['marks']
def w(i, word, n=0):
    hits = [x for x in W[i] if x[0] == word]
    return hits[min(n, len(hits) - 1)][1] if hits else M['vo_' + i]
V = lambda i: M['vo_' + i]
S = []
def add(at, typ, gain, what): S.append({'at': round(at, 3), 'type': typ, 'gain': gain, 'what': what})
add(w('a2', 'click'), 'click', 0.7, 'the app button is clicked')
for i in range(20): add(V('b1') + 0.04 + i * 0.2, 'tick', 0.16, 'storefronts draw in')
for i in range(3): add(w('b2', 'more') - 0.12 + i * 0.3, 'pop', 0.28, 'a shop is circled')
for word in ['shop', 'blog', 'idea']: add(w('b3', word), 'pop', 0.4, f'domain tag: {word}')
add(w('c1', 'job'), 'pop', 0.45, 'and a job')
cues = [V('c2'), w('c3', 'leave'), w('c3', 'sign'), V('c4'), V('c5'), V('c6'), V('c7')]
for k, cb in enumerate(cues): add(cb - 0.9, 'whoosh', 0.28, f'travel to station {k + 1}'); add(cb - 0.1, 'pop', 0.32, f'station {k + 1} node')
add(w('c3', 'forgot'), 'tick', 0.3, 'forgot password scribble')
add(w('c7', 'never'), 'shutter', 0.7, 'the X: it never connects')
add(w('c7', 'ticket'), 'pop', 0.4, 'support ticket')
add(w('d1', 'takes') - 0.2, 'whoosh', 0.45, 'the line pulls straight')
add(V('e1') - 1.3, 'whoosh', 0.3, 'the straight line settles into the rail')
add(w('e1', 'button') - 0.1, 'click', 0.7, 'the same button')
add(w('e1', 'once') + 0.2, 'click', 0.55, 'Continue')
add(w('e2', 'managed'), 'pop', 0.5, 'provider found')
add(w('e3', 'sign'), 'click', 0.6, 'Sign in')
add(w('e3', 'approve'), 'click', 0.7, 'Allow')
add(V('e4') - 0.05, 'pop', 0.5, 'customer done')
add(V('e5') - 0.6, 'whoosh', 0.4, 'behind the scenes')
for i in range(2): add(w('e5', 'records') + i * 0.3, 'pop', 0.32, f'record {i + 1} written')
add(w('e5', 'resolve'), 'pop', 0.4, 'records resolve')
add(w('e5', 'https'), 'pop', 0.45, 'HTTPS issued')
add(V('e6') - 0.6, 'whoosh', 0.4, 'to the live site')
add(w('e6', 'live'), 'thump', 0.55, 'live')
for word in ['hour', 'renew', 'expire']: add(w('e7', word), 'pop', 0.32, f'kept: {word}')
add(w('f1', 'or'), 'whoosh', 0.35, 'or: the straight line')
add(V('g1'), 'thump', 0.6, 'the lockup')
TL['sfx'] = sorted(S, key=lambda e: e['at'])
json.dump(TL, open('timeline.json', 'w'), indent=1, ensure_ascii=False)
print(len(S), 'sfx cues')
