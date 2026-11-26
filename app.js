(function () {
'use strict';
var AR = '٠١٢٣٤٥٦٧٨٩';
var ar = function (n) { return String(n).replace(/\d/g, function (d) { return AR[+d]; }); };
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var reduced = function () { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

/* ---------- storage (always try/catch, memory fallback) ---------- */
var mem = {};
var store = {
  get: function (k, d) { try { var v = window.localStorage.getItem('kh.' + k); if (v != null) return JSON.parse(v); } catch (e) {} return (k in mem) ? mem[k] : d; },
  set: function (k, v) { mem[k] = v; try { window.localStorage.setItem('kh.' + k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- data ---------- */
var RED = '#d7261e', YEL = '#ffcc1a', BLUE = '#2a7fd4', GRN = '#2e9e3e', ORG = '#f07c12', INK = '#1b1712';
var stories = [
  { n: 1, t: 'سوبر سينو ضد ميجا-بوت', b: 'روبوت عملاق هرب من مصنع اللعب وماشي ناحية الحضانة... وأصغر بطل لازم يوقفه!', note: 'أصغر بطل... أكبر روبوت!', word: 'بوم!', c: RED, hero: 'sino', hname: 'سوبر سينو',
    q: 'سينو لقى إيه على ضهر الروبوت؟', a: ['شريحة حمرا', 'زرار أزرق', 'بطارية صفرا'], ok: 0 },
  { n: 2, t: 'تيمو وسباق التجميد', b: 'دكتور صقيع جمّد المدينة كلها، وقدام تيمو ٦٠ ثانية بس عشان ينقذها!', note: 'وصل لحد الأهرامات!', word: 'زوووم!', c: '#f2a20c', hero: 'timo', hname: 'تيمو',
    q: 'تيمو جري بسرعة أوي... ووقف فين؟', a: ['في البحر', 'عند الأهرامات', 'فوق القمر'], ok: 1 },
  { n: 3, t: 'نونو ضد تنين اللهب', b: 'تنين نار بيولّع الغابة والحيوانات في خطر... بس هو ليه زعلان كده؟', note: 'مش كل وحش شرير!', word: 'سبلاش!', c: BLUE, hero: 'nono', hname: 'نونو',
    q: 'التنين كان زعلان ليه؟', a: ['كان جعان', 'كان بردان', 'حد سرق بيضته'], ok: 2 },
  { n: 4, t: 'حموزي وجيش الأسمنت', b: 'البارون رمادي عايز يحوّل الجناين أسمنت... وخطف نونو كمان!', note: 'الكبير بيحمي الصغير', word: 'فوووش!', c: GRN, hero: 'hamoza', hname: 'حموزي',
    q: 'حموزي أنقذ مين من القفص؟', a: ['أخوه نونو', 'قطة صغيرة', 'تيمو'], ok: 0 },
  { n: 5, t: 'الخارقون: انتقام الأشرار', b: 'الأشرار اتحالفوا مع بعض... والخارقين لازم يتجمعوا لأول مرة!', note: 'القصة الكبيرة!', word: 'كراش!', c: ORG, hero: 'hamoza', hname: 'الفريق',
    q: 'مين جه يساعد الخارقين في الآخر؟', a: ['دكتور صقيع', 'تنين اللهب', 'البارون رمادي'], ok: 1 }
];
var heroes = [
  { k: 'sino', n: 'سوبر سينو', age: 'سنتين', pw: 'بيطير وأقوى من أي حاجة', say: 'صغنن... بس قوي!', c: RED },
  { k: 'timo', n: 'تيمو البرق', age: '٣ سنين ونص', pw: 'أسرع من البرق', say: 'محدش يقدر يسبقني!', c: '#f2a20c' },
  { k: 'nono', n: 'نونو', age: '٤ سنين', pw: 'بيتحكم في المايه', say: 'يا موج... تعالى معايا!', c: BLUE },
  { k: 'hamoza', n: 'حموزي الأخضر', age: '٩ سنين', pw: 'بيتحكم في الطبيعة — قائد الفريق', say: 'يلا يا خارقين!', c: GRN }
];
var villains = [
  { n: 'ميجا-بوت', img: 'v1', pw: 'ضخم وأقوى من مية عربية', weak: 'الشريحة الحمرا على ضهره', by: 'سوبر سينو', st: 'بقى صاحبنا!', g: 1, rot: -2 },
  { n: 'دكتور صقيع', img: 'v2', pw: 'بيجمّد أي حاجة في ثانية', weak: 'السرعة... والدفا', by: 'تيمو البرق', st: 'اتمسك!', g: 0, rot: 1.8 },
  { n: 'تنين اللهب', img: 'v3', pw: 'بيطلّع نار من بقه', weak: 'قلبه طيب', by: 'نونو... بالطيبة', st: 'بقى صاحبنا!', g: 1, rot: 2 },
  { n: 'البارون رمادي', img: 'v4', pw: 'جيش خلاطات أسمنت', weak: 'الشجر والمايه مع بعض', by: 'الخارقين كلهم', st: 'اتمسك!', g: 0, rot: -1.6 }
];
var candidates = [
  { k: 'm', n: 'مستر مغناطيس', d: 'بيشد أي حاجة حديد في المدينة', c: RED },
  { k: 'b', n: 'ملكة الفقاعات', d: 'بتحبس الناس في فقاعات صابون', c: BLUE },
  { k: 'f', n: 'كابتن ضباب', d: 'بيخبّي المدينة في ضباب تقيل', c: '#6b7a86' }
];
var P = function (n, i) { return '/assets/p/s' + n + '-' + i + '.jpg'; };
var T = function (n, i) { return '/assets/t/t' + n + '-' + i + '.jpg'; };
var H = function (k) { return '/assets/' + k + '.jpg'; };
var cfg = window.KH_CFG || {};
var online = !!(cfg.projectId && cfg.apiKey);

/* ---------- shared backend (Supabase REST), optional ---------- */
var SB = online ? 'https://' + cfg.projectId + '.supabase.co/rest/v1' : '';
function sbh(extra) { var h = { apikey: cfg.apiKey, 'Content-Type': 'application/json' }; for (var k in (extra || {})) h[k] = extra[k]; return h; }
function tfetch(url, opts, ms) {
  opts = opts || {}; ms = ms || 4000;
  var ctl = ('AbortController' in window) ? new AbortController() : null;
  if (ctl) opts.signal = ctl.signal;
  var done = false, t = setTimeout(function () { if (!done && ctl) ctl.abort(); }, ms);
  return fetch(url, opts).then(function (r) { done = true; clearTimeout(t); return r; }, function (e) { done = true; clearTimeout(t); netFail(); throw e; });
}
function netFail() { online = false; if (window.__vtimer) { clearInterval(window.__vtimer); window.__vtimer = null; } }
var api = {
  tally: function () {
    return tfetch(SB + '/votes?select=k,n', { headers: sbh() }).then(function (r) { if (!r.ok) throw new Error('tally'); return r.json(); }).then(function (a) {
      var o = { m: 0, b: 0, f: 0 }; a.forEach(function (x) { o[x.k] = x.n; }); return o; });
  },
  vote: function (k) {
    return tfetch(SB + '/rpc/vote', { method: 'POST', headers: sbh(), body: JSON.stringify({ p: k }) }).then(function (r) { if (!r.ok) throw new Error('vote'); });
  },
  drawings: function () {
    return tfetch(SB + '/drawings?select=id,img,rot&order=t.desc&limit=40', { headers: sbh() })
      .then(function (r) { if (!r.ok) throw new Error('list'); return r.json(); })
      .then(function (a) { return a.map(function (d) { return { id: d.id, img: d.img, rot: d.rot || 0 }; }); });
  },
  addDrawing: function (img, rot) {
    return tfetch(SB + '/drawings', { method: 'POST', headers: sbh({ Prefer: 'return=representation' }), body: JSON.stringify({ img: img, rot: rot, t: Date.now() }) })
      .then(function (r) { if (!r.ok) throw new Error('add'); return r.json(); }).then(function (d) { return d[0].id; });
  },
  delDrawing: function (id) { return tfetch(SB + '/drawings?id=eq.' + encodeURIComponent(id), { method: 'DELETE', headers: sbh() }).then(function (r) { if (!r.ok) throw new Error('del'); }); }
};

/* ---------- helpers ---------- */
function wob(color) {
  return '<svg class="wob" viewBox="0 0 200 14" aria-hidden="true"><path d="M3 8 Q 14 1 26 8 T 50 7 T 76 8 T 102 6 T 128 8 T 154 7 T 180 8 T 197 6" fill="none" stroke="' + color + '" stroke-width="5" stroke-linecap="round"/></svg>';
}
function sec(id, title, color, sub, body) {
  return '<section class="sec" id="' + id + '"><h2>' + title + '</h2>' + wob(color) + (sub ? '<p class="sub">' + sub + '</p>' : '') + body + '</section>';
}
function reveal(el, cls, delay) {
  if (!('IntersectionObserver' in window) || reduced()) { el.classList.add(cls); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { setTimeout(function () { el.classList.add(cls); }, delay || 0); io.disconnect(); } }); }, { threshold: 0.15 });
  io.observe(el);
}
function toTop() { window.scrollTo(0, 0); }
function scrollToId(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' }); }
function showImage(dataUrl, name, msg) {
  var m = $('#modal'); m.hidden = false;
  m.innerHTML = '<div class="mbox"><img alt="" src="' + dataUrl + '"><p>' + (msg || 'اضغط مطولاً على الصورة واحفظها.') + '</p><div class="row"><a class="btn big" download="' + esc(name) + '" href="' + dataUrl + '">نزّل الصورة</a><button type="button" class="btn cream big" id="mclose">قفل</button></div></div>';
  $('#mclose').onclick = function () { m.hidden = true; m.innerHTML = ''; };
  m.onclick = function (e) { if (e.target === m) { m.hidden = true; m.innerHTML = ''; } };
}
function fontsReady() { try { return Promise.all([document.fonts.load('40px Lalezar', 'الخارقون'), document.fonts.load('700 30px "Aref Ruqaa"', 'شهادة'), document.fonts.load('700 20px Cairo', 'ا')]); } catch (e) { return Promise.resolve(); } }

/* ---------- state ---------- */
var state = {
  stickers: store.get('stickers', []),
  last: store.get('last', 1),
  name: store.get('name', ''),
  design: store.get('design', { suit: RED, power: 0, name: '' }),
  vote: store.get('vote', null)
};
function save(k) { store.set(k, state[k]); }

/* ---------- transitions ---------- */
var busy = false;
function navigate(url, info, x, y, replace) {
  if (busy) return;
  if (reduced() || !info) { go(url); return; }
  busy = true;
  var t = $('#trans'); t.classList.add('on'); t.style.setProperty('--tc', info.c);
  var R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 2 / 100 + 1.2;
  t.innerHTML = '<div class="tr-burst" style="left:' + x + 'px;top:' + y + 'px"></div><div class="tr-word"><span class="big">' + esc(info.word) + '</span><span class="cap">' + esc(info.cap) + '</span></div>';
  var b = $('.tr-burst', t), w = $('.tr-word', t);
  var a1 = b.animate([{ transform: 'scale(0) rotate(0)' }, { transform: 'scale(' + R + ') rotate(40deg)' }], { duration: 480, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
  a1.onfinish = function () {
    w.animate([{ opacity: 0, transform: 'translateY(-50%) scale(4) rotate(-10deg)' }, { opacity: 1, transform: 'translateY(-50%) scale(1) rotate(0)' }], { duration: 420, easing: 'cubic-bezier(.2,1.5,.4,1)', fill: 'forwards' });
    setTimeout(function () {
      go(url);
      setTimeout(function () {
        var o = t.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-110%)', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
        o.onfinish = function () { t.innerHTML = ''; t.classList.remove('on'); t.getAnimations().forEach(function (an) { an.cancel(); }); busy = false; };
      }, 350);
    }, 850);
  };
}
function go(url) { history.pushState({}, '', url); render(); }
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[data-go]');
  if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
  e.preventDefault();
  var info = null, u = a.getAttribute('href');
  var m = /^\/story-(\d)$/.exec(u);
  if (m) { var s = stories[+m[1] - 1]; info = { c: s.c, word: s.word, cap: 'العدد ' + ar(s.n) + ': ' + s.t }; }
  else if (u === '/') info = { c: YEL, word: 'بووووم!', cap: 'الخارقون — حراس المدينة' };
  var x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
  var after = a.getAttribute('data-after'); window.__after = after || null;
  navigate(u, info, x, y);
});
window.addEventListener('popstate', render);

/* ---------- home ---------- */
function homeHTML() {
  var posters = '';
  var all = []; for (var n = 1; n <= 5; n++) for (var i = 1; i <= 6; i++) all.push(T(n, i));
  var spots = [[2, 4, -7], [30, 1, 5], [60, 5, -4], [80, 2, 8], [6, 34, 6], [84, 38, -6], [4, 66, -8], [30, 76, 4], [64, 79, -5], [86, 70, 7], [46, 88, 3], [18, 52, -3]];
  spots.forEach(function (s, k) { posters += '<div class="poster" style="left:' + s[0] + '%;top:' + s[1] + '%;--r:' + s[2] + 'deg;animation-delay:-' + (k * 0.7) + 's;transform:rotate(' + s[2] + 'deg)"><img src="' + all[(k * 5 + 3) % 30] + '" alt="" width="120" height="170"' + (k > 3 ? ' loading="lazy"' : '') + ' decoding="async"></div>'; });
  var s = stories[state.last - 1];
  var hero = '<header class="hero corkboard">' + posters + '<div class="hcard"><h1>الخارقون</h1><div class="torn">حراس المدينة</div><p class="tag">٤ أبطال صغيرين... و٥ مغامرات أكشن. اختار قصتك وابدأ!</p><div class="hbtns">' +
    '<a class="btn big" data-go href="/story-' + s.n + '">ابدأ القراءة ⚡</a><button type="button" class="btn cream" data-scroll="index">الفهرس</button><button type="button" class="btn cream" data-scroll="album">الستيكرات</button><button type="button" class="btn cream" data-scroll="color">لوّن</button></div></div></header>';
  var cards = stories.map(function (s, i) {
    return '<article class="card" style="--c:' + s.c + ';--rot:' + [-2.4, 1.8, -1.2, 2.3, -1.9][i] + 'deg"><div class="cover" data-pop><img src="' + P(s.n, 1) + '" alt="غلاف العدد ' + ar(s.n) + ': ' + s.t + '" width="800" height="1135" loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async"><span class="word">' + s.word + '</span><span class="starburst"><b>العدد ' + ar(s.n) + '</b></span><span class="stamp-done' + (state.stickers.indexOf(s.n) >= 0 ? ' on' : '') + '">خلّصتها!</span></div>' +
      '<h3>' + s.t + '</h3><p class="blurb">' + s.b + '</p><p class="note">' + s.note + '</p><a class="btn col" data-go href="/story-' + s.n + '">اقرا القصة ←</a></article>';
  }).join('');
  var album = '<div class="album paper tape"><div class="slots">' + stories.map(function (s) {
    var got = state.stickers.indexOf(s.n) >= 0;
    return '<div class="slot' + (got ? ' got' : '') + '" style="--c:' + s.c + '"><div class="disc">' + (got ? '<img src="' + H(s.hero) + '" alt="ستيكر ' + s.hname + '">' : '؟') + '</div>العدد ' + ar(s.n) + '</div>';
  }).join('') + '</div><div class="prog" id="prog">جمّعت ' + ar(state.stickers.length) + ' من ٥ ستيكرات</div></div><div id="certbox"></div>';
  var hs = heroes.map(function (h) {
    return '<button type="button" class="hc" data-hc style="--c:' + h.c + '" aria-label="' + h.n + ': ' + h.say + '"><span class="rays"></span><span class="bubble">' + h.say + '</span><img class="himg" src="' + H(h.k) + '" alt="' + h.n + '" width="560" height="747" loading="lazy" decoding="async"><span class="hname">' + h.n + '</span><span class="chip">🎂 ' + h.age + '</span><span class="chip">⚡ ' + h.pw + '</span></button>';
  }).join('');
  var vs = villains.map(function (v) {
    return '<article class="wanted"style="--rot:' + v.rot + 'deg"><h3>مطلوب!</h3><div class="pic"><img src="/assets/' + v.img + '.jpg" alt="' + v.n + '" loading="lazy" decoding="async"><span class="vstamp ' + (v.g ? 'g' : 'r') + '">' + v.st + '</span></div><h4>' + v.n + '</h4>' +
      '<p class="vrow"><span>القوة:</span> ' + v.pw + '</p><p class="vrow"><span>نقطة الضعف:</span> ' + v.weak + '</p><p class="vrow"><span>غلبه:</span> ' + v.by + '</p></article>';
  }).join('');
  var sw = [RED, BLUE, GRN, YEL, ORG, INK].map(function (c) { return '<button type="button" data-suit="' + c + '" style="background:' + c + '" aria-label="لون البدلة"></button>'; }).join('');
  var pws = ['⚡ البرق', '💧 المايه', '🌿 الطبيعة', '⭐ النجوم', '🔥 النار'].map(function (p, i) { return '<button type="button" class="btn sm cream" data-pw="' + i + '">' + p + '</button>'; }).join('');
  var designer = '<div class="designer paper tape"><div class="dview"><div id="dsvg"></div><div class="dline" id="dline"></div></div><div class="dctl"><h4>لون البدلة</h4><div class="sw">' + sw + '</div><h4>القوة</h4><div class="pw">' + pws + '</div><h4>اسم البطل</h4><input class="field" id="dname" maxlength="18" placeholder="اكتب الاسم" autocomplete="off"><div class="row" style="margin-top:16px"><button type="button" class="btn big" id="dsave">حفظ البطل</button></div></div></div>';
  var thumbs = heroes.map(function (h, i) { return '<button type="button" data-ch="' + h.k + '" aria-label="' + h.n + '"><img src="' + H(h.k) + '" alt=""></button>'; }).join('');
  var crayons = ['#d7261e', '#f07c12', '#ffcc1a', '#2e9e3e', '#7ed38a', '#2a7fd4', '#8fcbf5', '#b5651d', '#f2b8c6', '#8a8a8a', '#ffe0bd', '#1b1712'].map(function (c) { return '<button type="button" data-cr="' + c + '" style="background:' + c + '" aria-label="لون"></button>'; }).join('');
  var color = '<div class="colwrap paper tape"><div class="thumbs">' + thumbs + '</div><canvas class="canv" id="canv" width="600" height="800" aria-label="صفحة التلوين"></canvas><div class="crayons">' + crayons + '</div><div class="row"><button type="button" class="btn cream" id="cundo">رجوع خطوة</button><button type="button" class="btn cream" id="cclear">امسح الكل</button><button type="button" class="btn" id="cdone">خلّصت!</button><button type="button" class="btn cream" id="cprint">اطبع</button></div></div>';
  var drawings = '<button type="button" class="btn big" id="dadd" style="display:flex;margin:0 auto 22px">علّق رسمة جديدة 📌</button><input type="file" id="dfile" accept="image/*" hidden><div class="board corkboard" id="board"></div><p class="stat" id="dstat"></p>';
  var video = '<div class="polaroid"><video controls playsinline preload="metadata" poster="/assets/poster.jpg" width="960" height="540"><source src="/assets/intro.mp4" type="video/mp4"></video><div class="cap">إنترو حراس المدينة</div></div><div class="vtxt"><h2>الإنترو!</h2><div class="arrow">← شغّلوا الصوت!</div><p>الأبطال الأربعة بيدخلوا واحد ورا التاني.</p><a class="btn big col" style="--c:' + ORG + '" data-go href="/story-5">اقرا القصة الكبيرة</a></div>';
  var sil = '<svg class="sil" viewBox="0 0 120 160" aria-hidden="true"><path d="M60 8c-20 0-30 16-30 34 0 12 5 20 10 25-18 6-30 20-30 40v53h100v-53c0-20-12-34-30-40 5-5 10-13 10-25C90 24 80 8 60 8z" fill="#000" stroke="#555" stroke-width="3"/><text x="60" y="88" text-anchor="middle" font-family="Lalezar" font-size="70" fill="#ffcc1a">؟</text></svg>';
  var vc = candidates.map(function (c, i) { return '<button type="button" class="vc" data-vote="' + c.k + '" style="--c:' + c.c + ';--rot:' + [-1.5, 1.2, -.8][i] + 'deg"><h4>' + c.n + '</h4><span>' + c.d + '</span><span class="pct" data-pct="' + c.k + '"></span><span class="bar"><i data-bar="' + c.k + '"></i></span></button>'; }).join('');
  var six = '<div class="six"><div class="rays6"></div><h2>العدد ٦... قريبًا!</h2>' + sil + '<p>شرير جديد جاي للمدينة... مين يكون؟ اختاروا انتو!</p><div class="votes">' + vc + '</div><p class="stat" id="vstat" style="color:#d8cdb4;font-size:16px;margin-top:16px"></p></div>';
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone ? '<div class="ios">دوس مشاركة ← أضف للشاشة الرئيسية</div>' : '';
  return hero +
    sec('index', 'الفهرس', RED, '', '<div class="cards">' + cards + '</div>') +
    sec('album', 'ألبوم الستيكرات', ORG, 'اقرا القصة وجاوب على السؤال... وجمّع كل الستيكرات!', album) +
    sec('heroes', 'تعرّف على الأبطال', GRN, 'دوس على البطل وشوف هيقول إيه!', '<div class="heroes">' + hs + '</div>') +
    sec('villains', 'ملفات الأشرار', RED, 'اعرف عدوك! قوته إيه... ونقطة ضعفه فين.', '<div class="wanted-grid">' + vs + '</div>') +
    sec('design', 'صمّم بطلك', BLUE, 'اختار لون البدلة والقوة واكتب اسم البطل... يمكن يطلع في العدد الجاي!', designer) +
    sec('color', 'لوّن بطلك', ORG, 'اختار البطل واللون... ودوس جوه أي حتة تتلوّن!', color) +
    sec('drawings', 'رسومات الأبطال', GRN, 'ارسم بطلك أو شريرك على ورقة، صوّرها... وعلّقها هنا!', drawings) +
    sec('intro', 'الإنترو!', RED, '', video) +
    sec('six', 'قريبًا', YEL, '', six) +
    '<footer class="foot">إهداء لأبطال بيتنا الحقيقيين:<br>سينو، تيمو، نونو، وحموزي<small>موسيقى الإنترو: Black Vortex - Kevin MacLeod (incompetech.com) - CC BY 3.0</small>' + ios + '</footer>';
}

/* ---------- certificate ---------- */
function renderCert() {
  var box = $('#certbox'); if (!box) return;
  if (state.stickers.length < 5) { box.innerHTML = ''; return; }
  box.innerHTML = '<div class="cert tape"><div class="cert-in"><h3>شهادة رسمية</h3><p>نشهد إن البطل</p><input id="cname" maxlength="20" placeholder="اكتب اسمك" value="' + esc(state.name) + '" autocomplete="off"><p>بقى عضو رسمي في حراس المدينة!</p><div class="seal"><b>حراس<br>المدينة</b></div><button type="button" class="btn big" id="csave">حفظ الشهادة</button></div></div>';
  $('#cname').oninput = function (e) { state.name = e.target.value; save('name'); };
  $('#csave').onclick = function () {
    fontsReady().then(function () {
      var c = document.createElement('canvas'); c.width = 1000; c.height = 700; var x = c.getContext('2d');
      x.fillStyle = '#fffaf0'; x.fillRect(0, 0, 1000, 700);
      x.strokeStyle = INK; x.lineWidth = 8; x.strokeRect(18, 18, 964, 664); x.strokeStyle = RED; x.lineWidth = 4; x.strokeRect(36, 36, 928, 628); x.strokeRect(46, 46, 908, 608);
      x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = RED; x.font = '84px Lalezar'; x.fillText('شهادة رسمية', 500, 150);
      x.fillStyle = INK; x.font = '700 44px "Aref Ruqaa"'; x.fillText('نشهد إن البطل', 500, 235);
      x.fillStyle = BLUE; x.font = '700 76px "Aref Ruqaa"'; x.fillText(state.name || '..............', 500, 340);
      x.strokeStyle = INK; x.setLineDash([10, 8]); x.lineWidth = 3; x.beginPath(); x.moveTo(250, 362); x.lineTo(750, 362); x.stroke(); x.setLineDash([]);
      x.fillStyle = INK; x.font = '700 44px "Aref Ruqaa"'; x.fillText('بقى عضو رسمي في حراس المدينة!', 500, 450);
      x.save(); x.translate(500, 560); x.rotate(-0.17); x.fillStyle = YEL; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath();
      for (var i = 0; i < 24; i++) { var r = i % 2 ? 62 : 84, a = i * Math.PI / 12; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.stroke();
      x.fillStyle = INK; x.font = '34px Lalezar'; x.fillText('حراس', 0, -2); x.fillText('المدينة', 0, 34); x.restore();
      showImage(c.toDataURL('image/png'), 'شهادة-حراس-المدينة.png');
    });
  };
}
function refreshAlbum(fresh) {
  $$('.slot').forEach(function (el, i) {
    var s = stories[i], got = state.stickers.indexOf(s.n) >= 0;
    el.className = 'slot' + (got ? ' got' : '') + (fresh === s.n ? ' fresh' : '');
    $('.disc', el).innerHTML = got ? '<img src="' + H(s.hero) + '" alt="ستيكر ' + s.hname + '">' : '؟';
  });
  var p = $('#prog'); if (p) p.textContent = 'جمّعت ' + ar(state.stickers.length) + ' من ٥ ستيكرات';
  $$('.stamp-done').forEach(function (el, i) { el.classList.toggle('on', state.stickers.indexOf(i + 1) >= 0); });
  renderCert();
}

/* ---------- hero designer ---------- */
var POW = ['⚡', '💧', '🌿', '⭐', '🔥'], POWN = ['البرق', 'المايه', 'الطبيعة', 'النجوم', 'النار'];
function heroSVG(suit, pw) {
  var dark = suit === INK;
  var cape = dark ? '#6b1511' : RED; if (suit === RED) cape = '#8d1611';
  var em = dark ? '#ffcc1a' : '#fffaf0';
  return '<svg id="hsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 340" width="520" height="680" font-family="Lalezar, sans-serif">' +
    '<rect width="260" height="340" fill="#fff7e2"/>' +
    '<path d="M80 128 L24 300 Q130 322 236 300 L180 128Z" fill="' + cape + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<rect x="96" y="226" width="26" height="74" rx="8" fill="' + suit + '" stroke="' + INK + '" stroke-width="5"/><rect x="138" y="226" width="26" height="74" rx="8" fill="' + suit + '" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M88 296h42v24H80z M130 296h42l8 24h-50z" fill="' + INK + '"/>' +
    '<path d="M88 130 H172 L178 232 H82Z" fill="' + suit + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M88 138 L52 196" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/><path d="M88 138 L52 196" stroke="' + suit + '" stroke-width="14" stroke-linecap="round"/>' +
    '<path d="M172 138 L208 196" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/><path d="M172 138 L208 196" stroke="' + suit + '" stroke-width="14" stroke-linecap="round"/>' +
    '<circle cx="50" cy="200" r="11" fill="#f2c9a0" stroke="' + INK + '" stroke-width="4"/><circle cx="210" cy="200" r="11" fill="#f2c9a0" stroke="' + INK + '" stroke-width="4"/>' +
    '<rect x="82" y="212" width="96" height="16" fill="' + YEL + '" stroke="' + INK + '" stroke-width="4"/><rect x="120" y="209" width="20" height="22" rx="3" fill="' + YEL + '" stroke="' + INK + '" stroke-width="4"/>' +
    '<circle cx="130" cy="170" r="25" fill="' + (dark ? '#3a342c' : '#fffaf0') + '" stroke="' + INK + '" stroke-width="4"/><text x="130" y="181" text-anchor="middle" font-size="30" fill="' + em + '">' + POW[pw] + '</text>' +
    '<circle cx="130" cy="84" r="42" fill="#f2c9a0" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M88 78 Q94 36 130 34 Q166 36 172 78 Q150 56 130 60 Q110 56 88 78Z" fill="#3a2a1c" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M92 80 Q130 66 168 80 L164 98 Q146 90 130 100 Q114 90 96 98Z" fill="' + suit + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
    '<circle cx="113" cy="87" r="6" fill="#fff"/><circle cx="147" cy="87" r="6" fill="#fff"/><circle cx="114" cy="88" r="3" fill="' + INK + '"/><circle cx="148" cy="88" r="3" fill="' + INK + '"/>' +
    '<path d="M114 112 Q130 126 146 112" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/></svg>';
}
function initDesigner() {
  var d = state.design;
  function redraw() {
    $('#dsvg').innerHTML = heroSVG(d.suit, d.power);
    $('#dline').textContent = (d.name || 'البطل') + '... قوته ' + POWN[d.power] + '!';
    $$('[data-suit]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-suit') === d.suit); });
    $$('[data-pw]').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-pw') === d.power); });
    $('#dname').value = d.name || '';
    state.design = d; save('design');
  }
  $$('[data-suit]').forEach(function (b) { b.onclick = function () { d.suit = b.getAttribute('data-suit'); redraw(); }; });
  $$('[data-pw]').forEach(function (b) { b.onclick = function () { d.power = +b.getAttribute('data-pw'); redraw(); }; });
  $('#dname').oninput = function (e) { d.name = e.target.value; $('#dline').textContent = (d.name || 'البطل') + '... قوته ' + POWN[d.power] + '!'; state.design = d; save('design'); };
  $('#dsave').onclick = function () {
    fontsReady().then(function () {
      var svg = $('#hsvg').outerHTML.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = 520; c.height = 780; var x = c.getContext('2d');
        x.fillStyle = '#fff7e2'; x.fillRect(0, 0, 520, 780); x.drawImage(img, 0, 0, 520, 680);
        x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = BLUE; x.font = '700 40px "Aref Ruqaa"'; x.fillText((d.name || 'البطل') + '... قوته ' + POWN[d.power] + '!', 260, 740);
        showImage(c.toDataURL('image/png'), 'بطلي.png');
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  };
  redraw();
}

/* ---------- coloring ---------- */
var colorState = { hero: 'sino', color: '#d7261e', undo: [] };
function initColoring() {
  var cv = $('#canv'), cx = cv.getContext('2d', { willReadFrequently: true });
  var img = new Image();
  function load(k) {
    colorState.hero = k; colorState.undo = [];
    $$('[data-ch]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-ch') === k); });
    img.onload = function () { cv.width = img.width; cv.height = img.height; cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0); };
    img.src = '/assets/line-' + k + '.png';
  }
  $$('[data-ch]').forEach(function (b) { b.onclick = function () { load(b.getAttribute('data-ch')); }; });
  $$('[data-cr]').forEach(function (b) { b.onclick = function () { colorState.color = b.getAttribute('data-cr'); $$('[data-cr]').forEach(function (o) { o.classList.toggle('on', o === b); }); }; });
  $('[data-cr]').classList.add('on');
  function hex(c) { return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; }
  function fill(px, py) {
    var w = cv.width, h = cv.height, id = cx.getImageData(0, 0, w, h), d = id.data;
    var wall = function (i) { return d[i] < 120 && d[i + 1] < 120 && d[i + 2] < 120; };
    var i0 = (py * w + px) * 4; if (wall(i0)) return;
    var t0 = [d[i0], d[i0 + 1], d[i0 + 2]], rgb = hex(colorState.color);
    if (Math.abs(t0[0] - rgb[0]) + Math.abs(t0[1] - rgb[1]) + Math.abs(t0[2] - rgb[2]) < 6) return;
    colorState.undo.push(cx.getImageData(0, 0, w, h)); if (colorState.undo.length > 15) colorState.undo.shift();
    var same = function (i) { return !wall(i) && Math.abs(d[i] - t0[0]) + Math.abs(d[i + 1] - t0[1]) + Math.abs(d[i + 2] - t0[2]) < 40; };
    var stack = [px, py];
    while (stack.length) {
      var y = stack.pop(), x = stack.pop(); var i = (y * w + x) * 4;
      while (x >= 0 && same(i)) { x--; i -= 4; } x++; i += 4;
      var up = false, dn = false;
      while (x < w && same(i)) {
        d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2];
        if (y > 0) { var iu = i - w * 4; if (same(iu)) { if (!up) { stack.push(x, y - 1); up = true; } } else up = false; }
        if (y < h - 1) { var idn = i + w * 4; if (same(idn)) { if (!dn) { stack.push(x, y + 1); dn = true; } } else dn = false; }
        x++; i += 4;
      }
    }
    cx.putImageData(id, 0, 0);
  }
  cv.addEventListener('click', function (e) {
    var r = cv.getBoundingClientRect();
    fill(Math.max(0, Math.min(cv.width - 1, Math.floor((e.clientX - r.left) * cv.width / r.width))), Math.max(0, Math.min(cv.height - 1, Math.floor((e.clientY - r.top) * cv.height / r.height))));
  });
  $('#cundo').onclick = function () { var u = colorState.undo.pop(); if (u) cx.putImageData(u, 0, 0); };
  $('#cclear').onclick = function () { load(colorState.hero); };
  $('#cdone').onclick = function () { showImage(cv.toDataURL('image/png'), 'تلوين-' + colorState.hero + '.png'); };
  $('#cprint').onclick = function () { var pa = $('#print-area'); pa.innerHTML = '<img alt="" src="' + cv.toDataURL('image/png') + '">'; setTimeout(function () { try { window.print(); } catch (e) {} }, 150); };
  load('sino');
}

