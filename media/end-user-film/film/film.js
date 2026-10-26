// CustomDomain™: the end user's path. A line-drawn explainer timed to its voiceover (≈104 s), 16:9 and 9:16.
// One ink line is the customer's journey: jagged and broken the usual way, pulled straight with CustomDomain™.
// Drawings are rough.js geometry (seeded, so every frame is identical) rendered as SVG paths that draw themselves on.
// Every cue is a voiceover mark (vo_<line>) or a word inside a line (Wd('c3', 'password')), on the 92 bpm grid.
// Pure function of time: no timers, no Math.random, nothing carried between frames.
(() => {
  const { W, H, FMT, put, reg, el, scene, canvas, sp, spHit, trk, trkObj, seg, clamp, lerp, ease, bt, beatAt, beatOf, mulberry32 } = C;
  const TALL = FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  const PAD = P(140, 84);
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '400 40px UI', '500 40px UI', '600 40px UI', '400 30px Mono', '500 30px Mono'];
  const COL = { paper: '#fafaf9', ink: '#1c1917', muted: '#78716c', soft: '#d6d3d1', hair: '#e7e5e4', long: '#44403c', done: '#16a34a' };
  const NS = 'http://www.w3.org/2000/svg';
  const HIT = 1 / 60;

  // ---------------------------------------------------------------- time helpers (voice-driven)
  const VOW = window.VOW || {};
  const V0 = (id) => beatOf('vo_' + id), V1 = (id) => beatOf('vo_' + id + '_end');
  const Wd = (id, word, n = 0) => { const ws = (VOW[id] || []).filter((w) => w[0] === word); return ws[Math.min(n, ws.length - 1)] ? ws[Math.min(n, ws.length - 1)][1] : V0(id); };
  const o4 = (k) => (k > 0.015 ? 1 : 0);
  const grow = (t, b, p = 'snappy', from = 0.86) => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), s: from + (1 - from) * k }; };
  const rise = (t, b, d = 30, p = 'default') => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), y: d * (1 - k) }; };
  const pan = (t, b0, b1) => ease.inOut(seg(t, b0, b1));
  // every held shot keeps moving: a slow push of a few percent across the shot
  const push = (t, b0, b1, amt = 0.035) => ({ s: 1 + amt * ease.inOut(seg(t, b0, b1)), css: { 'transform-origin': '50% 42%' } });

  // ---------------------------------------------------------------- DOM + type helpers
  function box(parent, x, y, css = '', html = '', base = {}) {
    const e = el('div', { class: 'abs', style: `left:${x}px;top:${y}px;${css}` }, parent, html);
    return reg(e, base);
  }
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
  // a caption: display lines that rise in on a beat and lift out on another
  const cap = (parent, lines, x, y, size = P(84, 80)) => para(parent, lines, { x, y, size });
  function eyebrow(parent, text, x, y, size = P(28, 30)) {
    return box(parent, x, y, `font-size:${size}px;color:${COL.muted}`, `<span class="eyebrow" style="display:flex;align-items:center;gap:14px;text-transform:none;letter-spacing:0.01em"><span style="display:inline-block;width:44px;height:1.5px;background:${COL.muted}"></span>${text}</span>`, { o: 0 });
  }
  const showEyebrow = (t, e, bIn, bOut = 1e9) => { const k = sp(t, bIn, 'default') - sp(t, bOut, 'snappy'); put(e, { o: clamp(k), x: -16 * (1 - clamp(k)) }); };
  // text that writes itself on, letter by letter (like the hand that draws the lines)
  function label(parent, x, y, text, css = '') { const e = box(parent, x, y, `white-space:nowrap;${css}`, ''); e._full = text; return e; }
  function write(t, e, b0, dur = null, gone = 1e9, g1 = null) {
    const d = dur ?? Math.max(0.35, e._full.length * 0.035);
    let n = Math.round(seg(t, b0, b0 + d) * e._full.length);
    if (g1 != null) n = Math.min(n, Math.round((1 - ease.inOut(seg(t, gone, g1))) * e._full.length));
    else if (beatAt(t) >= gone) n = 0;
    put(e, { text: e._full.slice(0, n) });
  }
  const UI = (px, w = 500, c = COL.ink) => `font:${w} ${px}px UI;color:${c};`;
  const MONO = (px, c = COL.ink) => `font:400 ${px}px Mono;color:${c};`;
  const HAND = (px, c = COL.ink) => `font:italic 400 ${px}px Display;color:${c};`;

  // ---------------------------------------------------------------- ink: hand-drawn shapes that draw themselves on
  const GEN = rough.generator();
  let SEED = 17;
  function svgIn(parent, w = W, h = H) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('width', w); s.setAttribute('height', h); parent.appendChild(s); return s; }
  // one rough.js shape → plain SVG paths (stroke paths draw on; solid fills appear when the outline completes)
  function ink(svg, kind, args, o = {}) {
    const d = GEN[kind](...args, { roughness: o.rough ?? 0.9, bowing: o.bow ?? 1, stroke: o.stroke || COL.ink, strokeWidth: o.sw || 3,
      disableMultiStroke: true, seed: SEED++, ...(o.fill ? { fill: o.fill, fillStyle: 'solid' } : {}) });
    return GEN.toPaths(d).map((p) => {
      const e = document.createElementNS(NS, 'path');
      e.setAttribute('d', p.d);
      const isFill = p.fill && p.fill !== 'none' && (!p.stroke || p.stroke === 'none');
      e.setAttribute('fill', isFill ? p.fill : 'none');
      e.setAttribute('stroke', isFill ? 'none' : (p.stroke || COL.ink));
      e.setAttribute('stroke-width', isFill ? 0 : p.strokeWidth);
      e.setAttribute('stroke-linecap', 'round'); e.setAttribute('stroke-linejoin', 'round');
      if (isFill) svg.insertBefore(e, svg.firstChild); else svg.appendChild(e);
      return e;
    });
  }
  const R = (svg, x, y, w, h, o) => ink(svg, 'rectangle', [x, y, w, h], o);
  const Ln = (svg, x1, y1, x2, y2, o) => ink(svg, 'line', [x1, y1, x2, y2], o);
  const Ci = (svg, x, y, d, o) => ink(svg, 'circle', [x, y, d], o);
  const El = (svg, x, y, w, h, o) => ink(svg, 'ellipse', [x, y, w, h], o);
  const Pl = (svg, pts, o) => ink(svg, 'linearPath', [pts], o);
  const Cu = (svg, pts, o) => ink(svg, 'curve', [pts], o);
  const Ar = (svg, x, y, w, h, a0, a1, o) => ink(svg, 'arc', [x, y, w, h, a0, a1, false], o);
  // a drawing: paths drawn in order along their total length
  function D(...groups) {
    const parts = groups.flat(3).filter(Boolean);
    const strokes = parts.filter((p) => p.getAttribute('stroke') !== 'none');
    const fills = parts.filter((p) => p.getAttribute('stroke') === 'none');
    const lens = strokes.map((p) => p.getTotalLength() + 1);
    strokes.forEach((p, i) => { p.setAttribute('stroke-dasharray', `${lens[i].toFixed(1)} ${lens[i].toFixed(1)}`); reg(p, { o: 0 }); });
    fills.forEach((p) => reg(p, { o: 0 }));
    return { strokes, fills, lens, total: lens.reduce((a, b) => a + b, 0) };
  }
  function drawU(Dr, u, color = null) {
    let acc = u * Dr.total;
    Dr.strokes.forEach((p, i) => {
      const f = clamp(acc / Dr.lens[i]); acc -= Dr.lens[i];
      put(p, { o: f > 0.002 ? 1 : 0, css: { strokeDashoffset: (Dr.lens[i] * (1 - f)).toFixed(1), ...(color ? { stroke: color } : {}) } });
    });
    Dr.fills.forEach((p) => put(p, { o: u >= 0.999 ? 1 : 0, ...(color ? { css: { fill: color } } : {}) }));
  }
  // draw on over [b0, b1] (beats); optionally erase back over [e0, e1]
  function draw(t, Dr, b0, b1, e0 = null, e1 = null, color = null) {
    let u = ease.inOut(seg(t, b0, b1));
    if (e0 != null) u *= 1 - ease.inOut(seg(t, e0, e1));
    drawU(Dr, u, color);
    return u;
  }
  // ---- a hand line through base points: straight runs with a small seeded wobble (keeps corners sharp; prefix-stable)
  function handPts(B, seed = 5, wob = 3) {
    const out = [B[0]];
    for (let i = 0; i < B.length - 1; i++) {
      const r = mulberry32(seed * 977 + i), [x0, y0] = B[i], [x1, y1] = B[i + 1], dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L, ny = dx / L, k = Math.max(1, Math.round(L / 90));
      for (let j = 1; j < k; j++) { const f = j / k, w = (r() - 0.5) * 2 * wob; out.push([x0 + dx * f + nx * w, y0 + dy * f + ny * w]); }
      out.push(B[i + 1]);
    }
    return out;
  }
  const dOf = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
  const lenOf = (pts) => pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  function pathEl(svg, d, sw = 4, color = COL.ink) {
    const e = document.createElementNS(NS, 'path'); e.setAttribute('d', d); e.setAttribute('fill', 'none'); e.setAttribute('stroke', color);
    e.setAttribute('stroke-width', sw); e.setAttribute('stroke-linecap', 'round'); e.setAttribute('stroke-linejoin', 'round'); svg.appendChild(e); return e;
  }
  // resample a polyline into n points evenly spaced along its length
  function resample(pts, n) {
    const L = lenOf(pts), out = []; let i = 0, acc = 0;
    for (let k = 0; k < n; k++) {
      const target = (L * k) / (n - 1);
      while (i < pts.length - 2 && acc + Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) < target) { acc += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); i++; }
      const sl = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) || 1, f = clamp((target - acc) / sl);
      out.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]);
    }
    return out;
  }

  // ---------------------------------------------------------------- small illustrations (all ink)
  function shopIcon(svg, x, y, s = 1, o = {}) {           // a storefront: roof, scalloped awning, body, door, window
    const q = (a, b) => [x + a * s, y + b * s], sw = o.sw ?? 2.6;
    return [
      Pl(svg, [q(-6, 30), q(10, 6), q(106, 6), q(122, 30)], { sw }),
      Cu(svg, [q(-6, 30), q(10, 42), q(26, 30), q(42, 42), q(58, 30), q(74, 42), q(90, 30), q(106, 42), q(122, 30)], { sw, rough: 0.5 }),
      R(svg, x + 2 * s, y + 38 * s, 112 * s, 66 * s, { sw }),
      R(svg, x + 70 * s, y + 62 * s, 26 * s, 42 * s, { sw }),
      R(svg, x + 18 * s, y + 56 * s, 32 * s, 22 * s, { sw }),
    ];
  }
  function cloudIcon(svg, x, y, s = 1, o = {}) {          // a cloud outline (Cloudflare, drawn in ink)
    const q = (a, b) => [x + a * s, y + b * s];
    return [Cu(svg, [q(0, 40), q(4, 22), q(22, 16), q(34, 2), q(56, 0), q(72, 12), q(80, 24), q(96, 22), q(106, 34), q(104, 46), q(0, 46), q(0, 40)], { sw: o.sw ?? 3, rough: 0.6 })];
  }
  function lockIcon(svg, x, y, s = 1, o = {}) {
    return [R(svg, x, y + 18 * s, 34 * s, 28 * s, { sw: o.sw ?? 3, stroke: o.stroke }), Ar(svg, x + 17 * s, y + 18 * s, 22 * s, 30 * s, Math.PI, Math.PI * 2, { sw: o.sw ?? 3, stroke: o.stroke })];
  }
  function checkMark(svg, x, y, s = 1, color = COL.done, sw = 4) { return [Pl(svg, [[x, y + 10 * s], [x + 9 * s, y + 19 * s], [x + 26 * s, y]], { sw, stroke: color, rough: 0.4 })]; }
  function personIcon(svg, x, y, s = 1) {
    return [Ci(svg, x, y, 70 * s, { sw: 3 }), Ar(svg, x, y + 108 * s, 130 * s, 110 * s, Math.PI, Math.PI * 2, { sw: 3 })];
  }
  function envelope(svg, x, y, s = 1) { return [R(svg, x, y, 90 * s, 62 * s, { sw: 3 }), Pl(svg, [[x, y], [x + 45 * s, y + 34 * s], [x + 90 * s, y]], { sw: 3 })]; }
  function arrowHead(svg, x, y, ang, s = 1, o = {}) {
    const a1 = ang + 2.6, a2 = ang - 2.6;
    return [Pl(svg, [[x + Math.cos(a1) * 18 * s, y + Math.sin(a1) * 18 * s], [x, y], [x + Math.cos(a2) * 18 * s, y + Math.sin(a2) * 18 * s]], { sw: o.sw ?? 3 })];
  }
  // the app window: browser chrome, sidebar, "Settings / Domains", the button. Returns its pieces.
  function appWindow(svg, layer, x, y, w, h, o = {}) {
    const S = {};
    S.frame = [R(svg, x, y, w, h, { sw: 3.2 }), Ln(svg, x, y + 54, x + w, y + 54, { sw: 2.6 }), Ci(svg, x + 28, y + 27, 13, { sw: 2.2 }), Ci(svg, x + 52, y + 27, 13, { sw: 2.2 }), Ci(svg, x + 76, y + 27, 13, { sw: 2.2 }),
      R(svg, x + 110, y + 14, Math.min(360, w - 160), 26, { sw: 2.2 })];
    S.url = label(layer, x + 124, y + 17, o.url || 'app.yourplatform.com', MONO(16, COL.muted));
    S.side = [Ln(svg, x + 200, y + 54, x + 200, y + h, { sw: 2.4 }), ...[0, 1, 2, 3].map((i) => Ln(svg, x + 28, y + 96 + i * 46, x + 28 + [130, 100, 120, 90][i], y + 96 + i * 46, { sw: 2.4, stroke: COL.soft }))];
    S.crumb = label(layer, x + 236, y + 84, 'Settings / Domains', UI(20, 500, COL.muted));
    S.title = label(layer, x + 236, y + 116, 'Custom domain', UI(34, 600));
    S.desc = [Ln(svg, x + 238, y + 190, x + 238 + Math.min(440, w - 300), y + 190, { sw: 2.4, stroke: COL.soft }), Ln(svg, x + 238, y + 220, x + 238 + Math.min(300, w - 340), y + 220, { sw: 2.4, stroke: COL.soft })];
    const bw = 330, bh = 78, bx = x + 236, by = y + 270;
    S.btnBox = [bx, by, bw, bh];
    S.btn = R(svg, bx, by, bw, bh, { sw: 3.2 });
    S.btnFill = box(layer, bx, by, `width:${bw}px;height:${bh}px;border-radius:6px;background:${COL.ink}`, '', { o: 0 });
    S.btnText = label(layer, bx, by + 22, 'Connect domain', UI(29, 600) + `width:${bw}px;text-align:center;`);
    return S;
  }
  function cursorEl(parent, sz = 40) {
    return box(parent, 0, 0, 'z-index:40', `<svg width="${sz}" height="${sz * 1.3}" viewBox="0 0 24 31" style="position:static;overflow:visible"><path d="M2 2v23.5l6.2-6 4.2 9.6 4.3-1.9-4.2-9.4h8.6z" fill="${COL.paper}" stroke="${COL.ink}" stroke-width="2" stroke-linejoin="round"/></svg>`, { o: 0 });
  }
  const press = (t, b) => { const d = beatAt(t) - b; return d >= 0 && d < 0.4 ? Math.sin(Math.PI * d / 0.4) : 0; };

  // ---------------------------------------------------------------- paper (faint dot grid, as on the homepage), whole film
  scene({
    name: 'paper', from: 0, to: 1e6,
    build(root, S) { root.style.background = COL.paper; S.ctx = canvas(root); },
    run(t, b, S) {
      const g = S.ctx; g.clearRect(0, 0, W, H); g.fillStyle = COL.soft; g.globalAlpha = 0.45;
      for (let y = 24; y < H; y += 36) for (let x = 24; x < W; x += 36) g.fillRect(x, y, 2, 2);
      g.globalAlpha = 1;
    },
  });

  // ================================================================ 1. the button (b0 → b1)
  const S1_END = V0('b1') - 0.5;
  scene({
    name: 'button', from: 0, to: S1_END, post: 0.8,
    build(root, S) {
      S.c1 = cap(root, TALL ? ['Every app with', 'custom domains', 'has *this button.*'] : ['Every app with custom', 'domains has *this button.*'], PAD, P(170, 280), P(84, 92));
      S.c2 = cap(root, TALL ? ['What happens', '*after the click?*'] : ['What happens', '*after the click?*'], PAD, P(170, 280), P(84, 92));
      S.svg = svgIn(root);
      const [x, y, w, h] = P([860, 300, 920, 560], [90, 680, 900, 640]);
      S.win = appWindow(S.svg, root, x, y, w, h);
      const [bx, by, bw, bh] = S.win.btnBox;
      S.bc = [bx + bw * 0.62, by + bh * 0.62];
      S.dFrame = D(S.win.frame); S.dSide = D(S.win.side, S.win.desc); S.dBtn = D(S.win.btn);
      S.ring = D(Ci(S.svg, S.bc[0], S.bc[1], 120, { sw: 2.6 }), Ci(S.svg, S.bc[0], S.bc[1], 200, { sw: 2.2 }));
      S.mark = D(El(S.svg, bx + bw / 2, by + bh / 2, bw + 70, bh + 56, { sw: 2.8, rough: 1.1 }));     // "this button": circled, like the shops
      // after the click: a question line runs off to the right / down, toward everything that comes next
      S.q = D(Cu(S.svg, P([[bx + bw + 20, by + bh / 2], [bx + bw + 120, by + bh / 2 - 60], [x + w - 40, by + 10], [x + w + 120, by + 120]], [[bx + bw / 2, by + bh + 20], [bx + bw / 2 + 60, by + bh + 120], [x + w * 0.55, y + h - 20], [x + w * 0.6, y + h + 150]]), { sw: 3 }));
      S.qm = box(root, P(x + w - 170, x + w * 0.6 + 40), P(by - 200, y + h + 10), HAND(P(150, 190)), '?', { o: 0 });   // whole, inside the frame
      S.cur = cursorEl(root, P(40, 46));
    },
    run(t, b, S) {
      put(S.root, { x: -W * pan(t, S1_END - 0.4, S1_END + 0.8), ...push(t, 0, S1_END) });
      // "this button." waits for the button: those two words rise as it draws, on the voice's word
      const st1 = at(S.c1, TALL ? [-0.4, 0.3, 1.0] : [-0.4, 0.4]), bw1 = Wd('a1', 'button');
      st1[st1.length - 2] = bw1 - 0.35; st1[st1.length - 1] = bw1 - 0.28;
      TYPE.rise(t, S.c1, st1, V0('a2') - 0.3);
      riseP(t, S.c2, [V0('a2') - 0.15, V0('a2') + 0.25]);
      draw(t, S.dFrame, -1.2, 2.2); draw(t, S.dSide, 1.4, 4.0); draw(t, S.dBtn, -0.6, 0.9);
      write(t, S.win.url, 1.0); write(t, S.win.crumb, 2.0); write(t, S.win.title, 2.6);
      write(t, S.win.btnText, 0.5, 0.8);
      draw(t, S.mark, Wd('a1', 'button') - 0.3, Wd('a1', 'button') + 0.4, Wd('a2', 'click') - 0.9, Wd('a2', 'click') - 0.4);
      // the click
      const ck = Wd('a2', 'click'), pr = press(t, ck);
      put(S.win.btnFill, { o: beatAt(t) >= ck && beatAt(t) < ck + 0.45 ? 1 : 0 });
      put(S.win.btnText, { css: { color: beatAt(t) >= ck && beatAt(t) < ck + 0.45 ? COL.paper : COL.ink } });
      const rk = seg(t, ck, ck + 1.2); drawU(S.ring, rk > 0 && rk < 1 ? ease.out(rk) : 0);
      const p = { x: trk(t, [[0, S.bc[0] + 260], [ck - 2.2, S.bc[0], 'heavy']]), y: trk(t, [[0, S.bc[1] + P(220, 300)], [ck - 2.2, S.bc[1], 'heavy']]) };
      put(S.cur, { o: beatAt(t) > ck - 3 ? 1 : 0, x: p.x, y: p.y, s: 1 - 0.14 * pr });
      draw(t, S.q, Wd('a2', 'decides'), Wd('a2', 'live'));
      const qk = grow(t, Wd('a2', 'live'), 'snappy', 0.7); put(S.qm, { o: qk.o, s: qk.s, r: -6 * qk.k });
    },
  });

  // ================================================================ 2. domains live everywhere (b1 → c1)
  const S2_END = V0('c1') - 0.6;
  scene({
    name: 'context', from: S1_END, to: S2_END, pre: 0.4, post: 0.8,
    build(root, S) {
      S.big = para(root, ['100+'], { x: PAD - 8, y: P(150, 260), size: P(300, 290) });
      S.sub = cap(root, TALL ? ['places to buy', 'a domain'] : ['places to buy', 'a domain'], PAD, P(470, 590), P(76, 80));
      S.c2 = cap(root, TALL ? ['Most people use', '*more than one.*'] : ['Most people use', '*more than one.*'], PAD, P(150, 280), P(84, 88));
      S.svg = svgIn(root);
      const cols = P(5, 4), cw = P(152, 200), ch = P(150, 150), gx = P(1040, 116), gy = P(170, 800);
      S.cells = [];
      for (let i = 0; i < 20; i++) { const cx = gx + (i % cols) * cw, cy = gy + Math.floor(i / cols) * ch; S.cells.push([cx, cy]); }
      S.shops = S.cells.map(([cx, cy]) => D(shopIcon(S.svg, cx, cy, 0.95)));
      S.pick = P([0, 10, 15], [7, 3, 2]);                    // the three shops this customer used (placed so no wire crosses a storefront)
      S.rings = S.pick.map((i) => D(El(S.svg, S.cells[i][0] + 54, S.cells[i][1] + 52, 170, 150, { sw: 3 })));
      // the customer and their three domains
      const px = P(300, 170), py = P(560, 610);
      S.person = D(personIcon(S.svg, px, py, P(1.25, 1.1)));
      const tags = ['acme.shop', 'maya.blog', 'oldidea.io'];
      S.tag = tags.map((s, i) => {
        const tx = P(500, 320), ty = P(470 + i * 130, 540 + i * 82), tw = P(250, 230);
        return { box: D(R(S.svg, tx, ty, tw, 64, { sw: 2.8 })), txt: label(root, tx + 22, ty + 18, s, MONO(P(26, 24))), at: [tx, ty, tw] };
      });
      S.wire = S.tag.map((T, i) => {
        const [tx, ty, tw] = T.at, [sx, sy] = S.cells[S.pick[i]], a = [tx + tw, ty + 32];
        const route = TALL ? [[a, [850, 610], [905, 850], [sx + 120, sy + 52]], [a, [sx + 24, ty + 26], [sx + 54, sy - 6]], [a, [sx + 69, ty + 24], [sx + 54, sy - 6]]][i]
          : [a, [lerp(a[0], sx - 10, 0.5), lerp(a[1], sy + 52, 0.5)], [sx - 10, sy + 52]];
        return D(Cu(S.svg, [[px + 50, py + 30], [tx - 40, ty + 32], [tx, ty + 32]], { sw: 2.4 }), Cu(S.svg, route, { sw: 2.4 }));
      });
    },
    run(t, b, S) {
      put(S.root, { x: W * (1 - pan(t, S1_END - 0.4, S1_END + 0.8)) - W * pan(t, S2_END - 0.4, S2_END + 0.8), ...push(t, S1_END, S2_END) });
      const b2 = V0('b2');
      riseP(t, S.big, [V0('b1') - 0.2], b2 - 0.5, { st: 0 });
      riseP(t, S.sub, [Wd('b1', 'websites') - 0.4, Wd('b1', 'websites')], b2 - 0.5);
      riseP(t, S.c2, [b2, b2 + 0.35]);
      // the shops draw in, quickly, one after another
      S.shops.forEach((Dr, i) => {
        const b0 = V0('b1') + i * 0.2;
        const dim = !S.pick.includes(i) && beatAt(t) > b2 + 0.4;
        draw(t, Dr, b0, b0 + 0.9, null, null, dim ? COL.soft : COL.ink);
      });
      S.rings.forEach((Dr, i) => draw(t, Dr, Wd('b2', 'more') - 0.2 + i * 0.3, Wd('b2', 'more') + 0.6 + i * 0.3));
      draw(t, S.person, b2 + 0.2, b2 + 1.6);
      const words = [Wd('b3', 'shop'), Wd('b3', 'blog'), Wd('b3', 'idea')];
      S.tag.forEach((T, i) => { draw(t, T.box, words[i] - 0.6, words[i] + 0.1); write(t, T.txt, words[i] - 0.1, 0.6); draw(t, S.wire[i], words[i] + 0.1, words[i] + 1.3); });
    },
  });

  // ================================================================ 3. the usual way: a list of records, then the jagged path (c1 → d1)
  const S3_END = V0('d1') + 0.7;                      // the bare path (stations and words erased) hands over to the turn exactly here
  // station cue beats (from the voice)
  const CUE = () => [V0('c2'), Wd('c3', 'leave'), Wd('c3', 'sign'), V0('c4'), V0('c5'), V0('c6'), V0('c7')];
  // journey geometry, in world coordinates, per format
  const JW = TALL
    ? (() => {
      const Y = (k) => 1740 + (k - 1) * 760, X = [0, 400, 680, 400, 680, 400, 680, 420];
      const st = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ cx: 540, cy: Y(k), nx: X[k], ny: Y(k) + 215, lx: (PAD + 270) / 1.5, ly: Y(k) - 250, top: true }));   // labels land on the margin at the 1.5× camera
      const B = [[540, 1300], [620, 1420], [150, 1520], [150, 1930]];
      st.forEach((s, i) => {
        B.push([s.nx, s.ny]);
        if (i < 6) { const y0 = s.ny; B.push([s.nx + (i % 2 ? -260 : 260), y0 + 120], [s.nx + (i % 2 ? 120 : -140), y0 + 230], [i % 2 ? 950 : 130, y0 + 330], [i % 2 ? 950 : 130, y0 + 740]); }   // round the next drawing, never through it
      });
      // stations 2 and 3 are one breath apart in the voice: frame them together, wider, instead of whipping between them.
      // station 7 sits higher, so "gave up" and the ticket below it stay above the bottom UI zone
      const mid = (st[1].cy + st[2].cy) / 2 + 60;
      const camKey = (k) => (k === 1 || k === 2 ? { x: 0, y: 960 - mid, s: 1 } : { x: 540 - 540 * 1.5, y: 1180 - (st[k].cy + (k === 6 ? 200 : 0)) * 1.5, s: 1.5 });
      return { st, B, camKey, all: { x: 540 - 540 * 0.225, y: 1195 - 4000 * 0.225, s: 0.225 }, endY: st[6].ny };
    })()
    : (() => {
      const xs = [2420, 3060, 3700, 4380, 5060, 5700, 6360];
      const st = xs.map((cx, i) => { const top = i % 2 === 0; return { cx, cy: top ? 300 : 790, nx: cx, ny: top ? 500 : 600, top }; });
      // the spikes run round every drawing (never through a tab or a label) and never cross themselves
      const spikes = [[[2000, 660], [2180, 420]], [[2700, 820], [2760, 360], [2860, 560]], [[3240, 300], [3330, 860]], [[3860, 840], [3990, 520], [4110, 860], [4200, 420]],
        [[4620, 360], [4720, 860]], [[5240, 780], [5300, 300], [5420, 860]], [[5900, 360], [6000, 800]]];
      const B = [[1780, 580]];
      st.forEach((s, i) => { B.push(...spikes[i], [s.nx, s.ny]); });
      // the station sits a little right of centre: the path behind it stays in view and the headline owns the top left
      return { st, B, camKey: (k) => ({ x: 1040 - st[k].cx, y: 0, s: 1 }), all: { x: 960 - 4240 * 0.36, y: 570 - 560 * 0.36, s: 0.36 }, endX: 6360 };
    })();
  const JE = handPts(JW.B, 9, 3.5);                                   // the drawn journey line (world coords)
  // cumulative length at each station node (prefix-stable, so the line can draw node to node)
  const NODE_IDX = JW.st.map((s) => JE.findIndex((p) => p[0] === s.nx && p[1] === s.ny));
  const NODE_LEN = NODE_IDX.map((i) => lenOf(JE.slice(0, i + 1)));
  const J_TOTAL = lenOf(JE);
  const toScreen = (p, cam) => [p[0] * cam.s + cam.x, p[1] * cam.s + cam.y];
  // the usual-way camera: the window, then station to station, then (once the ticket is written) back to the whole path
  const camUsual = (t) => { const cue = CUE(); return trkObj(t, [[0, { x: 0, y: 0, s: 1 }], ...cue.map((cb, k) => [cb - 1.1, JW.camKey(k), 'heavy']), [Wd('c7', 'ticket') + 0.9, JW.all, { response: 0.9, damping: 1 }]]); };

  scene({
    name: 'usual', from: S2_END, to: S3_END, pre: 0.4,
    build(root, S) {
      S.eb = eyebrow(root, 'The usual way', PAD, P(48, 230));
      S.c1 = cap(root, TALL ? ['A list of', 'DNS records.'] : ['A list of', 'DNS records.'], PAD, P(200, 300), P(88, 92));
      S.c1b = cap(root, ['*And a job.*'], PAD, P(200 + 2 * 92, 300 + 2 * 96), P(88, 92));
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px`);
      S.svg = svgIn(S.world, 8000, 8000);
      // part 1: the app window turns into a list of records to add elsewhere
      const [x, y, w, h] = P([860, 280, 920, 600], [90, 700, 900, 600]);
      S.win = appWindow(S.svg, S.world, x, y, w, h);
      S.dWin = D(S.win.frame, S.win.side);
      const mx = x + 236, my = y + 84, mw = w - 280;
      S.modal = D(R(S.svg, mx - 16, my - 16, mw + 20, h - 110, { sw: 3 }), Ln(S.svg, mx, my + 120, mx + mw - 30, my + 120, { sw: 2, stroke: COL.soft }), Ln(S.svg, mx, my + 190, mx + mw - 30, my + 190, { sw: 2, stroke: COL.soft }), Ln(S.svg, mx, my + 260, mx + mw - 30, my + 260, { sw: 2, stroke: COL.soft }));
      S.mt = label(S.world, mx, my, 'Add these DNS records at your provider', UI(P(26, 24), 600));
      S.rows = [['A', '@', '203.0.113.10'], ['CNAME', 'www', 'acme.yourapp.com'], ['TXT', '_verify', 'cd-9aF2bQ7x']].map(([a, bb, c], i) => label(S.world, mx, my + 64 + i * 70, `${a.padEnd(6)} ${bb.padEnd(8)} ${c}`, MONO(P(24, 22), COL.long)));
      // part 2: seven stations along a jagged line
      S.line = pathEl(S.svg, dOf(JE), 4.2);
      S.lineLen = S.line.getTotalLength();
      S.line.setAttribute('stroke-dasharray', `${S.lineLen} ${S.lineLen}`); reg(S.line, { o: 0 });
      S.nodes = JW.st.map((s) => D(Ci(S.svg, s.nx, s.ny, 30, { sw: 3, fill: COL.paper })));
      const titles = ['Remember where you bought it', 'Leave your app', 'Sign in somewhere else', 'Find the DNS settings', 'Copy each record by hand', 'Wait up to 48 hours', 'Check it worked'];
      // 16:9: the station's name is the headline, so it reads on a phone; 9:16 keeps it beside the drawing, where it is already large
      if (TALL) S.lab = JW.st.map((s, i) => ({ num: label(S.world, s.lx, s.ly, String(i + 1), MONO(30, COL.muted)), txt: label(S.world, s.lx + 40, s.ly - 6, titles[i], UI(36, 600)) }));
      else { S.sc = titles.map((s, i) => cap(root, [`${i + 1} · ${s}`], PAD, 96, 64)); S.fc = cap(root, ['One typo. *It never connects.*'], PAD, 96, 72); }
      const ill = [];
      const g = (s) => [s.cx, s.cy];
      // 1 · where did I buy this? a thought bubble of storefronts and a question mark
      { const [cx, cy] = g(JW.st[0]); ill.push(D(El(S.svg, cx, cy, 380, 220, { sw: 3 }), Ci(S.svg, cx - 170, cy + 120, 36, { sw: 2.6 }), Ci(S.svg, cx - 200, cy + 152, 20, { sw: 2.4 }), shopIcon(S.svg, cx - 150, cy - 40, 0.62), shopIcon(S.svg, cx - 60, cy - 40, 0.62)));
        S.qm1 = box(S.world, cx + 50, cy - 82, HAND(130), '?', { o: 0 }); }
      // 2 · leave your app: a browser with two tabs and a jump between them
      { const [cx, cy] = g(JW.st[1]); ill.push(D(R(S.svg, cx - 180, cy - 100, 360, 220, { sw: 3 }), Pl(S.svg, [[cx - 170, cy - 100], [cx - 160, cy - 140], [cx - 40, cy - 140], [cx - 30, cy - 100]], { sw: 2.8 }), Pl(S.svg, [[cx + 10, cy - 100], [cx + 20, cy - 140], [cx + 160, cy - 140], [cx + 170, cy - 100]], { sw: 2.8 }),
          Cu(S.svg, [[cx - 100, cy - 20], [cx - 10, cy - 70], [cx + 90, cy - 30]], { sw: 3 }), arrowHead(S.svg, cx + 90, cy - 30, 0.6)));
        S.tab1 = label(S.world, cx - 150, cy - 132, 'your app', UI(18, 500, COL.muted)); S.tab2 = label(S.world, cx + 32, cy - 132, 'registrar', UI(18, 500, COL.muted)); }
      // 3 · sign in somewhere else: a login card, a forgotten password
      { const [cx, cy] = g(JW.st[2]); S.fp = [cx - 120, cy + 74];
        ill.push(D(R(S.svg, cx - 150, cy - 125, 300, 250, { sw: 3 }), R(S.svg, cx - 120, cy - 72, 240, 40, { sw: 2.4 }), R(S.svg, cx - 120, cy - 20, 240, 40, { sw: 2.4 }), R(S.svg, cx - 120, cy + 30, 240, 34, { sw: 2.6 })));
        S.login = [label(S.world, cx - 120, cy - 112, 'Sign in', UI(22, 600)), label(S.world, cx - 108, cy - 62, 'maya@acme.shop', MONO(18, COL.long)), label(S.world, cx - 108, cy - 10, '••••••••', MONO(18, COL.long)), label(S.world, cx - 120, cy + 76, 'Forgot password?', UI(18, 500, COL.ink))];
        S.scrib = D(Pl(S.svg, [[cx - 122, cy + 102], [cx + 40, cy + 100], [cx - 100, cy + 108], [cx + 50, cy + 106]], { sw: 2.6, rough: 1.4 }));
        S.env = D(envelope(S.svg, cx + 160, cy + 50, 0.7)); S.envT = label(S.world, cx + 160, cy + 102, 'reset link sent', UI(16, 500, COL.muted)); }
      // 4 · find the DNS settings: menus inside menus
      { const [cx, cy] = g(JW.st[3]); const items = [['Domains', -170, -110], ['Manage', -40, -50], ['Advanced', 70, 10], ['DNS settings', -110, 80]];
        const parts = []; items.forEach(([, dx, dy], i) => { parts.push(R(S.svg, cx + dx, cy + dy, i === 3 ? 190 : 150, 46, { sw: 2.6 })); if (i < 3) { const [, dx2, dy2] = items[i + 1]; parts.push(Cu(S.svg, [[cx + dx + 120, cy + dy + 46], [cx + dx + 140, cy + dy + 60], [cx + dx2 + 30, cy + dy2 - 4]], { sw: 2.4 })); } });
        parts.push(Cu(S.svg, [[cx + 120, cy + 100], [cx + 190, cy + 40], [cx + 150, cy - 40], [cx + 60, cy - 120], [cx - 30, cy - 130]], { sw: 2.2, rough: 1.2 }));
        ill.push(D(parts)); S.menu = items.map(([s, dx, dy]) => label(S.world, cx + dx + 14, cy + dy + 10, s, UI(20, 500))); }
      // 5 · copy each record by hand: from your app to a field elsewhere
      { const [cx, cy] = g(JW.st[4]); const parts = [R(S.svg, cx - 190, cy - 100, 170, 200, { sw: 3 }), R(S.svg, cx + 20, cy - 100, 170, 200, { sw: 3 })];
        [0, 1, 2].forEach((i) => { parts.push(R(S.svg, cx + 34, cy - 50 + i * 48, 142, 34, { sw: 2.2 })); parts.push(Cu(S.svg, [[cx - 40, cy - 34 + i * 48], [cx - 10, cy - 44 + i * 48], [cx + 30, cy - 34 + i * 48]], { sw: 2.2 })); });
        // the same three records as the list (A, CNAME, TXT), copied across one field at a time; the typo is in the CNAME row
        ill.push(D(parts)); S.cp = [label(S.world, cx - 176, cy - 90, 'your app', UI(16, 600, COL.muted)), label(S.world, cx + 34, cy - 90, 'registrar', UI(16, 600, COL.muted)),
          ...['A 203.0.113.10', 'CNAME www', 'TXT _verify'].map((s, i) => label(S.world, cx - 178, cy - 44 + i * 48, s, MONO(15, COL.long))),
          ...['203.0.113.10', 'wwww', '_verify'].map((s, i) => label(S.world, cx + 42, cy - 44 + i * 48, s, MONO(16, COL.ink)))]; }
      // 6 · wait: a clock whose hands race
      { const [cx, cy] = g(JW.st[5]); const parts = [Ci(S.svg, cx, cy, 230, { sw: 3.2 })]; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; parts.push(Ln(S.svg, cx + Math.cos(a) * 98, cy + Math.sin(a) * 98, cx + Math.cos(a) * 110, cy + Math.sin(a) * 110, { sw: 2.4 })); }
        ill.push(D(parts)); S.hands = document.createElementNS(NS, 'g'); S.svg.appendChild(S.hands); S.hands.setAttribute('style', `transform-origin:${cx}px ${cy}px`); const hm = Ln(S.hands, cx, cy, cx, cy - 86, { sw: 3.4 }), hh = Ln(S.hands, cx, cy, cx + 50, cy, { sw: 3.4 }); S.hm = hm; S.hh = hh; S.handsD = D(hm, hh);
        S.clockC = [cx, cy]; }
      // 7 · check it worked: the site does not load. Then: give up, or a support ticket.
      { const [cx, cy] = g(JW.st[6]); ill.push(D(R(S.svg, cx - 180, cy - 110, 360, 220, { sw: 3 }), Ln(S.svg, cx - 180, cy - 66, cx + 180, cy - 66, { sw: 2.4 }), R(S.svg, cx - 150, cy - 98, 220, 22, { sw: 2 })));
        S.addr = label(S.world, cx - 140, cy - 97, 'acme.shop', MONO(15, COL.long));
        S.x = D(Ln(S.svg, cx - 60, cy - 40, cx + 60, cy + 80, { sw: 5 }), Ln(S.svg, cx + 60, cy - 40, cx - 60, cy + 80, { sw: 5 }));
        S.err = TALL ? label(S.world, cx - 200, cy + 126, 'One typo. It never connects.', UI(28, 600)) : null;
        S.gave = D(Pl(S.svg, P([[cx + 180, cy + 40], [cx + 260, cy + 90], [cx + 240, cy + 130], [cx + 300, cy + 170], [cx + 280, cy + 210], [cx + 340, cy + 250]], [[cx - 180, cy + 60], [cx - 260, cy + 120], [cx - 230, cy + 170], [cx - 300, cy + 220]]), { sw: 3, rough: 1.4 }));
        S.gaveT = label(S.world, P(cx + 260, cx - 300), P(cy + 262, cy + 236), 'gave up', HAND(P(48, 40), COL.ink));
        S.tk = D(envelope(S.svg, P(cx + 250, cx + 20), P(cy - 150, cy + 300), 0.9)); S.tkT = label(S.world, P(cx + 250, cx + 20), P(cy - 84, cy + 362), 'support ticket', HAND(P(48, 40), COL.ink)); }
      S.ill = ill;
      S.stTxt = [[S.qm1], [S.tab1, S.tab2], [...S.login, S.envT], S.menu, S.cp, [], []];
      S.stTxt.flat().forEach((e) => { e._c0 = e.style.color; });
      // the tally under the whole path (16:9 only: in 9:16 the path fills the column, and the comparison says it later)
      S.chip = TALL ? null : box(root, PAD, 960, `display:flex;align-items:center;gap:18px;padding:14px 24px;border:3px solid ${COL.ink};border-radius:10px;background:${COL.paper};${MONO(32)}white-space:nowrap`, '7 steps · 2 websites · hours of waiting', { o: 0 });
    },
    run(t, b, S) {
      put(S.root, { x: W * (1 - pan(t, S2_END - 0.4, S2_END + 0.8)) });
      const cue = CUE(), c1 = V0('c1'), nv = Wd('c7', 'never'), tkW = Wd('c7', 'ticket');
      const er0 = S3_END - 1.1, er1 = S3_END - 0.1;      // every drawing erases here with its words; the line and its nodes stay for the turn
      showEyebrow(t, S.eb, c1 - 0.6, TALL ? cue[0] - 1.0 : er0);   // in 9:16 the stations pass over its spot
      riseP(t, S.c1, [c1 - 0.3, c1 + 0.05], cue[0] - 1.0);
      riseP(t, S.c1b, [Wd('c1', 'job') - 0.2], cue[0] - 1.0);
      // camera: the window, then station to station, then (after the ticket) pull back to show the whole path
      const cam = camUsual(t);
      put(S.world, { x: cam.x, y: cam.y, s: cam.s });
      // part 1, erased once the camera has left it
      const p0 = cue[1], p1 = cue[1] + 1;
      draw(t, S.dWin, c1 - 1.0, c1 + 0.8, p0, p1); write(t, S.win.url, c1 - 0.6, null, p0);
      draw(t, S.modal, c1 + 0.8, c1 + 2.4, p0, p1); write(t, S.mt, c1 + 1.2, 1.2, p0);
      S.rows.forEach((r, i) => write(t, r, Wd('c1', 'records') - 0.8 + i * 0.5, 0.9, p0));
      // the line, node to node, drawn as the camera travels to each station; its width holds at 4 px on screen when the camera pulls back
      let L = 0;
      cue.forEach((cb, k) => { const from = k ? NODE_LEN[k - 1] : 0; L += (NODE_LEN[k] - from) * ease.inOut(seg(t, cb - 1.3, cb - 0.1)); });
      L += (J_TOTAL - NODE_LEN[6]) * ease.inOut(seg(t, nv, nv + 1));
      put(S.line, { o: L > 1 ? 1 : 0, css: { strokeDashoffset: (S.lineLen * (1 - L / J_TOTAL)).toFixed(1), strokeWidth: (4.2 / Math.min(1, cam.s)).toFixed(2) } });
      // stations: node, name, drawing; then every drawing and every word erases together, leaving the bare path
      cue.forEach((cb, k) => {
        draw(t, S.nodes[k], cb - 0.2, cb + 0.3);
        if (S.lab) { write(t, S.lab[k].num, cb, 0.2, er0, er1); write(t, S.lab[k].txt, cb + 0.1, 0.9, er0, er1); }
        draw(t, S.ill[k], cb, cb + 1.6, er0, er1, k < 6 && beatAt(t) >= cue[k + 1] ? COL.soft : null);
        (S.stTxt[k] || []).forEach((e) => put(e, { css: { color: k < 6 && beatAt(t) >= cue[k + 1] ? COL.soft : e._c0 } }));
      });
      if (S.sc) {
        S.sc.forEach((Rr, k) => riseP(t, Rr, [cue[k] + 0.05], k < 6 ? cue[k + 1] - 0.3 : nv - 0.45, { st: 0.05 }));
        riseP(t, S.fc, [nv - 0.1], er0 - 0.1, { st: 0.06 });
      }
      const qk = grow(t, cue[0] + 1.4, 'snappy', 0.7); put(S.qm1, { o: beatAt(t) < er0 + 0.3 ? qk.o : 0, s: qk.s });
      write(t, S.tab1, cue[1] + 0.8, 0.5, er0, er1); write(t, S.tab2, cue[1] + 1.0, 0.5, er0, er1);
      S.login.forEach((e, i) => write(t, e, cue[2] + 0.6 + i * 0.35, 0.6, er0, er1));
      const st3 = beatAt(t) >= cue[3] ? COL.soft : null, st6 = beatAt(t) >= cue[6] ? COL.soft : null;
      draw(t, S.scrib, Wd('c3', 'forgot'), Wd('c3', 'password') + 0.4, er0, er1, st3);
      draw(t, S.env, Wd('c3', 'reset') - 0.3, Wd('c3', 'reset') + 0.6, er0, er1, st3); write(t, S.envT, Wd('c3', 'reset') + 0.3, 0.6, er0, er1);
      S.menu.forEach((e, i) => write(t, e, cue[3] + 0.4 + i * 0.4, 0.5, er0, er1));
      S.cp.forEach((e, i) => write(t, e, cue[4] + 0.6 + i * 0.22, 0.4, er0, er1));
      // the clock's hands race while they wait
      draw(t, S.handsD, cue[5] + 0.6, cue[5] + 1.0, er0, er1, st6);
      const spin = seg(t, cue[5] + 0.8, S3_END) * 360 * 6;
      put(S.hands, { css: { transform: `rotate(${spin.toFixed(1)}deg)` } });
      write(t, S.addr, cue[6] + 0.6, 0.4, er0, er1);
      draw(t, S.x, nv - 0.35, nv, er0, er1);                         // complete on the word (and the shutter)
      if (S.err) write(t, S.err, Wd('c7', 'connects') - 0.2, 0.8, er0, er1);
      draw(t, S.gave, Wd('c7', 'give') - 0.3, Wd('c7', 'up') + 0.4, er0, er1); write(t, S.gaveT, Wd('c7', 'up'), 0.6, er0, er1);
      draw(t, S.tk, Wd('c7', 'support') - 0.3, tkW, er0, er1); write(t, S.tkT, Wd('c7', 'support'), 0.5, er0, er1);
      if (S.chip) { const ch = grow(t, tkW + 0.9, 'snappy', 0.8), wipe = ease.inOut(seg(t, er0, er0 + 0.6)); put(S.chip, { o: ch.o, s: ch.s, y: 10 * (1 - ch.k), clip: `inset(0 ${(wipe * 100).toFixed(2)}% 0 0)` }); }
    },
  });

  // ================================================================ 4. the turn: the jagged line pulls straight (d1 → e1)
  // Three moves: (1) the bare path, as the usual way left it; (2) pulled taut where it lies, at full size, the seven nodes
  // merging into four; held; (3) only then does the straight line settle into the rail (in 9:16 it swings down from upright).
  const S4_END = V0('e1') - 0.3;
  // the rail (screen coords): stops for the three things the customer does, and "Live"; inside the 9:16 safe zones
  const RAIL = P({ x0: 220, x1: 1700, y: 950 }, { x0: 100, x1: 920, y: 1440 });
  const RAIL_STOPS = P([0, 1 / 3, 2 / 3, 1], [0, 0.37, 0.69, 1]);   // 9:16: spaced so "Type domain" and "Sign in" never touch
  const RAIL_TXT = P(['Type your domain', 'Sign in', 'Approve', 'Live'], ['Type domain', 'Sign in', 'Approve', 'Live']);
  // a stop's label: a hidden copy holds the width so the text types on without sliding (first left-aligned, last right-aligned, others centred)
  function railLabel(parent, i, color = COL.ink) {
    const x = lerp(RAIL.x0, RAIL.x1, RAIL_STOPS[i]), tr = i === 0 ? '-11px' : i === 3 ? 'calc(11px - 100%)' : '-50%';
    const e = box(parent, x, RAIL.y + 30, `white-space:nowrap;translate:${tr} 0;${UI(P(40, 34), 600, color)}`, `<span style="visibility:hidden">${RAIL_TXT[i]}</span>`);
    const v = el('span', { style: 'position:absolute;left:0;top:0' }, e); v._full = RAIL_TXT[i]; e.rt = v;
    return e;
  }
  const NPT = 240;
  scene({
    name: 'turn', from: S3_END, to: S4_END, pre: 1.0,
    build(root, S) {
      S.svg = svgIn(root);
      S.cam0 = camUsual(bt(S3_END));
      S.pa = resample(JE.map((p) => toScreen(p, S.cam0)), NPT);            // (S.from / S.to are the scene's own window)
      const a = S.pa[0], z = S.pa[NPT - 1];
      S.F0 = TALL ? { c: [540, (a[1] + z[1]) / 2], a: Math.PI / 2, L: z[1] - a[1] } : { c: [(a[0] + z[0]) / 2, 570], a: 0, L: z[0] - a[0] };
      S.F1 = { c: [(RAIL.x0 + RAIL.x1) / 2, RAIL.y], a: 0, L: RAIL.x1 - RAIL.x0 };
      S.line = pathEl(S.svg, dOf(S.pa), 4.2);
      S.nodeT = NODE_LEN.map((l) => l / J_TOTAL);
      S.dots = JW.st.map(() => box(root, 0, 0, `width:22px;height:22px;margin:-11px 0 0 -11px;border:3px solid ${COL.ink};border-radius:50%;background:${COL.paper};box-sizing:border-box`, ''));
      S.cap = cap(root, TALL ? ['CustomDomain™ takes', 'all of that', '*off their plate.*'] : ['CustomDomain™ takes all', 'of that *off their plate.*'], PAD, P(150, 280), P(84, 80));
      S.eb = eyebrow(root, 'With CustomDomain™', PAD, P(80, 230));
      S.lab = RAIL_TXT.map((_, i) => railLabel(root, i));
    },
    run(t, b, S) {
      const on = beatAt(t) >= S3_END, d1 = V0('d1'), plate = Wd('d1', 'plate');
      riseP(t, S.cap, TALL ? [d1 - 0.1, d1 + 0.2, d1 + 0.5] : [d1 - 0.1, d1 + 0.25], S4_END - 0.35, { stagger: 0 });
      showEyebrow(t, S.eb, TALL ? S4_END - 0.1 : plate - 0.5);
      // the frame of the straight line: centre, angle, length; it moves only in step 3
      const k0 = Wd('d1', 'takes') - 0.2, k1 = plate - 1.2, g0 = V0('e1') - 1.3, g1 = V0('e1') - 0.4;
      const u = ease.inOut(seg(t, g0, g1)), F0 = S.F0, F1 = S.F1;
      const c = [lerp(F0.c[0], F1.c[0], u), lerp(F0.c[1], F1.c[1], u)], an = lerp(F0.a, F1.a, u), len = lerp(F0.L, F1.L, u);
      const onS = (f) => [c[0] + (f - 0.5) * len * Math.cos(an), c[1] + (f - 0.5) * len * Math.sin(an)];
      // each point springs onto the straight line in turn, start to end, with a little overshoot: pulled taut
      const pts = S.pa.map((p, i) => { const f = i / (NPT - 1), k = sp(t, lerp(k0, k1, f), { response: 0.7, damping: 0.72 }), q = onS(f); return [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]; });
      S.line.setAttribute('d', dOf(pts));
      put(S.line, { o: on ? 1 : 0 });
      // the seven nodes ride the line, grow to full size, then merge into the four stops
      const gather = sp(t, plate - 0.5, { response: 0.6, damping: 1 }), ds = lerp((30 * S.cam0.s) / 22, 1, sp(t, k1, 'default'));
      S.dots.forEach((e, i) => {
        const [px, py] = pts[Math.round(S.nodeT[i] * (NPT - 1))], [tx, ty] = onS(RAIL_STOPS[Math.min(3, Math.round((i / 6) * 3))]);
        put(e, { o: on ? 1 : 0, x: lerp(px, tx, gather), y: lerp(py, ty, gather), s: ds });
      });
      S.lab.forEach((e, i) => write(t, e.rt, g1 - 0.25 + i * 0.2, 0.5));
    },
  });

  // ================================================================ 5. with CustomDomain™: inside the app, then behind the scenes, then kept (e1 → f1)
  const S5_END = V0('f1') - 0.5;
  scene({
    name: 'ours', from: S4_END, to: S5_END, post: 0.8,
    build(root, S) {
      S.eb = eyebrow(root, 'With CustomDomain™', PAD, P(80, 230));
      const c = (lines, size) => cap(root, lines, PAD, P(140, 280), size ?? P(76, 80));
      S.caps = [
        [V0('e1'), c(TALL ? ['Same app.', '*Same button.*'] : ['Same app.', '*Same button.*'])],
        [V0('e2'), c(TALL ? ['We find where', 'it’s *managed.*'] : ['We find where', 'it’s *managed.*'])],
        [V0('e3'), c(TALL ? ['Sign in.', '*Approve once.*'] : ['Sign in.', '*Approve once.*'])],
        [V0('e4'), c(TALL ? ['That’s it for', '*your customer.*'] : ['That’s it for', '*your customer.*'])],
        [V0('e5'), c(TALL ? ['We add the records,', 'verify them,', '*issue HTTPS.*'] : ['We add the records, verify', 'them, and *issue HTTPS.*'])],
        [V0('e6'), c(TALL ? ['Live. Correct', '*the first time.*'] : ['Live. Correct', '*the first time.*'])],
        [V0('e7'), c(TALL ? ['And kept that way,', '*every hour.*'] : ['And kept that way,', '*every hour.*'])],
      ];
      // the rail (as the turn left it) with its four stops
      S.svgR = svgIn(root);
      S.rail = pathEl(S.svgR, `M${RAIL.x0},${RAIL.y} L${RAIL.x1},${RAIL.y}`, 4.2);
      S.stops = RAIL_STOPS.map((f, i) => box(root, lerp(RAIL.x0, RAIL.x1, f), RAIL.y, `width:22px;height:22px;margin:-11px 0 0 -11px;border:3px solid ${COL.ink};border-radius:50%;background:${COL.paper};box-sizing:border-box;transform-origin:50% 50%`, ''));
      S.lab = RAIL_TXT.map((_, i) => railLabel(root, i));                 // green arrives only with "live"
      S.loopI = box(root, RAIL.x1 + P(56, -40), RAIL.y - P(20, 86), '', `<svg width="44" height="44" viewBox="0 0 44 44" style="position:static;overflow:visible"><path d="M36 14 A16 16 0 1 0 38 26" fill="none" stroke="${COL.done}" stroke-width="3.4" stroke-linecap="round"/><path d="M30 8 L37 14 L30 20" fill="none" stroke="${COL.done}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { o: 0 });
      // three plates on one wide world: front (the app + widget), back (the DNS zone), live (the site, kept)
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px`);
      S.svg = svgIn(S.world, W * 3.2, H);
      const OX = [0, W * 1.1, W * 2.2];
      // --- front: the app; its button opens the widget inside it (the widget is its own layer: paper-filled, scaled up in 9:16)
      const [x, y, w, h] = P([760, 290, 1020, 600], [90, 560, 900, 840]);
      S.win = appWindow(S.svg, S.world, x, y, w, h);
      S.dWin = D(S.win.frame, S.win.side); S.dBtn = D(S.win.btn);
      const ws = P(1, 1.5), ww = 500, wh = P(520, 500);
      const wx = P(x + 330, x + (w - ww * ws) / 2), wy = P(y + 64, y + 80);
      S.wg = box(S.world, wx, wy, `width:${ww}px;height:${wh}px;transform-origin:0 0`); reg(S.wg, { s: ws });
      S.wpaper = box(S.wg, 0, 0, `width:${ww}px;height:${wh}px;background:${COL.paper};border-radius:8px`, '', { o: 0 });
      const v = svgIn(S.wg, ww + 40, wh + 40), G = S.wg;
      S.wbox = D(R(v, 0, 0, ww, wh, { sw: 3.4 / ws }));
      S.wFoot = label(G, ww / 2 - 110, wh - 36, 'Powered by CustomDomain™', UI(17, 500, COL.muted));
      // the note: one clean arrow, with a head, into the widget; never across the URL bar
      if (TALL) {
        S.inside = D(Cu(S.svg, [[730, 522], [790, 560], [806, wy - 8]], { sw: 2.8 }), arrowHead(S.svg, 806, wy - 8, 1.45));
        S.insideT = label(S.world, 400, 458, 'inside your app · no new tab', HAND(44, COL.ink));
      } else {
        S.inside = D(Cu(S.svg, [[680, 642], [880, 650], [wx - 14, wy + 250]], { sw: 2.8 }), arrowHead(S.svg, wx - 14, wy + 250, -0.12));
        S.insideT = label(S.world, PAD, 606, 'inside your app · no new tab', HAND(44, COL.ink));
      }
      // widget state 1: connect
      const lx = 34;
      S.w1 = { t: label(G, lx, 34, 'Connect your domain', UI(26, 600)), f: D(R(v, lx, 96, ww - 68, 60, { sw: 2.8 })), v: label(G, lx + 18, 112, 'acme.shop', MONO(26)),
        btn: D(R(v, lx, 200, ww - 68, 60, { sw: 3 })), bt: label(G, lx, 215, 'Continue', UI(24, 600) + `width:${ww - 68}px;text-align:center;`), fill: box(G, lx, 200, `width:${ww - 68}px;height:60px;border-radius:6px;background:${COL.ink}`, '', { o: 0 }) };
      // widget state 2: detect
      S.w2 = { t: label(G, lx, 34, 'Checking acme.shop…', UI(26, 600)), shops: [0, 1, 2, 3, 4].map((i) => D(shopIcon(v, lx + i * 88, 110, 0.55))),
        lens: D(Ci(v, 0, 0, 74, { sw: 3 }), Ln(v, 26, 26, 52, 52, { sw: 4 })), found: D(cloudIcon(v, lx + 4, 236, 0.9)), ft: label(G, lx + 120, 238, 'Managed at Cloudflare', UI(25, 600)), fc: D(checkMark(v, lx + 400, 244, 1)) };
      S.lensWrap = document.createElementNS(NS, 'g'); v.appendChild(S.lensWrap); S.w2.lens.strokes.forEach((pp) => S.lensWrap.appendChild(pp));
      // widget state 3: sign in to the provider, then approve
      S.w3 = { cl: D(cloudIcon(v, lx, 30, 0.7)), t: label(G, lx + 92, 34, 'Sign in to Cloudflare', UI(25, 600)),
        e: D(R(v, lx, 100, ww - 68, 54, { sw: 2.6 })), ev: label(G, lx + 16, 115, 'maya@acme.shop', MONO(22, COL.long)),
        p: D(R(v, lx, 168, ww - 68, 54, { sw: 2.6 })), pv: label(G, lx + 16, 183, '••••••••••', MONO(22, COL.long)),
        btn: D(R(v, lx, 250, ww - 68, 58, { sw: 3 })), bt: label(G, lx, 264, 'Sign in', UI(24, 600) + `width:${ww - 68}px;text-align:center;`), fill: box(G, lx, 250, `width:${ww - 68}px;height:58px;border-radius:6px;background:${COL.ink}`, '', { o: 0 }),
        q: label(G, lx, 330, 'Allow CustomDomain™ to manage', UI(21, 500, COL.long)), q2: label(G, lx, 358, 'DNS for acme.shop?', UI(21, 500, COL.long)),
        ab: D(R(v, lx, 396, ww - 68, 58, { sw: 3 })), at: label(G, lx, 410, 'Allow', UI(24, 600) + `width:${ww - 68}px;text-align:center;`), afill: box(G, lx, 396, `width:${ww - 68}px;height:58px;border-radius:6px;background:${COL.ink}`, '', { o: 0 }) };
      S.bigCheck = D(checkMark(v, ww - 120, wh - 150, 3.2, COL.done, 7));
      S.cur = cursorEl(S.world, P(40, 46));
      S.wgeo = { wx, wy, ww, wh, lx, ws };
      // --- back: the DNS zone at the provider, filled in by CustomDomain™
      // CustomDomain™'s own record set: the root and www pointed at the edge (Cloudflare flattens the root CNAME). No verification TXT:
      // the sign-in itself proves control (docs: connect-flow, dns/bring-your-own-records)
      const bx = OX[1] + P(560, 90), by = P(330, 590), bw = P(1100, 900), bh = P(420, 540);
      S.zone = D(R(S.svg, bx, by, bw, bh, { sw: 3.4 }), Ln(S.svg, bx, by + 70, bx + bw, by + 70, { sw: 2.6 }), cloudIcon(S.svg, bx + 26, by + 14, 0.5));
      S.zt = label(S.world, bx + 92, by + 20, 'Cloudflare DNS · acme.shop', UI(P(26, 24), 600));
      S.zrows = [['CNAME', '@', 'edge.customdomain.ai'], ['CNAME', 'www', 'edge.customdomain.ai']].map(([a, bb, cc], i) => ({
        txt: label(S.world, bx + 36, by + 110 + i * 82, `${a.padEnd(6)} ${bb.padEnd(5)} ${cc}`, MONO(P(28, 25), COL.ink) + 'white-space:pre;'),
        ln: D(Ln(S.svg, bx + 30, by + 160 + i * 82, bx + bw - 30, by + 160 + i * 82, { sw: 2, stroke: COL.hair })),
        ck: D(checkMark(S.svg, bx + bw - 80, by + 104 + i * 82, 1.2)) }));
      S.res = { txt: label(S.world, bx + 36, by + 290, 'All records resolve', UI(P(26, 24), 600)), ck: D(checkMark(S.svg, bx + P(330, 300), by + 292, 1.1)) };
      S.lock = D(lockIcon(S.svg, bx + 36, by + 336, 1.1, { stroke: COL.done }));
      S.lockT = label(S.world, bx + 92, by + 358, 'HTTPS certificate issued', UI(P(26, 24), 600));
      S.byT = label(S.world, bx, by + bh + 22, 'written by CustomDomain™, not by your customer', HAND(40, COL.ink));
      // --- live: the customer's site at their own domain, and the loop that keeps it so
      const sk = P(0.85, 0.8), sw = 860 * sk, sh = 520 * sk, LC = P([1200, 495], [530, 840]), sx = OX[2] + LC[0] - sw / 2, sy = LC[1] - sh / 2;
      const q = (a, b2) => [sx + a * sk, sy + b2 * sk], Rq = (a, b2, w2, h2, o) => R(S.svg, sx + a * sk, sy + b2 * sk, w2 * sk, h2 * sk, o), Lq = (a, b2, c2, d2, o) => Ln(S.svg, ...q(a, b2), ...q(c2, d2), o);
      S.site = D(Rq(0, 0, 860, 520, { sw: 3.4 }), Lq(0, 66, 860, 66, { sw: 2.6 }), Rq(30, 16, 440, 36, { sw: 2.4 }),
        Lq(60, 140, 460, 140, { sw: 6 }), Lq(60, 186, 380, 186, { sw: 6 }), Lq(60, 250, 520, 250, { sw: 2.4, stroke: COL.soft }),
        Lq(60, 284, 470, 284, { sw: 2.4, stroke: COL.soft }), Rq(60, 330, 200, 54, { sw: 3 }), Rq(560, 120, 240, 270, { sw: 2.6 }), Lq(560, 390, 800, 120, { sw: 2, stroke: COL.soft }));
      S.siteLock = D(lockIcon(S.svg, sx + 44 * sk, sy + 20 * sk, 0.62 * sk, { stroke: COL.done, sw: 2.6 }));
      S.urlRing = D(El(S.svg, sx + 250 * sk, sy + 36 * sk, 540 * sk, 74 * sk, { sw: 3, rough: 1.1 }));
      S.siteUrl = label(S.world, sx + 80 * sk, sy + 24 * sk - 2, 'https://acme.shop', MONO(P(24, 22)));
      // "Live": a green pill (green is for done, and this is the moment it is done)
      S.live = box(S.world, sx + sw - 170 * sk - 20, sy + 14 * sk, `display:flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;background:${COL.done};${UI(22, 600, COL.paper)}transform-origin:50% 50%`, `<svg width="18" height="18" viewBox="0 0 20 20" style="position:static"><path d="M4 10.5l4 4 8-9" fill="none" stroke="${COL.paper}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Live`, { o: 0 });
      // the loop around the site, an orbiting dot on it; sized to clear the caption, the checklist and the rail
      const lc = [OX[2] + LC[0], LC[1]], lr = P([580, 390], [420, 395]);
      S.loopC = lc; S.loopR = lr;
      S.loop = D(El(S.svg, lc[0], lc[1], lr[0] * 2, lr[1] * 2, { sw: 3, stroke: COL.done, rough: 0.6 }));
      S.orbit = box(S.world, 0, 0, `width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:${COL.done}`, '', { o: 0 });
      // what "kept" means, in the order the voice says it: a column under the caption (16:9), between the loop and the rail (9:16)
      const kx = OX[2] + P(PAD, 150), ky = P(420, 1268), kd = P(72, 54);
      S.keep = ['Checked every hour', 'Certificates renewed', 'Drift fixed'].map((s2, i) => ({ ck: D(checkMark(S.svg, kx, ky + i * kd + 6, 1)), txt: label(S.world, kx + 44, ky + i * kd, s2, UI(P(32, 28), 600)) }));
      S.OX = OX;
    },
    run(t, b, S) {
      const e = (id) => V0(id);
      showEyebrow(t, S.eb, TALL ? S4_END - 0.1 : Wd('d1', 'plate') - 0.5);   // continues the turn's kicker exactly
      S.caps.forEach(([bb, Rr], i) => { const out = i < S.caps.length - 1 ? S.caps[i + 1][0] - 0.45 : S5_END - 0.5; riseP(t, Rr, [bb, bb + 0.3, bb + 0.6], out); });
      // camera across the three plates: front → back (e5) → live (e6)
      const cx = trk(t, [[0, 0], [e('e5') - 0.6, -S.OX[1], { response: 0.9, damping: 1 }], [e('e6') - 0.6, -S.OX[2], { response: 0.9, damping: 1 }]]);
      const plate = beatAt(t) < e('e5') - 0.6 ? [S4_END, e('e5') - 0.6] : beatAt(t) < e('e6') - 0.6 ? [e('e5') - 0.6, e('e6') - 0.6] : [e('e6') - 0.6, S5_END];
      const ps = 1 + 0.04 * ease.inOut(seg(t, plate[0], plate[1]));
      const zk = TALL ? 0 : ease.inOut(seg(t, Wd('e3', 'they') - 0.9, Wd('e3', 'they') - 0.1)) - ease.inOut(seg(t, e('e5') - 2.2, e('e5') - 1.0));
      const z = 1 + 0.15 * zk, Zx = 600, Zy = 600, O1 = [W / 2 - cx, H * 0.45];     // screen = Z + z * (O1 + (cx,0) + ps * (p - O1) - Z)
      put(S.world, { x: Zx + z * (O1[0] + cx - Zx) - z * ps * O1[0], y: Zy + z * (O1[1] - Zy) - z * ps * O1[1], s: z * ps, css: { 'transform-origin': '0px 0px' } });
      // rail stops fill as the customer does each thing; Live fills green
      const done = [Wd('e1', 'once'), Wd('e3', 'sign'), Wd('e3', 'approve'), Wd('e6', 'live')];
      S.stops.forEach((st, i) => {
        const k = grow(t, done[i], 'snappy', 0.6), on = beatAt(t) >= done[i], c = i === 3 ? COL.done : COL.ink;
        put(st, { s: on ? k.s * 1.25 : 1, css: { background: on ? c : COL.paper, borderColor: on ? c : COL.ink } });
      });
      S.lab.forEach((e, i) => { write(t, e.rt, -10, 0.1); put(e.rt, { css: { color: i === 3 && beatAt(t) >= done[3] ? COL.done : COL.ink } }); });
      const lk = grow(t, Wd('e7', 'keep'), 'snappy', 0.5); put(S.loopI, { o: lk.o, s: lk.s, r: beatAt(t) > Wd('e7', 'keep') ? (beatAt(t) - Wd('e7', 'keep')) * 40 : 0 });
      // --- front: the app and its button; the click opens the widget inside it
      const g = S.wgeo, open = Wd('e1', 'button') + 0.15, shut = e('e5') - 0.6;
      draw(t, S.dWin, S4_END - 0.6, e('e1') + 1.0); write(t, S.win.url, e('e1'));
      write(t, S.win.crumb, e('e1') + 0.3, null, open + 0.4); write(t, S.win.title, e('e1') + 0.6, null, open + 0.4);
      draw(t, S.dBtn, e('e1') + 0.2, e('e1') + 1.0, open + 0.2, open + 0.6); write(t, S.win.btnText, e('e1') + 0.6, 0.6, open + 0.4);
      const onB = beatAt(t) >= Wd('e1', 'button') - 0.1 && beatAt(t) < open + 0.4;
      put(S.win.btnFill, { o: onB ? 1 : 0 }); put(S.win.btnText, { css: { color: onB ? COL.paper : COL.ink } });
      const wk = grow(t, open + 0.3, 'default', 0.92);   // opens from its centre: scale about the top-left, offset back by the shrink
      put(S.wpaper, { o: wk.o }); put(S.wg, { s: g.ws * wk.s, x: (1 - wk.s) * g.ww * g.ws * 0.5, y: (1 - wk.s) * g.wh * g.ws * 0.4 });
      draw(t, S.wbox, open + 0.2, open + 1.0); write(t, S.wFoot, open + 0.9, 0.7);
      draw(t, S.inside, Wd('e3', 'without') - 0.2, Wd('e3', 'app') + 0.3, shut - 0.6, shut); write(t, S.insideT, Wd('e3', 'leaving'), 1.0, shut - 0.2);
      // widget states swap: each erases (draws back) before the next draws on
      const s1 = [open + 0.5, e('e2') - 0.2], s2 = [e('e2') - 0.5, e('e3') + 0.05], s3 = [e('e3') - 0.4, shut];
      const W1 = S.w1;
      write(t, W1.t, s1[0], 0.6, s1[1] - 0.5, s1[1] - 0.15); draw(t, W1.f, s1[0] + 0.3, s1[0] + 0.9, s1[1] - 0.5, s1[1]);
      write(t, W1.v, Wd('e1', 'type') - 0.2, 0.9, s1[1] - 0.5, s1[1] - 0.15);
      draw(t, W1.btn, s1[0] + 0.6, s1[0] + 1.2, s1[1] - 0.5, s1[1]); write(t, W1.bt, s1[0] + 1.0, 0.4, s1[1] - 0.5, s1[1] - 0.15);
      const cont = Wd('e1', 'once') + 0.2, onC = beatAt(t) >= cont && beatAt(t) < cont + 0.5;
      put(W1.fill, { o: onC ? 1 : 0 }); put(W1.bt, { css: { color: onC ? COL.paper : COL.ink } });
      const W2 = S.w2, mg = Wd('e2', 'managed'), e3 = e('e3');
      write(t, W2.t, s2[0] + 0.35, 0.6, e3 - 0.35, e3 - 0.1);
      W2.shops.forEach((Dr, i) => draw(t, Dr, s2[0] + 0.3 + i * 0.15, s2[0] + 0.9 + i * 0.15, e3 - 0.4, e3, i === 3 || beatAt(t) < mg ? COL.ink : COL.soft));
      // the lens sweeps along the storefronts and stops on the one that manages this domain
      const lxp = trk(t, [[0, g.lx + 20], [s2[0] + 0.8, g.lx + 110, 'default'], [s2[0] + 1.6, g.lx + 200, 'default'], [s2[0] + 2.4, g.lx + 290, 'default'], [s2[0] + 3.1, g.lx + 290 + 18, 'default']]);
      draw(t, W2.lens, s2[0] + 0.4, s2[0] + 0.9, e3 - 0.4, e3);
      S.lensWrap.setAttribute('transform', `translate(${lxp.toFixed(1)}, 120)`);
      draw(t, W2.found, mg - 0.4, mg + 0.1, e3, e3 + 0.45); write(t, W2.ft, mg, 0.4, e3, e3 + 0.35);
      draw(t, W2.fc, mg + 0.45, mg + 0.7, e3, e3 + 0.45);
      const W3 = S.w3;
      draw(t, W3.cl, e3 - 0.05, e3 + 0.4, s3[1] - 0.5, s3[1]); write(t, W3.t, e3 + 0.05, 0.6, s3[1]);
      draw(t, W3.e, e3 + 0.15, e3 + 0.55, s3[1] - 0.5, s3[1]); draw(t, W3.p, e3 + 0.3, e3 + 0.7, s3[1] - 0.5, s3[1]);
      write(t, W3.ev, Wd('e3', 'they') - 0.6, 0.8, s3[1]); write(t, W3.pv, Wd('e3', 'they'), 0.5, s3[1]);
      draw(t, W3.btn, e3 + 0.5, e3 + 0.9, s3[1] - 0.5, s3[1]); write(t, W3.bt, e3 + 0.7, 0.3, s3[1]);
      const sg = Wd('e3', 'sign'), onS = beatAt(t) >= sg && beatAt(t) < sg + 0.5;
      put(W3.fill, { o: onS ? 1 : 0 }); put(W3.bt, { css: { color: onS ? COL.paper : COL.ink } });
      write(t, W3.q, Wd('e3', 'provider'), 0.6, s3[1]); write(t, W3.q2, Wd('e3', 'provider') + 0.4, 0.5, s3[1]);
      draw(t, W3.ab, Wd('e3', 'provider') + 0.2, Wd('e3', 'provider') + 0.7, s3[1] - 0.5, s3[1]); write(t, W3.at, Wd('e3', 'provider') + 0.5, 0.3, s3[1]);
      const ap = Wd('e3', 'approve'), onA = beatAt(t) >= ap && beatAt(t) < ap + 0.5;
      put(W3.afill, { o: onA ? 1 : 0 }); put(W3.at, { css: { color: onA ? COL.paper : COL.ink } });
      draw(t, S.bigCheck, e('e4') - 0.1, e('e4') + 0.6, s3[1] - 0.5, s3[1]);
      // the cursor drives every press: the app's button, then Continue, Sign in, Allow inside the widget
      const [bx, by, bw, bh] = S.win.btnBox, inW = (yy) => [g.wx + (g.lx + (g.ww - 68) * 0.66) * g.ws, g.wy + yy * g.ws];
      const park = P([g.wx + (g.ww + 70) * g.ws, g.wy + 330 * g.ws], [g.wx + (g.ww - 40) * g.ws, g.wy + (g.wh - 30) * g.ws]);
      const kk = [[0, bx + bw * 0.7 + 140, by + bh + 120], [Wd('e1', 'button') - 1.6, bx + bw * 0.66, by + bh * 0.6], [cont - 1.2, ...inW(232)], [cont + 0.6, ...park], [sg - 1.2, ...inW(280)], [ap - 1.0, ...inW(426)]];
      const cxp = trk(t, kk.map(([bb, X]) => [bb, X, 'heavy'])), cyp = trk(t, kk.map(([bb, , Y]) => [bb, Y, 'heavy']));
      const pr = press(t, Wd('e1', 'button') - 0.1) + press(t, cont) + press(t, sg) + press(t, ap);
      put(S.cur, { o: beatAt(t) > e('e1') + 0.6 && beatAt(t) < e('e4') ? 1 : 0, x: cxp, y: cyp, s: 1 - 0.14 * pr });
      // --- back: the records write themselves, then verify, then HTTPS
      draw(t, S.zone, e('e5') - 0.2, e('e5') + 1.2); write(t, S.zt, e('e5') + 0.6, 0.8);
      const ra = Wd('e5', 'add') - 0.2;
      S.zrows.forEach((r, i) => { const c = Wd('e5', 'records') + i * 0.3; write(t, r.txt, ra + i * 0.6, 0.9); draw(t, r.ln, ra + i * 0.6, ra + i * 0.6 + 0.5); draw(t, r.ck, c - 0.05, c + 0.15); });
      write(t, S.res.txt, Wd('e5', 'check'), 0.6); draw(t, S.res.ck, Wd('e5', 'resolve') - 0.05, Wd('e5', 'resolve') + 0.15);
      draw(t, S.lock, Wd('e5', 'https') - 0.3, Wd('e5', 'https') + 0.05); write(t, S.lockT, Wd('e5', 'https') - 0.1, 0.8);
      write(t, S.byT, Wd('e5', 'records') + 0.4, 1.2);
      // --- live
      draw(t, S.site, e('e6') - 0.4, e('e6') + 1.6); draw(t, S.siteLock, e('e6') + 0.6, e('e6') + 1.0); write(t, S.siteUrl, e('e6') + 0.5, 0.8);
      const lv = grow(t, Wd('e6', 'live'), 'snappy', 0.6); put(S.live, { o: lv.o, s: lv.s });
      draw(t, S.urlRing, Wd('e6', 'correctly') - 0.2, Wd('e6', 'time') + 0.2, Wd('e7', 'keep') - 0.6, Wd('e7', 'keep') - 0.1);
      draw(t, S.loop, Wd('e7', 'keep') - 0.2, Wd('e7', 'way') + 0.6);
      const orb = beatAt(t) > Wd('e7', 'way') + 0.6, ang = (beatAt(t) - Wd('e7', 'way')) * 0.9;
      put(S.orbit, { o: orb ? 1 : 0, x: S.loopC[0] + Math.cos(ang) * S.loopR[0], y: S.loopC[1] + Math.sin(ang) * S.loopR[1] });
      const kc = [Wd('e7', 'hour'), Wd('e7', 'renew'), Wd('e7', 'expire')];
      S.keep.forEach((k, i) => { draw(t, k.ck, kc[i] - 0.05, kc[i] + 0.15); write(t, k.txt, kc[i] - 0.05, 0.7); });
      put(S.root, { x: -W * pan(t, S5_END - 0.4, S5_END + 0.8) });
    },
  });

  // ================================================================ 6. the comparison (f1 → g1)
  const S6_END = V0('g1') - 0.5;
  scene({
    name: 'compare', from: S5_END, to: S6_END, pre: 0.4, post: 0.8,
    build(root, S) {
      S.cap = cap(root, TALL ? ['Seven steps,', 'or *one sign-in.*'] : ['Seven steps, or *one sign-in.*'], PAD, P(150, 280), P(84, 88));
      S.svg = svgIn(root);
      const A = P({ x: 140, y: 420, w: 760 }, { x: 84, y: 560, w: 900 }), B = P({ x: 1020, y: 420, w: 760 }, { x: 84, y: 1060, w: 900 });
      // left: the usual way (jagged), right: with CustomDomain™ (straight)
      const jag = [[0, 120], [90, 30], [150, 200], [230, 60], [300, 230], [370, 20], [440, 180], [520, 70], [590, 230], [660, 120], [720, 160]].map(([x, y]) => [A.x + x * (A.w / 760), A.y + 70 + y * P(1, 0.62)]);
      S.jag = pathEl(S.svg, dOf(handPts(jag, 4, 3)), 4); S.jagL = S.jag.getTotalLength(); S.jag.setAttribute('stroke-dasharray', `${S.jagL} ${S.jagL}`); reg(S.jag, { o: 0 });
      S.jdots = [0, 2, 4, 6, 8, 9, 10].map((i) => box(root, jag[i][0], jag[i][1], `width:20px;height:20px;margin:-10px 0 0 -10px;border:3px solid ${COL.ink};border-radius:50%;background:${COL.paper};box-sizing:border-box`, '', { o: 0 }));
      const sy = B.y + P(185, 120);
      S.str = pathEl(S.svg, `M${B.x},${sy} L${B.x + B.w},${sy}`, 4); S.strL = B.w; S.str.setAttribute('stroke-dasharray', `${B.w} ${B.w}`); reg(S.str, { o: 0 });
      S.sdots = [0, 1 / 3, 2 / 3, 1].map((f, i) => box(root, B.x + B.w * f, sy, `width:22px;height:22px;margin:-11px 0 0 -11px;border:3px solid ${i === 3 ? COL.done : COL.ink};border-radius:50%;background:${i === 3 ? COL.done : COL.ink};box-sizing:border-box`, '', { o: 0 }));
      S.ha = label(root, A.x, A.y, 'The usual way', UI(P(36, 32), 600, COL.muted)); S.hb = label(root, B.x, B.y, 'With CustomDomain™', UI(P(36, 32), 600));
      const statY = (o) => o.y + P(320, 250);
      S.sa = ['7 steps', '2 websites', 'hours of waiting'].map((s, i) => label(root, A.x, statY(A) + i * P(62, 50), s, MONO(P(42, 34), COL.long)));
      S.sb = ['1 sign-in', '0 records to copy', 'minutes to live'].map((s, i) => label(root, B.x, statY(B) + i * P(62, 50), s, MONO(P(42, 34))));
    },
    run(t, b, S) {
      put(S.root, { x: W * (1 - pan(t, S5_END - 0.4, S5_END + 0.8)) - W * pan(t, S6_END - 0.4, S6_END + 0.8), ...push(t, S5_END, S6_END, 0.03) });
      const f1 = V0('f1'), or = Wd('f1', 'or');
      riseP(t, S.cap, TALL ? [f1 - 0.3, or] : [f1 - 0.3], null, { st: 0.07 });
      write(t, S.ha, f1 + 0.2, 0.6);
      const uj = ease.inOut(seg(t, f1 - 0.1, or - 0.3)); put(S.jag, { o: uj > 0.002 ? 1 : 0, css: { strokeDashoffset: (S.jagL * (1 - uj)).toFixed(1) } });
      S.jdots.forEach((d, i) => { const k = grow(t, f1 + 0.4 + i * ((or - f1 - 0.8) / 7), 'snappy', 0.5); put(d, { o: k.o, s: k.s }); });
      S.sa.forEach((e, i) => write(t, e, Wd('f1', 'seven') + 0.6 + i * 0.4, 0.5));
      write(t, S.hb, or, 0.6);
      const us = ease.inOut(seg(t, or + 0.2, or + 1.0)); put(S.str, { o: us > 0.002 ? 1 : 0, css: { strokeDashoffset: (S.strL * (1 - us)).toFixed(1) } });
      S.sdots.forEach((d, i) => { const k = grow(t, or + 0.3 + i * 0.25, 'snappy', 0.5); put(d, { o: k.o, s: k.s }); });
      S.sb.forEach((e, i) => write(t, e, Wd('f1', 'sign-in') + 0.2 + i * 0.4, 0.5));
    },
  });

  // ================================================================ 7. the end card (g1 → done)
  scene({
    name: 'end', from: S6_END, to: 1e6, pre: 0.4,
    build(root, S) {
      S.h = para(root, TALL ? ['Your customers', 'should never', '*touch DNS.*'] : ['Your customers should', 'never *touch DNS.*'], { x: PAD, y: P(170, 430), size: P(140, 150) });
      const ts = P(120, 150), tx = PAD - P(10, 8), ty = P(560, 990);
      S.tree = box(root, tx, ty, `width:${ts}px;height:${ts}px`, `<svg viewBox="0 0 512 512" width="100%" height="100%" style="position:static;overflow:visible"><g class="tf" fill="${COL.ink}"><rect x="238" y="250" width="36" height="150" rx="18"/><g fill="none" stroke="${COL.ink}" stroke-width="26" stroke-linecap="round"><path d="M256 330 L196 372 M256 330 L316 372"/></g>${[[256, 176, 86], [176, 220, 62], [336, 220, 62], [212, 140, 54], [300, 140, 54], [256, 244, 58]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></svg>`, { o: 0 });
      S.word = para(root, ['CustomDomain™'], { x: tx + ts + 10, y: ty + P(14, 24), size: P(96, 108) });
      S.url = label(root, PAD, P(760, 1230), 'customdomain.ai', MONO(P(84, 72)));
      S.svg = svgIn(root); S.under = D(Ln(S.svg, PAD, P(872, 1330), PAD + P(760, 650), P(872, 1330), { sw: 3.4 }));
    },
    run(t, b, S) {
      put(S.root, { x: W * (1 - pan(t, S6_END - 0.4, S6_END + 0.8)), s: 1 + 0.045 * seg(t, S6_END, S6_END + 10), css: { 'transform-origin': '50% 42%' } });   // linear: it never comes to rest
      const g1 = V0('g1'), nv = Wd('g1', 'your');
      const tr = grow(t, S6_END + 0.3, 'heavy', 0.6); put(S.tree, { o: tr.o, s: tr.s, css: { 'transform-origin': '50% 100%' } });
      riseP(t, S.word, [S6_END + 0.35], null, { st: 0 });
      riseP(t, S.h, TALL ? [nv, nv + 0.45, Wd('g1', 'touch') - 0.2] : [nv, Wd('g1', 'never') - 0.1], null, { st: 0.07 });
      write(t, S.url, Wd('g1', 'dns') + 0.8, 1.0);
      draw(t, S.under, Wd('g1', 'dns') + 1.6, Wd('g1', 'dns') + 2.6);
    },
  });

  C.start();
})();
