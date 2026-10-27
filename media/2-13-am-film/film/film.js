// CustomDomain™: "2:13 AM". A screen-life short timed to its voiceover (≈71 s), 16:9 (a laptop desktop) and 9:16 (a phone).
// Everything happens on the support lead's own screen, in real time: a 2 a.m. ticket, a DNS mistake, a queue that keeps
// filling, a message to the team. After "So we shipped Custom Domain" the same screen turns to light mode four weeks
// later: Maya's next domain connects while Sam watches the connection page, and at 2:13 the next night nothing arrives.
// Pure function of time.
(() => {
  const { W, H, FMT, put, reg, el, scene, sp, spHit, trk, trkObj, seg, clamp, lerp, ease, bt, beatAt, beatOf } = C;
  const TALL = FMT === '9x16';
  const P = (wide, tall) => (TALL ? tall : wide);
  C.fonts = ['400 100px Display', 'italic 400 100px Display', '300 40px UI', '400 40px UI', '500 40px UI', '600 40px UI', '700 40px UI', '400 30px Mono', '500 30px Mono'];
  const HIT = 1 / 60;
  const VOW = window.VOW || {};
  const V0 = (id) => beatOf('vo_' + id), V1 = (id) => beatOf('vo_' + id + '_end');
  const Wd = (id, word, n = 0) => { const ws = (VOW[id] || []).filter((w) => w[0] === word); return ws.length ? ws[Math.min(n, ws.length - 1)][1] : V0(id); };
  const o4 = (k) => (k > 0.015 ? 1 : 0);
  const grow = (t, b, p = 'snappy', from = 0.9) => { const k = spHit(t, b, p, HIT); return { k, o: o4(k), s: from + (1 - from) * k }; };
  const press = (t, b) => { const d = beatAt(t) - b; return d >= 0 && d < 0.5 ? Math.sin(Math.PI * d / 0.5) : 0; };
  const DONE = '#16a34a';

  // ---------------------------------------------------------------- the two appearances; every colour is a variable, so
  // night → day is one interpolation of a handful of tokens (an appearance switch, as the OS does it)
  const NIGHT = { desk: '#0c0a09', win: '#1c1917', pane: '#221e1c', line: '#3a3532', fg: '#f5f5f4', muted: '#a8a29e', soft: '#57534e', chip: '#2c2725', inv: '#f5f5f4', invfg: '#1c1917', hi: '#57534e', phone: '#0c0a09', key: '#2f2a27' };
  const DAY = { desk: '#e7e5e4', win: '#fafaf9', pane: '#ffffff', line: '#e2e0de', fg: '#1c1917', muted: '#78716c', soft: '#d6d3d1', chip: '#f0efed', inv: '#1c1917', invfg: '#fafaf9', hi: '#d6d3d1', phone: '#fafaf9', key: '#ffffff' };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, u) => { const A = hex(a), Bq = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, Bq[i], u)).toString(16).padStart(2, '0')).join(''); };
  const V = (k) => `var(--${k})`;

  function box(parent, x, y, css = '', html = '', base = {}) { return reg(el('div', { class: 'abs', style: `left:${x}px;top:${y}px;${css}` }, parent, html), base); }
  function para(parent, lines, o) {
    const size = o.size, lh = o.lh ?? 1.04, R = { words: [], line: [], size, els: [] };
    lines.forEach((txt, li) => {
      const L = el('div', { class: 'line display', style: `left:${o.x}px;top:${o.y + li * size * lh}px;font-size:${size}px;color:${o.color || V('fg')};${o.center ? `width:${o.center}px;text-align:center;` : ''}` }, parent);
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
  const mark = (t, e, b0, dur) => put(e, { css: { background: `linear-gradient(${V('hi')}, ${V('hi')}) no-repeat`, 'background-size': `${(ease.out(seg(t, b0, b0 + dur)) * 100).toFixed(1)}% 100%` } });
  const marker = (t, S) => { mark(t, S.h1, B.hiDays, 0.5); mark(t, S.h2, B.hiLaunch, 0.8); put(S.nc, { o: beatAt(t) >= B.notConn ? 1 : 0 }); };
  const lockKeys = (parent, y, bg) => [120, W - 240].forEach((x) => box(parent, x, y, `width:120px;height:120px;border-radius:50%;background:${bg}`));
  const UI = (px, w = 500, c = V('fg')) => `font:${w} ${px}px UI;color:${c};`;
  const MONO = (px, c = V('fg'), w = 400) => `font:${w} ${px}px Mono;color:${c};`;
  function typed(t, e, text, b0, b1) { const n = Math.round(seg(t, b0, b1) * text.length); put(e, { text: text.slice(0, n) }); return n; }
  const ICON = {
    moon: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="position:static;flex:none"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor"/></svg>`,
    check: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="position:static;flex:none"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    inbox: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="position:static;flex:none"><path d="M3 13l3-8h12l3 8v6H3z M3 13h5l1.5 2.5h5L16 13h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    clock: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="position:static;flex:none"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  };

  // ---------------------------------------------------------------- beats (from the voice)
  const B = {
    toast: 0.6, open: Wd('a1', 'another') + 0.2,
    hiDays: Wd('a2', 'three') - 0.1, hiLaunch: Wd('a2', 'launches') - 0.1, notConn: Wd('a2', 'maya') - 0.1,
    dns: V0('b1') - 0.2, wrong: Wd('b1', 'name') - 0.2, type0: Wd('b1', 'course') - 0.3, type1: V1('b1') - 0.1, send: V1('b1') + 0.3,
    queue: V0('b2') + 0.6, q: [Wd('b2', 'where') - 0.1, Wd('b2', 'which') - 0.1, Wd('b2', 'why') - 0.1], flood: V0('b3') - 0.2,
    chat: Wd('b3', 'all') - 0.5, sam: [Wd('b3', 'all') - 0.1, V1('b3') - 0.2], sent: V1('b3') + 0.1, priya: Wd('c1', 'shipped') - 0.2,
    sw: Math.ceil(V1('c1') + 0.2), day: Wd('d1', 'maya') - 0.3,
    ev: [Wd('d1', 'maya') - 0.2, Wd('d1', 'sign') - 0.3, Wd('d1', 'provider') - 0.2, Wd('d1', 'approve') - 0.2, Wd('d2', 'written') - 0.2, Wd('d2', 'checked') - 0.2, Wd('d3', 'live') - 0.3],
    kept: Wd('d2', 'kept') - 0.2, wait: Wd('d1', 'inside') - 0.3,
    thanks: Wd('d3', 'while') - 0.1, sleep: Math.floor(V0('e1')), pill: V0('e1'), asleep: Wd('e1', 'asleep') - 0.05, end: V0('f1') - 0.4,
  };
  // the night windows stay through the cut to light (the same screen, four weeks later) until the connection page is up
  const nightUI = (b) => b < B.day + 0.4;
  const clockAt = (b) => (b < B.send ? '2:13' : b < B.q[0] - 0.15 ? '2:19' : b < B.q[1] - 0.15 ? '2:20' : b < B.q[2] - 0.15 ? '2:21' : b < B.flood + 0.5 ? '2:22' : b < B.chat ? '2:23' : '2:24');
  const clockFull = (b) => (b < B.sw ? `Tue ${clockAt(b)} AM` : b < B.sleep ? 'Tue 10:24 AM' : 'Wed 2:13 AM');
  const dayU = (t) => { const b = beatAt(t); return b >= B.sw && b < B.sleep ? 1 : 0; };   // cuts on the beat, never a grey dissolve

  // ---------------------------------------------------------------- story content (a fictional platform and people)
  const TICKETS = [
    { id: 4471, who: 'Maya R.', sub: 'My domain isn’t working', at: '2:12' },
    { id: 4472, who: 'Dev P.', sub: 'Where are my DNS settings?', at: '2:20' },
    { id: 4473, who: 'Ola K.', sub: 'Which records do I add?', at: '2:21' },
    { id: 4474, who: 'Jun L.', sub: 'Why does it still say pending?', at: '2:22' },
    { id: 4475, who: 'Rui M.', sub: 'SSL error on my domain', at: '2:22' },
    { id: 4476, who: 'Ana S.', sub: 'Domain not connecting', at: '2:23' },
    { id: 4477, who: 'Tom B.', sub: 'Do I need the www record?', at: '2:23' },
    { id: 4478, who: 'Lia F.', sub: 'It says invalid record', at: '2:23' },
  ];
  const OLD = [{ id: 4466, who: 'Kim H.', sub: 'Still pending after 2 days', at: '1:58' }, { id: 4463, who: 'Sol V.', sub: 'Where do I add a CNAME?', at: '1:31' }, { id: 4459, who: 'Eli N.', sub: 'Domain shows not secure', at: '12:47' },
    { id: 4455, who: 'Noa G.', sub: 'Help with the www record', at: '11:52' }, { id: 4452, who: 'Ivy T.', sub: 'Records not updating', at: '11:20' }, { id: 4448, who: 'Ben A.', sub: 'Is my domain connected?', at: '10:41' }];
  const MSG = 'Hi, I added the records 3 days ago and it still says not connected. We launch tomorrow morning. What am I doing wrong?';
  const REPLY = 'Hi Maya, nearly there. In the Name field, enter just shop. Your provider adds acme.com by itself.';
  const DOM = 'shop.acme.com', BAD = 'shop.acme.com.acme.com', TARGET = 'domains.yourplatform.com';
  const SAM = 'Eleven domain tickets tonight. Not one of them is about our product.';
  const PRIYA = 'Shipped: custom domains now go through CustomDomain™.';
  const OLDMSG = 'Same thing again. The Name field.';
  const EVENTS = ['Maya opened Connect domain', 'Provider found: Cloudflare', 'Maya signed in to Cloudflare', 'Maya approved the change', 'Records written', 'Records checked: both resolve', 'maya.studio is live'];
  const EVT = ['10:24', '10:24', '10:24', '10:25', '10:25', '10:25', '10:25'];
  const RECS = [['CNAME', '@', 'edge.customdomain.ai'], ['CNAME', 'www', 'edge.customdomain.ai']];
  const THANKS = 'Signed in, clicked Allow, and it’s live. That was it?';
  const KB = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const QSUB = ['Where are my DNS settings?', 'Which records do I add?', 'Why does it still say pending?'];

  scene({
    name: 'screen', from: 0, to: B.end + 0.1, post: 0.5,
    build(root, S) {
      Object.entries(NIGHT).forEach(([k, v]) => root.style.setProperty('--' + k, v));
      root.style.background = TALL ? V('phone') : V('desk');
      S.world = box(root, 0, 0, `width:${W}px;height:${H}px;transform-origin:0 0`);
      if (!TALL) buildDesktop(S, S.world); else buildPhone(S, S.world);
      // "Four weeks later": a card on the screen, right after the cut to light
      const lw = P(820, 860), lh = P(220, 220);
      S.later = box(root, (W - lw) / 2, P(430, 1250), `width:${lw}px;height:${lh}px;border-radius:28px;background:#fafaf9;border:2px solid #1c1917;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:400 ${P(104, 100)}px Display;letter-spacing:-0.015em;color:#1c1917;transform-origin:50% 50%`, 'Four weeks later', { o: 0 });
      // the next night: a cut to a quiet lock screen at 2:13, pushing in slowly
      if (!TALL) {
        S.wake = box(root, 0, 0, `width:${W}px;height:${H}px;background:#0c0a09;color:#f5f5f4`);
        box(S.wake, 0, 150, `width:${W}px;text-align:center;font:300 300px UI;letter-spacing:-0.02em`, '2:13');
        box(S.wake, 0, 470, `width:${W}px;text-align:center;${UI(52, 500, '#a8a29e')}`, 'Tuesday');
        S.wakeN = box(S.wake, W / 2 - 520, 610, `width:1040px;padding:34px 44px;border-radius:32px;background:#2c2725;box-sizing:border-box;transform-origin:50% 0`,
          `<div style="${UI(28, 600, '#a8a29e')}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:10px;${UI(46, 700, '#f5f5f4')}">New ticket #4471 · Maya R.</div><div style="margin-top:6px;${UI(46, 500, '#f5f5f4')}">My domain isn’t working</div>`, { o: 0 });
      }
      S.sleep = box(root, 0, 0, `width:${W}px;height:${H}px;background:#0c0a09;color:#f5f5f4;transform-origin:50% 45%`, '', { o: 0 });
      S.sleepClock = box(S.sleep, 0, P(170, 590), `width:${W}px;text-align:center;font:300 ${P(300, 300)}px UI;letter-spacing:-0.02em`, '2:13');
      S.sleepDate = box(S.sleep, 0, P(510, 940), `width:${W}px;text-align:center;${UI(P(52, 52), 500, '#a8a29e')}`, 'Wednesday');
      S.sleepPill = box(S.sleep, W / 2 - P(210, 210), P(640, 1100), `width:420px;height:104px;border-radius:999px;background:#2c2725;display:flex;align-items:center;justify-content:center;gap:18px;${UI(52, 600, '#f5f5f4')}transform-origin:50% 50%`,
        `${ICON.moon(48)}Sleep`, { o: 0 });
      if (TALL) {
        lockKeys(S.sleep, 1660, '#2c2725');
        box(S.sleep, W - 230, 34, 'display:flex;align-items:center;gap:16px;color:#f5f5f4', `<svg width="46" height="30" viewBox="0 0 46 30" style="position:static">${[0, 1, 2, 3].map((i) => `<rect x="${i * 12}" y="${22 - i * 7}" width="8" height="${8 + i * 7}" rx="2" fill="currentColor"/>`).join('')}</svg><svg width="70" height="32" viewBox="0 0 70 32" style="position:static"><rect x="1.5" y="1.5" width="60" height="29" rx="8" fill="none" stroke="currentColor" stroke-width="3" opacity=".5"/><rect x="6" y="6" width="22" height="20" rx="4" fill="currentColor"/></svg>`);
      }
      S.sleepNote = box(S.sleep, 0, P(800, 1270), `width:${W}px;text-align:center;${UI(P(50, 50), 500, '#a8a29e')}`.replace('50px', '60px'), 'No new notifications', { o: 0 });
    },
    run(t, b, S) {
      const u = dayU(t), css = {};
      Object.keys(NIGHT).forEach((k) => { css['--' + k] = mix(NIGHT[k], DAY[k], u); });
      put(S.root, { css });
      if (!TALL) runDesktop(t, b, S); else runPhone(t, b, S);
      if (!TALL) {
        const wn = grow(t, B.toast, 'default', 0.4), up = ease.inOut(seg(t, B.open - 0.75, B.open - 0.1));
        put(S.wakeN, { o: wn.o, s: wn.s, y: -60 * (1 - wn.k) });
        put(S.wake, { o: up < 1 ? 1 : 0, y: -H * up, s: 1 + 0.05 * ease.inOut(seg(t, 1.0, B.open - 0.75)), css: { 'transform-origin': '50% 40%' } });   // never still while it waits
      }
      // the time card lands just after the cut and leaves upward as the connection page springs in over it
      const lk = grow(t, B.sw + 0.3, 'default', 0.4), lx = ease.inOut(seg(t, B.day - 0.3, B.day + 0.25));
      put(S.later, { o: lk.o && lx < 0.97 ? 1 : 0, s: lk.s * (1 - 0.6 * lx), y: -P(220, 300) * lx });
      // the next night: a cut on the beat, then the pill on "two thirteen", the note on "asleep"; never still
      put(S.sleep, { o: b >= B.sleep ? 1 : 0, s: 1 + 0.06 * ease.inOut(seg(t, B.sleep, B.end + 0.3)) });
      const pk = grow(t, B.pill, 'default', 0.9); put(S.sleepPill, { o: pk.o, s: pk.s });
      const nk = grow(t, B.asleep, 'default', 0.96); put(S.sleepNote, { o: nk.o, y: 20 * (1 - nk.k) });
    },
  });

  // ================================================================ 16:9: a laptop desktop
  function buildDesktop(S, world) {
    S.menu = box(world, 0, 0, `width:${W}px;height:44px;background:${V('win')};border-bottom:1px solid ${V('line')};box-sizing:border-box`);
    box(S.menu, 24, 10, UI(20, 700), 'Helpdesk');
    ['File', 'Edit', 'View', 'Window'].forEach((m, i) => box(S.menu, 140 + i * 78, 11, UI(19, 500, V('muted')), m));
    S.clock = box(S.menu, W - 240, 10, `width:216px;text-align:right;${UI(20, 600)}`, 'Tue 2:13 AM');
    // the helpdesk window: queue on the left, the ticket on the right
    const hx = 60, hy = 76, hw = 1200, hh = 950, qw = 410, tx = qw + 36, tw = hw - qw - 72;
    S.hd = box(world, hx, hy, `width:${hw}px;height:${hh}px;background:${V('win')};border:1px solid ${V('line')};border-radius:14px;box-sizing:border-box;overflow:hidden;transform-origin:50% 100%`);
    box(S.hd, 0, 0, `width:${hw}px;height:48px;border-bottom:1px solid ${V('line')};box-sizing:border-box`, [20, 40, 60].map((x) => `<span style="position:absolute;left:${x}px;top:17px;width:12px;height:12px;border-radius:50%;background:${V('soft')}"></span>`).join('') + `<span style="position:absolute;left:0;width:${hw}px;top:13px;text-align:center;${UI(18, 600, V('muted'))}">Inbox · Domains</span>`);
    S.q = box(S.hd, 0, 48, `width:${qw}px;height:${hh - 48}px;border-right:1px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`);
    S.qHead = box(S.q, 24, 18, `display:flex;align-items:center;gap:12px;${UI(24, 700)}`, `Domains <span class="cnt" style="padding:2px 12px;border-radius:999px;background:${V('chip')};font:600 18px UI;color:${V('muted')}"></span>`);
    S.cnt = reg(S.qHead.querySelector('.cnt'));
    const row = (tk) => ({ tk, r: box(S.q, 0, 0, `width:${qw}px;height:92px;border-bottom:1px solid ${V('line')};box-sizing:border-box;padding:16px 24px`, `<div style="${UI(22, 600)}white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tk.sub}</div><div style="margin-top:7px;${UI(17, 500, V('muted'))}">#${tk.id} · ${tk.who} · ${tk.at}</div>`, { o: 0 }) });
    S.newRows = TICKETS.map(row); S.oldRows = OLD.map(row);
    S.sel = box(S.q, 0, 0, `width:5px;height:92px;background:${V('fg')}`, '', { o: 0 });
    S.empty = box(S.hd, qw, 48 + 380, `width:${hw - qw}px;display:flex;flex-direction:column;align-items:center;gap:14px;${UI(22, 500, V('muted'))}`, `${ICON.inbox(44)}No ticket selected`);
    // the ticket
    S.tk = box(S.hd, 0, 48, `width:${hw}px;height:${hh - 48}px`, '', { o: 0 });
    box(S.tk, tx, 24, UI(32, 700), 'My domain isn’t working');
    box(S.tk, tx, 72, UI(19, 500, V('muted')), `#4471 · Maya R. · ${DOM} · 2:12 AM`);
    S.nc = box(S.tk, tx + tw - 190, 30, `padding:5px 14px;border-radius:8px;background:${V('inv')};${UI(18, 600, V('invfg'))}`, 'not connected', { o: 0 });
    S.msg = box(S.tk, tx, 118, `width:${tw}px;padding:20px 26px;border-radius:14px;background:${V('chip')};box-sizing:border-box;${UI(27, 500)}line-height:1.42`, '');
    S.msg.innerHTML = MSG.replace('3 days ago', '<span class="h1" style="border-radius:5px">3 days ago</span>').replace('We launch tomorrow morning.', '<span class="h2" style="border-radius:5px">We launch tomorrow morning.</span>');
    S.h1 = reg(S.msg.querySelector('.h1')); S.h2 = reg(S.msg.querySelector('.h2'));
    // the DNS check: what is actually at her provider
    S.dns = box(S.tk, tx, 330, `width:${tw}px;height:260px;border-radius:14px;border:1px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`, '', { o: 0 });
    box(S.dns, 26, 18, MONO(18, V('muted'), 500), `DNS CHECK · ${DOM} · CNAME`);
    S.dnsRow = box(S.dns, 26, 56, `${MONO(25)}white-space:pre`, `name   <span class="bad" style="padding:2px 7px;border-radius:5px">${BAD}</span>`);
    S.bad = reg(S.dnsRow.querySelector('.bad'));
    box(S.dns, 26, 100, `${MONO(25)}white-space:pre`, `value  ${TARGET}`);
    box(S.dns, 26, 146, `${MONO(22, V('muted'))}white-space:pre`, 'expected name  shop');
    S.badTag = box(S.dns, 26, 194, `padding:7px 16px;border-radius:8px;background:${V('inv')};${UI(20, 600, V('invfg'))}`, 'Full domain typed in the Name field', { o: 0 });
    // the reply box
    S.rp = box(S.tk, tx, 616, `width:${tw}px;height:270px;border-radius:14px;border:1px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`, '', { o: 0 });
    S.rpT = box(S.rp, 24, 20, `width:${tw - 48}px;${UI(26, 500)}line-height:1.45;white-space:normal`, '');
    S.rpTxt = reg(el('span', {}, S.rpT));
    S.rpC = reg(el('span', { style: `display:inline-block;width:2px;height:28px;margin-left:2px;vertical-align:-5px;background:${V('fg')}` }, S.rpT));
    S.sentNote = box(S.rp, 24, 24, `display:flex;align-items:center;gap:10px;${UI(22, 600, V('muted'))}`, `${ICON.check(26)}Reply sent · 2:19 AM`, { o: 0 });
    S.send = box(S.rp, tw - 150, 206, `width:124px;height:44px;border-radius:10px;${UI(20, 600)}line-height:44px;text-align:center;transform-origin:50% 50%`, 'Send');
    // toasts (top right): Maya's, then one per question
    S.toasts = [TICKETS[0], TICKETS[1], TICKETS[2], TICKETS[3]].map((tk) => box(world, W - 600, 62, `width:560px;padding:18px 22px;border-radius:16px;background:${V('win')};border:1px solid ${V('line')};box-sizing:border-box`,
      `<div style="${UI(16, 600, V('muted'))}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:7px;${UI(22, 700)}">New ticket #${tk.id} · ${tk.who}</div><div style="margin-top:4px;${UI(21, 500)}">${tk.sub}</div>`, { o: 0 }));
    // the team chat (the turn)
    const cx = 560, cy = 300, cw = 800, ch = 480;
    S.chat = box(world, cx, cy, `width:${cw}px;height:${ch}px;background:${V('win')};border:1px solid ${V('line')};border-radius:14px;box-sizing:border-box;overflow:hidden`, '', { o: 0 });
    box(S.chat, 0, 0, `width:${cw}px;height:54px;border-bottom:1px solid ${V('line')};box-sizing:border-box;padding:13px 22px;${UI(24, 700)}`, '# support');
    const msgBlock = (y, who, role, when) => box(S.chat, 26, y, `width:${cw - 52}px;${UI(28, 500)}line-height:1.38`, `<div style="${UI(26, 700)}">${who} <span style="${UI(24, 500, V('muted'))}">${role} · ${when}</span></div><div class="t" style="margin-top:4px"></div>`, { o: 0 });
    S.oldM = msgBlock(72, 'Sam', 'support', 'Mon 1:47 AM'); S.oldM.querySelector('.t').textContent = OLDMSG;
    S.samM = msgBlock(166, 'Sam', 'support', '2:24 AM'); S.samT = reg(S.samM.querySelector('.t'));
    S.samSent = box(S.chat, cw - 140, 262, `display:flex;align-items:center;gap:6px;${UI(22, 600, V('muted'))}`, `${ICON.check(24)}Sent`, { o: 0 });
    S.samTx = reg(el('span', {}, S.samT));
    S.chatCaret = reg(el('span', { style: `display:inline-block;width:2px;height:24px;margin-left:2px;vertical-align:-4px;background:${V('fg')}` }, S.samT));
    S.div = box(S.chat, 26, 296, `width:${cw - 52}px;display:flex;align-items:center;gap:14px;${UI(26, 600, V('muted'))}`, `<span style="flex:1;height:1px;background:${V('line')}"></span>Friday<span style="flex:1;height:1px;background:${V('line')}"></span>`, { o: 0 });
    S.priM = msgBlock(344, 'Priya', 'engineering', 'Fri 4:40 PM'); S.priT = reg(S.priM.querySelector('.t'));
    S.priT.textContent = PRIYA;
    // day: the connection page for Maya's next domain (left: what happened; right: the connection itself)
    const ax = 250, ay = 110, aw = 1420, ah = 880, fx = 40, fw = 650, rx = 760;
    S.act = box(world, ax, ay, `width:${aw}px;height:${ah}px;background:${V('win')};border:1px solid ${V('line')};border-radius:16px;box-sizing:border-box;overflow:hidden`, '', { o: 0 });
    box(S.act, 0, 0, `width:${aw}px;height:56px;border-bottom:1px solid ${V('line')};box-sizing:border-box`, [20, 40, 60].map((x) => `<span style="position:absolute;left:${x}px;top:21px;width:12px;height:12px;border-radius:50%;background:${V('soft')}"></span>`).join('') + `<span style="position:absolute;left:0;width:${aw}px;top:15px;text-align:center;${UI(20, 600, V('muted'))}">Domains · maya.studio</span>`);
    box(S.act, rx - 40, 56, `width:1px;height:${ah - 56}px;background:${V('line')}`);
    box(S.act, fx, 90, `${UI(18, 600, V('muted'))}letter-spacing:.1em`, 'ACTIVITY');
    S.evs = EVENTS.map((s, i) => box(S.act, fx, 140 + i * 100, `width:${fw}px;display:flex;align-items:center;gap:18px;${UI(36, i === 6 ? 700 : 500, i === 6 ? DONE : V('fg'))}`,
      `<span style="width:16px;height:16px;border-radius:50%;background:${i === 6 ? DONE : V('fg')};flex:none"></span><span>${s}</span><span style="margin-left:auto;${UI(22, 500, V('muted'))}">${EVT[i]}</span>`, { o: 0 }));
    S.wait = box(S.act, fx, 140 + 3 * 100, `width:${fw}px;display:flex;align-items:center;gap:18px;${UI(36, 500, V('muted'))}`,
      `<span style="width:16px;height:16px;border-radius:50%;border:2px solid ${V('muted')};box-sizing:border-box;flex:none"></span><span>Waiting for Maya to approve</span><span class="dots"></span>`, { o: 0 });
    S.waitDots = reg(S.wait.querySelector('.dots'));
    box(S.act, rx, 90, `${UI(18, 600, V('muted'))}letter-spacing:.1em`, 'CONNECTION');
    box(S.act, rx, 124, UI(64, 700), 'maya.studio');
    S.pill = box(S.act, rx, 216, `height:46px;padding:0 22px;border-radius:999px;display:flex;align-items:center;gap:10px;${UI(24, 600)}box-sizing:border-box`, '<span class="d" style="width:12px;height:12px;border-radius:50%"></span><span class="l">pending</span>');
    S.pillD = reg(S.pill.querySelector('.d')); S.pillL = reg(S.pill.querySelector('.l'));
    S.prov = box(S.act, rx, 290, UI(30, 500, V('muted')), 'Provider: <b style="font-weight:600;color:' + V('fg') + '">Cloudflare</b> · sign-in', { o: 0 });
    box(S.act, rx, 364, `${MONO(19, V('muted'), 500)}white-space:pre`, 'TYPE   NAME  VALUE');
    S.recs = RECS.map(([ty, nm, val], i) => box(S.act, rx, 408 + i * 62, `width:${aw - rx - 40}px;display:flex;align-items:center;${MONO(28)}white-space:pre`, `<span>${ty.padEnd(6)} ${nm.padEnd(5)} ${val}</span><span class="c" style="margin-left:auto">${ICON.check(30)}</span>`, { o: 0 }));
    S.recC = S.recs.map((r) => reg(r.querySelector('.c'), { o: 0 }));
    S.recNone = box(S.act, rx, 420, UI(26, 500, V('muted')), 'No records yet');
    S.mon = box(S.act, rx, 568, `display:flex;align-items:center;gap:12px;${UI(30, 500)}`, `${ICON.clock(32)}Checked every hour from now on`, { o: 0 });
    // Maya's note: a large notification, so it reads with the whole screen in view
    S.thanks = box(world, W - 1000, 60, `width:960px;padding:26px 34px;border-radius:22px;background:${V('win')};border:2px solid ${V('fg')};box-sizing:border-box`,
      `<div style="${UI(26, 600, V('muted'))}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:8px;${UI(40, 700)}">Maya R. · maya.studio</div><div style="margin-top:6px;${UI(46, 500)}line-height:1.25">${THANKS}</div>`, { o: 0 });
    S.cur = box(world, 0, 0, '', `<svg width="30" height="39" viewBox="0 0 24 31" style="position:static;overflow:visible"><path d="M2 2v23.5l6.2-6 4.2 9.6 4.3-1.9-4.2-9.4h8.6z" fill="#fafaf9" stroke="#1c1917" stroke-width="2" stroke-linejoin="round"/></svg>`);
    S.geo = { hx, hy, hw, hh, qw, tx, tw, cx, cy, cw, ch, ax, ay, aw, ah, rx };
  }
  function runDesktop(t, b, S) {
    const g = S.geo;
    put(S.clock, { text: clockFull(b) });
    // camera: a screen recording that zooms to where things happen; never shows past the desktop's edge
    const Z = (x, y, s) => ({ x, y, s });
    const ALL = Z(W / 2, H / 2, 1);
    const T = { response: 1.2, damping: 1 };
    const tkX = g.hx + g.tx + g.tw / 2;
    // ticket shots keep their left edge on the queue/ticket divider, so no word is cut at the frame's edge
    const div = g.hx + g.qw, onTk = (y, s) => Z(div + W / (2 * s), y, s);
    const keys = [[0, onTk(g.hy + 48 + 240, 2.4)], [B.open + 0.6, onTk(g.hy + 48 + 240, 2.4), T], [Wd('a2', 'maya') - 0.3, onTk(g.hy + 48 + 236, 2.47), { response: 2.5, damping: 1 }], [B.hiDays - 0.4, onTk(g.hy + 48 + 230, 2.4), T], [B.hiLaunch - 0.4, onTk(g.hy + 48 + 250, 2.4), T],
      [B.dns - 0.4, onTk(g.hy + 48 + 547, 2.4), T], [B.type0 - 0.5, onTk(g.hy + 48 + 760, 2.4), T], [B.type1, onTk(g.hy + 48 + 760, 2.48), { response: 3, damping: 1 }],
      [B.queue, Z(650, g.hy + 344, 1.48), T], [B.flood - 1.4, Z(738, 490, 1.3), { response: 1.0, damping: 1 }],
      [B.chat - 0.3, Z(g.cx + g.cw / 2, g.cy + g.ch / 2, 1.95), { response: 1.0, damping: 1 }],
      [B.sw, ALL, { response: 0.5, damping: 1 }],
      [B.day, Z(g.ax + g.aw / 2, g.ay + g.ah / 2, 1.2), { response: 1.4, damping: 1 }],
      [B.ev[4] - 0.8, Z(g.ax + g.aw / 2, g.ay + g.ah / 2, 1.23), { response: 3.0, damping: 1 }],
      [B.thanks - 0.6, Z(W / 2 + 80, H / 2 - 40, 1.08), T]];
    const cam = trkObj(t, keys);
    cam.s *= 1 + 0.01 * Math.sin(b * 0.23);
    const hx = W / (2 * cam.s), hy = H / (2 * cam.s);
    cam.x = clamp(cam.x, hx, W - hx); cam.y = clamp(cam.y, hy, H - hy);
    put(S.world, { x: W / 2 - cam.x * cam.s, y: H / 2 - cam.y * cam.s, s: cam.s });
    const night = b < B.sw;
    // toasts
    const tt = [-99, ...B.q];
    S.toasts.forEach((e, i) => {
      const k = grow(t, tt[i], 'default', 0.94), gone = i === 0 ? -98 : i < 3 ? tt[i + 1] - 0.02 : B.flood + 1.4;
      put(e, { o: k.o && b < gone ? 1 : 0, s: k.s, x: 40 * (1 - k.k) });
    });
    // the queue: three older tickets, Maya's on top, the questions, then the flood
    const showAt = [B.toast, ...B.q, B.flood + 0.5, B.flood + 1.0, B.flood + 1.6, B.flood + 2.2];
    const order = S.newRows.filter((_, i) => b >= showAt[i]).reverse().concat(S.oldRows);
    S.newRows.concat(S.oldRows).forEach((R) => put(R.r, { o: 0 }));
    order.forEach((R, i) => { const ni = S.newRows.indexOf(R), k = grow(t, ni >= 0 ? showAt[ni] : -10, 'default', 1); put(R.r, { o: ni >= 0 ? k.o : 1, y: 66 + i * 92, x: ni >= 0 ? -30 * (1 - k.k) : 0 }); });
    put(S.cnt, { text: `${3 + S.newRows.filter((_, i) => b >= showAt[i]).length} open` });
    const mi = order.findIndex((R) => R.tk.id === 4471);
    put(S.sel, { o: b >= B.open - 0.8 ? 1 : 0, y: 66 + mi * 92 });
    // the ticket
    put(S.empty, { o: b < B.open - 0.8 ? 1 : 0 });
    put(S.tk, { o: b >= B.open - 0.8 ? 1 : 0 });
    marker(t, S);
    const dk = grow(t, B.dns, 'default', 0.96); put(S.dns, { o: dk.o, s: dk.s });
    put(S.bad, { css: { background: b >= B.wrong ? V('inv') : 'transparent', color: b >= B.wrong ? V('invfg') : V('fg') } });
    const bt2 = grow(t, B.wrong + 0.35, 'snappy', 0.9); put(S.badTag, { o: bt2.o, s: bt2.s });
    put(S.rp, { o: b >= B.type0 - 0.5 ? 1 : 0 });
    const sent = b >= B.send;
    typed(t, S.rpTxt, REPLY, B.type0, B.type1);
    put(S.rpT, { o: sent ? 0 : 1 });
    put(S.rpC, { o: !sent && (b < B.type1 || Math.floor(b * 1.4) % 2 === 0) ? 1 : 0 });
    const sn = grow(t, B.send + 0.05, 'snappy', 0.94); put(S.sentNote, { o: sn.o, s: sn.s });
    const ready = b >= B.type1 && !sent;
    put(S.send, { s: 1 - 0.08 * press(t, B.send - 0.1), css: { background: ready ? V('fg') : V('chip'), color: ready ? V('win') : V('muted') } });
    // cursor: clicks Maya's toast, waits by the reply, clicks Send, then leaves it
    const kk = [[0, W - 260, 330], [B.open - 1.2, W - 330, 140], [B.open + 0.6, g.hx + g.tx + 360, g.hy + 330], [B.type1 - 1.2, g.hx + g.tx + g.tw - 140, g.hy + 48 + 840], [B.send - 0.15, g.hx + g.tx + g.tw - 90, g.hy + 48 + 826], [B.send + 1.2, g.hx + g.tx + g.tw - 60, g.hy + 48 + 900]];
    const cx = trk(t, kk.map(([bb, x]) => [bb, x, 'heavy'])), cy = trk(t, kk.map(([bb, , y]) => [bb, y, 'heavy']));
    put(S.cur, { o: b > B.open + 0.2 && b < B.flood ? 1 : 0, x: cx, y: cy, s: 1 - 0.14 * (press(t, B.open - 0.2) + press(t, B.send - 0.1)) });
    // the turn: Sam writes to the team; Priya's reply arrives (its own day and time)
    const ck = grow(t, B.chat - 0.25, 'default', 0.45); put(S.chat, { o: nightUI(b) ? ck.o : 0, s: ck.s, css: { 'transform-origin': '50% 50%' } });
    put(S.div, { o: b >= B.priya - 0.15 ? 1 : 0 });
    put(S.samM, { o: b >= B.sam[0] - 0.1 ? 1 : 0 });
    const ss = grow(t, B.sent, 'snappy', 0.6); put(S.samSent, { o: ss.o, s: ss.s, css: { 'transform-origin': '100% 50%' } });
    typed(t, S.samTx, SAM, B.sam[0], B.sam[1]);
    put(S.chatCaret, { o: (b >= B.sam[0] && b < B.sam[1]) || (b < B.sent && Math.floor(b * 1.4) % 2 === 0) ? 1 : 0 });
    const pk = grow(t, B.priya, 'default', 0.95); put(S.priM, { o: pk.o, y: 20 * (1 - pk.k) });
    // the helpdesk minimises as Sam turns to the team chat, and is back (in light) after the cut
    const mn = ease.inOut(seg(t, B.chat - 0.45, B.chat + 0.05)), back = b >= B.sw;
    put(S.hd, { o: nightUI(b) && (back || mn < 1) ? 1 : 0, s: back ? 1 : 1 - 0.85 * mn, y: back ? 0 : 260 * mn });
    // day
    put(S.oldM, { o: 0.6 });
    const ak = grow(t, B.day, 'default', 0.4), thk = grow(t, B.thanks, 'default', 0.94).k * (1 - ease.inOut(seg(t, B.sleep - 0.55, B.sleep - 0.05)));
    put(S.act, { o: !night && b < B.sleep ? ak.o : 0, s: ak.s, y: 40 * (1 - ak.k) + 160 * thk, css: { 'transform-origin': '50% 50%' } });
    S.evs.forEach((e, i) => { const k = grow(t, B.ev[i], 'default', 0.96); put(e, { o: k.o, x: 26 * (1 - k.k) }); });
    put(S.wait, { o: b >= B.wait && b < B.ev[3] ? 1 : 0 });
    put(S.waitDots, { text: '.'.repeat(1 + (Math.floor(b * 2) % 3)) });
    const st = b < B.ev[4] ? 'pending' : b < B.ev[6] ? 'propagating' : 'live';
    put(S.pillL, { text: st });
    put(S.pill, { s: 1 + 0.06 * press(t, B.ev[6]), css: { background: st === 'live' ? DONE : V('chip'), color: st === 'live' ? '#ffffff' : V('fg'), 'transform-origin': '0 50%' } });
    put(S.pillD, { css: { background: st === 'live' ? '#ffffff' : st === 'propagating' ? V('fg') : V('muted') } });
    put(S.prov, { o: b >= B.ev[1] ? 1 : 0 });
    S.recs.forEach((r, i) => { const k = grow(t, B.ev[4] + i * 0.25, 'snappy', 1); put(r, { o: k.o, x: 20 * (1 - k.k) }); });
    put(S.recNone, { o: b < B.ev[4] ? 1 : 0 });
    S.recC.forEach((c, i) => { const k = grow(t, B.ev[5] + i * 0.2, 'snappy', 0.5); put(c, { o: k.o, s: k.s, css: { 'transform-origin': '50% 50%' } }); });
    const mk = grow(t, B.kept, 'default', 0.96); put(S.mon, { o: mk.o, x: 20 * (1 - mk.k) });
    const th = grow(t, B.thanks, 'default', 0.94), tx2 = ease.inOut(seg(t, B.sleep - 0.55, B.sleep - 0.05));
    put(S.thanks, { o: th.o && b < B.sleep ? 1 : 0, s: th.s, x: 40 * (1 - th.k), y: -320 * tx2 });
  }

  // ================================================================ 9:16: a phone
  // the on-screen keyboard (generic): the key for the character just typed lights for that frame
  const KBH = 660;
  function keyboard(parent) {
    const kb = box(parent, 0, H - 96 - KBH, `width:${W}px;height:${KBH}px;background:${V('pane')};border-top:2px solid ${V('line')};box-sizing:border-box`, '', { o: 0 });
    const keys = {}, kw = 94, kh = 118, gap = 11;
    const key = (x, y, w, label, id) => { const e = box(kb, x, y, `width:${w}px;height:${kh}px;border-radius:14px;background:${V('key')};${UI(46, 400)}line-height:${kh}px;text-align:center`, label); if (id) keys[id] = e; return e; };
    KB.forEach((r, ri) => { const x0 = (W - (r.length * kw + (r.length - 1) * gap)) / 2; [...r].forEach((c, i) => key(x0 + i * (kw + gap), 26 + ri * (kh + 18), kw, c, c)); });
    key(18, 26 + 2 * (kh + 18), 130, '⇧', 'shift'); key(W - 148, 26 + 2 * (kh + 18), 130, '⌫');
    key(18, 26 + 3 * (kh + 18), 180, '123'); key(210, 26 + 3 * (kh + 18), W - 560, 'space', ' '); key(W - 338, 26 + 3 * (kh + 18), 110, '.', '.'); key(W - 216, 26 + 3 * (kh + 18), 198, 'return');
    keys[' '].style.fontSize = '36px'; return { kb, keys };
  }
  function runKeyboard(t, K, text, b0, b1, up0, up1) {
    const kin = sp(t, up0, { response: 0.4, damping: 1 }), kout = sp(t, up1, { response: 0.4, damping: 1 }), k = clamp(kin - kout);
    put(K.kb, { o: k > 0.01 ? 1 : 0, y: KBH * (1 - k) });
    const n = Math.round(seg(t, b0, b1) * text.length), b = beatAt(t), ch = b > b0 && b < b1 ? text[n - 1] || '' : '', c = ch.toLowerCase();
    const cap = ch !== c;
    Object.entries(K.keys).forEach(([id, e]) => put(e, { css: id === c || (cap && id === 'shift') ? { background: V('fg'), color: V('phone') } : {} }));
    return k;
  }
  function buildPhone(S, world) {
    S.bar = box(world, 0, 0, `width:${W}px;height:96px`);
    S.clock = box(S.bar, 64, 30, UI(38, 700), '2:13');
    box(S.bar, W - 230, 34, 'display:flex;align-items:center;gap:16px;color:' + V('fg'), `<svg width="46" height="30" viewBox="0 0 46 30" style="position:static">${[0, 1, 2, 3].map((i) => `<rect x="${i * 12}" y="${22 - i * 7}" width="8" height="${8 + i * 7}" rx="2" fill="currentColor"/>`).join('')}</svg><svg width="70" height="32" viewBox="0 0 70 32" style="position:static"><rect x="1.5" y="1.5" width="60" height="29" rx="8" fill="none" stroke="currentColor" stroke-width="3" opacity=".5"/><rect x="6" y="6" width="36" height="20" rx="4" fill="currentColor"/><rect x="64" y="10" width="5" height="12" rx="2" fill="currentColor" opacity=".5"/></svg>`);
    const scr = () => box(world, 0, 96, `width:${W}px;height:${H - 96}px;overflow:hidden`, '', { o: 0 });
    S.lock = scr(); S.ticket = scr(); S.inbox = scr(); S.chatS = scr(); S.actS = scr();
    const pad = 54, tw = W - pad * 2;
    // lock screen
    box(S.lock, 0, 340, `width:${W}px;text-align:center;font:300 280px UI;letter-spacing:-0.02em;color:${V('fg')}`, '2:13');
    box(S.lock, 0, 670, `width:${W}px;text-align:center;${UI(48, 500, V('muted'))}`, 'Tuesday');
    S.lockN = box(S.lock, pad, 860, `width:${tw}px;padding:36px 40px;border-radius:36px;background:${V('chip')};box-sizing:border-box`,
      `<div style="${UI(30, 600, V('muted'))}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:12px;${UI(44, 700)}">New ticket #4471 · Maya R.</div><div style="margin-top:8px;${UI(44, 500)}">My domain isn’t working</div>`, { o: 0 });
    S.lockOld = [[4466, 'Kim H.', 'Still pending after 2 days', '1:58 AM'], [4463, 'Sol V.', 'Where do I add a CNAME?', '1:31 AM']].map(([id, who, sub, at2], i) => box(S.lock, pad, 860 + i * 190, `width:${tw}px;padding:30px 40px;border-radius:36px;background:${V('chip')};box-sizing:border-box;opacity:.7`,
      `<div style="${UI(28, 600, V('muted'))}letter-spacing:.04em">HELPDESK · ${at2}</div><div style="margin-top:10px;${UI(38, 600)}">#${id} · ${who} · ${sub}</div>`));
    box(S.lock, W / 2 - 150, H - 96 - 60, `width:300px;height:10px;border-radius:5px;background:${V('soft')}`);
    lockKeys(S.lock, H - 96 - 260, V('chip'));
    // ticket screen (its content scrolls up above the keyboard while Sam types)
    S.tkScroll = box(S.ticket, 0, 0, `width:${W}px;height:${H - 96}px`);
    S.tkHost = S.ticket; S.ticket = S.tkScroll;
    box(S.ticket, pad, 24, UI(34, 600, V('muted')), '‹ Domains');
    box(S.ticket, pad, 86, `width:${tw}px;${UI(66, 700)}line-height:1.1`, 'My domain isn’t working');
    box(S.ticket, pad, 176, UI(34, 500, V('muted')), `#4471 · Maya R. · ${DOM}`);
    S.nc = box(S.ticket, W - pad - 250, 168, `padding:8px 20px;border-radius:12px;background:${V('inv')};${UI(30, 600, V('invfg'))}`, 'not connected', { o: 0 });
    S.msg = box(S.ticket, pad, 250, `width:${tw}px;padding:34px 38px;border-radius:32px;background:${V('chip')};box-sizing:border-box;${UI(46, 500)}line-height:1.38`, '');
    S.msg.innerHTML = MSG.replace('3 days ago', '<span class="h1" style="border-radius:8px">3 days ago</span>').replace('We launch tomorrow morning.', '<span class="h2" style="border-radius:8px">We launch tomorrow morning.</span>');
    S.h1 = reg(S.msg.querySelector('.h1')); S.h2 = reg(S.msg.querySelector('.h2'));
    S.dns = box(S.ticket, pad, 690, `width:${tw}px;height:350px;border-radius:32px;border:2px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`, '', { o: 0 });
    box(S.dns, 38, 32, MONO(28, V('muted'), 500), `DNS CHECK · ${DOM}`);
    S.dnsRow = box(S.dns, 38, 92, `${MONO(38)}white-space:pre`, `name  <span class="bad" style="padding:2px 10px;border-radius:8px">${BAD}</span>`);
    S.bad = reg(S.dnsRow.querySelector('.bad'));
    box(S.dns, 38, 162, `${MONO(38, V('muted'))}white-space:pre`, 'expected name  shop');
    S.badTag = box(S.dns, 38, 248, `padding:14px 24px;border-radius:14px;background:${V('inv')};${UI(36, 600, V('invfg'))}`, 'Full domain in the Name field', { o: 0 });
    S.rp = box(S.ticket, pad, 1090, `width:${tw}px;height:520px;border-radius:32px;border:2px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`, '', { o: 0 });
    S.rpPh = box(S.rp, 38, 34, UI(44, 500, V('muted')), 'Reply to Maya…');
    S.rpT = box(S.rp, 38, 34, `width:${tw - 76}px;${UI(44, 500)}line-height:1.4;white-space:normal`, '');
    S.rpTxt = reg(el('span', {}, S.rpT));
    S.rpC = reg(el('span', { style: `display:inline-block;width:3px;height:46px;margin-left:3px;vertical-align:-8px;background:${V('fg')}` }, S.rpT));
    S.sentNote = box(S.rp, 38, 40, `display:flex;align-items:center;gap:14px;${UI(38, 600, V('muted'))}`, `${ICON.check(40)}Reply sent · 2:19 AM`, { o: 0 });
    S.send = box(S.rp, tw - 38 - 180, 520 - 34 - 76, `width:180px;height:76px;border-radius:38px;${UI(34, 600)}line-height:76px;text-align:center;transform-origin:50% 50%`, 'Send');
    S.ticket = S.tkHost;
    S.kb1 = keyboard(S.ticket);
    // inbox screen
    S.inboxHead = box(S.inbox, pad, 24, `display:flex;align-items:center;gap:20px;${UI(66, 700)}`, `Domains <span class="cnt" style="padding:6px 22px;border-radius:999px;background:${V('chip')};font:600 34px UI;color:${V('muted')}"></span>`);
    S.cnt = reg(S.inbox.querySelector('.cnt'));
    S.inboxBody = box(S.inbox, 0, 0, `width:${W}px;height:${H}px`);
    S.rows = TICKETS.concat(OLD).map((tk) => ({ tk, r: box(S.inboxBody, 0, 0, `width:${W}px;height:156px;border-bottom:2px solid ${V('line')};box-sizing:border-box;padding:30px ${pad}px`,
      `<div style="${UI(44, 600)}white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tk.sub}</div><div style="margin-top:10px;${UI(32, 500, V('muted'))}">#${tk.id} · ${tk.who} · ${tk.at}</div>`, { o: 0 }) }));
    S.qBanner = [TICKETS[1], TICKETS[2], TICKETS[3]].map((tk) => box(world, 30, 20, `width:${W - 60}px;padding:30px 36px;border-radius:36px;background:${V('chip')};border:2px solid ${V('line')};box-sizing:border-box`,
      `<div style="${UI(28, 600, V('muted'))}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:10px;${UI(40, 700)}">#${tk.id} · ${tk.who}</div><div style="margin-top:6px;${UI(40, 500)}">${tk.sub}</div>`, { o: 0 }));
    // chat screen
    box(S.chatS, pad, 194, UI(66, 700), '# support');
    const mb = (y, who, role, when) => box(S.chatS, pad, y, `width:${tw}px;${UI(46, 500)}line-height:1.38`, `<div style="${UI(38, 700)}">${who} <span style="${UI(30, 500, V('muted'))}">${role} · ${when}</span></div><div class="t" style="margin-top:10px"></div>`, { o: 0 });
    S.oldM = mb(290, 'Sam', 'support', 'Mon 1:47 AM'); S.oldM.querySelector('.t').textContent = OLDMSG;
    S.samM = mb(440, 'Sam', 'support', '2:24 AM'); S.samM.querySelector('.t').textContent = SAM;
    S.div = box(S.chatS, pad, 650, `width:${tw}px;display:flex;align-items:center;gap:20px;${UI(34, 600, V('muted'))}`, `<span style="flex:1;height:2px;background:${V('line')}"></span>Friday<span style="flex:1;height:2px;background:${V('line')}"></span>`, { o: 0 });
    S.priM = mb(700, 'Priya', 'engineering', 'Fri 4:40 PM'); S.priT = reg(S.priM.querySelector('.t'));
    S.priT.textContent = PRIYA;
    S.compPh = box(S.chatS, pad, H - 96 - 90 - 120, `width:${tw}px;height:120px;padding:0 34px;border-radius:40px;border:2px solid ${V('line')};box-sizing:border-box;background:${V('pane')};${UI(44, 500, V('muted'))}line-height:116px`, 'Message #support');
    S.comp = box(S.chatS, pad, 0, `width:${tw}px;min-height:120px;padding:26px 34px;border-radius:40px;border:2px solid ${V('line')};box-sizing:border-box;background:${V('pane')};${UI(44, 500)}line-height:1.35`, '', { o: 0 });
    S.samTx = reg(el('span', {}, S.comp));
    S.chatCaret = reg(el('span', { style: `display:inline-block;width:3px;height:44px;margin-left:3px;vertical-align:-7px;background:${V('fg')}` }, S.comp));
    S.kb2 = keyboard(S.chatS);
    // day: the connection
    box(S.actS, pad, 190, UI(34, 600, V('muted')), '‹ Domains');
    box(S.actS, pad, 240, UI(84, 700), 'maya.studio');
    S.pill = box(S.actS, pad, 358, `height:72px;padding:0 32px;border-radius:999px;display:flex;align-items:center;gap:14px;${UI(38, 600)}box-sizing:border-box;transform-origin:0 50%`, '<span class="d" style="width:18px;height:18px;border-radius:50%"></span><span class="l">pending</span>');
    S.pillD = reg(S.pill.querySelector('.d')); S.pillL = reg(S.pill.querySelector('.l'));
    S.prov = box(S.actS, pad, 452, UI(38, 500, V('muted')), 'Provider: <b style="font-weight:600;color:' + V('fg') + '">Cloudflare</b> · sign-in', { o: 0 });
    S.recBox = box(S.actS, pad, 1180, `width:${tw}px;height:300px;border-radius:32px;border:2px solid ${V('line')};box-sizing:border-box;background:${V('pane')}`);
    box(S.recBox, 36, 30, `${MONO(26, V('muted'), 500)}white-space:pre`, 'DNS RECORDS');
    S.recs = RECS.map(([ty, nm, val], i) => box(S.recBox, 36, 86 + i * 72, `width:${tw - 72}px;display:flex;align-items:center;${MONO(34)}white-space:pre`, `<span>${nm.padEnd(4)} → ${val}</span><span class="c" style="margin-left:auto">${ICON.check(40)}</span>`, { o: 0 }));
    S.recC = S.recs.map((r) => reg(r.querySelector('.c'), { o: 0 }));
    S.recNone = box(S.recBox, 36, 110, UI(38, 500, V('muted')), 'No records yet');
    S.mon = box(S.recBox, 36, 236, `display:flex;align-items:center;gap:16px;${UI(38, 500)}`, `${ICON.clock(40)}Checked every hour from now on`, { o: 0 });
    box(S.actS, pad, 530, `${UI(28, 600, V('muted'))}letter-spacing:.1em`, 'ACTIVITY');
    S.evs = EVENTS.map((s, i) => box(S.actS, pad, 586 + i * 84, `width:${tw}px;display:flex;align-items:center;gap:24px;${UI(44, i === 6 ? 700 : 500, i === 6 ? DONE : V('fg'))}line-height:1.2`,
      `<span style="width:22px;height:22px;border-radius:50%;background:${i === 6 ? DONE : V('fg')};flex:none"></span><span>${s.replace(', in the widget', '')}</span>`, { o: 0 }));
    S.wait = box(S.actS, pad, 586 + 3 * 84, `width:${tw}px;display:flex;align-items:center;gap:24px;${UI(44, 500, V('muted'))}`,
      `<span style="width:22px;height:22px;border-radius:50%;border:3px solid ${V('muted')};box-sizing:border-box;flex:none"></span><span>Waiting for Maya to approve</span><span class="dots"></span>`, { o: 0 });
    S.waitDots = reg(S.wait.querySelector('.dots'));
    S.thanks = box(world, 30, 20, `width:${W - 60}px;padding:32px 38px;border-radius:36px;background:${V('pane')};border:2px solid ${V('line')};box-sizing:border-box`,
      `<div style="${UI(28, 600, V('muted'))}letter-spacing:.04em">HELPDESK · now</div><div style="margin-top:10px;${UI(40, 700)}">Maya R. · maya.studio</div><div style="margin-top:8px;${UI(42, 500)}line-height:1.3">${THANKS}</div>`, { o: 0 });
  }
  function runPhone(t, b, S) {
    put(S.clock, { text: clockFull(b).replace(/^\w+ /, '').replace(/ [AP]M$/, '') });
    const night = b < B.sw;
    // which screen is up; each new screen slides in from the right
    const scrAt = b < B.open ? 'lock' : b < B.queue ? 'ticket' : b < B.chat - 0.25 ? 'inbox' : b < B.day ? 'chatS' : 'actS';
    const ch = { lock: 0, ticket: B.open, inbox: B.queue, chatS: B.chat - 0.25, actS: B.day }[scrAt];
    const k = sp(t, ch ?? 0, { response: 0.45, damping: 1 });
    ['lock', 'ticket', 'inbox', 'chatS', 'actS'].forEach((n) => put(S[n], { o: n === scrAt || (scrAt === 'actS' && n === 'chatS' && k < 0.98) ? 1 : 0, x: n === scrAt && n !== 'lock' && n !== 'actS' ? 140 * (1 - k) : 0 }));
    S._actY = scrAt === 'actS' ? (H - 96) * (1 - clamp(k)) : 0;   // the page slides up over the chat
    put(S.lock, { s: 1 + 0.05 * ease.inOut(seg(t, 1.0, B.open)), css: { 'transform-origin': '50% 40%' } });
    const ln = grow(t, B.toast, 'default', 0.4), lo = sp(t, B.toast - 0.3, { response: 0.35, damping: 1 });
    put(S.lockN, { o: ln.o, s: ln.s, css: { 'transform-origin': '50% 0' } });
    S.lockOld.forEach((e) => put(e, { y: 300 * clamp(lo) }));   // the older two step down first, then Maya's grows in above them
    // ticket
    marker(t, S);
    const dk = grow(t, B.dns, 'default', 0.96); put(S.dns, { o: dk.o, s: dk.s });
    put(S.bad, { css: { background: b >= B.wrong ? V('inv') : 'transparent', color: b >= B.wrong ? V('invfg') : V('fg') } });
    const bt2 = grow(t, B.wrong + 0.35, 'snappy', 0.9); put(S.badTag, { o: bt2.o, s: bt2.s });
    put(S.rp, { o: 1 });
    const sent = b >= B.send;
    typed(t, S.rpTxt, REPLY, B.type0, B.type1);
    put(S.rpPh, { o: b < B.type0 ? 1 : 0 });
    put(S.rpT, { o: sent ? 0 : 1 });
    put(S.rpC, { o: !sent && b >= B.type0 - 0.6 && (b < B.type1 || Math.floor(b * 1.4) % 2 === 0) ? 1 : 0 });
    const sn = grow(t, B.send + 0.05, 'snappy', 0.94); put(S.sentNote, { o: sn.o, s: sn.s });
    const ready = b >= B.type1 && !sent;
    put(S.send, { s: 1 - 0.08 * press(t, B.send - 0.1), css: { background: ready ? V('fg') : V('chip'), color: ready ? V('win') : V('muted') } });
    const k1 = runKeyboard(t, S.kb1, REPLY, B.type0, B.type1, B.type0 - 0.7, B.send + 0.2);
    put(S.tkScroll, { y: 120 - 590 * k1 });
    // inbox: the questions arrive one by one (each with a banner), then the flood
    const showAt = [B.toast, ...B.q, B.flood + 0.5, B.flood + 1.0, B.flood + 1.6, B.flood + 2.2];
    const order = S.rows.slice(0, 8).filter((_, i) => b >= showAt[i]).reverse().concat(S.rows.slice(8));
    S.rows.forEach((R) => put(R.r, { o: 0 }));
    order.forEach((R, i) => { const idx = TICKETS.indexOf(R.tk), g2 = grow(t, idx >= 0 ? showAt[idx] : -10, 'default', 1); put(R.r, { o: idx >= 0 ? g2.o : 1, y: 140 + i * 156, x: idx >= 0 ? -40 * (1 - g2.k) : 0 }); });
    put(S.cnt, { text: `${3 + TICKETS.filter((_, i) => b >= showAt[i]).length} open` });
    let bannerK = 0;
    S.qBanner.forEach((e, i) => { const g2 = grow(t, B.q[i], 'default', 0.95), gone = i < 2 ? B.q[i + 1] - 0.02 : B.flood - 0.1, on = g2.o && b < gone; if (on) bannerK = Math.max(bannerK, g2.k); put(e, { o: on ? 1 : 0, y: -60 * (1 - g2.k) }); });
    put(S.inboxBody, { y: 170 + 170 * bannerK }); put(S.inboxHead, { y: 170 + 170 * bannerK });
    // the turn: Sam types in the composer, sends; Priya's reply arrives later (its own day and time)
    const k2 = runKeyboard(t, S.kb2, SAM, B.sam[0], B.sam[1], B.chat, B.sw + 1);
    put(S.div, { o: b >= B.priya - 0.15 ? 1 : 0 });
    put(S.oldM, { o: 0.55 });
    put(S.compPh, { o: k2 > 0.01 ? 0 : 1 });
    put(S.comp, { o: k2 > 0.01 ? 1 : 0, y: H - 96 - KBH - 30 - 190 + KBH * (1 - k2) });
    typed(t, S.samTx, b < B.sent ? SAM : '', B.sam[0], B.sam[1]);
    if (b >= B.sent) put(S.samTx, { text: '' });
    put(S.chatCaret, { o: b < B.sent && ((b >= B.sam[0] && b < B.sam[1]) || Math.floor(b * 1.4) % 2 === 0) ? 1 : 0 });
    const sk = grow(t, B.sent, 'snappy', 0.95); put(S.samM, { o: sk.o, y: 40 * (1 - sk.k) });
    const pk = grow(t, B.priya, 'default', 0.95); put(S.priM, { o: pk.o, y: 30 * (1 - pk.k) });
    // day
    S.evs.forEach((e, i) => { const g2 = grow(t, B.ev[i], 'default', 0.96); put(e, { o: g2.o, x: 30 * (1 - g2.k) }); });
    put(S.wait, { o: b >= B.wait && b < B.ev[3] ? 1 : 0 });
    put(S.waitDots, { text: '.'.repeat(1 + (Math.floor(b * 2) % 3)) });
    const st = b < B.ev[4] ? 'pending' : b < B.ev[6] ? 'propagating' : 'live';
    put(S.pillL, { text: st });
    put(S.pill, { s: 1 + 0.06 * press(t, B.ev[6]), css: { background: st === 'live' ? DONE : V('chip'), color: st === 'live' ? '#ffffff' : V('fg') } });
    put(S.pillD, { css: { background: st === 'live' ? '#ffffff' : st === 'propagating' ? V('fg') : V('muted') } });
    put(S.prov, { o: b >= B.ev[1] ? 1 : 0 });
    S.recs.forEach((r, i) => { const g2 = grow(t, B.ev[4] + i * 0.25, 'snappy', 1); put(r, { o: g2.o, x: 20 * (1 - g2.k) }); });
    put(S.recNone, { o: b < B.ev[4] ? 1 : 0 });
    S.recC.forEach((c, i) => { const g2 = grow(t, B.ev[5] + i * 0.2, 'snappy', 0.5); put(c, { o: g2.o, s: g2.s, css: { 'transform-origin': '50% 50%' } }); });
    const mk = grow(t, B.kept, 'default', 0.96); put(S.mon, { o: mk.o, x: 20 * (1 - mk.k) });
    const th = grow(t, B.thanks, 'default', 0.95), tx2 = ease.inOut(seg(t, B.sleep - 0.55, B.sleep - 0.05));
    put(S.thanks, { o: th.o && b < B.sleep ? 1 : 0, y: -80 * (1 - th.k) - 420 * tx2 });
    put(S.actS, { y: S._actY + (b >= B.day ? 140 * th.k * (1 - tx2) : 0), s: 1 + 0.02 * ease.inOut(seg(t, B.ev[6] - 3, B.sleep)),
      css: { 'transform-origin': '50% 0', background: V('phone'), borderTop: S._actY > 1 ? `2px solid ${V('line')}` : '0', boxShadow: S._actY > 1 ? '0 -18px 40px rgba(0,0,0,.18)' : 'none' } });   // one css object: a second put would replace it
  }

  // ================================================================ the end card (day)
  scene({
    name: 'end', from: B.end, to: 1e6, pre: 0.3,
    build(root, S) {
      root.style.background = '#fafaf9';
      const ink = '#1c1917';
      S.h = para(root, TALL ? ['You never touch', 'their DNS.', '*Neither does your*', '*support team.*'] : ['You never touch their DNS.', '*Neither does your support team.*'], { x: P(120, 84), y: P(150, 400), size: P(124, 104), color: ink });
      const ts = P(120, 136), tx = P(110, 76), ty = P(520, 1000);
      S.tree = box(root, tx, ty, `width:${ts}px;height:${ts}px;transform-origin:50% 100%`, `<svg viewBox="0 0 512 512" width="100%" height="100%" style="position:static;overflow:visible"><g fill="${ink}"><rect x="238" y="250" width="36" height="150" rx="18"/><g fill="none" stroke="${ink}" stroke-width="26" stroke-linecap="round"><path d="M256 330 L196 372 M256 330 L316 372"/></g>${[[256, 176, 86], [176, 220, 62], [336, 220, 62], [212, 140, 54], [300, 140, 54], [256, 244, 58]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></svg>`, { o: 0 });
      S.word = para(root, ['CustomDomain™'], { x: tx + ts + 10, y: ty + P(14, 20), size: P(92, 100), color: ink });
      S.url = box(root, P(120, 84), P(760, 1240), `font:500 ${P(100, 76)}px Mono;color:${ink}`, '');
    },
    run(t, b, S) {
      put(S.root, { s: 1 + 0.06 * seg(t, B.end, 'done'), css: { 'transform-origin': '30% 40%' } });
      const tr = grow(t, B.end - 0.35, 'heavy', 0.6); put(S.tree, { o: tr.o, s: tr.s });
      riseP(t, S.word, [B.end - 0.1], null, { st: 0 });
      riseP(t, S.h, TALL ? [Wd('f1', 'you') - 0.2, Wd('f1', 'their') - 0.2, Wd('f1', 'neither') - 0.2, Wd('f1', 'support') - 0.2] : [Wd('f1', 'you') - 0.2, Wd('f1', 'neither') - 0.2], null, { st: 0.06 });
      typed(t, S.url, 'customdomain.ai', Wd('f1', 'team') + 0.7, Wd('f1', 'team') + 1.7);
    },
  });

  C.start();
})();