/* ---------- drawings ---------- */
var localDraw = store.get('draws', []);
function initDrawings() {
  var board = $('#board'), stat = $('#dstat'), mine = store.get('mydraw', []);
  var list = [];
  function paint() {
    if (!list.length) { board.innerHTML = '<div class="empty">لسه مفيش رسومات معلّقة.<br>كن أول واحد يعلّق رسمة! 🎨</div>'; return; }
    board.innerHTML = list.map(function (d, i) { return '<figure class="dr pin blue" style="margin:0;--rot:' + (d.rot || 0) + 'deg"><img src="' + d.img + '" alt="رسمة"><button type="button" class="btn cream" data-rm="' + i + '">شيل</button></figure>'; }).join('');
    $$('[data-rm]', board).forEach(function (b) { b.onclick = function () {
      var d = list[+b.getAttribute('data-rm')];
      if (online && d.id) { api.delDrawing(d.id).then(function () { list = list.filter(function (x) { return x !== d; }); paint(); }).catch(function () { stat.textContent = 'مش قادر أشيل الرسمة دلوقتي.'; }); }
      else { list = list.filter(function (x) { return x !== d; }); store.set('draws', list.filter(function (x) { return !x.id; })); paint(); }
    }; });
  }
  if (online) { stat.textContent = 'الرسومات مشتركة: أي حد يفتح الموقع هيشوفها.'; api.drawings().then(function (a) { list = a; paint(); }).catch(function () { stat.textContent = 'مش قادر أحمّل الرسومات دلوقتي.'; paint(); }); }
  else { stat.textContent = 'الرسومات هنا على جهازك بس.'; list = localDraw.slice(); paint(); }
  $('#dadd').onclick = function () { $('#dfile').click(); };
  $('#dfile').onchange = function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 700 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        var q = 0.78, url = c.toDataURL('image/jpeg', q); while (url.length > 700000 && q > 0.3) { q -= 0.1; url = c.toDataURL('image/jpeg', q); }
        var rot = Math.round((Math.random() * 10 - 5) * 10) / 10;
        if (online) { stat.textContent = 'بنعلّق الرسمة...'; api.addDrawing(url, rot).then(function (id) { list.unshift({ id: id, img: url, rot: rot }); paint(); stat.textContent = 'الرسمة اتعلّقت وبقت ظاهرة لكل الناس!'; }).catch(function () { stat.textContent = 'مقدرتش أعلّق الرسمة. جرّب تاني.'; }); }
        else { list.unshift({ img: url, rot: rot }); try { store.set('draws', list.slice(0, 6)); } catch (e2) {} paint(); }
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(f); e.target.value = '';
  };
}

