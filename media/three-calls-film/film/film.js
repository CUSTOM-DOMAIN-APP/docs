// CustomDomain™: "Three Calls". A screencast-style developer demo timed to its voiceover (≈44 s), 16:9 and 9:16.
// The whole integration types itself in three files: a server route that mints a widget token, a click handler that
// opens the widget, and a webhook that hears connection.live. A live preview runs the end user's part (sign in at the
// provider, Allow); the terminal and a status pill show pending → propagating → live, in that order. Monochrome syntax
// (ink, stone greys) in the brand faces; green only when the domain is live. Pure function of time.
(() => {
  const { W, H, FMT, put, reg, el, scene, sp, spHit, trk, trkObj, seg, clamp, lerp, ease, bt, beatAt, beatOf } = C;
  const TALL = FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '400 40px UI', '500 40px UI', '600 40px UI', '400 30px Mono', '500 30px Mono', '600 30px Mono'];
  const COL = { paper: '#fafaf9', ink: '#1c1917', s50: '#f5f5f4', s100: '#f0efed', s200: '#e7e5e4', s300: '#d6d3d1', s400: '#a8a29e', s500: '#78716c', s600: '#57534e', s700: '#44403c', done: '#16a34a' };
  const HIT = 1 / 60;
  const VOW = window.VOW || {};
  const V0 = (id) => beatOf('vo_' + id), V1 = (id) => beatOf('vo_' + id + '_end');
  const Wd = (id, word, n = 0) => { const ws = (VOW[id] || []).filter((w) => w[0] === word); return ws.length ? ws[Math.min(n, ws.length - 1)][1] : V0(id); };
  const o4 = (k) => (k > 0.015 ? 1 : 0);
  const grow = (t, b, p = 'snappy', from = 0.86) => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), s: from + (1 - from) * k }; };
  const press = (t, b) => { const d = beatAt(t) - b; return d >= 0 && d < 0.5 ? Math.sin(Math.PI * d / 0.5) : 0; };
  const win = (t, b0, b1, p = 'snappy') => clamp(sp(t, b0, p) - sp(t, b1, p));   // 0 → 1 → 0, sprung

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
  function label(parent, x, y, text, css = '') { const e = box(parent, x, y, `white-space:pre;${css}`, ''); e._full = text; return e; }
  function write(t, e, b0, dur = null, gone = 1e9) {
    const d = dur ?? Math.max(0.25, e._full.length * 0.02);
    const n = beatAt(t) >= gone ? 0 : Math.round(seg(t, b0, b0 + d) * e._full.length);
    put(e, { text: e._full.slice(0, n) });
  }
  const UI = (px, w = 500, c = COL.ink) => `font:${w} ${px}px UI;color:${c};`;
  const MONO = (px, c = COL.ink, w = 400) => `font:${w} ${px}px Mono;color:${c};`;
  // Cloudflare's own mark (assets/logos/cloudflare.svg), inked to fit the brand's monochrome
  const CF = (h) => `<svg height="${h}" viewBox="-2.769 -2.769 29.538 29.538" style="position:static;vertical-align:middle"><path fill="${COL.ink}" d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727"/></svg>`;

  // ---------------------------------------------------------------- code: a tiny monochrome tokenizer (weight and grey, no hues)
  const KW = new Set(['const', 'await', 'import', 'from', 'if', 'return', 'async', 'export', 'function', 'new', 'true', 'false']);
  const STY = { kw: `color:${COL.ink};font-weight:600`, str: `color:${COL.s600}`, com: `color:${COL.s400};font-style:italic`, key: `color:${COL.ink};font-weight:500`,
    pun: `color:${COL.s500}`, num: `color:${COL.s700}`, id: `color:${COL.ink}` };
  function tokens(line) {
    const out = []; let i = 0;
    const push = (t, c) => { if (t) out.push({ t, c }); };
    while (i < line.length) {
      const r = line.slice(i); let m;
      if ((m = r.match(/^\/\/.*/))) { push(m[0], 'com'); i += m[0].length; continue; }
      if ((m = r.match(/^("[^"]*"|`[^`]*`)/))) { push(m[0], 'str'); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-z_$][\w$]*(?=\s*:)/)) && !KW.has(m[0])) { push(m[0], 'key'); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-z_$][\w$]*/))) { push(m[0], KW.has(m[0]) ? 'kw' : 'id'); i += m[0].length; continue; }
      if ((m = r.match(/^\d+/))) { push(m[0], 'num'); i += m[0].length; continue; }
      if ((m = r.match(/^\s+/))) { push(m[0], 'id'); i += m[0].length; continue; }
      push(r[0], 'pun'); i += 1;
    }
    return out;
  }
  // every line ≤ 49 characters, so 28 px code fits a 9:16 phone with room to spare. "pre" lines are already in the file
  // when it opens (the developer fills in the body), so typing stays under ~46 characters a second
  const FILES = [
    { name: 'server.ts', focus: 5, pre: [0, 1, 2, 3, 13], code: [
      'const API = "https://app.customdomain.ai/api";',
      'const KEY = process.env.CUSTOMDOMAIN_API_KEY;',
      'app.post("/token", auth, express.json(),',
      '  async (req, res) => {',
      '  const { domain } = req.body;',
      '  const r = await fetch(`${API}/widget-token`, {',
      '    method: "POST",',
      '    headers: { Authorization: `Bearer ${KEY}`,',
      '      "Content-Type": "application/json" },',
      '    body: JSON.stringify({ domain }),',
      '  });',
      '  if (!r.ok) return res.sendStatus(502);',
      '  res.json(await r.json());',
      '});',
    ] },
    { name: 'connect.tsx', focus: 6, pre: [0, 1, 2, 3, 10, 11], code: [
      'import { customdomain } from "customdomain-js";',
      'import { api } from "./api"; // your fetch helper',
      '',
      'export function Connect({ domain }) {',
      '  const run = async () => {',
      '    const t = await api("/token", { domain });',
      '    customdomain.open({ token: t.token, domain,',
      '      applicationId: t.application_id,',
      '      onSuccess: () => location.reload() });',
      '  };',
      '  return <button onClick={run}>Connect</button>;',
      '}',
    ] },
    { name: 'webhooks.ts', focus: 4, live: 8, scroll: 4, pre: [0, 1, 2, 10], code: [
      'app.post("/webhooks/customdomain",',
      '  express.raw({ type: "application/json" }),',
      '  (req, res) => {',
      '    const sig = req.get("X-JE-Signature");',
      '    if (!verify(req.body, sig)) // sha256=…',
      '      return res.sendStatus(401);',
      '    const event = JSON.parse(req.body);',
      '    if (event.type === "connection.live")',
      '      markLive(event.domain); // acme.shop',
      '    res.sendStatus(200);',
      '  });',
    ] },
  ];
  function codeBlock(parent, file, x, y, fs, lh, gutter) {
    const lines = file.code.map((src, li) => {
      const row = box(parent, x, y + li * lh, `height:${lh}px;width:2000px;white-space:pre;font:400 ${fs}px Mono`, '');
      const num = gutter ? box(row, -gutter, 0, `width:${gutter - 16}px;text-align:right;${MONO(fs * 0.78, COL.s300)}line-height:${lh}px`, String(li + 1)) : null;
      const span = el('span', { style: `position:absolute;left:0;top:0;line-height:${lh}px` }, row);
      const toks = tokens(src).map((tk) => { const s = el('span', { style: STY[tk.c] }, span); reg(s); return { s, t: tk.t }; });
      return { row, num, toks, len: src.length };
    });
    return { lines };
  }
  const weightsOf = (f) => f.code.map((l, i) => ((f.pre || []).includes(i) ? 0 : l.length + 5));
  const firstTyped = (f) => f.code.findIndex((_, i) => !(f.pre || []).includes(i));
  // the beat at which line li of file f is fully typed, for typing window [b0, b1]
  function lineDone(f, li, b0, b1) { const w = weightsOf(f), s = w.reduce((a, b) => a + b, 0); let acc = 0; for (let i = 0; i <= li; i++) acc += w[i]; return b0 + (b1 - b0) * (Math.max(0, acc - 5) / s); }
  function typeCode(t, f, blk, b0, b1) {
    const w = weightsOf(f), wsum = w.reduce((a, b) => a + b, 0);
    const u = seg(t, b0, b1) * wsum; let acc = 0, caret = null;
    blk.lines.forEach((l, li) => {
      const pre = !w[li], local = pre ? 1e9 : clamp((u - acc) / w[li]) * w[li]; acc += w[li];
      let n = Math.min(l.len, Math.floor(local));
      if (l.num) put(l.num, { o: local > 0 ? 1 : 0 });
      l.toks.forEach((tk) => { const k = Math.min(tk.t.length, Math.max(0, n)); put(tk.s, { text: tk.t.slice(0, k) }); n -= tk.t.length; });
      if (!pre && local > 0 && local < w[li]) caret = [li, Math.min(l.len, Math.floor(local))];
    });
    return caret;
  }

  // ---------------------------------------------------------------- beats (from the voice); typing ≤ ~50 characters a second
  const BT = {
    tabs: Wd('a1', 'three') - 0.2, one: V0('b1'), two: V0('c1'), three: V0('d1'),
    type1: [2.0, V1('b1') - 0.2], type2: [V1('b1') + 1.0, V0('c2') - 0.15], type3: [V1('c2') + 0.15, V0('d2') + 0.6],
    open: V0('c2') + 0.1, signin: Wd('c2', 'signs') + 0.2, approve: Wd('c2', 'approves') + 0.1,
    prop: Wd('d2', 'records'), hook: Wd('d2', 'care') - 1.1, live: Wd('d2', 'care') + 0.5,
    fan: V0('e1') - 0.6, end: V0('f1') - 0.4,
  };
  BT.popOpen = BT.signin + 0.4; BT.popShut = BT.approve + 0.5; BT.wShut = BT.approve + 1.1;
  window.BT = BT;   // read by the sound plan's check (and handy when debugging)

  // ---------------------------------------------------------------- layout per format
  const L = TALL
    ? { cap: [84, 286, 66], ed: [40, 440, 1000, 710], fs: 28, lh: 44, gut: 44, pv: [40, 1160, 1000, 460], tm: [40, 1160, 1000, 460], pill: 36, ban: 36, tfs: 30, tlh: 42 }
    : { cap: [120, 66, 72], ed: [110, 200, 1060, 734], fs: 28, lh: 46, gut: 58, pv: [1210, 200, 600, 430], tm: [1210, 660, 600, 240], pill: 28, ban: 30, tfs: 24, tlh: 36 };
  const CODE_Y = 80;

  scene({
    name: 'demo', from: 0, to: BT.end + 0.1, post: 0.6,
    build(root, S) {
      root.style.background = COL.paper;
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:0 0`);
      // --- the editor
      const [ex, ey, ew, eh] = L.ed;
      S.ed = box(S.world, ex, ey, `width:${ew}px;height:${eh}px;background:${COL.paper};border:2px solid ${COL.s300};border-radius:16px;box-sizing:border-box;overflow:hidden`);
      box(S.ed, 0, 0, `width:${ew}px;height:56px;border-bottom:2px solid ${COL.s200};box-sizing:border-box`, [0, 1, 2].map((i) => `<span style="position:absolute;left:${22 + i * 22}px;top:21px;width:12px;height:12px;border-radius:50%;border:2px solid ${COL.s300};box-sizing:border-box"></span>`).join(''));
      S.tabs = FILES.map((f, i) => {
        const tx = 100 + i * 214;
        return { tab: box(S.ed, tx, 0, `width:200px;height:56px;${MONO(20, COL.s400)}line-height:56px;text-align:center`, f.name, { o: 0 }),
          bar: box(S.ed, tx + 22, 52, `width:156px;height:3px;background:${COL.ink};border-radius:2px`, '', { o: 0 }) };
      });
      S.hl = box(S.ed, 0, 0, `width:${ew}px;height:${L.lh}px;background:${COL.s100}`, '', { o: 0 });
      S.code = FILES.map((f) => { const c = box(S.ed, 0, 0, `width:${ew}px;height:${eh}px`, '', { o: 0 }); return { wrap: c, blk: codeBlock(c, f, L.gut + 26, CODE_Y, L.fs, L.lh, L.gut + 26) }; });
      S.caret = box(S.ed, 0, 0, `width:3px;height:${L.lh - 14}px;background:${COL.ink};border-radius:1px`, '', { o: 0 });
      // --- the preview: the app the developer is building
      const [px, py, pw, ph] = L.pv, k = P(1, 1.55);
      S.pv = box(S.world, px, py, `width:${pw}px;height:${ph}px;background:${COL.paper};border:2px solid ${COL.s300};border-radius:14px;box-sizing:border-box;overflow:hidden`, '', { o: 0 });
      box(S.pv, 0, 0, `width:${pw}px;height:${44 * k}px;border-bottom:2px solid ${COL.s200};box-sizing:border-box`, `<span style="position:absolute;left:18px;top:${9 * k}px;padding:3px 12px;border:1.5px solid ${COL.s200};border-radius:6px;${MONO(13 * k, COL.s500)}">app.yourplatform.com/settings/domains</span>`);
      box(S.pv, 28, 66 * k, UI(15 * k, 500, COL.s500), 'Settings / Domains');
      box(S.pv, 28, 90 * k, UI(24 * k, 600), 'Custom domain');
      S.pvBtn = box(S.pv, 28, 136 * k, `width:${190 * k}px;height:${44 * k}px;border-radius:8px;background:${COL.ink};${UI(17 * k, 600, COL.paper)}line-height:${44 * k}px;text-align:center`, 'Connect');
      // the widget (a sandboxed iframe in the real thing)
      const wx = P(250, 470), wy = 58 * k, ww = P(320, 450), wh = ph - 76 * k, wf = P(1, 1.5);
      S.wg = box(S.pv, wx, wy, `width:${ww}px;height:${wh}px;background:${COL.paper};border:2px solid ${COL.ink};border-radius:12px;box-sizing:border-box;transform-origin:50% 30%`, '', { o: 0 });
      S.w = {
        title: box(S.wg, 20, 16 * wf, UI(17 * wf, 600), 'Connect acme.shop'),
        found: box(S.wg, 20, 52 * wf, `display:flex;align-items:center;gap:8px;${UI(15 * wf, 500, COL.s600)}`, `${CF(18 * wf)}Managed at Cloudflare`, { o: 0 }),
        signin: box(S.wg, 20, 92 * wf, `width:${ww - 44}px;height:${40 * wf}px;border-radius:8px;background:${COL.ink};${UI(15 * wf, 600, COL.paper)}line-height:${40 * wf}px;text-align:center`, 'Sign in with Cloudflare', { o: 0 }),
        wait: box(S.wg, 20, 150 * wf, `width:${ww - 44}px;${UI(14 * wf, 500, COL.s600)}line-height:1.35`, 'Approved. Connecting acme.shop…', { o: 0 }),
        foot: box(S.wg, 0, wh - 28 * wf, `width:${ww}px;text-align:center;${UI(11 * wf, 500, COL.s400)}`, 'Powered by CustomDomain™'),
      };
      // the provider's own sign-in page, in a popup over the app (consent happens there, not in the widget)
      const qx = P(140, 120), qy = 92 * k, qw = P(330, 640), qh = P(250, 330);
      S.pop = box(S.pv, qx, qy, `width:${qw}px;height:${qh}px;background:${COL.paper};border:2px solid ${COL.s500};border-radius:10px;box-sizing:border-box;overflow:hidden;transform-origin:50% 20%`, '', { o: 0 });
      box(S.pop, 0, 0, `width:${qw}px;height:${34 * wf}px;border-bottom:2px solid ${COL.s200};box-sizing:border-box;background:${COL.s50}`, `<span style="position:absolute;left:14px;top:${8 * wf}px;${MONO(12 * wf, COL.s500)}">dash.cloudflare.com/oauth</span>`);
      box(S.pop, 18, 46 * wf, `display:flex;align-items:center;gap:10px;${UI(15 * wf, 600)}`, `${CF(22 * wf)}Cloudflare`);
      box(S.pop, 18, 82 * wf, `width:${qw - 36}px;${UI(14 * wf, 500, COL.s700)}line-height:1.35`, 'Allow CustomDomain™ to edit DNS for acme.shop?');
      box(S.pop, 18, qh - 56 * wf, `width:${qw - 36}px;height:${38 * wf}px;border-radius:8px;border:2px solid ${COL.ink};box-sizing:border-box;${UI(15 * wf, 600)}line-height:${34 * wf}px;text-align:center`, 'Allow');
      S.popBtnF = box(S.pop, 18, qh - 56 * wf, `width:${qw - 36}px;height:${38 * wf}px;border-radius:8px;background:${COL.ink};${UI(15 * wf, 600, COL.paper)}line-height:${38 * wf}px;text-align:center`, 'Allow', { o: 0 });
      S.geo = { wx: px + wx, wy: py + wy, ww, wf, qx: px + qx, qy: py + qy, qw, qh, k };
      // the result in the app: a status pill pending → propagating → live, then a banner
      S.pill = box(S.pv, 28, P(206, 318), `display:flex;align-items:center;gap:12px;padding:${P(7, 12)}px ${P(14, 22)}px;border-radius:999px;border:2px solid ${COL.s300};${MONO(L.pill, COL.ink)}`, '', { o: 0 });
      S.pillDot = el('span', { style: `width:${L.pill * 0.5}px;height:${L.pill * 0.5}px;border-radius:50%;background:${COL.s400}` }, S.pill); reg(S.pillDot);
      S.pillT = el('span', {}, S.pill); reg(S.pillT);
      S.ban = box(S.pv, 30, P(268, 318 + L.pill * 1.9), `display:flex;align-items:center;gap:12px;${UI(L.ban, 600, COL.done)}`, `<svg width="${L.ban}" height="${L.ban}" viewBox="0 0 20 20" style="position:static"><circle cx="10" cy="10" r="9" fill="${COL.done}"/><path d="M5.5 10.5l3 3 6-7" fill="none" stroke="${COL.paper}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>acme.shop is live`, { o: 0 });
      S.cur = box(S.world, 0, 0, 'z-index:5', `<svg width="${26 * P(1, 1.4)}" height="${34 * P(1, 1.4)}" viewBox="0 0 24 31" style="position:static;overflow:visible"><path d="M2 2v23.5l6.2-6 4.2 9.6 4.3-1.9-4.2-9.4h8.6z" fill="${COL.paper}" stroke="${COL.ink}" stroke-width="2" stroke-linejoin="round"/></svg>`, { o: 0 });
      // --- the terminal (stone, not inverted: inverted panels are the brand's error style)
      const [tx2, ty2, tw, th] = L.tm;
      S.tm = box(S.world, tx2, ty2, `width:${tw}px;height:${th}px;background:${COL.s50};border:2px solid ${COL.s300};border-radius:14px;box-sizing:border-box;overflow:hidden;transform-origin:50% 0`, '', { o: 0 });
      box(S.tm, 18, 10, MONO(P(14, 20), COL.s400, 500), 'terminal');
      const tl = (lines, y0) => lines.map((s, i) => label(S.tm, 22, y0 + i * L.tlh, s, MONO(L.tfs, i ? COL.s700 : COL.ink, i ? 400 : 600)));
      S.out1 = tl(['› POST /token → widget-token', '{ "token": "wt_3fQ…9xk",', '  "application_id": "app_7Hq2",', '  "expires_in": 900,', '  "token_type": "Bearer" }'], P(40, 54));
      S.out2 = tl(['› POST /webhooks/customdomain   200', '  type                connection.live', '  domain              acme.shop', '  provider            cloudflare', '  propagation_status  success'], P(40, 54));
      // --- the outro: the three files side by side, each with the number of lines it really has
      S.fan = FILES.map((f, i) => {
        const cw = P(560, 960), chh = P(520, 372), cx = P(100 + i * 580, 60), cy = P(300, 470 + i * 380), fs = 15, lh = P(32, 22);
        const c = box(root, cx, cy, `width:${cw}px;height:${chh}px;background:${COL.paper};border:2px solid ${COL.s300};border-radius:14px;box-sizing:border-box;overflow:hidden;transform-origin:50% 0`, '', { o: 0 });
        box(c, 20, 14, MONO(P(17, 18), COL.s600, 600), `${i + 1}   ${f.name}`);
        box(c, cw - P(120, 130), 14, MONO(P(17, 18), COL.s400), `${f.code.length} lines`);
        const blk = codeBlock(c, f, 24, 54, fs, lh, 0);
        blk.lines.forEach((l) => l.toks.forEach((tk) => { tk.s.textContent = tk.t; }));
        return { c };
      });
      // --- captions (screen space), over a paper header band in 16:9 so zoomed code passes cleanly beneath them
      if (!TALL) box(root, 0, 0, `width:${W}px;height:160px;background:${COL.paper};border-bottom:2px solid ${COL.s200};box-sizing:border-box`);
      const [cx0, cy0, cs] = L.cap;
      S.capA = para(root, TALL ? ['The whole integration.', '*Three calls.*'] : ['The whole integration. *Three calls.*'], { x: cx0, y: cy0, size: cs });
      S.chap = ['1 · Mint a widget token', '2 · Open the widget', '3 · Hear when it’s live'].map((s) => para(root, [s], { x: cx0, y: cy0, size: cs }));
      S.capU = para(root, TALL ? ['Your customer: sign in,', 'Allow. *That’s their job.*'] : ['Your customer: sign in, Allow. *That’s their job.*'], { x: cx0, y: cy0, size: cs });
      S.capE = para(root, TALL ? ['No DNS code.', '*No certificate code.*', 'Just three calls.'] : ['No DNS code. *No certificate code.*', 'Just three calls.'], { x: cx0, y: P(110, 200), size: P(80, 76) });
    },
    run(t, b, S) {
      const [ex, ey] = L.ed, typ = [BT.type1, BT.type2, BT.type3];
      const lv = grow(t, BT.live, 'snappy', 0.8), liveOn = lv.o === 1;
      // camera (16:9): one zoom per file, landing once its key line is typed and holding; a push-in on the app for the
      // customer's part and for the result. 9:16 holds still (a zoom would crop code at phone width).
      const REST = { x: W / 2, y: H / 2, s: 1 };
      const fz = (i, li) => { const ln = FILES[i].code[li]; return { x: ex + L.gut + 26 + (ln.length * L.fs * 0.6) / 2, y: ey + CODE_Y + li * L.lh + L.lh / 2, s: 1.8 }; };
      const [px, py, pw, ph] = L.pv, [, ty2, , th] = L.tm;
      const PVZ = { x: px + pw / 2, y: py + ph / 2, s: 1.6 }, RES = { x: 1000, y: 560, s: 1.15 };
      const dz = FILES.map((f, i) => lineDone(f, f.focus - 1, ...typ[i]) - 0.3);
      const keys = TALL ? [[0, REST]] : [[0, REST],
        [dz[0], fz(0, FILES[0].focus), { response: 1.3, damping: 1 }], [lineDone(FILES[0], 10, ...typ[0]), { ...fz(0, FILES[0].focus), y: fz(0, 10).y }, { response: 1.0, damping: 1 }], [typ[0][1] + 0.3, REST, { response: 1.2, damping: 1 }],
        [dz[1], fz(1, FILES[1].focus), { response: 1.3, damping: 1 }], [BT.open - 0.5, PVZ, { response: 1.2, damping: 1 }],
        [BT.wShut + 0.6, REST, { response: 1.2, damping: 1 }], [dz[2], fz(2, FILES[2].focus), { response: 1.3, damping: 1 }],
        [Math.max(BT.prop - 0.5, typ[2][1] + 0.2), RES, { response: 1.2, damping: 1 }]];
      const cam = trkObj(t, keys);
      cam.s *= 1 + 0.015 * Math.sin(b * 0.17);
      if (!TALL) cam.s *= 1 + 0.06 * ease.inOut(seg(t, BT.live - 0.6, BT.fan - 0.5));
      const ex2 = ease.inOut(seg(t, BT.fan - 0.5, BT.fan));      // the world slides away just before the file cards rise
      put(S.world, { x: W / 2 - cam.x * cam.s, y: H / 2 - cam.y * cam.s + ex2 * H * 0.7, s: cam.s, o: ex2 >= 1 ? 0 : 1 });
      // which file is open, typing, caret, focus highlight
      const fileAt = b < BT.type2[0] - 0.3 ? 0 : b < BT.type3[0] - 0.3 ? 1 : 2;
      S.tabs.forEach((tb, i) => { const on = b >= BT.tabs + i * 0.25 || i === 0; put(tb.tab, { o: on ? 1 : 0, css: { color: i === fileAt ? COL.ink : COL.s400, fontWeight: i === fileAt ? 600 : 400 } }); put(tb.bar, { o: i === fileAt ? 1 : 0 }); });
      let caret = null;
      S.code.forEach((c, i) => { put(c.wrap, { o: i === fileAt ? 1 : 0 }); const cr = typeCode(t, FILES[i], c.blk, ...typ[i]); if (i === fileAt) caret = cr; });
      // 9:16 result: the editor shortens to the webhook's key lines, the terminal and the app move up beneath it
      const rr = TALL ? clamp(sp(t, BT.hook - 0.3, 'default')) : 0, scr = rr * (FILES[2].scroll || 0) * L.lh;
      if (TALL) { put(S.code[2].wrap, { y: -scr, clip: `inset(${(rr > 0.001 ? CODE_Y - 4 + scr : 56).toFixed(1)}px 0 0 0)` }); put(S.ed, { clip: `inset(0 0 ${(rr * (L.ed[3] - (CODE_Y + 5 * L.lh + 4))).toFixed(1)}px 0 round 16px)` }); }
      const f0 = FILES[fileAt], ft = firstTyped(f0);
      if (b < typ[fileAt][0]) {      // before typing: the caret waits at the first line to be typed
        put(S.hl, { o: 1, y: CODE_Y + ft * L.lh }); put(S.caret, { o: Math.floor(b * 2) % 2 === 0 ? 1 : 0, x: L.gut + 26, y: CODE_Y + ft * L.lh + 7 });
        put(S.code[fileAt].blk.lines[ft].num, { o: 1 });
      } else if (caret) {
        const [li, n] = caret; put(S.hl, { o: 1, y: CODE_Y + li * L.lh }); put(S.caret, { o: 1, x: L.gut + 26 + n * L.fs * 0.6, y: CODE_Y + li * L.lh + 7 });
      } else {
        const lit = fileAt === 2 && liveOn, li = lit ? f0.live : f0.focus;   // after typing: the key line stays lit (markLive once live)
        const yo = fileAt === 2 ? scr : 0;
        put(S.hl, { o: 1, y: CODE_Y + li * L.lh - yo, css: { background: lit ? '#dcfce7' : COL.s100 } });
        put(S.caret, { o: 0 });
      }
      // --- panels. 16:9: preview and terminal sit beside the editor. 9:16: one slot below the editor alternates (app →
      // terminal → app), and for the result the terminal takes the editor's slot so both are on screen
      const t1 = typ[0][1] - 0.4;
      if (TALL) {
        // the token's terminal slides up over the app like a sheet, clipped at the slot's bottom edge, then back down
        const sh = clamp(win(t, t1, BT.open - 0.8)), slot = L.tm[3], dy = slot * (1 - sh);
        put(S.pv, { o: 1, y: (1075 - L.pv[1]) * (TALL ? clamp(sp(t, BT.hook - 0.6, 'default')) : 0) });   // the app rises first, then the terminal
        if (rr > 0.001) put(S.tm, { o: 1, y: (780 - L.tm[1]) * rr, css: { height: `${lerp(slot, 280, rr).toFixed(1)}px` } });
        else put(S.tm, { o: sh > 0.01 ? 1 : 0, y: dy, clip: `inset(0 0 ${dy.toFixed(1)}px 0)` });
      } else {
        const pk = grow(t, 0.4, 'default', 0.96), tk = grow(t, t1 - 0.2, 'default', 0.96);
        put(S.pv, { o: pk.o, s: pk.s }); put(S.tm, { o: tk.o, s: tk.s });
      }
      S.out1.forEach((e, i) => write(t, e, t1 + i * 0.12, 0.35, BT.hook - 0.4));
      S.out2.forEach((e, i) => write(t, e, BT.hook + i * 0.14, 0.35));
      // --- the end user's part: the widget, the provider's popup, Allow
      put(S.pvBtn, { css: { background: b >= BT.open - 0.15 && b < BT.open + 0.2 ? COL.s700 : COL.ink } });
      const wk = grow(t, BT.open + 0.1, 'default', 0.92); put(S.wg, { o: wk.o && b < BT.wShut ? 1 : 0, s: wk.s });
      put(S.w.found, { o: b >= BT.open + 0.6 ? 1 : 0 }); put(S.w.signin, { o: b >= BT.open + 0.9 ? 1 : 0, s: 1 - 0.04 * press(t, BT.signin) });
      put(S.w.wait, { o: b >= BT.popShut ? 1 : 0 });
      const pk2 = grow(t, BT.popOpen, 'default', 0.9); put(S.pop, { o: pk2.o && b < BT.popShut ? 1 : 0, s: pk2.s });
      put(S.popBtnF, { o: b >= BT.approve && b < BT.popShut ? 1 : 0 });
      const g = S.geo;
      const kk = [[0, px + 140 * g.k, py + 165 * g.k], [BT.open - 1.6, px + 140 * g.k, py + 165 * g.k], [BT.signin - 0.9, g.wx + g.ww * 0.62, g.wy + 112 * g.wf],
        [BT.approve - 0.9, g.qx + g.qw * 0.62, g.qy + g.qh - 36 * g.wf], [BT.approve + 1.4, g.qx + g.qw + 40, g.qy + g.qh + 40]];
      const curx = trk(t, kk.map(([bb, x]) => [bb, x, 'heavy'])), cury = trk(t, kk.map(([bb, , y]) => [bb, y, 'heavy']));
      put(S.cur, { o: b >= BT.open - (TALL ? 0.6 : 1.7) && b < BT.wShut ? 1 : 0, x: curx, y: cury, s: 1 - 0.14 * (press(t, BT.open - 0.15) + press(t, BT.signin) + press(t, BT.approve)) });
      // status: pending once Allowed, propagating on "records", the webhook lands, then live (in that order)
      const st = b < BT.wShut ? null : b < BT.prop ? 'pending' : !liveOn ? 'propagating' : 'live';
      put(S.pill, { o: st ? 1 : 0, css: { borderColor: st === 'live' ? COL.done : COL.s300 } });
      put(S.pillDot, { css: { background: st === 'live' ? COL.done : st === 'propagating' ? COL.s600 : COL.s400 } });
      put(S.pillT, { text: st ? `acme.shop · ${st}` : '' });
      put(S.ban, { o: lv.o, s: lv.s });
      // --- captions: each comes in only after the one before has cleared
      const out = (b0) => b0 - 0.5;
      riseP(t, S.capA, TALL ? [-0.6, Wd('a1', 'three') - 0.2] : [-0.6], out(BT.one), { st: 0.06 });
      riseP(t, S.chap[0], [BT.one], out(BT.two), { st: 0.05 });
      riseP(t, S.chap[1], [BT.two], out(BT.open), { st: 0.05 });
      riseP(t, S.capU, TALL ? [BT.open, Wd('c2', 'approves') - 0.3] : [BT.open], out(BT.three), { st: 0.05 });
      riseP(t, S.chap[2], [BT.three], out(BT.fan), { st: 0.05 });
      // --- the outro: the editor clears first, then three file cards rise side by side
      S.fan.forEach((F, i) => { const k = grow(t, BT.fan - 0.1 + i * 0.2, 'default', 0.88); put(F.c, { o: k.o, s: k.s, y: 40 * (1 - k.k) }); });
      if (TALL) riseP(t, S.capE, [V0('e1'), Wd('e1', 'certificate') - 0.3, Wd('e1', 'just') - 0.2], BT.end - 0.2, { st: 0.06 });
      else TYPE.rise(t, S.capE, S.capE.words.map((_, i) => (i < 3 ? V0('e1') + i * 0.06 : i < 6 ? Wd('e1', 'no', 1) - 0.2 + (i - 3) * 0.06 : Wd('e1', 'just') - 0.2 + (i - 6) * 0.06)), BT.end - 0.2);   // "No certificate code." on its own words
    },
  });

  // ================================================================ the end card
  scene({
    name: 'end', from: BT.end, to: 1e6, pre: 0.3,
    build(root, S) {
      root.style.background = COL.paper;
      S.h = para(root, TALL ? ['You never touch', 'their DNS.', '*Or their certificates.*'] : ['You never touch their DNS.', '*Or their certificates.*'], { x: P(120, 84), y: P(130, 520), size: P(104, 100) });
      const ts = P(110, 130), tx = P(110, 76), ty = P(400, 940);
      S.tree = box(root, tx, ty, `width:${ts}px;height:${ts}px;transform-origin:50% 100%`, `<svg viewBox="0 0 512 512" width="100%" height="100%" style="position:static;overflow:visible"><g fill="${COL.ink}"><rect x="238" y="250" width="36" height="150" rx="18"/><g fill="none" stroke="${COL.ink}" stroke-width="26" stroke-linecap="round"><path d="M256 330 L196 372 M256 330 L316 372"/></g>${[[256, 176, 86], [176, 220, 62], [336, 220, 62], [212, 140, 54], [300, 140, 54], [256, 244, 58]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></svg>`, { o: 0 });
      S.word = para(root, ['CustomDomain™'], { x: tx + ts + 10, y: ty + P(12, 18), size: P(88, 96) });
      S.npm = box(root, P(120, 84), P(600, 1200), `padding:18px 28px;border:2px solid ${COL.s300};border-radius:14px;background:${COL.s50};${MONO(P(72, 44), COL.ink)}white-space:nowrap`, `<span style="color:${COL.s400}">$ </span>npm install customdomain-js`, { o: 0 });
      S.docs = label(root, P(120, 84), P(800, 1380), 'docs.customdomain.ai', MONO(P(72, 56), COL.s600));
    },
    run(t, b, S) {
      put(S.root, { s: 1 + 0.05 * seg(t, BT.end, 'done'), css: { 'transform-origin': '30% 40%' } });
      const tr = grow(t, BT.end - 0.35, 'heavy', 0.6); put(S.tree, { o: tr.o, s: tr.s });
      riseP(t, S.word, [BT.end - 0.3], null, { st: 0 });
      riseP(t, S.h, TALL ? [Wd('f1', 'you') - 0.2, Wd('f1', 'their') - 0.2, Wd('f1', 'or') - 0.2] : [Wd('f1', 'you') - 0.2, Wd('f1', 'or') - 0.2], null, { st: 0.06 });
      const nk = grow(t, Wd('f1', 'certificates') + 0.6, 'default', 0.9); put(S.npm, { o: nk.o, s: nk.s });
      write(t, S.docs, Wd('f1', 'certificates') + 1.4, 0.8);
    },
  });

  C.start();
})();
