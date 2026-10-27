// CustomDomain™: "Under the Button". One continuous take timed to its voiceover (≈76 s), 16:9 and 9:16.
// The "Connect domain" button is the tip of an iceberg: paper above the waterline, the brand's ink below. The camera
// dives through eight layers (each a real system with a docs page), pulls back to show the whole mass, then rises.
// Pure function of time: water, ice, light and particles are seeded canvas drawing; text and glyphs are DOM/SVG.
(() => {
  const { W, H, FMT, put, reg, el, scene, canvas, sp, spHit, trk, trkObj, seg, clamp, lerp, ease, bt, beatAt, beatOf, mulberry32, noise1 } = C;
  const TALL = FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '400 40px UI', '500 40px UI', '600 40px UI', '400 30px Mono', '500 30px Mono'];
  const COL = { paper: '#fafaf9', ink: '#1c1917', deep: '#0c0a09', s800: '#292524', s700: '#44403c', s600: '#57534e', s500: '#78716c',
    s400: '#a8a29e', s300: '#d6d3d1', s200: '#e7e5e4', done: '#16a34a' };
  const NS = 'http://www.w3.org/2000/svg';
  const HIT = 1 / 60;

  // ---------------------------------------------------------------- time helpers (voice-driven)
  const VOW = window.VOW || {};
  const V0 = (id) => beatOf('vo_' + id), V1 = (id) => beatOf('vo_' + id + '_end');
  const Wd = (id, word, n = 0) => { const ws = (VOW[id] || []).filter((w) => w[0] === word); return ws.length ? ws[Math.min(n, ws.length - 1)][1] : V0(id); };
  const o4 = (k) => (k > 0.015 ? 1 : 0);
  const grow = (t, b, p = 'snappy', from = 0.86) => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), s: from + (1 - from) * k }; };

  // ---------------------------------------------------------------- DOM + type helpers
  function box(parent, x, y, css = '', html = '', base = {}) { return reg(el('div', { class: 'abs', style: `left:${x}px;top:${y}px;${css}` }, parent, html), base); }
  function para(parent, lines, o) {
    const size = o.size, lh = o.lh ?? 1.04, R = { words: [], line: [], size, els: [] };
    lines.forEach((txt, li) => {
      const L = el('div', { class: 'line display', style: `left:${o.x}px;top:${o.y + li * size * lh}px;font-size:${size}px;color:${o.color || COL.ink}` }, parent);
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
  const at = (R, starts, st = 0.07) => { const n = []; return R.words.map((w, i) => { const li = R.line[i]; n[li] = (n[li] ?? -1) + 1; return starts[Math.min(li, starts.length - 1)] + n[li] * st; }); };
  const riseP = (t, R, starts, out = null, o = {}) => TYPE.rise(t, R, at(R, starts, o.st), out, o);
  // a steady exit: the words lift up out of their mask over ~0.22 beats (≈ 5 frames at 30 fps), never a one-frame cut
  // the mask is opened one line height upward for the exit, so the words travel visibly before the mask takes them
  const lift = (t, R, b0) => {
    const e = seg(t, b0, b0 + 0.3); if (e <= 0) return;
    R.els.forEach((L) => put(L, { css: { paddingTop: `${R.size * 1.1}px`, marginTop: `${-R.size * 1.1}px` } }));
    R.words.forEach((w) => put(w, { y: -R.size * 2.2 * e, hide: e >= 0.999 }));
  };
  function label(parent, x, y, text, css = '') { const e = box(parent, x, y, `white-space:nowrap;${css}`, ''); e._full = text; return e; }
  function write(t, e, b0, dur = null, gone = 1e9, g1 = null) {
    const d = dur ?? Math.max(0.3, e._full.length * 0.03);
    let n = Math.round(seg(t, b0, b0 + d) * e._full.length);
    if (g1 != null) n = Math.min(n, Math.round((1 - ease.inOut(seg(t, gone, g1))) * e._full.length));
    else if (beatAt(t) >= gone) n = 0;
    put(e, { text: e._full.slice(0, n) });
  }
  const UI = (px, w = 500, c = COL.paper) => `font:${w} ${px}px UI;color:${c};`;
  const MONO = (px, c = COL.paper, w = 400) => `font:${w} ${px}px Mono;color:${c};`;

  // ---------------------------------------------------------------- clean strokes that draw themselves on
  function svgIn(parent, w = 10, h = 10) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('width', w); s.setAttribute('height', h); parent.appendChild(s); return s; }
  function pth(svg, d, sw = 3, color = COL.paper, fill = 'none') {
    const e = document.createElementNS(NS, 'path'); e.setAttribute('d', d); e.setAttribute('fill', fill); e.setAttribute('stroke', color);
    e.setAttribute('stroke-width', sw); e.setAttribute('stroke-linecap', 'round'); e.setAttribute('stroke-linejoin', 'round'); svg.appendChild(e); return e;
  }
  const dL = (x1, y1, x2, y2) => `M${x1},${y1} L${x2},${y2}`;
  const dRR = (x, y, w, h, r) => `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
  const dC = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy} Z`;
  function dot(svg, cx, cy, r, color = COL.paper) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r); c.setAttribute('fill', color); svg.appendChild(c); return reg(c, { o: 0 }); }
  const dPL = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  function D(...parts) {
    const strokes = parts.flat(3).filter(Boolean);
    const lens = strokes.map((p) => p.getTotalLength() + 1);
    strokes.forEach((p, i) => { p.setAttribute('stroke-dasharray', `${lens[i].toFixed(1)} ${lens[i].toFixed(1)}`); reg(p, { o: 0 }); });
    return { strokes, lens, total: lens.reduce((a, b) => a + b, 0) };
  }
  function drawU(Dr, u) {
    let acc = u * Dr.total;
    Dr.strokes.forEach((p, i) => { const f = clamp(acc / Dr.lens[i]); acc -= Dr.lens[i]; put(p, { o: f > 0.002 ? 1 : 0, css: { strokeDashoffset: (Dr.lens[i] * (1 - f)).toFixed(1) } }); });
  }
  function draw(t, Dr, b0, b1, e0 = null, e1 = null) { let u = ease.inOut(seg(t, b0, b1)); if (e0 != null) u *= 1 - ease.inOut(seg(t, e0, e1)); drawU(Dr, u); return u; }

  // ---------------------------------------------------------------- the world (world units = px at camera scale 1)
  const CX = P(700, 540);                                  // the iceberg's axis
  const LAYER = P(600, 700), Y = (i) => P(640, 800) + (i - 1) * LAYER, YBOT = Y(8) + P(760, 820);
  const CW = P(620, 760), CH = P(400, 470);                // the app card: the tip, resting on the waterline (y = 0)
  // half-width of the ice at depth y (smooth through control points), slightly asymmetric
  const CTRL = TALL
    ? [[0, 400], [300, 470], [Y(1), 620], [Y(2), 900], [Y(4), 1500], [Y(6), 2000], [Y(8), 2350], [YBOT - 260, 2250], [YBOT, 0]]
    : [[0, 330], [300, 420], [Y(1), 700], [Y(2), 1000], [Y(4), 1600], [Y(6), 2100], [Y(8), 2400], [YBOT - 260, 2300], [YBOT, 0]];
  function hw(y) {
    for (let i = 0; i < CTRL.length - 1; i++) {
      const [y0, w0] = CTRL[i], [y1, w1] = CTRL[i + 1];
      if (y <= y1) { const u = clamp((y - y0) / (y1 - y0)); return lerp(w0, w1, (1 - Math.cos(Math.PI * u)) / 2); }
    }
    return 0;
  }
  const hwL = (y) => hw(y) * (1 - 0.045 * Math.sin(y / 530 + 1)), hwR = (y) => hw(y) * (1 + 0.055 * Math.sin(y / 700));
  // the ice as seeded facets: rows of jittered points, triangulated strip by strip, each facet its own warm stone grey
  const FACETS = (() => {
    const r = mulberry32(4242), ROW = 130, NC = 21, rows = [];
    for (let k = 0; ; k++) {
      const yy = Math.min(k * ROW, YBOT), row = [];
      for (let j = 0; j < NC; j++) {
        const u = j / (NC - 1), x = CX + lerp(-hwL(yy), hwR(yy), u);
        const inner = j > 0 && j < NC - 1, jy = k > 0 && yy < YBOT ? (r() - 0.5) * 50 : 0;
        row.push([x + (inner ? (r() - 0.5) * 70 : 0), yy + jy]);
      }
      rows.push(row);
      if (yy >= YBOT) break;
    }
    const tris = [];
    for (let k = 0; k < rows.length - 1; k++) for (let j = 0; j < NC - 1; j++) {
      const a = rows[k][j], b = rows[k][j + 1], c = rows[k + 1][j], d = rows[k + 1][j + 1];
      const pair = (k + j) % 2 ? [[a, b, d], [a, d, c]] : [[a, b, c], [b, d, c]];
      pair.forEach((tri) => {
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, depth = clamp(cy / YBOT);
        const light = 25 - 8 * depth + (r() - 0.5) * 5 + (cy < 260 ? 6 * (1 - cy / 260) : 0);
        tris.push({ p: tri, c: `hsl(24, 7%, ${light.toFixed(1)}%)` });
      });
    }
    return tris;
  })();
  const RAYS = [[-0.35, 0.10, 220], [-0.12, -0.05, 160], [0.08, 0.07, 260], [0.3, -0.08, 190], [0.55, 0.04, 230]];
  const PART = (() => { const r = mulberry32(77); return Array.from({ length: 170 }, () => ({ x: r(), y: r(), z: 0.55 + r() * 0.9, sz: 1 + r() * 2.2, a: 0.08 + r() * 0.2, ph: r() * 6.28 })); })();
  const BUB = (() => { const r = mulberry32(91); return Array.from({ length: 46 }, () => ({ x: r(), d: r(), sz: 3 + r() * 9, sp: 0.6 + r() * 0.8, wob: r() * 6.28 })); })();
  const sway = noise1(11);

  // ---------------------------------------------------------------- beats (from the voice)
  const B = {
    flood0: Wd('a2', 'part') - 0.3, flood1: Wd('a2', 'water') + 1.2,
    dive: V0('b1') - 1.0,
    layer: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'].map((id) => V0(id)),
    pull: V0('c1') - 0.4,
    bracket0: V0('d1') - 0.2, bracket1: V0('d1') + 0.45,
    rise: Wd('d1', 'ice') - 0.2,
    press: Wd('d1', 'ice') + 1.15,    // pressed as the camera arrives; "live" holds ~1.6 s on a push-in, then the camera rises on
    sky: V0('e1') + 0.6,
  };
  // the camera: world point at the centre of the frame, and scale
  const CAM_CARD = { x: P(880, 540), y: -CH * P(0.5, 0.45), s: P(1.4, 1.3) };
  const CAM_REVEAL = { x: W / 2, y: P(70, 60), s: P(0.9, 0.86) };
  const camLayer = (i) => ({ x: W / 2, y: Y(i) + P(0, 30), s: 1 });
  const ALLH = YBOT + CH, OVS = P((H * 0.86) / ALLH, 1150 / ALLH);
  const CAM_ALL = { x: CX - (P(1300, 540) - W / 2) / OVS, y: (YBOT - CH) / 2 - (P(560, 1180) - H / 2) / OVS, s: OVS };
  const CAM_PRESS = { x: 0, y: 0, s: P(1.9, 1.75) };      // set once the button's world position is known (below)
  const CAM_END = { x: P(900, 540), y: -CH - P(760, 1150), s: 1 };
  function camera(t) {
    const keys = [[0, CAM_CARD], [B.flood0 - 0.6, CAM_REVEAL, { response: 1.4, damping: 1 }], [B.dive, camLayer(1), { response: 1.3, damping: 1 }],
      ...B.layer.slice(1).map((b, i) => [b - 0.9, camLayer(i + 2), { response: 1.05, damping: 1 }]),
      [B.pull, CAM_ALL, { response: 1.5, damping: 1 }],
      ...(TALL ? [[B.rise, CAM_CARD, { response: 0.9, damping: 1 }], [B.press - 0.3, CAM_PRESS, { response: 0.8, damping: 1 }]] : [[B.rise, CAM_PRESS, { response: 0.25, damping: 1 }]]),
      [B.sky, CAM_END, { response: 1.2, damping: 1 }]];
    const c = trkObj(t, keys);
    if (!TALL && beatAt(t) >= B.rise && beatAt(t) < B.press) {
      // view height goes geometrically from the pull-back to the press; both views contain the waterline, and the centre moves
      // by the same fraction as the view height, so every in-between view contains it too (no frame loses the surface)
      const u = ease.inOut(seg(t, B.rise, B.press)), h0 = H / CAM_ALL.s, h1 = H / CAM_PRESS.s, h = h0 * Math.pow(h1 / h0, u), k = (h0 - h) / (h0 - h1);
      c.x = lerp(CAM_ALL.x, CAM_PRESS.x, k); c.y = lerp(CAM_ALL.y, CAM_PRESS.y, k); c.s = H / h;
    }
    // never quite still: a slow swell underwater, a slow push everywhere
    const b = beatAt(t), under = clamp((c.y - 40) / 300);
    if (b > B.pull + 0.6 && b < B.rise) c.s *= 1 + 0.12 * ease.inOut(seg(t, B.pull + 0.6, B.rise));
    if (b > B.sky) c.s *= 1 + 0.06 * seg(t, B.sky + 0.8, B.sky + 9);           // the end card never comes to rest
    c.y += sway(b * 0.35) * 14 * under; c.x += sway(b * 0.21 + 40) * 8 * under;
    return c;
  }

  // ---------------------------------------------------------------- the eight layers (copy is short so it reads on a phone)
  const LAYERS = [
    ['Provider detection', '189 catalogued', 'Where is this domain’s DNS hosted?'],
    ['Sign-in rails', '3 kinds of door', 'OAuth, Domain Connect, scoped API keys.'],
    ['Guided setup', '116 by hand', 'Where there’s no way in: exact records, checked automatically.'],
    ['Root domains', '4 ways to point a root', 'Each provider handles the root its own way.'],
    ['Value checks', 'every 5 s at first', 'Until every value resolves, with a 24-hour deadline.'],
    ['Certificates', 'renews ~30 days early', 'Let’s Encrypt, issued on the first visit.'],
    ['The edge', 'TLS, on demand', 'Certificates for every customer’s domain, never for a host it shouldn’t.'],
    ['Monitoring', 'live domains, hourly', 'Checking that nothing has drifted.'],
  ];

  scene({
    name: 'film', from: 0, to: 1e6,
    build(root, S) {
      root.style.background = COL.paper;
      // a CPU-backed canvas: an accelerated canvas is its own GPU layer, which forces the scaled world above it into one too, and
      // Chrome then picks that layer's raster scale from the frames before it (the overview frame depended on history)
      S.g = el('canvas', { width: W, height: H, style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px` }, root).getContext('2d', { willReadFrequently: true });
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:0 0`);
      // --- the app card (the tip)
      const cx0 = CX - CW / 2, cy0 = -CH;
      S.card = box(S.world, cx0, cy0, `width:${CW}px;height:${CH}px;background:${COL.paper};border:2px solid ${COL.s300};border-radius:${P(16, 18)}px;box-sizing:border-box;overflow:hidden`);   // no blurred shadow: Skia caches blur masks per scale, which made the overview frame depend on history
      const cs = P(1, 1.15);
      S.card.innerHTML = `
        <div style="position:absolute;left:0;top:0;right:0;height:${44 * cs}px;border-bottom:2px solid ${COL.s200};display:flex;align-items:center;gap:${8 * cs}px;padding-left:${18 * cs}px">
          ${[0, 1, 2].map(() => `<span style="width:${11 * cs}px;height:${11 * cs}px;border-radius:50%;border:2px solid ${COL.s300}"></span>`).join('')}
          <span style="margin-left:${14 * cs}px;padding:${3 * cs}px ${12 * cs}px;border:1.5px solid ${COL.s200};border-radius:6px;${MONO(13 * cs, COL.s500)}">app.yourplatform.com</span></div>
        <div style="position:absolute;left:0;top:${44 * cs}px;bottom:0;width:${150 * cs}px;border-right:2px solid ${COL.s200}">
          ${[0, 1, 2, 3].map((i) => `<div style="margin:${(i ? 18 : 26) * cs}px 0 0 ${22 * cs}px;width:${[90, 70, 84, 60][i] * cs}px;height:${5 * cs}px;border-radius:3px;background:${COL.s200}"></div>`).join('')}</div>
        <div style="position:absolute;left:${180 * cs}px;top:${70 * cs}px;${UI(15 * cs, 500, COL.s500)}">Settings / Domains</div>
        <div style="position:absolute;left:${180 * cs}px;top:${96 * cs}px;${UI(27 * cs, 600, COL.ink)}">Custom domain</div>
        <div style="position:absolute;left:${180 * cs}px;top:${148 * cs}px;width:${(CW / cs - 220) * cs}px;height:${46 * cs}px;border:2px solid ${COL.s300};border-radius:8px;box-sizing:border-box;padding:${11 * cs}px ${14 * cs}px;${MONO(17 * cs, COL.ink)}">acme.shop</div>`;
      S.btn = box(S.card, 180 * cs, 218 * cs, `width:${250 * cs}px;height:${60 * cs}px;border-radius:9px;background:${COL.ink};display:flex;align-items:center;justify-content:center;gap:10px;${UI(21 * cs, 600, COL.paper)}transform-origin:50% 50%`, 'Connect domain');
      S.btnDone = box(S.card, 180 * cs, 218 * cs, `width:${250 * cs}px;height:${60 * cs}px;border-radius:9px;background:${COL.done};display:flex;align-items:center;justify-content:center;gap:10px;${UI(21 * cs, 600, COL.paper)}`,
        `<svg width="${20 * cs}" height="${20 * cs}" viewBox="0 0 20 20" style="position:static"><path d="M4 10.5l4 4 8-9" fill="none" stroke="${COL.paper}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>acme.shop is live`, { o: 0 });
      S.cardLo = (() => { const r = document.createElementNS(NS, 'rect'); return r; })();
      S.btnC = [CX - CW / 2 + 180 * cs + 160 * cs, -CH + 218 * cs + 38 * cs];
      CAM_PRESS.x = CX - CW / 2 + 180 * cs + 125 * cs; CAM_PRESS.y = -CH + 218 * cs + 30 * cs;
      S.cur = box(S.world, 0, 0, 'z-index:5', `<svg width="${30 * cs}" height="${39 * cs}" viewBox="0 0 24 31" style="position:static;overflow:visible"><path d="M2 2v23.5l6.2-6 4.2 9.6 4.3-1.9-4.2-9.4h8.6z" fill="${COL.paper}" stroke="${COL.ink}" stroke-width="2" stroke-linejoin="round"/></svg>`, { o: 0 });

      // --- the layers: number, name, figure, one line; and a glyph drawn on the ice
      S.svg = svgIn(S.world);
      const WORLD = S.world, SVG = S.svg;
      { const r = S.cardLo; r.setAttribute('x', CX - CW / 2); r.setAttribute('y', -CH); r.setAttribute('width', CW); r.setAttribute('height', CH); r.setAttribute('fill', COL.paper); r.setAttribute('stroke', COL.s300); r.setAttribute('stroke-width', 6); SVG.appendChild(r); reg(r, { o: 0 });
        const cs2 = P(1, 1.15), bb = document.createElementNS(NS, 'rect'); bb.setAttribute('x', CX - CW / 2 + 180 * cs2); bb.setAttribute('y', -CH + 218 * cs2); bb.setAttribute('width', 250 * cs2); bb.setAttribute('height', 60 * cs2); bb.setAttribute('fill', COL.ink); SVG.appendChild(bb); S.cardBtn = reg(bb, { o: 0 }); }
      S.lay = LAYERS.map(() => ({ d: box(WORLD, 0, 0, ''), g: (() => { const gg = document.createElementNS(NS, 'g'); SVG.appendChild(gg); return reg(gg); })() }));
      const into = (i) => { S.world = S.lay[i].d; S.svg = S.lay[i].g; };
      S.L = LAYERS.map(([name, stat, line], i) => {
        into(i);
        const y = Y(i + 1), tx = P(1250, 100), ty = P(y - 210, y - 530);
        const L = {
          num: label(S.world, tx, ty, TALL ? `${String(i + 1).padStart(2, '0')} / 08` : '', MONO(28, COL.s400, 500)),
          name: para(S.world, [name], { x: tx - 4, y: ty + P(30, 46), size: P(92, 84), color: COL.paper }),
          stat: label(S.world, tx, ty + P(150, 150), stat, MONO(P(44, 40), COL.paper)),
          line: box(S.world, tx, ty + P(222, 210), `width:${P(640, 860)}px;${UI(P(40, 36), 400, COL.s300)}line-height:1.28`, ''),
        };
        L.line._full = line; L.y = y;
        return L;
      });
      const gx = CX, gy = (i) => Y(i) + P(0, 300);
      const G = [];
      // 01 · 189 dots, sweep in; 73 fill (automatic), 116 stay open (guided)
      into(0); {
        const cols = P(21, 21), sp2 = P(19, 22), x0 = gx - ((cols - 1) * sp2) / 2, y0 = gy(1) - 4 * sp2;
        const order = (() => { const r = mulberry32(189), a = Array.from({ length: 189 }, (_, i) => i); for (let i = 188; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return new Set(a.slice(0, 73)); })();
        S.dots = Array.from({ length: 189 }, (_, i) => {
          const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x0 + (i % cols) * sp2); c.setAttribute('cy', y0 + Math.floor(i / cols) * sp2);
          c.setAttribute('r', P(5.2, 6)); c.setAttribute('fill', 'none'); c.setAttribute('stroke', COL.paper); c.setAttribute('stroke-width', 1.8); S.svg.appendChild(c);
          return { e: reg(c, { o: 0 }), auto: order.has(i), col: i % cols, row: Math.floor(i / cols) };
        });
        S.scan = pth(S.svg, dL(x0 - 30, y0 - 26, x0 - 30, y0 + 8 * sp2 + 26), 2.4, COL.paper); reg(S.scan, { o: 0 }); S.scanX = [x0 - 30, x0 + (cols - 1) * sp2 + 30];
        S.key1 = [label(S.world, x0, y0 + 9 * sp2 + 8, '● 73 automatic', MONO(P(30, 28), COL.s300)), label(S.world, x0 + P(270, 290), y0 + 9 * sp2 + 8, '○ 116 guided', MONO(P(30, 28), COL.s300))];
      }
      // 02 · three doors, three counts
      into(1); {
        const y = gy(2), dw = P(116, 130), dh = P(180, 190), gap = P(200, 220);
        S.doors = [['6', 'OAuth'], ['1', 'Domain Connect'], ['66', 'API key']].map(([n, nm], i) => {
          const x = gx + (i - 1) * gap - dw / 2, yy = y - dh / 2 + 20;
          const parts = [pth(S.svg, dRR(x, yy, dw, dh, 10), 3), pth(S.svg, dC(x + dw - 24, yy + dh / 2, 6), 2.6)];
          if (i === 0) parts.push(pth(S.svg, `M${x + 30},${yy + 70} h40 m-14,-14 l14,14 l-14,14 M${x + 70},${yy + 50} v40`, 2.6));          // sign-in arrow into a door
          if (i === 1) parts.push(pth(S.svg, dC(x + dw / 2 - 8, yy + 70, 20), 2.6), pth(S.svg, `M${x + dw / 2 - 16},${yy + 70} l6,6 l12,-13`, 2.6));   // a signed seal
          if (i === 2) parts.push(pth(S.svg, dC(x + 36, yy + 70, 13), 2.6), pth(S.svg, `M${x + 49},${yy + 70} h34 m-10,0 v10 m-10,-10 v8`, 2.6));     // a key
          const lit = document.createElementNS(NS, 'rect'); [['x', x], ['y', yy], ['width', dw], ['height', dh], ['rx', 10], ['fill', COL.paper]].forEach(([k, v]) => lit.setAttribute(k, v)); S.svg.appendChild(lit); reg(lit, { o: 0 });
          return { lit, N: +n, D: D(parts), n: para(S.world, [n], { x: x + 6, y: yy - P(84, 92), size: P(64, 70), color: COL.paper }), nm: label(S.world, x + dw / 2 - 100, yy + dh + 14, nm, MONO(P(26, 24), COL.s300) + 'width:200px;text-align:center;white-space:normal;line-height:1.15') };
        });
      }
      // 03 · a record card whose rows tick themselves
      into(2); {
        const w = P(470, 700), h = P(176, 200), x = gx - w / 2, y = gy(3) - h / 2;
        S.rec = { D: D(pth(S.svg, dRR(x, y, w, h, 12), 3), pth(S.svg, dL(x, y + 52, x + w, y + 52), 2)),
          head: label(S.world, x + 22, y + 15, 'Add these records at your provider', UI(P(18, 22), 600, COL.s300)),
          rows: [['CNAME', '@'], ['CNAME', 'www']].map(([a, b2], i) => ({ txt: label(S.world, x + 22, y + 74 + i * 48, `${a.padEnd(6)}${b2.padEnd(5)}edge.customdomain.ai`, MONO(P(19, 23), COL.paper) + 'white-space:pre;'),
            ck: D(pth(S.svg, `M${x + w - 54},${y + 86 + i * 48} l8,8 l16,-17`, 3.2)) })) };
      }
      // 04 · "@" and its four forms
      into(3); {
        const y = gy(4), ax = gx - P(170, 240);
        S.at = para(S.world, ['@'], { x: ax - P(70, 80), y: y - P(110, 120), size: P(200, 220), color: COL.paper });
        S.atB = ['flattened CNAME', 'ALIAS', 'ANAME', 'A records'].map((s2, i) => {
          const ly = y - P(96, 114) + i * P(64, 76), lx = gx + P(40, 60);
          return { D: D(pth(S.svg, `M${ax + P(60, 70)},${y} C${ax + 140},${y} ${lx - 90},${ly + 18} ${lx - 14},${ly + 18}`, 2.4)), t: label(S.world, lx, ly, s2, MONO(P(34, 30), COL.paper)) };
        });
      }
      // 05 · checks: dense at first, then backing off, to a 24 h deadline (log time axis)
      into(4); {
        const y = gy(5), w = P(560, 740), x0 = gx - w / 2;
        const groups = [[16, 7, '5 s'], [9, 15, '30 s'], [6, 26, '2 min'], [4, 42, '15 min']];
        const span = groups.reduce((a, [n, gap]) => a + n * gap + P(18, 26), 0), kk = (w * 0.84) / span;   // fit the groups before the 24 h flag
        const ticks = []; let x = x0; const labs = [];
        groups.forEach(([n, gap, lab]) => { const gx0 = x; for (let k = 0; k < n; k++) { ticks.push(x); x += gap * kk; } labs.push([gx0, lab]); x += P(18, 26) * kk; });
        const xEnd = x0 + w;
        S.chk = { axis: D(pth(S.svg, dL(x0, y + 30, xEnd, y + 30), 2.4)), ticks: ticks.map((xx) => { const e = pth(S.svg, dL(xx, y + 30, xx, y - 6), 2); reg(e, { o: 0 }); return { e, u: (xx - x0) / w }; }),
          flag: D(pth(S.svg, `M${xEnd},${y + 30} V${y - 74} h44 l-11,15 l11,15 h-44`, 2.8)),
          labs: [...labs, [xEnd - P(30, 34), '24 h']].map(([lx, tx]) => label(S.world, lx, y + 46, tx, MONO(P(28, 28), COL.s300))) };
      }
      // 06 · a certificate and its life: issued, renews ~30 days early, expiry
      into(5); {
        const y = gy(6), cw = P(150, 170), ch = P(110, 124), x = gx - P(260, 360);
        S.cert = { D: D(pth(S.svg, dRR(x, y - ch / 2, cw, ch, 10), 3), pth(S.svg, dL(x + 22, y - 18, x + cw - 50, y - 18), 2), pth(S.svg, dL(x + 22, y + 4, x + cw - 64, y + 4), 2),
          pth(S.svg, dC(x + cw - 34, y + 26, 16), 2.6), pth(S.svg, `M${x + cw - 44},${y + 40} l-6,26 l10,-6 l6,10 l4,-26`, 2.4)) };
        const bx0 = x + cw + 50, bx1 = gx + P(420, 360), rx = lerp(bx0, bx1, 0.62);
        S.life = { D: D(pth(S.svg, dL(bx0, y, bx1, y), 3), pth(S.svg, dC(bx0, y, 7), 3), pth(S.svg, dC(bx1, y, 7), 3), pth(S.svg, `M${rx},${y - 46} V${y + 14}`, 2.2), pth(S.svg, `M${rx},${y - 30} H${bx1}`, 1.8)),
          dot: (() => { const d = dot(S.svg, rx, y, 9); d.style.transformOrigin = `${rx}px ${y}px`; d.style.transformBox = 'view-box'; return d; })(),
          t: [label(S.world, bx0 - 30, y + 22, 'issued', MONO(P(28, 26), COL.s300)), label(S.world, rx - 40, y + 22, 'renews', MONO(P(28, 26), COL.paper)), label(S.world, bx1 - 44, y + 22, 'expiry', MONO(P(28, 26), COL.s300)),
            label(S.world, rx + 14, y - 72, '~30 days', MONO(P(28, 26), COL.s300))] };
      }
      // 07 · the edge: domains flow in to the origin; an unknown host is turned away
      into(6); {
        const y = gy(7), px = gx - P(250, 340), ex = gx + P(20, 40), ox = gx + P(170, 250);
        const names = ['acme.shop', 'maya.blog', 'oldidea.io'];
        S.edge = { pills: names.map((nm, i) => { const yy = y - 70 + i * 50; return { D: D(pth(S.svg, dRR(px, yy - 17, P(150, 180), 34, 17), 2.4), pth(S.svg, `M${px + P(160, 190)},${yy} C${px + 220},${yy} ${ex - 60},${y} ${ex - 40},${y}`, 2)), t: label(S.world, px + 16, yy - 11, nm, MONO(P(17, 20), COL.paper)) }; }),
          box: D(pth(S.svg, `M${ex - 36},${y - 60} L${ex + 36},${y - 60} L${ex + 50},${y} L${ex + 36},${y + 60} L${ex - 36},${y + 60} L${ex - 50},${y} Z`, 3), pth(S.svg, dRR(ex - 13, y - 2, 26, 22, 4), 2.4), pth(S.svg, `M${ex - 8},${y - 2} v-7 a8,8 0 0 1 16,0 v7`, 2.4)),
          out: D(pth(S.svg, dL(ex + 52, y, ox - 6, y), 2.4), pth(S.svg, dRR(ox, y - 34, P(110, 130), 68, 10), 2.8)), ot: label(S.world, ox + 16, y - 12, 'your app', MONO(P(18, 21), COL.paper)),
          bad: { D: D(pth(S.svg, dRR(px, y + 88, P(150, 180), 34, 17), 2, COL.s500), pth(S.svg, `M${px + P(160, 190)},${y + 105} H${ex - 80}`, 2, COL.s500), pth(S.svg, `M${ex - 74},${y + 95} l20,20 m0,-20 l-20,20`, 3)),
            t: label(S.world, px + 16, y + 94, 'unknown.host', MONO(P(17, 20), COL.s400)) }, ex, y };
        S.flow = [0, 1, 2].map(() => dot(S.svg, 0, 0, 5));
      }
      // 08 · an hourly ring: 24 ticks, a hand, a dot on every hour it passes
      into(7); {
        const y = gy(8), r = P(110, 130);
        S.ring = { D: D(pth(S.svg, dC(gx, y, r), 2.6)), ticks: Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2 - Math.PI / 2; return dot(S.svg, gx + Math.cos(a) * r, y + Math.sin(a) * r, 6); }),
          hand: (() => { const h = pth(S.svg, dL(gx, y, gx, y - r + 16), 4); reg(h, { o: 0 }); return h; })(), cx: gx,
          t: label(S.world, gx - 26, y + 18, '1 h', MONO(P(32, 30), COL.s300)), r, y };
      }
      S.world = WORLD; S.svg = SVG;
      // --- the bracket around everything under the water, labelled
      {
        const mw = Math.max(...CTRL.map(([, w]) => w)) * 1.06, x0 = CX - mw - 160, x1 = CX + mw + 160, y0 = 40, y1 = YBOT + 120;
        S.brk = D(pth(S.svg, dRR(x0, y0, x1 - x0, y1 - y0, 120), P(20, 20)));
        S.brkT = para(root, ['CustomDomain™'], { x: 0, y: 0, size: P(64, 56), color: COL.paper }); S.brkA = [x0, y0];
        S.brkT.els.forEach((e) => reg(e));
      }
      // --- the end, above the card, in the sky (the camera keeps rising into it)
      {
        const ey = -CH - P(760, 1150) - H / 2, ex = (P(900, 540) - W / 2);
        S.endH = para(S.world, TALL ? ['You ship the button.', '*We run everything*', '*under it.*'] : ['You ship the button.', '*We run everything under it.*'], { x: ex + P(220, 84), y: ey + P(170, 420), size: P(136, 100), color: COL.ink });
        const ts = P(130, 140), tx = ex + P(210, 76), ty = ey + P(600, 920);
        S.tree = box(S.world, tx, ty, `width:${ts}px;height:${ts}px;transform-origin:50% 100%`, `<svg viewBox="0 0 512 512" width="100%" height="100%" style="position:static;overflow:visible"><g fill="${COL.ink}"><rect x="238" y="250" width="36" height="150" rx="18"/><g fill="none" stroke="${COL.ink}" stroke-width="26" stroke-linecap="round"><path d="M256 330 L196 372 M256 330 L316 372"/></g>${[[256, 176, 86], [176, 220, 62], [336, 220, 62], [212, 140, 54], [300, 140, 54], [256, 244, 58]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></svg>`, { o: 0 });
        S.word = para(S.world, ['CustomDomain™'], { x: tx + ts + 10, y: ty + P(14, 20), size: P(96, 104), color: COL.ink });
        S.url = label(S.world, ex + P(220, 84), ty + P(210, 230), 'customdomain.ai', MONO(P(104, 72), COL.ink));
        S.endY = ey;
      }
      // --- screen-space: captions, the depth rail
      S.cap = {
        a1: para(root, TALL ? ['The button that connects', '*your customer’s domain.*'] : ['The button', 'that connects', '*your customer’s*', '*domain.*'], { x: P(1150, 84), y: P(300, 290), size: P(80, 72), color: COL.ink }),
        a2: para(root, TALL ? ['That’s the part', '*above the water.*'] : ['That’s the part', '*above the water.*'], { x: P(1150, 84), y: P(150, 290), size: P(84, 80), color: COL.ink }),
        c1: para(root, TALL ? ['You could build all of it.', '*Then run it, for as long*', '*as you have customers.*'] : ['You could build', 'all of it. *Then run it,*', '*for as long as you*', '*have customers.*'], { x: P(120, 84), y: P(300, 280), size: P(84, 64), color: P(COL.paper, COL.ink) }),   // 9:16: over the sky
        d1: para(root, ['Or embed one widget.', '*Leave the ice to us.*'], { x: P(120, 84), y: P(300, 280), size: P(84, 76), color: P(COL.paper, COL.ink) }),
      };
      S.rail = box(root, P(52, 34), P(250, 420), `width:${P(160, 140)}px;height:${P(580, 1000)}px`, `<div style="position:absolute;left:6px;top:0;bottom:0;width:2px;background:rgba(250,250,249,.25)"></div>${Array.from({ length: 8 }, (_, i) => `<div style="position:absolute;left:0;top:${(i / 7) * P(580, 1000) - 1}px;width:14px;height:2px;background:rgba(250,250,249,.45)"></div>`).join('')}`, { o: 0 });
      S.railDot = box(S.rail, 0, 0, `width:14px;height:14px;margin:-7px 0 0 0;border-radius:50%;background:${COL.paper}`);
      S.railT = box(S.rail, 26, 0, `margin-top:-14px;${MONO(22, COL.s300, 500)}white-space:nowrap;${TALL ? 'display:none' : ''}`, '01');   // 9:16: the layer's own number says it
    },
    run(t, b, S) {
      const cam = camera(t), s = cam.s, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s, sec = t;
      put(S.world, { x: ox, y: oy, s });
      const tiny = s < 0.2; put(S.card, { o: tiny ? 0 : 1 }); put(S.cardLo, { o: tiny ? 1 : 0 }); put(S.cardBtn, { o: tiny ? 1 : 0 });
      // ------------------------------------------------ canvas: sky, water, light, ice, particles, bubbles
      const g = S.g; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
      const wl = oy;                                               // screen y of the waterline
      const flood = ease.inOut(seg(t, B.flood0, B.flood1)), pre = ease.inOut(seg(t, 0.6, 2.2));
      const inkTop = flood >= 1 ? wl : lerp(lerp(H + 60, Math.max(wl, P(H * 0.75, 1440)), pre), wl, flood);  // a band first, then up to the waterline
      if ((flood > 0 || pre > 0) && inkTop < H + 40) {
        g.save(); g.beginPath();
        g.moveTo(0, H + 10); g.lineTo(0, wl);
        for (let x = 0; x <= W + 16; x += 16) g.lineTo(x, wl + Math.sin(x / (90 * s + 30) + sec * 1.4) * 3.2 * Math.min(1, s));
        g.lineTo(W + 16, H + 10); g.closePath(); g.clip();
        g.beginPath(); g.rect(0, inkTop - 50, W, Math.max(0, H + 200 - (inkTop - 50))); g.clip();   // from the ink's edge to below the frame, however deep
        const gr = g.createLinearGradient(0, wl, 0, wl + YBOT * s);
        gr.addColorStop(0, '#292524'); gr.addColorStop(0.06, COL.ink); gr.addColorStop(1, COL.deep);
        g.fillStyle = gr; g.fillRect(0, Math.max(0, wl - 10), W, H + 20);
        g.setTransform(s, 0, 0, s, ox, oy);
        // light shafts from the surface, gone by the second layer
        RAYS.forEach(([u, lean, w], i) => {
          const x = CX + u * P(1400, 900) + Math.sin(sec * 0.3 + i) * 30, len = 1500;
          const lg = g.createLinearGradient(0, 0, 0, len); lg.addColorStop(0, 'rgba(250,250,249,0.10)'); lg.addColorStop(1, 'rgba(250,250,249,0)');
          g.fillStyle = lg; g.beginPath(); g.moveTo(x - w / 2, 0); g.lineTo(x + w / 2, 0); g.lineTo(x + w / 2 + lean * len + w * 0.6, len); g.lineTo(x - w / 2 + lean * len - w * 0.2, len); g.closePath(); g.fill();
        });
        // the ice
        g.lineWidth = 1 / s; g.strokeStyle = 'rgba(250,250,249,0.05)';
        const yTop = cam.y - H / 2 / s - 200, yBot = cam.y + H / 2 / s + 200;
        for (const f of FACETS) {
          const [a, b2, c] = f.p; if (Math.max(a[1], b2[1], c[1]) < yTop || Math.min(a[1], b2[1], c[1]) > yBot) continue;
          g.fillStyle = f.c; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b2[0], b2[1]); g.lineTo(c[0], c[1]); g.closePath(); g.fill(); g.stroke();
        }
        // a faint rim
        g.strokeStyle = 'rgba(250,250,249,0.16)'; g.lineWidth = 2 / s; g.beginPath();
        for (let y = 0; y <= YBOT; y += 40) g.lineTo(CX - hwL(y), y); for (let y = YBOT; y >= 0; y -= 40) g.lineTo(CX + hwR(y), y); g.stroke();
        g.setTransform(1, 0, 0, 1, 0, 0);
        // marine snow: screen-space, with parallax against the camera; streams down past a rising camera
        PART.forEach((p) => {
          const span = H + 60, yy = ((p.y * span * 3 - cam.y * s * p.z * 0.9 - sec * 9 * p.z) % span + span) % span - 30;
          const xx = p.x * W + Math.sin(sec * 0.4 + p.ph) * 8;
          if (yy < wl + 6) return;
          g.fillStyle = `rgba(250,250,249,${p.a})`; g.beginPath(); g.arc(xx, yy, p.sz * Math.min(1.2, 0.6 + s * 0.5), 0, Math.PI * 2); g.fill();
        });
        // bubbles on the way up
        const bu = seg(t, B.rise - 0.2, B.rise + 2.6);
        if (bu > 0 && bu < 1) BUB.forEach((q) => {
          const yy = H + 60 - ((bu * 2.2 + q.d) % 1.2) * (H + 160) * q.sp * 1.4, xx = q.x * W + Math.sin(sec * 3 + q.wob) * 10;
          if (yy < wl + 4) return;
          g.strokeStyle = 'rgba(250,250,249,0.45)'; g.lineWidth = 1.6; g.beginPath(); g.arc(xx, yy, q.sz, 0, Math.PI * 2); g.stroke();
        });
        g.restore();
        if (flood < 1) {                                            // a soft leading edge on the rising ink
          const fe = g.createLinearGradient(0, inkTop - 50, 0, inkTop + 30); fe.addColorStop(0, 'rgba(250,250,249,1)'); fe.addColorStop(1, 'rgba(250,250,249,0)');
          g.fillStyle = fe; g.fillRect(0, Math.max(wl, inkTop - 50), W, 80);
        }
      }
      // the waterline itself (a thin stone line before the ink arrives)
      if (wl > -20 && wl < H + 20) {
        g.strokeStyle = flood > 0.05 ? 'rgba(68,64,60,0.0)' : COL.s300; g.lineWidth = 2; g.beginPath();
        for (let x = 0; x <= W; x += 16) g.lineTo(x, wl + Math.sin(x / (90 * s + 30) + sec * 1.4) * 3.2 * Math.min(1, s));
        g.stroke();
      }
      // ------------------------------------------------ the card, the cursor, the press
      const bc = S.btnC, a1b = Wd('a1', 'button');
      const cur = { x: trk(t, [[0, bc[0] + P(260, 220)], [a1b - 1.2, bc[0] + 30, 'heavy'], [B.press - 1.6, bc[0] + 160], [B.press - 0.8, bc[0] + 20, 'heavy']]),
        y: trk(t, [[0, bc[1] + P(200, 260)], [a1b - 1.2, bc[1] + 8, 'heavy'], [B.press - 1.6, bc[1] + 120], [B.press - 0.8, bc[1] + 6, 'heavy']]) };
      const pr = (() => { const d = b - B.press + 0.2; return d >= 0 && d < 0.28 ? Math.sin(Math.PI * d / 0.28) : 0; })();   // back to rest before the swap
      const curOn = (b > 0.4 && b < B.flood0 + 0.6) || (b > B.press - 1.6 && b < B.press + 0.8);
      put(S.cur, { o: curOn ? 1 : 0, x: cur.x, y: cur.y, s: 1 - 0.14 * pr });
      put(S.btn, { s: 1 - 0.05 * pr, o: b >= B.press + 0.08 ? 0 : 1 });   // no black edge behind the green
      const lv = grow(t, B.press + 0.08, 'snappy', 0.97); put(S.btnDone, { o: b >= B.press + 0.08 ? 1 : 0, s: lv.s });   // on the frame the black one goes
      // ------------------------------------------------ captions
      riseP(t, S.cap.a1, TALL ? [-0.6, -0.3] : [-0.6, -0.5, -0.4, -0.3], V0('a2') - 0.5);
      riseP(t, S.cap.a2, [Wd('a2', 'part') - 0.3, Wd('a2', 'above') - 0.1], B.dive + 0.2, { stagger: 0 });
      riseP(t, S.cap.c1, TALL ? [V0('c1') + 0.9, Wd('c1', 'then') - 0.2, Wd('c1', 'long') - 0.2] : [V0('c1') + 0.4, Wd('c1', 'all') - 0.2, Wd('c1', 'for') - 0.2, Wd('c1', 'have') - 0.2], V0('d1') - 0.5, { stagger: 0 });
      riseP(t, S.cap.d1, [V0('d1') + 0.05, V0('d1') + 0.3], null, { stagger: 0 }); lift(t, S.cap.d1, B.rise - 0.4);
      // ------------------------------------------------ the layers
      S.L.forEach((L, i) => {
        const b0 = B.layer[i];
        write(t, L.num, b0 - 0.3, 0.4);
        riseP(t, L.name, [b0 - 0.1], null, { st: 0.06 });
        write(t, L.stat, b0 + 0.5, 0.7);
        write(t, L.line, b0 + 1.2, 1.4);
      });
      S.lay.forEach((Ly, i) => {
        const nx = i < 7 ? B.layer[i + 1] : B.pull;
        const dim = i < 7 ? ease.inOut(seg(t, nx + 0.1, nx + 0.7)) * (1 - ease.inOut(seg(t, B.pull + 0.2, B.pull + 1.2))) : 0;
        let oD, oG;
        if (TALL) {
          const gone = i < 7 ? ease.inOut(seg(t, nx - 0.55, nx - 0.15)) : 0, back = ease.inOut(seg(t, B.pull + 0.2, B.pull + 1.2));
          oD = b >= B.pull ? 0 : 1 - gone; oG = Math.max(1 - gone, 0.9 * back);
        } else { oD = oG = 1 - 0.74 * dim; }
        if (b >= B.rise - 0.3) oD = oG = 0;
        put(Ly.d, { o: oD }); put(Ly.g, { o: oG });
      });
      // 01 census
      {
        const b0 = B.layer[0], cls = Wd('b1', 'managed');
        S.dots.forEach((d) => {
          const on = b >= b0 + 0.2 + (d.col + d.row * 0.5) * 0.045, filled = b >= cls + d.col * 0.06;
          put(d.e, { o: on ? 1 : 0, css: { fill: filled && d.auto ? COL.paper : 'none' } });
        });
        const sx = lerp(S.scanX[0], S.scanX[1], seg(t, cls, cls + 21 * 0.06)); put(S.scan, { o: b >= cls && b < cls + 21 * 0.06 + 0.1 ? 1 : 0, css: { transform: `translateX(${(sx - S.scanX[0]).toFixed(1)}px)` } });
        S.key1.forEach((e, i) => write(t, e, cls + 1.3 + i * 0.5, 0.6));
      }
      // 02 doors
      // each count runs up from 0 as its door is drawn; then "a different door" lights them one by one
      S.doors.forEach((d, i) => {
        const b0 = Wd('b2', ['oauth', 'domain', 'scoped'][i]) - 0.3; draw(t, d.D, b0 - 0.4, b0 + 0.5); riseP(t, d.n, [b0 + 0.1], null, { st: 0 }); write(t, d.nm, b0 + 0.2, 0.6);
        put(d.n.words[0], { text: String(Math.round(d.N * ease.out(seg(t, b0 + 0.1, b0 + 0.1 + [0.8, 0.3, 2.6][i])))) });
        put(d.lit, { o: 0.14 * ease.out(seg(t, Wd('b2', 'different') - 0.25 + i * 0.32, Wd('b2', 'different') - 0.1 + i * 0.32)) });
      });
      // 03 record card, rows tick by themselves
      {
        const b0 = B.layer[2]; draw(t, S.rec.D, b0 - 0.2, b0 + 0.8); write(t, S.rec.head, b0 + 0.4, 0.9);
        S.rec.rows.forEach((r, i) => { write(t, r.txt, b0 + 1.0 + i * 0.5, 0.8); const c = Wd('b3', 'checks') + i * 0.6; draw(t, r.ck, c, c + 0.25); });
      }
      // 04 @
      { const b0 = B.layer[3]; riseP(t, S.at, [b0 - 0.1], null, { st: 0 }); S.atB.forEach((x, i) => { draw(t, x.D, b0 + 0.6 + i * 0.35, b0 + 1.1 + i * 0.35); write(t, x.t, b0 + 0.9 + i * 0.35, 0.5); }); }
      // 05 checks
      {
        const b0 = B.layer[4], c = S.chk; draw(t, c.axis, b0 - 0.2, b0 + 0.6);
        const u = seg(t, Wd('b5', 'every', 1) - 0.2, Wd('b5', 'deadline') - 0.2);
        c.ticks.forEach((k) => put(k.e, { o: k.u <= u ? 1 : 0 }));
        c.labs.forEach((e, i) => write(t, e, b0 + 0.6 + i * 0.5, 0.4)); draw(t, c.flag, Wd('b5', 'deadline') - 0.2, Wd('b5', 'deadline') + 0.4);
      }
      // 06 certificate
      {
        const b0 = B.layer[5], L6 = S.life; draw(t, S.cert.D, b0 - 0.2, b0 + 0.9); draw(t, L6.D, Wd('b6', 'renewed') - 0.6, Wd('b6', 'renewed') + 0.4);
        const dk = grow(t, Wd('b6', 'renewed'), 'snappy', 0.4); put(L6.dot, { o: dk.o, css: { transform: `scale(${dk.s.toFixed(4)})` } });
        L6.t.forEach((e, i) => write(t, e, Wd('b6', 'renewed') - 0.3 + i * 0.25, 0.5));
      }
      // 07 edge
      {
        const b0 = B.layer[6], E = S.edge; E.pills.forEach((p, i) => { draw(t, p.D, b0 - 0.3 + i * 0.25, b0 + 0.5 + i * 0.25); write(t, p.t, b0 + i * 0.25, 0.5); });
        draw(t, E.box, b0 + 0.3, b0 + 1.0); draw(t, E.out, b0 + 0.8, b0 + 1.3); write(t, E.ot, b0 + 1.1, 0.4);
        const nv = Wd('b7', 'never'); draw(t, E.bad.D, nv - 0.4, nv + 0.25); write(t, E.bad.t, nv - 0.3, 0.4);
        S.flow.forEach((f, i) => {   // requests travelling in
          const ph = (b - (b0 + 1.2) - i * 0.45) / 1.35, on = ph >= 0 && b < B.pull + 1;
          const u = ((ph % 1) + 1) % 1, yy = E.y - 70 + i * 50;
          const x = u < 0.5 ? lerp(E.ex - P(250, 340) + P(160, 190), E.ex - 40, u * 2) : lerp(E.ex + 52, E.ex + P(170, 250) - 6, (u - 0.5) * 2);
          f.setAttribute('cx', x.toFixed(1)); f.setAttribute('cy', (u < 0.5 ? lerp(yy, E.y, ease.inOut(u * 2)) : E.y).toFixed(1)); put(f, { o: on ? 1 : 0 });
        });
      }
      // 08 hourly ring
      {
        const b0 = B.layer[7], R8 = S.ring; draw(t, R8.D, b0 - 0.3, b0 + 0.6); write(t, R8.t, b0 + 0.3, 0.3);
        const a = clamp(seg(t, Wd('b8', 'hour') - 0.2, Wd('b8', 'drifted') + 1.2)) * 360;
        R8.hand.setAttribute('transform', `rotate(${a.toFixed(2)} ${R8.cx} ${R8.y})`); put(R8.hand, { o: b >= b0 + 0.4 ? 1 : 0 });
        R8.ticks.forEach((d, i) => put(d, { o: a >= (i / 24) * 360 && b >= b0 + 0.4 ? 1 : 0 }));
      }
      // ------------------------------------------------ the bracket, the depth rail
      draw(t, S.brk, B.bracket0, B.bracket1, B.rise - 0.35, B.rise);
      { const [bx, by] = S.brkA, sx2 = (bx - cam.x) * s + W / 2, sy2 = (by - cam.y) * s + H / 2;           // the label rides the bracket's corner, at screen size
        // inside the bracket's top corner, over the ink
        S.brkT.els.forEach((e) => put(e, { x: sx2 + P(34, 28), y: sy2 + P(30, 26) })); riseP(t, S.brkT, [B.bracket1 - 0.25], null, { st: 0 }); lift(t, S.brkT, B.rise - 0.28); }
      const under = b >= B.dive + 0.3 && b < B.pull;
      const rk = sp(t, B.dive + 0.3, 'default') - sp(t, B.pull - 0.4, 'snappy');
      put(S.rail, { o: rk > 0.02 ? 1 : 0, x: -60 * (1 - clamp(rk)) });
      const li = clamp((cam.y - Y(1)) / (Y(8) - Y(1)));
      put(S.railDot, { y: li * P(580, 1000) });
      put(S.railT, { y: li * P(580, 1000), text: String(Math.min(8, Math.max(1, Math.round(li * 7) + 1))).padStart(2, '0') + ' / 08' });
      // ------------------------------------------------ the end, in the sky
      const e1 = V0('e1');
      riseP(t, S.endH, TALL ? [Wd('e1', 'you') - 0.3, Wd('e1', 'we') - 0.1, Wd('e1', 'under') - 0.1] : [Wd('e1', 'you') - 0.3, Wd('e1', 'we') - 0.1], null, { st: 0.06 });
      const tr = grow(t, B.sky - 0.15, 'heavy', 0.6); put(S.tree, { o: tr.o, s: tr.s });   // already in the sky as the camera rises to it
      riseP(t, S.word, [B.sky - 0.1], null, { st: 0 });
      write(t, S.url, Wd('e1', 'under') + 1.2, 1.0);
      void under;
    },
  });

  C.start();
})();