/* ---------- vote ---------- */
function initVote() {
  var tally = null, stat = $('#vstat');
  function paint() {
    var tot = tally ? (tally.m + tally.b + tally.f) : 0;
    $$('[data-vote]').forEach(function (b) {
      var k = b.getAttribute('data-vote'); b.classList.toggle('mine', state.vote === k);
      var old = $('.mine-sticker', b); if (old) old.remove();
      if (state.vote === k) b.insertAdjacentHTML('afterbegin', '<span class="mine-sticker">صوتك!</span>');
      if (tally && state.vote) { var p = tot ? Math.round(tally[k] * 100 / tot) : 0; $('[data-pct="' + k + '"]', b).textContent = ar(p) + '٪'; $('[data-bar="' + k + '"]', b).style.width = p + '%'; }
      else { $('[data-pct="' + k + '"]', b).textContent = ''; $('[data-bar="' + k + '"]', b).style.width = '0'; }
    });
    stat.textContent = state.vote ? (online ? 'شكرًا على صوتك! النسب بتتحدّث لحظيًا.' : 'صوتك اتسجّل على جهازك بس.') : 'اختار شرير واحد... صوت واحد لكل جهاز.';
  }
  function refresh() { if (!online) return; api.tally().then(function (t) { tally = t; paint(); }).catch(function () { paint(); }); }
  $$('[data-vote]').forEach(function (b) { b.onclick = function () {
    if (state.vote) { stat.textContent = 'صوّتّ قبل كده... صوت واحد لكل جهاز.'; return; }
    var k = b.getAttribute('data-vote'); state.vote = k; save('vote');
    if (online) api.vote(k).then(refresh).catch(function () { stat.textContent = 'صوتك اتحفظ عندك، بس مقدرتش أبعته للسيرفر.'; }); else { tally = null; }
    paint();
  }; });
  paint(); refresh();
  if (online) window.__vtimer = setInterval(function () { if (state.vote) refresh(); }, 15000);
}

