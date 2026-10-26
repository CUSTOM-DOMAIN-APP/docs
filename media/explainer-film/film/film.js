// CustomDomain™ — "The human middleware". A problem-first explainer, 42 s at 120 bpm, 16:9 and 9:16.
// Story: the finish line (hook) → the button you ship → the homework your customer gets → the registrar panel where it
// dies → the three-actor gap (the insight) → CustomDomain™ removes the human → the real connect flow → proof → CTA.
// Pure function of time: no timers, no Math.random, nothing mutated in run(). Springs from lib/motion.js only.
// The connect widget and the console pieces exist on customdomain.ai only as live UI / screenshots
// (assets/cap/widget-states.png), so they are rebuilt here element by element with the brand's real fonts, tokens and copy.
(() => {
  const { W, H, FMT, put, reg, el, scene, canvas, sp, spHit, trk, trkObj, seg, clamp, lerp, ease, bt, beatAt, noise1, mulberry32 } = C;
  const TALL = FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  const PAD = P(140, 84);
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '400 40px UI', '500 40px UI', '600 40px UI', '400 30px Mono', '500 30px Mono'];

  const COL = { paper: '#fafaf9', ink: '#1c1917', night: '#0c0a09', nightCard: '#1c1917', nightMuted: '#292524', fg2: '#a8a29e',
    muted: '#f5f5f4', mutedFg: '#78716c', hair: '#e7e5e4', input: '#d6d3d1', long: '#44403c', done: '#16a34a' };

  // ---------------------------------------------------------------- helpers
  const HIT = 1 / 60;                                                // pops and checks: one frame of lead, so they read ON the sound
  const o4 = (k) => (k > 0.015 ? 1 : 0);                            // things snap in (scale carries the enter), never fade
  const grow = (t, b, p = 'snappy', from = 0.86) => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), s: from + (1 - from) * k }; };
  const rise = (t, b, d = 30, p = 'default') => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), y: d * (1 - k) }; };
  const pan = (t, b0, b1) => ease.inOut(seg(t, b0, b1));           // camera pans between scenes (push-through: linear progress + ease)
  function box(parent, x, y, css = '', html = '', base = {}) {
    const e = el('div', { class: 'abs', style: `left:${x}px;top:${y}px;${css}` }, parent, html);
    return reg(e, base);
  }
  const ICON = {
    check: (sz, bg = COL.done, fg = '#fff') => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="${bg}"/><path d="M5.6 10.3l2.8 2.8 5.9-6.1" fill="none" stroke="${fg}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    soft: (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#16a34a" fill-opacity=".12"/><path d="M5.8 10.3l2.7 2.7 5.7-5.9" fill="none" stroke="#16a34a" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    spin: (sz, c = COL.ink) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.4" fill="none" stroke="${c}" stroke-opacity=".16" stroke-width="2.2"/><path d="M10 2.6A7.4 7.4 0 0 1 17.4 10" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    dot: (sz, c = COL.input) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3.2" fill="${c}"/></svg>`,
    lock: (sz, c = COL.mutedFg) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.8a3 3 0 0 1 6 0V9"/></svg>`,
    globe: (sz, c = COL.mutedFg) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.5"><circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2.2 2.2 2.2 11.8 0 14M10 3c-2.2 2.2-2.2 11.8 0 14"/></svg>`,
    close: (sz, c = COL.mutedFg) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" stroke="${c}" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l8 8M14 6l-8 8"/></svg>`,
    cross: (sz, c = COL.paper) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" stroke="${c}" stroke-width="2.4" stroke-linecap="round"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>`,
    clock: (sz, c = COL.mutedFg) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 6v4.3l2.8 1.8"/></svg>`,
    copy: (sz, c = COL.mutedFg) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.6"><rect x="7" y="7" width="9" height="9" rx="2"/><path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7"/></svg>`,
    arrow: (sz, c = COL.paper) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h11M11 5.5 15.5 10 11 14.5"/></svg>`,
    cursor: (sz) => `<svg width="${sz}" height="${sz * 1.3}" viewBox="0 0 24 31"><path d="M2 2v23.5l6.2-6 4.2 9.6 4.3-1.9-4.2-9.4h8.6z" fill="#0c0a09" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
  };
  const LOGO = (n) => `../assets/logos/${n}${n === 'namecom' ? '.png' : '.svg'}`;
  const TREE = (fill) => `<svg viewBox="0 0 512 512" width="100%" height="100%" style="overflow:visible">
      <rect class="t-trunk" x="238" y="250" width="36" height="150" rx="18" fill="${fill}" style="transform-box:fill-box;transform-origin:50% 100%"/>
      <g class="t-roots" fill="none" stroke="${fill}" stroke-width="26" stroke-linecap="round" style="transform-box:fill-box;transform-origin:50% 0%"><path d="M256 330 L196 372 M256 330 L316 372"/></g>
      <g fill="${fill}">${[[256, 176, 86], [176, 220, 62], [336, 220, 62], [212, 140, 54], [300, 140, 54], [256, 244, 58]]
        .map(([x, y, r]) => `<circle class="t-c" cx="${x}" cy="${y}" r="${r}" style="transform-box:fill-box;transform-origin:50% 50%"/>`).join('')}</g></svg>`;   // the brand's tree-mark.svg, split into parts

  // Display paragraphs: lines of words that rise through masks. *word* or *several words* = Instrument Serif italic.
  function para(parent, lines, o) {
    const size = o.size, lh = o.lh ?? 1.02, R = { words: [], line: [], size, els: [] };
    lines.forEach((txt, li) => {
      const L = el('div', { class: 'line display', style: `left:${o.x}px;top:${o.y + li * size * lh}px;font-size:${size}px;color:${o.color || 'inherit'}` }, parent);
      reg(L); R.els.push(L);
      let it = false;
      const toks = txt.split(' ');
      toks.forEach((tk, i) => {
        let s = tk;
        if (s.startsWith('*')) { it = true; s = s.slice(1); }
        const close = s.endsWith('*'); if (close) s = s.slice(0, -1);
        const w = el('span', { class: 'word' }, L, s.replace('™', '<span style="font-size:.3em;vertical-align:1.75em;margin-left:-.02em;font-style:normal">™</span>'));
        if (it) w.style.fontStyle = 'italic';
        if (close) it = false;
        if (i < toks.length - 1) L.appendChild(document.createTextNode(' '));
        R.words.push(reg(w, { y: 0 })); R.line.push(li);
      });
    });
    return R;
  }
  // per-word in-beats: one start beat per line, words staggered inside it
  const at = (R, starts, st = 0.07) => { const n = []; return R.words.map((w, i) => { const li = R.line[i]; n[li] = (n[li] ?? -1) + 1; return starts[Math.min(li, starts.length - 1)] + n[li] * st; }); };
  const riseP = (t, R, starts, out = null, o = {}) => TYPE.rise(t, R, at(R, starts, o.st), out, o);
  function eyebrow(parent, text, x, y, color, size = P(20, 24)) {
    return box(parent, x, y, `font-size:${size}px;color:${color}`, `<span class="eyebrow" style="display:flex;align-items:center;gap:14px"><span style="display:inline-block;width:44px;height:1.5px;background:${color}"></span>${text}</span>`, { o: 0 });
  }
  // eyebrows are the one thing allowed to fade (small kicker lines)
  const showEyebrow = (t, e, bIn, bOut = 1e9) => { const k = sp(t, bIn, 'default') - sp(t, bOut, 'snappy'); put(e, { o: clamp(k), x: -16 * (1 - clamp(k)) }); };
  function cursor(parent, sz) { return box(parent, 0, 0, 'z-index:50;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))', ICON.cursor(sz), { o: 0 }); }
  // a press: the cursor (or button) dips for a quarter beat starting exactly on the click beat
  const dip = (t, b, depth) => { const d = beatAt(t) - b; return d >= 0 && d < 0.3 ? depth * Math.sin(Math.PI * Math.min(1, d / 0.3)) : 0; };
  const press = (t, b) => 1 - dip(t, b, 0.045);
  // cursor path in some coordinate space: keys [[beat, x, y]] → {x, y}; windows [[on, off]] when it is visible
  const cursorAt = (t, keys) => ({ x: trk(t, keys.map(([b, X]) => [b, X, 'default'])), y: trk(t, keys.map(([b, , Y]) => [b, Y, 'default'])) });
  function showCursor(t, c, p, clicks, windows) {
    const b = beatAt(t), vis = windows.some(([a, z]) => b >= a && b < z);
    let s = 1; for (const k of clicks) s -= dip(t, k, 0.16);
    put(c, { x: p.x, y: p.y, s, o: vis ? 1 : 0 });
  }

  // ================================================================ 0. dark ground (night + drifting Geist Mono DNS failures), whole film
  const NOISE = ['CNAME app.acme.com.acme.com  ← saved', 'SERVFAIL  acme.com  A', 'record exists at this name', 'TTL 86400  propagation pending',
    'CNAME at zone apex not permitted', 'A  app  edge.customdomain.ai  invalid IPv4', 'NXDOMAIN  www.acme.com', '_acme-challenge  TXT  not found',
    'expected CNAME edge.customdomain.ai.', 'certificate: pending validation', 'conflict: A @ 192.0.2.44', 'verification failed · retry in 24h',
    'Host  @  Value  edge.customdomain.ai.acme.com', 'dig +short acme.com  →  (empty)', 'status: Pending · 47:12:09', 'support: "my domain is not working"'];
  scene({
    name: 'ground', from: 0, to: 84,
    build(root, S) {
      root.style.background = COL.night;
      S.ctx = canvas(root);
      const r = mulberry32(42); S.rows = [];
      const cols = P(3, 2), cw = W / cols;
      const N = P(34, 52), per = Math.ceil(N / cols);
      for (let i = 0; i < N; i++) S.rows.push({ x: (i % cols) * cw + 40 + r() * (cw - 520), y: (Math.floor(i / cols) + r() * 0.35) * (H + 400) / per, s: NOISE[Math.floor(r() * NOISE.length)], a: 0.035 + r() * 0.07, v: 10 + r() * 22 });
    },
    run(t, b, S) {
      const g = S.ctx; g.clearRect(0, 0, W, H);
      if (b > 41 && b < 82.8) return;                                  // covered by the paper act
      if (b >= 82.8) t -= C.DUR;                                       // under the closing iris: frame 0's noise, for the loop
      g.font = `400 ${P(19, 22)}px Mono`; g.fillStyle = COL.paper;
      for (const R of S.rows) { g.globalAlpha = R.a; const y = ((R.y - t * R.v) % (H + 400) + H + 400) % (H + 400) - 200; g.fillText(R.s, R.x, y); }
      g.globalAlpha = 1;
    },
  });

  // ================================================================ A. hook: "Your customers fail at the finish line." (b0 → b8)
  // Built as functions so the last half-beat of the film can repaint frame 0 exactly under the closing iris (seamless loop).
  function buildHook(root, S) {
    S.push = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:${PAD}px ${P(420, 700)}px`);
    const R = S.push;
    S.eb = eyebrow(R, 'The usual path', PAD, P(230, 450), COL.fg2);
    S.h = para(R, TALL ? ['Your customers', 'fail at', '*the finish line.*'] : ['Your customers fail', 'at *the finish line.*'],
      { x: PAD, y: P(286, 510), size: P(184, 150), color: COL.paper });
    const by = P(800, 1110), bw = W - 2 * PAD;
    S.bw = bw; S.by = by;
    S.track = box(R, PAD, by, `width:${bw}px;height:8px;border-radius:4px;background:${COL.nightMuted};transform-origin:0 0`, '', { o: 0 });
    S.fill = box(R, PAD, by, `width:${bw}px;height:8px;border-radius:4px;background:${COL.paper};transform-origin:0 0`, '', { o: 0 });
    S.stops = [['Sign up', 0.02, -2], ['Build', 0.3, 0.9], ['Publish', 0.6, 2.4], ['Connect domain', 0.94, 99]];
    S.labels = S.stops.map(([s, f], i) => {
      const e = box(R, PAD + bw * f, by + 32, `width:0;`, `<span class="lab" style="position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;font:400 ${P(24, 26)}px Mono;color:inherit;white-space:nowrap;transform:translateX(${i === 3 ? '-100%' : i === 0 ? '-12%' : '-50%'})"><span class="ok" style="display:inline-block;width:${i === 3 ? 0 : P(22, 24)}px;transform-origin:50% 50%">${ICON.check(P(22, 24), COL.paper, COL.night)}</span>${s}</span>`, { o: 0 });
      e.style.color = COL.fg2; e.ok = e.querySelector('.ok'); reg(e.ok);
      const tickE = box(R, PAD + bw * f - 1.5, by - 10, `width:3px;height:28px;background:${COL.fg2};transform-origin:50% 50%`, '', { o: 0 });
      return { e, tickE, f };
    });
    S.pct = box(R, P(W - PAD - 220, PAD), P(by - 128, by + 150), `width:${P(220, 600)}px;text-align:${P('right', 'left')};font:400 ${P(88, 190)}px Mono;color:${COL.paper};letter-spacing:-0.04em;white-space:nowrap`, '0%', { o: 0 });
    S.chip = box(R, 0, 0, `display:flex;align-items:center;gap:12px;padding:${P('15px 24px', '16px 24px')};border-radius:8px;background:${COL.paper};color:${COL.ink};font:500 ${P(28, 30)}px UI;white-space:nowrap;box-shadow:0 20px 50px -10px rgba(0,0,0,.6)`,
      `${ICON.cross(P(22, 26), COL.ink)}Setup abandoned at DNS`, { o: 0 });
  }
  function runHook(t, b, S) {
    put(S.push, { s: 1 + 0.05 * ease.inOut(seg(t, -1, 8)) });          // a slow push the whole shot
    showEyebrow(t, S.eb, -1);
    riseP(t, S.h, TALL ? [-0.4, 0.95, 1.85] : [-0.4, 1.85]);
    if (!TALL) TYPE.rise(t, { words: [S.h.words[2]], size: S.h.size }, [0.95]);     // "fail" lands on beat 1
    put(S.track, { o: 1, sx: 0.05 + 0.95 * sp(t, -0.6, 'heavy') });
    // progress: Sign up → Build (b1.5) → Publish (b3) → reaches "Connect domain" and stalls at 94 % (b4.5 → b6)
    const f = trk(t, [[0, 0.02], [0.2, 0.3, 'default'], [1.7, 0.6, 'default'], [3.2, 0.915, { response: 0.9, damping: 1 }]]);
    put(S.fill, { o: 1, sx: f });
    S.labels.forEach((L, i) => {
      const k = sp(t, -0.5 + i * 0.25, 'snappy'), passed = i < 3 && b >= S.stops[i][2];
      put(L.e, { o: o4(k), y: 12 * (1 - k), css: { color: passed || (i === 3 && b > 5.9) ? COL.paper : COL.fg2 } });
      const ok = i < 3 ? grow(t, S.stops[i][2], 'snappy', 0.55) : { o: 0, s: 1 };
      put(L.e.ok, { o: ok.o, s: ok.s });
      put(L.tickE, { o: o4(k), sy: k * (1 + 0.5 * (i < 3 ? spHit(t, S.stops[i][2], 'snappy', HIT) - sp(t, S.stops[i][2] + 0.25, 'default') : 0)) });
    });
    put(S.pct, { o: 1, text: `${Math.round(f * 100)}%` });
    // stall: the bar jitters at 94 %, then the inverted chip slams in on beat 6
    const c = grow(t, 6, 'snappy', 0.7), shake = b > 4.6 && b < 6.6 ? Math.sin(t * 90) * 3 * Math.exp(-Math.max(0, b - 5.6) * 3) : 0;
    put(S.fill, { x: shake });
    put(S.chip, { o: c.o, s: c.s, r: -2.5 * c.k, x: P(1180, PAD + S.bw * 0.94 - 470), y: S.by - P(112, 116) - 24 * (1 - c.k), css: { 'transform-origin': '100% 100%' } });
  }
  scene({
    name: 'hook', from: 0, to: 8, post: 0.4,
    build: buildHook,
    run(t, b, S) {
      // the whole hook is pushed up out of frame as the next shot rises in (b7.45 → b8.15)
      put(S.root, { y: -H * pan(t, 7.45, 8.15) });
      runHook(t, b, S);
    },
  });

  // the loop: under the end card's closing iris, the hook's frame 0 is repainted (same build, time shifted by the duration)
  scene({
    name: 'tail', from: 83.3, to: 84,
    build: buildHook,
    run(t, b, S) { const t2 = t - C.DUR; runHook(t2, beatAt(t2), S); },
  });

  // ================================================================ B. ship: the button you ship → the homework they get (b8 → b16)
  scene({
    name: 'ship', from: 8, to: 16, pre: 0.55, post: 0.2,
    build(root, S) {
      S.c1 = para(root, ['You ship', '*Connect your domain.*'], { x: PAD, y: P(380, 380), size: P(98, 96), color: COL.paper });
      S.c2 = para(root, ['Your customer', 'gets *homework.*'], { x: PAD, y: P(380, 380), size: P(104, 110), color: COL.paper });
      // the app card ("your product's settings"): built at 760 px wide, scaled per format
      S.wrap = box(root, 0, 0, 'width:760px;height:700px', '', {});
      S.card = box(S.wrap, 0, 0, 'width:760px;height:430px', '', {}); S.card.classList.add('card'); S.card.style.borderRadius = '16px';
      const k = S.card;
      S.crumb = box(k, 44, 40, `font:500 24px UI;color:${COL.mutedFg}`, 'Settings&nbsp;&nbsp;/&nbsp;&nbsp;Domains');
      S.t1 = box(k, 44, 86, `font:600 36px UI;color:${COL.ink};letter-spacing:-0.01em`, 'Custom domain');
      S.s1 = box(k, 44, 138, `font:400 25px UI;color:${COL.mutedFg}`, 'Use your own domain for your site.');
      S.field = box(k, 44, 196, `width:672px;height:80px;border:1.5px solid ${COL.input};border-radius:8px;box-sizing:border-box;background:#fff`);
      S.ftext = box(S.field, 26, 22, `font:400 30px Mono;color:${COL.ink}`, '');
      S.caret = box(S.field, 0, 18, `width:3px;height:40px;background:${COL.ink}`, '', { o: 0 });
      S.btn = box(k, 44, 300, `width:672px;height:80px;font:500 29px UI;transform-origin:50% 50%`, 'Connect your domain'); S.btn.classList.add('btn');
      // state 2: the instructions (the homework)
      S.t2 = box(k, 44, 86, `font:600 33px UI;color:${COL.ink};letter-spacing:-0.01em`, 'Add these records at your DNS provider', { o: 0 });
      S.hdr = box(k, 44, 150, `font:500 18px UI;color:${COL.mutedFg};letter-spacing:.14em;text-transform:uppercase;width:672px`,
        '<span class="abs" style="left:0">Type</span><span class="abs" style="left:132px">Host</span><span class="abs" style="left:262px">Value</span>', { o: 0 });
      S.rows = [['A', '@', '203.0.113.10'], ['CNAME', 'www', 'edge.customdomain.ai'], ['TXT', '_acme', '9aF2bQ7x…Kd0']].map(([ty, ho, va], i) => {
        const r = box(k, 44, 192 + i * 84, `width:672px;height:68px;border:1px solid ${COL.hair};border-radius:8px;box-sizing:border-box;background:#fff`, '', { o: 0 });
        box(r, 14, 15, `font:500 20px Mono;color:${COL.ink};background:${COL.muted};border:1px solid ${COL.hair};border-radius:6px;padding:4px 10px`, ty);
        box(r, 132, 18, `font:400 25px Mono;color:${COL.ink}`, ho);
        box(r, 262, 18, `font:400 25px Mono;color:${COL.long}`, va);
        const cp = box(r, 600, 14, `width:56px;height:38px;border:1px solid ${COL.input};border-radius:6px;display:flex;align-items:center;justify-content:center;background:#fff;transform-origin:50% 50%`, ICON.copy(22));
        return { r, cp };
      });
      S.note = box(k, 44, 452, `width:672px;height:64px;border-radius:8px;background:${COL.muted};display:flex;align-items:center;gap:12px;padding:0 20px;box-sizing:border-box;font:400 23px UI;color:${COL.mutedFg}`,
        `${ICON.clock(24)}Changes can take up to 48 hours to propagate.`, { o: 0 });
      S.cur = cursor(root, P(36, 42));
    },
    run(t, b, S) {
      // rises in under the outgoing hook (vertical pan), leaves on a whip to the left (horizontal pan) — same curve as the next shot
      put(S.root, { y: H * (1 - pan(t, 7.45, 8.15)), x: -W * 1.05 * pan(t, 15.3, 16.15) });
      riseP(t, S.c1, [8.0, 8.35], 11.85, { exit: 0.3 });
      riseP(t, S.c2, [12.4, 12.8]);
      const sc = P(1.12, 1.19), X = P(1010, 84), Y = P(250, 800);
      put(S.wrap, { x: X, y: Y, s: sc * (1 + 0.03 * seg(t, 8, 16)), r: -1.2 * (1 - sp(t, 7.6, 'heavy')) });
      const hgt = trk(t, [[0, 430], [11.9, 540, 'default']]);
      put(S.card, { css: { height: hgt + 'px' } });
      // typing acme.com 9 → 10.75
      const n = TYPE.type(t, S.ftext, 'acme.com', 9, 10.75, S.caret, 11.7);
      put(S.caret, { x: 26 + n * 18.1 + 2 });
      put(S.btn, { s: press(t, 11) });
      // state swap inside the card: state 1 lifts out through the top, state 2 rises in
      const away = sp(t, 11.65, 'snappy');
      for (const e of [S.t1, S.s1, S.field, S.btn]) put(e, { y: -60 * away, o: away > 0.6 ? 0 : 1 });
      const a2 = rise(t, 12, 40, 'default');
      put(S.t2, { o: a2.o, y: a2.y });
      const ah = rise(t, 12.15, 30, 'default'); put(S.hdr, { o: ah.o, y: ah.y });
      S.rows.forEach((R, i) => {
        const g = rise(t, 12.25 + i * 0.22, 24, 'default');
        put(R.r, { o: g.o, y: g.y });
        const cb = 13.5 + i * 0.5, done = beatAt(t) >= cb;
        put(R.cp, { s: press(t, cb), css: { background: done ? COL.ink : '#fff' }, html: done ? ICON.check(22, COL.ink, '#fff') : ICON.copy(22) });
      });
      const nt = rise(t, 12.9, 20);
      put(S.note, { o: nt.o, y: nt.y });
      // cursor in card space: presses Connect, then the three Copy buttons
      const p = cursorAt(t, [[8, 820, 600], [10.3, 560, 350], [12.9, 560, 360], [13.2, 632, 234], [13.75, 632, 318], [14.25, 632, 402], [14.9, 700, 520]]);
      showCursor(t, S.cur, { x: X + p.x * sc, y: Y + p.y * sc }, [11, 13.5, 14, 14.5], [[9.7, 15.3]]);
    },
  });

  // ================================================================ C. chaos: their registrar panel, where it dies (b16 → b30)
  const ERR = [
    { b: 17, ty: 'CNAME', ho: 'app.acme.com', bad: '.acme.com', at: 'ho', va: 'edge.customdomain.ai', ttl: '3600', chip: 'Host vs. full domain' },
    { b: 19, ty: 'CNAME', ho: 'www', va: 'edge.customdomain.ai', bad: '.acme.com', at: 'va', ttl: '3600', chip: 'The trailing dot' },
    { b: 21, ty: 'TXT', ho: '_acme', va: '9aF2bQ7x…Kd0', ttl: '86400', at: 'ttl', chip: 'TTL 86400: wait a day' },
    { b: 22.5, ty: 'A', ho: 'app', va: 'edge.customdomain.ai', at: 'va-all', ttl: '3600', chip: 'A hostname where an IP belongs' },
    { b: 24, ty: 'CNAME', ho: '@', va: 'edge.customdomain.ai', at: 'row', ttl: '3600', chip: 'CNAME at the root: refused' },
    { b: 25, ty: 'A', ho: '@', va: '192.0.2.44', at: 'old', ttl: '3600', chip: 'The old record still answers' },
  ];
  const FL = ['NXDOMAIN', 'SERVFAIL', 'Certificate failed to issue', 'Record already exists', 'Invalid IPv4 address', 'Propagation pending',
    'Support: “my domain is not working”', 'Verification failed', 'CNAME conflicts with MX', 'Wrong host field', 'Try again in 24 hours', 'www.acme.com: no answer',
    'SSL: pending validation', 'Duplicate record', 'Unsupported at zone apex', 'Setup abandoned', 'TXT record not found', 'Conflicting A record',
    'ACME challenge failed', 'Nameserver mismatch', 'CAA blocks issuance', 'Host field invalid', 'MX overwritten: mail stopped', 'Redirect loop',
    '502 Bad Gateway', 'Wrong registrar login', 'DNSSEC validation failed', 'Still propagating…', 'Record saved twice', 'Ticket escalated'];
  scene({
    name: 'chaos', from: 16, to: 30, pre: 0.75,
    build(root, S) {
      S.eb = eyebrow(root, 'Their registrar · a panel they have never seen', PAD, P(110, 300), COL.fg2);
      S.cam = box(root, 0, 0, `width:1160px;height:720px`);
      S.panel = box(S.cam, 0, 0, `width:1160px;height:720px;border-radius:14px;background:${COL.muted};overflow:hidden;box-shadow:0 50px 120px -30px rgba(0,0,0,.7)`);
      const p = S.panel;
      box(p, 0, 0, `width:1160px;height:72px;background:#e7e5e4;border-bottom:1px solid ${COL.input}`,
        `<div class="abs" style="left:28px;top:20px;font:600 26px UI;color:${COL.ink}">DNS Management</div><div class="abs" style="left:286px;top:23px;font:400 23px Mono;color:${COL.mutedFg}">acme.com · zone editor</div>
         <div class="abs" style="left:${P(944, 740)}px;top:14px;width:190px;height:44px;border-radius:6px;background:#fff;border:1px solid ${COL.input};font:500 21px UI;color:${COL.long};display:flex;align-items:center;justify-content:center">+ Add record</div>`);
      S.cols = TALL ? { ty: 24, ho: 150, va: 440, ttl: 870 } : { ty: 28, ho: 176, va: 492, ttl: 1010 };
      box(p, 0, 92, `width:1160px;font:500 18px UI;color:${COL.mutedFg};letter-spacing:.14em;text-transform:uppercase`,
        Object.entries(S.cols).map(([k, x]) => `<span class="abs" style="left:${x}px">${{ ty: 'Type', ho: 'Host', va: 'Value', ttl: 'TTL' }[k]}</span>`).join(''));
      S.rows = ERR.map((E, i) => {
        const r = box(p, 14, 128 + i * 80, `width:1132px;height:68px;border-radius:8px;background:#fff;border:1px solid ${COL.hair};box-sizing:border-box`, '', { o: 0 });
        const cell = (x) => box(r, x - 14, 17, `font:400 ${P(24, 22)}px Mono;color:${COL.ink};white-space:nowrap`, '');
        const R = { r, ty: cell(S.cols.ty), ho: cell(S.cols.ho), va: cell(S.cols.va), ttl: cell(S.cols.ttl), E };
        R.strike = box(r, 10, 33, `width:1110px;height:2.5px;background:${COL.ink};transform-origin:0 0`, '', { o: 0 });
        R.chip = box(root, 0, 0, `display:flex;align-items:center;gap:12px;padding:12px 20px;border-radius:8px;background:${COL.ink};color:${COL.paper};font:500 ${P(30, 26)}px UI;white-space:nowrap;box-shadow:0 18px 40px -12px rgba(0,0,0,.55), 0 0 0 1px rgba(250,250,249,.12)`,
          `${ICON.cross(P(24, 22))}${E.chip}`, { o: 0 });
        return R;
      });
      if (TALL) {   // tall: the propagation clock owns the bottom band
        S.clock = box(root, PAD, 1378, `font:400 112px Mono;color:${COL.paper};letter-spacing:-0.04em;white-space:nowrap;display:flex;align-items:baseline;gap:22px`, '', { o: 0 });
      }
      S.status = box(p, 0, 648, `width:${P(1160, 1000)}px;height:72px;background:#e7e5e4;border-top:1px solid ${COL.input};display:flex;align-items:center;gap:14px;padding:0 28px;box-sizing:border-box;font:400 22px Mono;color:${COL.long}`, '');
      // the flood: right before the slab, thirty failures bury the frame on thirty-second notes
      const fr = mulberry32(99), fc = P(5, 3), frows = Math.ceil(FL.length / fc);
      S.flood = FL.map((m, i) => ({ e: box(root, 0, 0, `display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:8px;background:${i % 3 === 0 ? COL.paper : COL.ink};color:${i % 3 === 0 ? COL.ink : COL.paper};font:500 ${P(24, 26) + (i % 3) * 4}px UI;white-space:nowrap;box-shadow:0 18px 40px -12px rgba(0,0,0,.6), 0 0 0 1px rgba(250,250,249,.14);transform-origin:50% 50%`,
        `${ICON.cross(P(18, 22), i % 3 === 0 ? COL.ink : COL.paper)}${m}`, { o: 0 }),
        x: 20 + ((i % fc) + fr() * 0.55) * (W - P(400, 420)) / fc, y: P(70, 300) + ((Math.floor(i / fc) + fr() * 0.6) * (H - P(160, 520)) / frows), r: (fr() - 0.5) * 10, b: 25.02 + i * 0.03 }));
      // the slab: one wrong character, and the setup dies
      S.slab = box(root, 0, 0, `width:${W}px;height:${H}px;background:${COL.night}`, '', { o: 0 });
      S.s1 = para(root, TALL ? ['One wrong', 'character,'] : ['One wrong character,'], { x: PAD, y: P(330, 560), size: P(170, 176), color: COL.paper });
      S.s2 = para(root, TALL ? ['and the setup', '*dies.*'] : ['and the setup *dies.*'], { x: PAD, y: P(520, 960), size: P(170, 176), color: COL.paper });
    },
    run(t, b, S) {
      // whip in from the right on the same curve the previous shot leaves on
      put(S.root, { x: W * 1.05 * (1 - pan(t, 15.3, 16.15)) });
      showEyebrow(t, S.eb, 16.2, 25.8);
      const push = seg(t, 16, 26);
      let shake = 0, shakeY = 0;
      for (const E of ERR) { const d = t - bt(E.b); if (d > 0 && d < 0.6) { shake += Math.sin(d * 70) * 9 * Math.exp(-d * 9); shakeY += Math.cos(d * 63) * 5 * Math.exp(-d * 9); } }
      const PS = P(1.02, 0.8) * (1 + 0.07 * ease.inOut(push)), PX = P(110, 76) + shake, PY = P(190, 380) + shakeY;
      put(S.cam, { x: PX, y: PY, s: PS, r: -1.2 * ease.inOut(push) + 2.5 * (1 - sp(t, 15.8, 'heavy')) });
      const u0 = seg(t, 16.5, 26), hours = Math.floor(47.99 * ease.inOut(u0)), mins = Math.floor((u0 * 2879) % 60), secs = Math.floor((u0 * 172799) % 60);
      if (S.clock) { const ck = rise(t, 16.3, 40, 'default'); put(S.clock, { o: ck.o, y: ck.y, html: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}<span style="font:500 24px UI;letter-spacing:.14em;text-transform:uppercase;color:${COL.fg2}">still pending</span>` }); }
      put(S.status, { html: `${ICON.clock(24, COL.long)}Waiting for DNS to propagate · ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}<span style="margin-left:auto;padding:6px 14px;border-radius:999px;border:1px solid ${COL.input};font:500 20px UI;color:${COL.long}">Pending</span>` });
      S.rows.forEach((R, i) => {
        const E = R.E, t0 = E.b - (i < 3 ? 1.35 : 1.1), t1 = E.b - 0.2;
        const g = rise(t, t0 - 0.15, 20, 'snappy');
        put(R.r, { o: g.o, y: g.y });
        const u = seg(t, t0, t1);
        const full = { ty: E.ty, ho: E.ho, va: E.va };
        let n = Math.floor(u * (E.ty.length + E.ho.length + E.va.length));
        const typed = {};
        for (const k of ['ty', 'ho', 'va']) { const s = full[k]; typed[k] = s.slice(0, Math.max(0, Math.min(s.length, n))); n -= s.length; }
        const on = beatAt(t) >= E.b - 0.02;
        const mark = (s) => `<span style="background:${COL.ink};color:${COL.paper};border-radius:4px;padding:0 4px">${s}</span>`;
        put(R.ty, { text: typed.ty });
        put(R.ho, { html: typed.ho + (E.at === 'ho' && on ? mark(E.bad) : '') });
        put(R.va, { html: (E.at === 'va-all' && on ? mark(typed.va) : typed.va) + (E.at === 'va' && on ? mark(E.bad) : '') + (E.at === 'old' && u >= 1 ? `<span style="margin-left:14px;font:500 18px UI;color:${COL.mutedFg};border:1px solid ${COL.input};border-radius:999px;padding:3px 10px;vertical-align:4px">old</span>` : '') });
        put(R.ttl, { html: u >= 1 ? (E.at === 'ttl' && on ? mark(E.ttl) : E.ttl) : '' });
        put(R.strike, { o: E.at === 'row' && on ? 1 : 0, sx: E.at === 'row' ? spHit(t, E.b, 'snappy', HIT) : 0 });
        // the chip slams in on the error beat: beside its row (wide) or as a list under the panel (tall)
        const c = grow(t, E.b, 'snappy', 1.18);
        const jitter = (mulberry32(7 + i)() - 0.5) * 5;
        const cx = TALL ? PAD + (i % 2) * 24 : PX + 1160 * PS - 30, cy = TALL ? 1022 + i * 58 : PY + (128 + i * 80 + 8) * PS;
        put(R.chip, { o: c.o, s: c.s, r: jitter * c.k * (TALL ? 0.5 : 1), x: cx + 40 * (1 - c.k), y: cy });
      });
      S.flood.forEach((F) => { const g = grow(t, F.b, 'snappy', 1.25); put(F.e, { o: g.o, s: g.s, x: F.x, y: F.y - (1 - g.k) * 12, r: F.r * g.k }); });
      // the slab rises over everything (b26), the two lines land, hard cut at b30
      const sl = spHit(t, 'slab', { response: 0.34, damping: 1 }, HIT);
      put(S.slab, { o: sl > 0.001 ? 1 : 0, clip: C.inset((1 - sl) * 100, 0, 0, 0) });
      riseP(t, S.s1, TALL ? [26.1, 26.6] : [26.1], null, { st: 0.12 });
      riseP(t, S.s2, TALL ? [27.25, 27.35] : [27.25], null, { st: 0.1 });
    },
  });

  // ================================================================ D. the gap: two systems, bridged by a person (b30 → b41)
  scene({
    name: 'gap', from: 30, to: 41,
    build(root, S) {
      S.eb = eyebrow(root, 'The three-actor gap', PAD, P(110, 270), COL.fg2);
      S.h1 = para(root, ['Your app and their DNS host', 'agree *perfectly.*'], { x: PAD, y: P(160, 320), size: P(104, 84), color: COL.paper });
      S.h2 = para(root, TALL ? ['The bridge between', 'them is *a person.*'] : ['The bridge between them', 'is *a person* in two tabs.'], { x: PAD, y: P(160, 320), size: P(104, 84), color: COL.paper });
      const NW = P(520, 912), NH = P(300, 250);
      S.NW = NW; S.NH = NH;
      S.pos = TALL ? [[84, 600], [84, 920], [84, 1240]] : [[90, 540], [700, 540], [1310, 540]];
      S.meet = TALL ? [[84, 775], [84, 1095]] : [[400, 540], [1000, 540]];        // where the two systems meet once the human is gone
      S.hc = [S.pos[1][0] + NW / 2, S.pos[1][1] + NH / 2];                        // the human node's centre: the camera pushes into it
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:${S.hc[0]}px ${S.hc[1]}px`);
      const nodeHTML = (lab, title, sub, inv) => `
        <div class="abs eyebrow" style="left:36px;top:34px;font-size:${P(20, 22)}px;color:${inv ? COL.mutedFg : COL.fg2}">${lab}</div>
        <div class="abs display" style="left:36px;top:${P(78, 70)}px;font-size:${P(82, 76)}px;color:${inv ? COL.ink : COL.paper}">${title}</div>
        <div class="abs" style="left:36px;top:${P(200, 172)}px;font:400 ${P(28, 30)}px UI;color:${inv ? COL.long : COL.fg2};white-space:nowrap">${sub}</div>`;
      const mk = (lab, title, sub, inv) => box(S.world, 0, 0, `width:${NW}px;height:${NH}px;border-radius:16px;box-sizing:border-box;${inv ? `background:${COL.paper};box-shadow:0 40px 100px -20px rgba(0,0,0,.85)` : `background:${COL.nightCard};border:1px solid ${COL.nightMuted};box-shadow:0 30px 80px -30px rgba(0,0,0,.8)`};transform-origin:50% 50%`,
        nodeHTML(lab, title, sub, inv), { o: 0 });
      S.slots = S.pos.map(() => box(S.world, 0, 0, `width:${NW}px;height:${NH}px;border-radius:16px;box-sizing:border-box;border:1.5px dashed rgba(168,162,158,.45)`, '', { o: 0 }));
      S.n1 = mk('System', 'Your app', 'Knows every record.');
      S.n3 = mk('System', 'Their DNS host', 'Can write any record.');
      S.l1 = box(S.world, 0, 0, `background:repeating-linear-gradient(${TALL ? '180deg' : '90deg'}, ${COL.fg2} 0 10px, transparent 10px 18px)`, '', { o: 0 });
      S.l2 = box(S.world, 0, 0, `background:repeating-linear-gradient(${TALL ? '180deg' : '90deg'}, ${COL.fg2} 0 10px, transparent 10px 18px)`, '', { o: 0 });
      S.link = box(S.world, 0, 0, `background:${COL.paper}`, '', { o: 0 });
      S.n2 = mk('Human · the failure point', 'Your customer', 'Copy-pastes between tabs.', true);
      S.pk = ['CNAME www', 'A @', 'TXT _acme', 'CNAME www', 'A @', 'TXT _acme', 'CNAME @', 'A www'].map((s) => box(S.world, 0, 0,
        `font:500 ${P(26, 28)}px Mono;color:${COL.paper};background:${COL.nightMuted};border:1px solid #57534e;border-radius:8px;padding:7px 14px;white-space:nowrap;transform-origin:50% 50%;box-shadow:0 12px 30px -8px rgba(0,0,0,.7)`, s, { o: 0 }));
      S.nz = [noise1(11), noise1(12), noise1(13)];
    },
    run(t, b, S) {
      showEyebrow(t, S.eb, 29.6, 39.4);
      riseP(t, S.h1, [29.85, 30.4], 33.7);
      riseP(t, S.h2, [34.05, 34.5], 39.25);
      const { NW, NH, pos, meet } = S;
      // the camera pushes into the human through the build, snaps back out on the stop hit
      const zoom = 1 + P(0.3, 0.14) * ease.inOut(seg(t, 34.6, 39.3)) * (1 - sp(t, 39.45, { response: 0.6, damping: 1 }));
      put(S.world, { s: zoom });
      const close = sp(t, 39.6, { response: 0.42, damping: 0.9 });
      const p1 = [lerp(pos[0][0], meet[0][0], close), lerp(pos[0][1], meet[0][1], close)];
      const p3 = [lerp(pos[2][0], meet[1][0], close), lerp(pos[2][1], meet[1][1], close)];
      const g1 = grow(t, 31, 'default', 0.9), g3 = grow(t, 32, 'default', 0.9), g2 = grow(t, 34, 'snappy', 0.8);
      [31, 34, 32].forEach((nb, i) => put(S.slots[i], { o: b < nb + 0.4 ? 1 : 0, x: pos[i][0], y: pos[i][1] }));
      put(S.n1, { o: g1.o, s: g1.s, x: p1[0], y: p1[1] });
      put(S.n3, { o: g3.o, s: g3.s, x: p3[0], y: p3[1] });
      // the human node: jitters harder through the build, freezes in the silence, is yanked out on the stop hit
      // anticipation (lift + swell, b39) then the exit on a spring (b39.15), down and away, while the camera still holds the push
      const tense = seg(t, 34.5, 38.72), amp = b < 38.72 ? 1.5 + 11 * tense * tense : 0;
      const antic = sp(t, 38.72, 'snappy'), yank = Math.pow(seg(t, 38.8, 39.5), 2.2);
      const jx = S.nz[0](t * 9) * amp, jy = S.nz[1](t * 9) * amp, jr = S.nz[2](t * 7) * amp * 0.25;
      put(S.n2, { o: g2.o && yank < 1 ? 1 : 0, s: g2.s * (1 + 0.06 * antic * (1 - yank)) * (1 - 0.2 * yank), x: pos[1][0] + jx + (TALL ? yank * W * 1.1 : -700 * yank),
        y: pos[1][1] + jy - 28 * antic * (1 - yank) + (TALL ? 120 * yank : yank * H * 0.75), r: jr - 16 * yank });
      // dashed bridges: app ↔ human ↔ host
      const d1 = sp(t, 32.6, 'default'), d2 = sp(t, 33, 'default'), gone = 1 - yank;
      if (TALL) {
        put(S.l1, { o: d1 * gone > 0.01 ? 1 : 0, x: 538, y: pos[0][1] + NH, css: { width: '4px', height: (pos[1][1] - pos[0][1] - NH) * d1 + 'px' } });
        put(S.l2, { o: d2 * gone > 0.01 ? 1 : 0, x: 538, y: pos[1][1] + NH, css: { width: '4px', height: (pos[2][1] - pos[1][1] - NH) * d2 + 'px' } });
      } else {
        put(S.l1, { o: d1 * gone > 0.01 ? 1 : 0, x: pos[0][0] + NW, y: pos[0][1] + NH / 2 - 2, css: { height: '4px', width: (pos[1][0] - pos[0][0] - NW) * d1 + 'px' } });
        put(S.l2, { o: d2 * gone > 0.01 ? 1 : 0, x: pos[1][0] + NW, y: pos[0][1] + NH / 2 - 2, css: { height: '4px', width: (pos[2][0] - pos[1][0] - NW) * d2 + 'px' } });
      }
      // the systems snap together: one solid link on the drop
      const lk = spHit(t, 40, 'snappy', HIT);
      if (TALL) put(S.link, { o: lk > 0.01 ? 1 : 0, x: 536, y: meet[0][1] + NH, css: { width: '8px', height: (meet[1][1] - meet[0][1] - NH) * lk + 'px' } });
      else put(S.link, { o: lk > 0.01 ? 1 : 0, x: meet[0][0] + NW, y: pos[0][1] + NH / 2 - 4, css: { height: '8px', width: (meet[1][0] - meet[0][0] - NW) * lk + 'px' } });
      // records arc from the app to the human; every other one falls out of the bridge
      S.pk.forEach((e, i) => {
        const b0 = 34.4 + i * 0.6, u = ease.inOut(seg(t, b0, b0 + 1)), fail = i % 2 === 1;
        const A = TALL ? [300, pos[0][1] + NH * 0.5] : [pos[0][0] + NW * 0.5, pos[0][1] + 20];
        const B = TALL ? [300, pos[1][1] + NH * 0.5] : [pos[1][0] + NW * 0.5, pos[1][1] + 20];
        const Cc = TALL ? [760, (A[1] + B[1]) / 2] : [(A[0] + B[0]) / 2, pos[0][1] - 190];
        let x = (1 - u) * (1 - u) * A[0] + 2 * u * (1 - u) * Cc[0] + u * u * B[0];
        let y = (1 - u) * (1 - u) * A[1] + 2 * u * (1 - u) * Cc[1] + u * u * B[1], r = (u - 0.5) * 10;
        const fu = seg(t, b0 + 1, b0 + 2.6);
        if (fail && fu > 0) { x += (TALL ? 520 : 140) * fu; y += (TALL ? 260 : 700) * fu * fu; r += 80 * fu; }
        const vis = beatAt(t) > b0 && beatAt(t) < 38.8 && (fail ? fu < 1 : u < 1);
        put(e, { o: vis ? 1 : 0, css: { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${r.toFixed(2)}deg)` } });
      });
    },
  });

  // ================================================================ E. the turn: paper bursts from the junction, the tree grows (b40 → b46)
  scene({
    name: 'turn', from: 40, to: 46, post: 0.35,
    build(root, S) {
      root.style.background = COL.paper;
      S.dots = canvas(root);
      S.tree = box(root, 0, 0, `width:512px;height:512px;transform-origin:0 0`, TREE(COL.ink));
      S.trunk = S.tree.querySelector('.t-trunk'); S.roots = S.tree.querySelector('.t-roots'); S.cs = [...S.tree.querySelectorAll('.t-c')];
      reg(S.trunk); reg(S.roots); S.cs.forEach((c) => reg(c));
      S.word = para(root, ['CustomDomain™'], { x: P(PAD + 236, PAD), y: P(352, 1010), size: P(196, 160), color: COL.ink });
      S.sub = para(root, ['*closes the gap.*'], { x: P(PAD + 242, PAD + 4), y: P(570, 1196), size: P(96, 110), color: COL.long });
    },
    run(t, b, S) {
      const cx = P(960, 540), cy = P(690, 1060), R = Math.hypot(W, H) * 1.05;
      const wipe = sp(t, 40, { response: 0.75, damping: 1 });
      // pushed up and out as the flow rises in beneath it (b45.5 → b46.3)
      put(S.root, { clip: `circle(${(R * wipe).toFixed(1)}px at ${cx}px ${cy}px)`, y: -H * pan(t, 45.5, 46.3) });
      const g = S.dots; g.clearRect(0, 0, W, H); g.fillStyle = COL.input;
      for (let y = 20; y < H; y += 34) for (let x = 20; x < W; x += 34) { const d = Math.hypot(x - cx, y - cy), k = clamp(1 - Math.abs(d - R * wipe * 0.92) / 260); g.globalAlpha = 0.25 + 0.6 * k; g.fillRect(x, y, 2 + 2 * k, 2 + 2 * k); }
      g.globalAlpha = 1;
      // the brand's tree grows out of the junction: trunk, roots, then the canopy, one circle per eighth-beat
      put(S.trunk, { sy: spHit(t, 40.1, 'heavy', HIT) });
      put(S.roots, { s: spHit(t, 40.3, 'default', HIT) });
      [40.5, 40.625, 40.75, 40.875, 41, 41.125].forEach((bb, i) => put(S.cs[i], { s: spHit(t, bb, 'default', HIT) }));
      // big at the junction → lockup beside / above the wordmark on b42
      const big = P(560, 620), small = P(200, 520);
      const s = trk(t, [[0, big], [41.5, small, 'heavy']]) / 512;
      const x = trk(t, [[0, cx - big / 2], [41.5, P(PAD - 18, PAD - 114), 'heavy']]);
      const y = trk(t, [[0, cy - big * 0.79], [41.5, P(330, 530), 'heavy']]);
      put(S.tree, { s: s * (1 + 0.02 * seg(t, 42, 46)), x, y: y - P(0, 40) * ease.inOut(seg(t, 42, 46)) });
      riseP(t, S.word, [P(42, 41.7)], null, { st: 0 });
      riseP(t, S.sub, [P(42.35, 42.05)], null, { st: 0.08 });
    },
  });

  // ================================================================ F. the flow: the real connect widget, one container, one cursor (b46 → b68)
  // Rebuilt from the live widget on customdomain.ai (assets/cap/widget-states.png): same copy, same states, same order.
  // The camera flies over the card: it pushes into the active part of each state and pans the card from side to side,
  // opposite the caption, then pushes through the live URL until it fills the frame.
  const ST = [[46, 300], [48, 262], [52, 334], [54, 392], [56, 284], [60, 284], [63.7, 312]];
  const CAM = TALL
    ? [[0, { tx: 540, ty: 1110, fx: 200, fy: 150, s: 2.3 }], [47.85, { tx: 540, ty: 1080, fx: 175, fy: 130, s: 2.85 }], [51.85, { tx: 540, ty: 1090, fx: 200, fy: 175, s: 2.45 }],
       [53.85, { tx: 540, ty: 1075, fx: 200, fy: 200, s: 2.3 }], [55.85, { tx: 540, ty: 1080, fx: 190, fy: 130, s: 2.7 }], [59.85, { tx: 540, ty: 1080, fx: 190, fy: 130, s: 2.7 }],
       [63.6, { tx: 540, ty: 1090, fx: 200, fy: 160, s: 2.45 }], [65.55, { tx: 520, ty: 1000, fx: 200, fy: 196, s: 3.1 }]]
    : [[0, { tx: 1320, ty: 540, fx: 200, fy: 150, s: 2.15 }], [47.85, { tx: 1300, ty: 520, fx: 175, fy: 130, s: 2.9 }], [51.85, { tx: 600, ty: 540, fx: 200, fy: 175, s: 2.45 }],
       [53.85, { tx: 600, ty: 540, fx: 200, fy: 200, s: 2.25 }], [55.85, { tx: 1340, ty: 520, fx: 190, fy: 130, s: 3.0 }], [59.85, { tx: 620, ty: 520, fx: 190, fy: 130, s: 2.8 }],
       [63.6, { tx: 1330, ty: 540, fx: 200, fy: 160, s: 2.4 }], [65.55, { tx: 960, ty: 540, fx: 200, fy: 196, s: 6.0 }]];
  scene({
    name: 'flow', from: 46, to: 68, pre: 0.5,
    build(root, S) {
      root.style.background = COL.paper;
      S.dots = canvas(root);
      const side = P([140, 1130, 140, 1260, 140], [84, 84, 84, 84, 84]);
      S.caps = [[46.1, 51.72, ['One button', '*for them.*']], [52.6, 55.72, ['They approve', '*once.*']], [56.1, 59.72, ['We write', '*the records.*']], [60.6, 63.5, ['We issue', '*HTTPS.*']], [64.1, 65.4, ['Their domain,', '*live.*']]]
        .map(([bb, out, lines], i) => ({ bb, out, R: para(root, lines, { x: side[i], y: P(390, 330), size: P(124, 112), color: COL.ink }) }));
      S.wrap = box(root, 0, 0, 'width:400px;height:400px');
      S.card = box(S.wrap, 0, 0, 'width:400px;height:300px;overflow:hidden;border-radius:14px'); S.card.classList.add('card');
      const k = S.card;
      const layer = () => box(k, 0, 0, 'width:400px;height:400px', '', { o: 0 });
      const title = (L, s, center) => box(L, center ? 0 : 24, 24, `font:600 16px UI;color:${COL.ink};${center ? 'width:400px;text-align:center' : ''}`, s);
      const xbtn = (L) => box(L, 364, 20, '', ICON.close(16));
      const btn = (L, y, s, extra = '') => { const e = box(L, 24, y, 'width:352px;height:42px;font:500 14px UI;transform-origin:50% 50%;' + extra, s); e.classList.add('btn'); return e; };
      const foot = (L, y) => box(L, 0, y, `width:400px;text-align:center;font:400 11px UI;color:${COL.mutedFg}`, `Powered by <b style="color:${COL.ink};font-weight:600">CustomDomain™</b>`);
      const row = (L, y, s) => { const r = box(L, 24, y, `font:400 13px UI;color:${COL.long};display:flex;align-items:center;gap:10px;white-space:nowrap`, ''); const ic = box(r, 0, 0, 'position:relative;width:18px;height:18px;transform-origin:50% 50%', ICON.dot(18)); const tx = el('span', {}, r, s); return { r, ic, tx }; };
      // S1 connect
      const L1 = layer(); title(L1, 'Connect your domain'); xbtn(L1);
      const fld = box(L1, 24, 60, `width:352px;height:44px;border:1px solid ${COL.ink};border-radius:8px;box-sizing:border-box;box-shadow:0 0 0 3px rgba(28,25,23,.08)`, `<div class="abs" style="left:12px;top:13px">${ICON.globe(16)}</div>`);
      S.ftx = box(fld, 38, 12, `font:400 15px Mono;color:${COL.ink}`, ''); S.fcar = box(fld, 0, 11, `width:1.5px;height:20px;background:${COL.ink}`, '', { o: 0 });
      box(L1, 24, 116, `font:400 12px UI;color:${COL.mutedFg};display:flex;gap:6px;align-items:center;white-space:nowrap`, `${ICON.lock(13)}We detect where it’s hosted, so you never touch DNS.`);
      S.cont = btn(L1, 204, 'Continue'); foot(L1, 270);
      // S2 checking
      const L2 = layer(); title(L2, 'Checking everjust.co…'); xbtn(L2);
      S.tiles = ['namecheap', 'godaddy', 'route53', 'digitalocean', 'cloudflare', 'vercel'].map((n, i) => box(L2, 24 + i * 50, 60,
        `width:40px;height:40px;border-radius:9px;border:1px solid ${COL.hair};background:#fff;box-sizing:border-box;display:flex;align-items:center;justify-content:center;transform-origin:50% 50%`, `<img src="${LOGO(n)}" style="width:22px;height:22px;object-fit:contain">`));
      S.ring = box(L2, 0, 56, `width:48px;height:48px;border-radius:12px;border:2px solid ${COL.ink};box-sizing:border-box`, '', { o: 0 });
      S.badge = box(L2, 24 + 4 * 50 + 28, 54, 'transform-origin:50% 50%', ICON.check(16), { o: 0 });
      S.chk = ['Looking up your DNS', 'Identifying your provider', 'Preparing your records'].map((s, i) => row(L2, 124 + i * 30, s));
      foot(L2, 236);
      // S3 provider found
      const L3 = layer(); title(L3, 'Connect everjust.co'); xbtn(L3);
      box(L3, 24, 58, `width:352px;height:62px;border-radius:10px;background:${COL.muted};border:1px solid ${COL.hair};box-sizing:border-box`,
        `<div class="abs" style="left:12px;top:11px;width:38px;height:38px;border-radius:8px;background:#fff;border:1px solid ${COL.hair};display:flex;align-items:center;justify-content:center"><img src="${LOGO('cloudflare')}" style="width:24px"></div>
         <div class="abs" style="left:62px;top:12px;font:600 14px UI;color:${COL.ink}">Cloudflare</div><div class="abs" style="left:62px;top:33px;font:400 12px Mono;color:${COL.mutedFg}">everjust.co</div>`);
      box(L3, 24, 134, `width:352px;font:400 13px/1.5 UI;color:${COL.long}`, 'Authorize once and we’ll add the DNS records for you. No copy-paste, no waiting.');
      S.auth = btn(L3, 206, `<img src="${LOGO('cloudflare')}" style="width:18px;background:#fff;border-radius:4px;padding:1px">Authorize with Cloudflare`);
      box(L3, 0, 262, `width:400px;text-align:center;font:400 12px UI;color:${COL.mutedFg}`, 'Set up manually instead');
      foot(L3, 306);
      // S4 provider consent
      const L4 = layer(); xbtn(L4);
      box(L4, 24, 20, `width:330px;height:30px;border-radius:7px;background:${COL.muted};border:1px solid ${COL.hair};box-sizing:border-box;display:flex;align-items:center;gap:6px;padding-left:10px;font:400 12px Mono;color:${COL.mutedFg}`, `${ICON.lock(12)}dash.cloudflare.com`);
      box(L4, 176, 66, `width:48px;height:48px;border-radius:11px;border:1px solid ${COL.hair};background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.06)`, `<img src="${LOGO('cloudflare')}" style="width:30px">`);
      box(L4, 0, 128, `width:400px;text-align:center;font:600 17px UI;color:${COL.ink}`, 'Authorize CustomDomain™');
      box(L4, 0, 156, `width:400px;text-align:center;font:400 13px/1.5 UI;color:${COL.long}`, `CustomDomain™ wants to manage DNS<br>for <b style="color:${COL.ink}">everjust.co</b>.`);
      ['Read &amp; write DNS records', 'Verify domain ownership'].forEach((s, i) => box(L4, 40, 214 + i * 28, `font:400 13px UI;color:${COL.long};display:flex;align-items:center;gap:10px`, `${ICON.soft(18)}${s}`));
      S.allow = btn(L4, 284, 'Allow');
      box(L4, 0, 338, `width:400px;text-align:center;font:400 12px UI;color:${COL.mutedFg}`, 'Deny');
      foot(L4, 364);
      // S5 records
      const L5 = layer(); title(L5, 'Setting up everjust.co'); xbtn(L5);
      S.recs = [['A', '@', 'edge.customdomain.ai'], ['CNAME', 'www', 'edge.customdomain.ai'], ['TXT', '_acme', 'cd-verify=9aF2…Kd0']].map(([ty, ho, va], i) => {
        const r = box(L5, 24, 58 + i * 44, `width:352px;height:36px;border-radius:8px;border:1px solid ${COL.hair};box-sizing:border-box;background:#fff`, `
          <div class="abs" style="left:8px;top:7px;font:500 10px Mono;color:${COL.long};background:${COL.muted};border:1px solid ${COL.hair};border-radius:5px;padding:3px 6px">${ty}</div>
          <div class="abs" style="left:70px;top:10px;font:500 12px Mono;color:${COL.ink}">${ho}</div>
          <div class="abs" style="left:122px;top:10px;font:400 12px Mono;color:${COL.mutedFg}">${va}</div>`, { o: 0 });
        const ic = box(r, 322, 9, 'width:16px;height:16px;transform-origin:50% 50%', ICON.spin(16)); return { r, ic };
      });
      S.wst = box(L5, 24, 206, `font:400 12px UI;color:${COL.long};display:flex;align-items:center;gap:8px`, '');
      foot(L5, 252);
      // S6 finishing
      const L6 = layer(); title(L6, 'Finishing everjust.co'); xbtn(L6);
      S.fin = ['Verifying domain ownership', 'Issuing HTTPS certificate', 'Publishing to the edge'].map((s, i) => row(L6, 64 + i * 32, s));
      box(L6, 0, 214, `width:400px;font:400 11px UI;color:${COL.mutedFg};display:flex;align-items:center;justify-content:center;gap:6px`, `${ICON.lock(12)}Certificate issued before the first request.`);
      foot(L6, 252);
      // S7 live
      const L7 = layer(); S.l7x = xbtn(L7);
      S.big = box(L7, 172, 34, 'width:56px;height:56px;transform-origin:50% 50%', ICON.check(56));
      S.l7t = [box(L7, 0, 108, `width:400px;text-align:center;font:600 19px UI;color:${COL.ink}`, 'everjust.co is live'),
        box(L7, 0, 138, `width:400px;text-align:center;font:400 13px UI;color:${COL.long}`, 'DNS records configured · HTTPS issued')];
      S.url = box(L7, 60, 176, `width:280px;height:40px;border-radius:9px;border:1px solid ${COL.hair};background:${COL.muted};box-sizing:border-box;display:flex;align-items:center;gap:8px;padding-left:12px;font:500 13px Mono;color:${COL.ink}`,
        `${ICON.lock(14, COL.ink)}https://everjust.co<span style="margin-left:auto;margin-right:8px;background:${COL.ink};color:${COL.paper};font:500 11px UI;border-radius:999px;padding:3px 9px 3px 7px;display:flex;align-items:center;gap:4px">${ICON.check(11, COL.ink, COL.paper)}Live</span>`);
      S.l7f = foot(L7, 280);
      S.layers = [L1, L2, L3, L4, L5, L6, L7];
      S.cur = cursor(root, P(36, 42));
    },
    run(t, b, S) {
      put(S.root, { y: H * (1 - pan(t, 45.5, 46.3)) });
      // dot grid, as on the homepage, drifting slowly
      const g = S.dots; g.clearRect(0, 0, W, H); g.fillStyle = COL.input; g.globalAlpha = 0.55;
      const off = (t * 6) % 34;
      for (let y = 20 - off; y < H; y += 34) for (let x = 20; x < W; x += 34) g.fillRect(x, y, 2.2, 2.2);
      g.globalAlpha = 1;
      // captions swap every two bars and alternate sides with the card (wide)
      S.caps.forEach((c) => riseP(t, c.R, [c.bb, c.bb + 0.3], c.out));
      // the camera
      const cam = trkObj(t, CAM.map(([bb, v], i) => [bb, v, i === CAM.length - 1 ? 'heavy' : 'default']));
      const sc = cam.s * (1 + 0.012 * Math.sin(t * 0.9)), X = cam.tx - cam.fx * sc, Y = cam.ty - cam.fy * sc;
      const tilt = trk(t, [[0, 0], [48, -0.6], [52, 0.5], [54, -0.45], [56, 0.4], [60, -0.3], [64, 0]].map(([bb, v]) => [bb - 0.1, v, 'default']));
      put(S.wrap, { x: X, y: Y, s: sc, r: tilt });
      const hgt = trk(t, ST.map(([bb, h], i) => [i === 0 ? 0 : bb - 0.1, h, 'default']));
      put(S.card, { css: { height: hgt + 'px' } });
      // state swaps inside the one container: the outgoing state lifts out through the top, the next rises from below
      // (a vertical carousel: both move on the same spring, exactly one layer-height apart, so they never overlap)
      S.layers.forEach((L, i) => {
        const tin = ST[i][0], tout = i < ST.length - 1 ? ST[i + 1][0] : 1e9;
        const kin = i === 0 ? 1 : sp(t, tin - 0.12, 'default'), kout = sp(t, tout - 0.12, 'default');
        const vis = kin > 0.001 && kout < 0.995;
        put(L, { o: vis ? 1 : 0, y: 400 * (1 - kin) - 400 * kout });
      });
      // S1: typing, Continue
      const n = TYPE.type(t, S.ftx, 'everjust.co', 46.5, 47.3, S.fcar, 47.9);
      put(S.fcar, { x: 38 + n * 9.05 + 1 });
      put(S.cont, { s: press(t, 47.5) });
      // S2: the ring scans the providers and lands on Cloudflare
      const ix = trk(t, [[0, 0], [48.3, 1, 'snappy'], [48.8, 2, 'snappy'], [49.3, 3, 'snappy'], [49.9, 4, 'snappy']]);
      put(S.ring, { o: b > 48.1 ? 1 : 0, x: 20 + ix * 50 });
      S.tiles.forEach((e, i) => { const lit = i === 4 ? spHit(t, 50.5, 'snappy', HIT) : 0; put(e, { s: 1 + 0.08 * lit - 0.06 * (i !== 4 ? seg(t, 50.3, 50.8) : 0), css: { filter: i !== 4 && b > 50.3 ? `grayscale(${seg(t, 50.3, 50.8)})` : 'none' } }); });
      const bg = grow(t, 50.5, 'snappy', 0.4); put(S.badge, { o: bg.o, s: bg.s });
      const flip = (R, bb, b0) => { const k = beatAt(t) >= bb - 0.02 ? 2 : beatAt(t) >= b0 ? 1 : 0; const gk = grow(t, bb, 'snappy', 0.5); put(R.ic, { html: k === 2 ? ICON.soft(18) : k === 1 ? ICON.spin(18) : ICON.dot(18), r: k === 1 ? t * 400 : 0, s: k === 2 ? gk.s : 1 }); put(R.tx, { css: { color: k ? COL.ink : COL.mutedFg } }); };
      [[49, 48.1], [50.5, 49], [51.25, 50.5]].forEach(([bb, b0], i) => flip(S.chk[i], bb, b0));
      put(S.auth, { s: press(t, 53) });
      // S4: Allow → Authorizing…
      const authz = beatAt(t) >= 55.5;
      put(S.allow, { s: press(t, 55.5), html: authz ? `<span style="display:inline-block;width:16px;height:16px;transform:rotate(${(t * 400) % 360}deg)">${ICON.spin(16, COL.paper)}</span>Authorizing…` : 'Allow' });
      // S5: records written one per beat
      S.recs.forEach((R, i) => {
        const g2 = rise(t, 56.25 + i * 0.4, 12, 'snappy'); put(R.r, { o: g2.o, y: g2.y });
        const done = beatAt(t) >= 57 + i - 0.02, gk = grow(t, 57 + i, 'snappy', 0.5);
        put(R.ic, { html: done ? ICON.check(16) : ICON.spin(16), r: done ? 0 : t * 400, s: done ? gk.s : 1 });
      });
      const wDone = beatAt(t) >= 59.2;
      put(S.wst, { html: `<span style="display:inline-block;width:14px;height:14px;transform:rotate(${wDone ? 0 : (t * 400) % 360}deg)">${wDone ? ICON.check(14) : ICON.spin(14)}</span>${wDone ? 'Records written' : 'Writing records…'}` });
      // S6
      [[61, 60.2], [62, 61], [63, 62]].forEach(([bb, b0], i) => flip(S.fin[i], bb, b0));
      // S7
      // wide: as the camera pushes through the URL, the rest of the live card lifts out of the container, leaving the URL alone
      const bk = grow(t, 64, 'snappy', 0.4), lift = TALL ? 0 : sp(t, 65.3, 'default');
      put(S.big, { s: bk.s, y: -240 * lift }); S.l7t.forEach((e) => put(e, { y: -240 * lift })); put(S.l7f, { y: 140 * lift }); put(S.l7x, { y: -240 * sp(t, 65.3, 'default') });
      // cursor: card coordinates through the camera, visible only around its presses
      const p = cursorAt(t, [[46, 430, 420], [46.9, 250, 232], [48.2, 250, 236], [52.3, 240, 234], [54.4, 250, 312], [56.3, 300, 420]]);
      showCursor(t, S.cur, { x: X + p.x * sc, y: Y + p.y * sc }, [47.5, 53, 55.5], [[46.6, 47.95], [52.25, 53.5], [54.6, 56]]);
    },
  });

  // ================================================================ G. proof: zero DNS panels; every provider (b68 → b76)
  const PROV = ['cloudflare', 'godaddy', 'namecheap', 'route53', 'azuredns', 'gcpdns', 'digitalocean', 'vercel', 'netlify', 'squarespace', 'ionos', 'wix',
    'bluehost', 'wordpresscom', 'shopify', 'hostinger', 'porkbun', 'namecom', 'gandi', 'dynadot', 'ovh', 'spaceship', 'hetzner', 'linode'];
  scene({
    name: 'proof', from: 68, to: 76,
    build(root, S) {
      root.style.background = COL.paper;
      S.zero = para(root, ['0'], { x: P(PAD - 10, PAD - 10), y: P(150, 330), size: P(700, 640), color: COL.ink });
      S.zt = para(root, TALL ? ['DNS panels your', 'customer should', '*ever see.*'] : ['DNS panels', 'your customer', 'should *ever see.*'], { x: P(560, PAD), y: P(330, 1010), size: P(104, 100), color: COL.ink });
      S.h = para(root, ['Every provider', 'they *already use.*'], { x: PAD, y: P(330, 330), size: P(118, 104), color: COL.ink });
      S.stat = box(root, PAD, P(620, 590), `font:400 ${P(28, 30)}px Mono;color:${COL.mutedFg};white-space:nowrap`, `<b style="color:${COL.ink};font-weight:500">150+</b> DNS providers · <b style="color:${COL.ink};font-weight:500">40+</b> set up automatically`, { o: 0 });
      const cols = P(4, 5), ts = P(132, 140), gap = P(18, 18), gx = P(1160, 84), gy = P(110, 720);
      const gw = cols * (ts + gap) - gap, gh = Math.ceil(PROV.length / cols) * (ts + gap) - gap;
      S.wall = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:${gx}px ${TALL ? gy : gy + gh / 2}px`);   // anchored at the wall's edge nearest the type, so the close-up never covers it
      const r = mulberry32(5);
      S.tiles = PROV.map((n, i) => ({ e: box(S.wall, gx + (i % cols) * (ts + gap), gy + Math.floor(i / cols) * (ts + gap),
        `width:${ts}px;height:${ts}px;border-radius:18px;background:#fff;box-shadow:0 0 0 1px ${COL.hair}, 0 10px 24px -14px rgba(28,25,23,.18);display:flex;align-items:center;justify-content:center;transform-origin:50% 50%`,
        `<img src="${LOGO(n)}" style="width:${ts * 0.46}px;height:${ts * 0.46}px;object-fit:contain">`, { o: 0 }), dx: (r() - 0.5) * 700, dy: 300 + r() * 500, dr: (r() - 0.5) * 50 }));
    },
    run(t, b, S) {
      riseP(t, S.zero, [67.9], 71.74);
      riseP(t, S.zt, [68.25, 68.45, 68.65], 71.72, { st: 0.05 });
      riseP(t, S.h, [71.95, 72.3], 75.86);
      const st = rise(t, 72.8, 20), so = sp(t, 75.6, 'snappy'); put(S.stat, { o: st.o && so < 0.97 ? 1 : 0, y: st.y - 40 * so, sy: 1 - so, css: { 'transform-origin': '0 50%' } });
      const drift = -40 * seg(t, 72, 76);
      // the camera starts close on the wall and pulls back (with a slight roll) as it fills, to reveal every provider
      const pull = 1 - ease.inOut(seg(t, 71.4, 75.7));
      put(S.wall, { s: 1 + P(0.85, 0.6) * pull, r: -4 * pull });
      // the wall: tiles fly in from below the frame, scattered, and settle into the grid one per thirty-second
      S.tiles.forEach((T, i) => { const k = sp(t, 71.45 + i * 0.12, 'default'); const out = sp(t, 75.74 + (i % 6) * 0.02, 'snappy');
        put(T.e, { o: k > 0.002 && out < 0.98 ? 1 : 0, x: T.dx * (1 - k), y: T.dy * (1 - k) + drift + out * H * 0.3, r: T.dr * (1 - k), s: 1 - 0.4 * out }); });
    },
  });

  // ================================================================ H. end card: the promise, the lockup, the CTA, then an iris back to night (b76 → b84)
  scene({
    name: 'end', from: 76, to: 84,
    build(root, S) {
      root.style.background = COL.paper;
      S.dots = canvas(root);
      S.push = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:${PAD}px ${H / 2}px`);
      // the problem, solved: the widget's live state, as the flow ended (wide: right of the headline; tall: under it, then pushed out)
      {
        S.live = box(S.push, P(1180, 220), P(250, 990), 'width:400px;height:312px;transform-origin:0 0', '', { o: 0 }); S.live.classList.add('card'); S.live.style.borderRadius = '14px';
        box(S.live, 172, 34, 'width:56px;height:56px', ICON.check(56));
        box(S.live, 0, 108, `width:400px;text-align:center;font:600 19px UI;color:${COL.ink}`, 'everjust.co is live');
        box(S.live, 0, 138, `width:400px;text-align:center;font:400 13px UI;color:${COL.long}`, 'DNS records configured · HTTPS issued');
        box(S.live, 60, 176, `width:280px;height:40px;border-radius:9px;border:1px solid ${COL.hair};background:${COL.muted};box-sizing:border-box;display:flex;align-items:center;gap:8px;padding-left:12px;font:500 13px Mono;color:${COL.ink}`,
          `${ICON.lock(14, COL.ink)}https://everjust.co<span style="margin-left:auto;margin-right:8px;background:${COL.ink};color:${COL.paper};font:500 11px UI;border-radius:999px;padding:3px 9px 3px 7px;display:flex;align-items:center;gap:4px">${ICON.check(11, COL.ink, COL.paper)}Live</span>`);
        box(S.live, 0, 280, `width:400px;text-align:center;font:400 11px UI;color:${COL.mutedFg}`, `Powered by <b style="color:${COL.ink};font-weight:600">CustomDomain™</b>`);
      }
      S.h = para(S.push, TALL ? ['Your customers', 'should never', '*touch DNS.*'] : ['Your customers', 'should never', '*touch DNS.*'], { x: PAD, y: P(150, 450), size: P(150, 150), color: COL.ink });
      S.tc = [P(PAD + 46, PAD + 58), P(680, 1078)];                      // tree centre: the iris closes on it
      const ts = P(104, 120);
      S.tree = box(S.push, S.tc[0] - ts / 2, S.tc[1] - ts * 0.6, `width:${ts}px;height:${ts}px;transform-origin:50% 100%`, TREE(COL.ink), { o: 0 });
      S.word = para(S.push, ['CustomDomain™'], { x: P(PAD + 108, PAD + 128), y: P(640, 1028), size: P(92, 96), color: COL.ink });
      S.btn = box(S.push, PAD, P(800, 1200), `width:${P(440, 560)}px;height:${P(112, 128)}px;font:500 ${P(44, 50)}px UI;gap:14px;border-radius:10px;transform-origin:50% 50%`, `Start free trial ${ICON.arrow(P(34, 40))}`, { o: 0 });
      S.btn.classList.add('btn');
      S.url = box(S.push, P(PAD + 490, PAD), P(830, 1376), `font:400 ${P(54, 62)}px Mono;color:${COL.ink};white-space:nowrap`, 'customdomain.ai', { o: 0 });
      S.under = box(S.push, 0, P(902, 1456), `height:4px;background:${COL.ink}`, '', { o: 0 });
      S.cur = cursor(root, P(40, 46));
    },
    run(t, b, S) {
      const R = Math.hypot(W, H);
      // the iris closes on the tree (b82.9 → b83.85); beneath it the hook's frame 0 is already waiting
      put(S.root, { clip: `circle(${(R * (1 - ease.inOut(seg(t, 82.9, 83.85)))).toFixed(1)}px at ${S.tc[0]}px ${S.tc[1]}px)` });
      const g = S.dots; g.clearRect(0, 0, W, H); g.fillStyle = COL.input; g.globalAlpha = 0.5;
      const off = (t * 6) % 34;
      for (let y = 20 - off; y < H; y += 34) for (let x = 20; x < W; x += 34) g.fillRect(x, y, 2.2, 2.2);
      g.globalAlpha = 1;
      put(S.push, { s: 1 + 0.04 * ease.inOut(seg(t, 76, 84)) });
      riseP(t, S.h, [75.55, 76.1, 76.6], null, { st: 0.07 });
      const tr = grow(t, 78, 'heavy', 0.6); put(S.tree, { o: tr.o, s: tr.s });
      riseP(t, S.word, [78.05], null, { st: 0 });
      // the CTA: snaps in on b79, pressed on b81 (dips and darkens), springs back
      const bt_ = grow(t, 79, 'snappy', 0.8), pr = dip(t, 81, 1);
      put(S.btn, { o: bt_.o, s: bt_.s * (1 - 0.06 * pr), css: { background: pr > 0.2 ? COL.night : COL.ink, 'box-shadow': `0 ${18 - 14 * pr}px 40px -16px rgba(28,25,23,.5)` } });
      const u = rise(t, 79.4, 30, 'default'); put(S.url, { o: u.o, y: u.y });
      // the underline sweeps through the URL twice (enter left, exit right), so the hold never goes static
      const UW = P(486, 558), UX = P(PAD + 490, PAD);
      const sw = Motion.indicator(t, [[0, 0, 0], [bt(80.5), 0, 1], [bt(81.5), 1, 1], [bt(82), 0, 1], [bt(82.5), 1, 1]]);
      put(S.under, { o: sw.size > 0.003 ? 1 : 0, x: UX + UW * sw.start, css: { width: `${UW * sw.size}px` } });
      const lv = rise(t, P(77, 76.5), 60, 'default'), gone = TALL ? sp(t, 77.75, 'default') : 0;
      put(S.live, { o: lv.o && gone < 0.99 ? 1 : 0, y: lv.y + gone * H * 0.62, s: P(1.55, 1.6), r: 1.2 * (1 - lv.k) + 6 * gone });
      const bx = PAD + P(220, 280), by = P(856, 1264);
      const p = cursorAt(t, [[79.6, bx + 300, by + 220], [80.6, bx + 20, by + 6], [81.4, PAD + P(452, 572), P(918, 1336)]]);
      showCursor(t, S.cur, p, [81], [[79.8, 84]]);
    },
  });

  C.start();
})();
