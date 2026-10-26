# beats.py drops the beat at t=0 (an onset at sample 0 has no lead-in). The score is synthesized on an exact grid
# starting at 0, so put the measured hit at t≈0 back as beat 0. Run after beats.py, before sync.mjs.
import json
b = json.load(open('beats.json'))
if b['beats'][0] > b['beat'] * 0.5:
    h0 = min((h['t'] for h in b['hits']), key=lambda t: abs(t - (b['beats'][0] - b['beat'])))
    b['beats'].insert(0, round(h0, 5)); b['offset'] = b['beats'][0]
    b['downbeats'] = b['beats'][0::4]; b['downbeat_phase'] = 0
    json.dump(b, open('beats.json', 'w'), indent=1)
    print(f'beat 0 restored at {h0:.4f}s; {len(b["beats"])} beats')
else: print('beat 0 already present')