/* ---------- reader ---------- */
function readerHTML(n) {
  var s = stories[n - 1], nx = stories[n];
  var slides = ''; for (var i = 1; i <= 6; i++) slides += '<section class="slide" style="--tilt:' + (i % 2 ? 2 : -2) + 'deg" aria-label="صفحة ' + ar(i) + '"><img src="' + P(n, i) + '" alt="العدد ' + ar(n) + ' صفحة ' + ar(i) + '" width="800" height="1135" loading="' + (i < 3 ? 'eager' : 'lazy') + '" decoding="async" draggable="false"></section>';
  var answers = s.a.map(function (a, i) { return '<button type="button" data-a="' + i + '">' + a + '</button>'; }).join('');
  var end = '<section class="slide" style="--tilt:2deg"><div class="endcard long"><h2>النهاية!</h2><div class="q">' + s.q + '</div><div class="ans">' + answers + '</div><div class="fb" id="fb"></div><div id="gs"></div>' +
    (nx ? '<a class="nxt" data-go href="/story-' + nx.n + '"><img src="' + P(nx.n, 1) + '" alt="" loading="lazy"><span>القصة الجاية<br>العدد ' + ar(nx.n) + ': ' + nx.t + '</span></a><a class="btn big col" style="--c:' + nx.c + '" data-go href="/story-' + nx.n + '">القصة الجاية ⚡</a>' : '<p class="hand" style="font-size:24px">كمّلت كل المغامرات! الخارقون بيشكروك 🎉</p>') +
    '<a class="btn cream" data-go data-after="album" href="/">الفهرس</a></div></section>';
  return '<div class="reader" style="--c:' + s.c + '"><header class="bar-top"><a class="btn cream sm" data-go href="/">الفهرس</a><h1>العدد ' + ar(n) + ': ' + s.t + '</h1><span class="counter" id="cnt">١ / ٦</span></header>' +
    '<div class="stage"><div class="car" id="car" tabindex="0" aria-label="صفحات القصة">' + slides + end + '</div></div>' +
    '<nav class="ctrl" aria-label="التنقل"><button type="button" class="btn cream" id="prev" aria-label="الصفحة السابقة">→</button><div class="dots" id="dots">' + Array(8).join('x').split('').map(function (_, i) { return '<button type="button" class="dot" data-d="' + i + '" aria-label="' + (i < 6 ? 'صفحة ' + ar(i + 1) : 'النهاية') + '"></button>'; }).join('') + '</div><button type="button" class="btn cream" id="next" aria-label="الصفحة التالية">←</button></nav></div>';
}
function initReader(n) {
  var s = stories[n - 1], car = $('#car'), slides = $$('.slide', car), active = 0;
  state.last = n; save('last');
  function set(i) {
    active = i;
    slides.forEach(function (el, k) { var d = Math.abs(k - i); el.classList.toggle('cur', d === 0); el.classList.toggle('d2', d > 1); });
    $$('.dot').forEach(function (b, k) { b.classList.toggle('on', k === i); });
    $('#cnt').textContent = i < 6 ? ar(i + 1) + ' / ٦' : 'النهاية';
    $('#prev').disabled = i === 0; $('#next').disabled = i === 6;
    var nx = slides[i + 1]; if (nx) { var im = $('img', nx); if (im) { im.loading = 'eager'; var pre = new Image(); pre.src = im.src; } }
  }
  function goTo(i) { i = Math.max(0, Math.min(6, i)); slides[i].scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }); set(i); }
  var raf = 0;
  car.addEventListener('scroll', function () {
    cancelAnimationFrame(raf); raf = requestAnimationFrame(function () {
      var cr = car.getBoundingClientRect(), mid = cr.left + cr.width / 2, best = 0, bd = 1e9;
      slides.forEach(function (el, k) { var r = el.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = k; } });
      if (best !== active) set(best);
    });
  }, { passive: true });
  $('#prev').onclick = function () { goTo(active - 1); };
  $('#next').onclick = function () { goTo(active + 1); };
  $$('.dot').forEach(function (b) { b.onclick = function () { goTo(+b.getAttribute('data-d')); }; });
  window.__key = function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active + 1); } else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active - 1); } };
  document.addEventListener('keydown', window.__key);
  // quiz
  var done = state.stickers.indexOf(n) >= 0;
  function showSticker() { $('#gs').innerHTML = '<div class="got-sticker"><img src="' + H(s.hero) + '" alt=""><span>كسبت ستيكر ' + s.hname + '!</span></div>'; }
  if (done) { $$('[data-a]').forEach(function (b) { if (+b.getAttribute('data-a') === s.ok) b.classList.add('right'); }); $('#fb').textContent = 'برافو عليك!'; showSticker(); }
  $$('[data-a]').forEach(function (b) { b.onclick = function () {
    var i = +b.getAttribute('data-a');
    if (i === s.ok) {
      b.classList.add('right'); $('#fb').textContent = 'برافو عليك!';
      if (state.stickers.indexOf(n) < 0) { state.stickers.push(n); save('stickers'); window.__fresh = n; }
      showSticker();
    } else { b.classList.add('wrong'); $('#fb').textContent = 'قرّبت... جرّب تاني!'; }
  }; });
  set(0); toTop();
}

/* ---------- router ---------- */
function cleanup() { if (window.__key) { document.removeEventListener('keydown', window.__key); window.__key = null; } if (window.__vtimer) { clearInterval(window.__vtimer); window.__vtimer = null; } }
function render() {
  cleanup();
  var path = location.pathname.replace(/\/+$/, '') || '/', app = $('#app'), m = /^\/story-([1-5])$/.exec(path);
  if (m) { var n = +m[1]; app.innerHTML = readerHTML(n); document.title = 'العدد ' + ar(n) + ': ' + stories[n - 1].t + ' — الخارقون'; initReader(n); return; }
  document.title = 'الخارقون — حراس المدينة';
  app.innerHTML = homeHTML();
  $$('[data-scroll]').forEach(function (b) { b.onclick = function () { scrollToId(b.getAttribute('data-scroll')); }; });
  $$('.card').forEach(function (c, i) { reveal(c, 'in', 0); });
  $$('.wanted').forEach(function (c) { reveal(c, 'in', 150); });
  $$('[data-pop]').forEach(function (c) { var t; var on = function () { c.classList.add('pop'); clearTimeout(t); t = setTimeout(function () { c.classList.remove('pop'); }, 1100); }; c.addEventListener('pointerdown', on); c.addEventListener('mouseenter', on); });
  $$('[data-hc]').forEach(function (c) { var t; c.onclick = function () { c.classList.remove('on'); void c.offsetWidth; c.classList.add('on'); clearTimeout(t); t = setTimeout(function () { c.classList.remove('on'); }, 2800); }; });
  initDesigner(); initColoring(); initDrawings(); initVote(); renderCert();
  var fresh = window.__fresh, after = window.__after; window.__fresh = null; window.__after = null;
  if (after === 'album' || fresh) { setTimeout(function () { scrollToId('album'); if (fresh) setTimeout(function () { refreshAlbum(fresh); }, 500); }, 80); } else toTop();
}

/* ---------- boot ---------- */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
render();
var ld = $('#loading'); function hideLoad() { ld.classList.add('done'); setTimeout(function () { ld.remove(); }, 500); }
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(hideLoad, 250); });
setTimeout(hideLoad, 2500);
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
})();
