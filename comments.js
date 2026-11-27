/* تعليقات الجمهور — audience comments (Supabase, moderated) */
(function () {
'use strict';
var AR = '٠١٢٣٤٥٦٧٨٩';
var ar = function (n) { return String(n).replace(/\d/g, function (d) { return AR[+d]; }); };
var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
var cfg = window.KH_CFG || {};
var online = !!(cfg.projectId && cfg.apiKey);
var SB = online ? 'https://' + cfg.projectId + '.supabase.co/rest/v1' : '';
function sbh() { return { apikey: cfg.apiKey, Authorization: 'Bearer ' + cfg.apiKey, 'Content-Type': 'application/json' }; }
function tfetch(url, opts, ms) {
  opts = opts || {}; ms = ms || 6000;
  var ctl = ('AbortController' in window) ? new AbortController() : null;
  if (ctl) opts.signal = ctl.signal;
  var done = false, t = setTimeout(function () { if (!done && ctl) ctl.abort(); }, ms);
  return fetch(url, opts).then(function (r) { done = true; clearTimeout(t); return r; }, function (e) { done = true; clearTimeout(t); throw e; });
}
function adminCode() { try { return sessionStorage.getItem('kh.cmt.admin') || ''; } catch (e) { return ''; } }
function setAdminCode(c) { try { sessionStorage.setItem('kh.cmt.admin', c); } catch (e) {} }

var api = {
  list: function (topic) {
    return tfetch(SB + '/comments?select=id,name,body,t&topic=eq.' + encodeURIComponent(topic) + '&order=t.desc&limit=30', { headers: sbh() })
      .then(function (r) { if (!r.ok) throw new Error('list'); return r.json(); });
  },
  add: function (topic, name, body) {
    return tfetch(SB + '/comments', { method: 'POST', headers: sbh(), body: JSON.stringify({ topic: topic, name: name, body: body, t: Date.now() }) })
      .then(function (r) { if (!r.ok) { var e = new Error('add'); e.status = r.status; throw e; } });
  },
  pending: function (code) {
    return tfetch(SB + '/rpc/pending_comments', { method: 'POST', headers: sbh(), body: JSON.stringify({ p_code: code }) })
      .then(function (r) { if (!r.ok) { var e = new Error('pending'); e.status = r.status; throw e; } return r.json(); });
  },
  moderate: function (code, id, action) {
    return tfetch(SB + '/rpc/moderate_comment', { method: 'POST', headers: sbh(), body: JSON.stringify({ p_code: code, p_id: id, p_action: action }) })
      .then(function (r) { if (!r.ok) throw new Error('mod'); return r.json(); });
  }
};

function when(t) {
  var d = new Date(+t || 0);
  if (isNaN(d)) return '';
  var days = ['الأحد', 'الاتنين', 'التلات', 'الأربع', 'الخميس', 'الجمعة', 'السبت'];
  return days[d.getDay()] + ' ' + ar(d.getDate()) + '/' + ar(d.getMonth() + 1);
}

function commentHTML(c, isAdmin, pending) {
  return '<div class="cmt' + (pending ? ' pending' : '') + '"><div class="cmt-h"><b>' + esc(c.name || 'زائر') + '</b><span class="cmt-w">' + when(c.t) + '</span></div>' +
    '<p class="cmt-b">' + esc(c.body) + '</p>' +
    (isAdmin ? '<div class="cmt-adm">' +
      (pending ? '<button type="button" class="btn sm" data-apr="' + c.id + '">انشر ✅</button>' : '<button type="button" class="btn sm cream" data-hide="' + c.id + '">اخفي</button>') +
      '<button type="button" class="btn sm cream" data-del="' + c.id + '">امسح 🗑</button></div>' : '') + '</div>';
}

function sectionHTML(topic, title, sub) {
  return '<section class="sec cmts-sec" id="cmts" data-topic="' + esc(topic) + '">' +
    '<h2>' + esc(title) + '</h2>' +
    '<svg class="wob" viewBox="0 0 200 14" aria-hidden="true"><path d="M3 8 Q 14 1 26 8 T 50 7 T 76 8 T 102 6 T 128 8 T 154 7 T 180 8 T 197 6" fill="none" stroke="#2a7fd4" stroke-width="5" stroke-linecap="round"/></svg>' +
    (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') +
    '<div class="cmts paper tape">' +
      '<div class="cmts-list" id="cmts-list"><p class="cmts-stat">بنحمّل التعليقات...</p></div>' +
      '<form class="cmts-form" id="cmts-form">' +
        '<input class="field" id="cmt-name" maxlength="40" placeholder="اسمك (مش لازم)" autocomplete="off">' +
        '<textarea class="field" id="cmt-body" maxlength="500" rows="3" placeholder="اكتب تعليقك هنا..." required></textarea>' +
        '<button type="submit" class="btn big" id="cmt-send">ابعت التعليق 💬</button>' +
        '<p class="cmts-note">تعليقك بيتراجع الأول وبعدين بينشر للكل. <button type="button" class="cmt-gear" id="cmt-gear" aria-label="إدارة التعليقات" title="إدارة التعليقات">⚙</button></p>' +
        '<p class="cmts-msg" id="cmts-msg"></p>' +
      '</form>' +
      '<div class="cmts-admin">' +
      '<div class="cmts-login" id="cmts-login" hidden><input class="field" id="cmt-code" type="password" inputmode="text" placeholder="كود الإدارة" autocomplete="off"><button type="button" class="btn sm" id="cmt-enter">دخول</button><p class="cmts-msg" id="cmts-loginmsg"></p></div>' +
      '<div class="cmts-pending" id="cmts-pending" hidden></div></div>' +
    '</div></section>';
}

function initSection(sec) {
  var topic = sec.getAttribute('data-topic');
  var list = sec.querySelector('#cmts-list'), form = sec.querySelector('#cmts-form');
  var msg = sec.querySelector('#cmts-msg');
  var isAdmin = false, items = [];

  function paint() {
    if (!online) { list.innerHTML = '<p class="cmts-stat">التعليقات محتاجة نت عشان تظهر.</p>'; return; }
    if (!items.length) { list.innerHTML = '<p class="cmts-stat">لسه مفيش تعليقات... كن أول واحد يكتب! 🎉</p>'; return; }
    list.innerHTML = items.map(function (c) { return commentHTML(c, isAdmin, false); }).join('');
    wireAdminButtons();
  }
  function load() {
    if (!online) { paint(); return; }
    api.list(topic).then(function (a) { items = a; paint(); }).catch(function () { list.innerHTML = '<p class="cmts-stat">مش قادر أحمّل التعليقات دلوقتي.</p>'; });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = sec.querySelector('#cmt-name').value.trim();
    var body = sec.querySelector('#cmt-body').value.trim();
    if (!body) return;
    if (!online) { msg.textContent = 'مفيش نت... جرّب تاني لما النت يرجع.'; return; }
    var btn = sec.querySelector('#cmt-send'); btn.disabled = true; msg.textContent = 'بنبعت...';
    api.add(topic, name, body).then(function () {
      msg.textContent = 'وصل! تعليقك هيظهر بعد المراجعة ✅';
      sec.querySelector('#cmt-body').value = '';
    }).catch(function (err) {
      msg.textContent = (err && err.status === 401) ? 'التعليق مرفوض: ممنوع روابط أو كلام طويل أوي.' : 'حصلت مشكلة... جرّب تاني.';
    }).then(function () { btn.disabled = false; });
  });

  /* ----- admin ----- */
  var gear = sec.querySelector('#cmt-gear'), login = sec.querySelector('#cmts-login'), pendBox = sec.querySelector('#cmts-pending');
  function paintPending(a) {
    pendBox.hidden = false;
    if (!a.length) { pendBox.innerHTML = '<p class="cmts-stat">مفيش تعليقات مستنية المراجعة 👍</p>'; return; }
    pendBox.innerHTML = '<h4>مستنية المراجعة (' + ar(a.length) + ')</h4>' + a.map(function (c) {
      return '<div class="cmt-src">' + (c.topic === 'general' ? 'الصفحة العامة' : 'العدد ' + ar(c.topic.slice(1))) + '</div>' + commentHTML(c, true, true);
    }).join('');
    wireAdminButtons();
  }
  function loadPending() {
    api.pending(adminCode()).then(paintPending).catch(function () {
      setAdminCode(''); isAdmin = false; login.hidden = false; pendBox.hidden = true;
      sec.querySelector('#cmts-loginmsg').textContent = 'الكود غلط أو في مشكلة نت.';
    });
  }
  function wireAdminButtons() {
    sec.querySelectorAll('[data-apr]').forEach(function (b) { b.onclick = function () { b.disabled = true; api.moderate(adminCode(), +b.getAttribute('data-apr'), 'approve').then(function () { loadPending(); load(); }).catch(function () { b.disabled = false; }); }; });
    sec.querySelectorAll('[data-hide]').forEach(function (b) { b.onclick = function () { b.disabled = true; api.moderate(adminCode(), +b.getAttribute('data-hide'), 'hide').then(function () { load(); }).catch(function () { b.disabled = false; }); }; });
    sec.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { b.disabled = true; api.moderate(adminCode(), +b.getAttribute('data-del'), 'delete').then(function () { loadPending(); load(); }).catch(function () { b.disabled = false; }); }; });
  }
  gear.onclick = function () {
    if (isAdmin) { login.hidden = true; pendBox.hidden = !pendBox.hidden; if (!pendBox.hidden) loadPending(); return; }
    login.hidden = !login.hidden;
  };
  sec.querySelector('#cmt-enter').onclick = function () {
    var code = sec.querySelector('#cmt-code').value.trim();
    if (!code) return;
    sec.querySelector('#cmts-loginmsg').textContent = '...';
    api.pending(code).then(function (a) {
      setAdminCode(code); isAdmin = true; login.hidden = true;
      sec.querySelector('#cmts-loginmsg').textContent = '';
      paintPending(a); paint();
    }).catch(function () { sec.querySelector('#cmts-loginmsg').textContent = 'الكود غلط.'; });
  };
  if (adminCode()) { isAdmin = true; loadPending(); }
  load();
}

function place() {
  var app = document.getElementById('app');
  if (!app || app.querySelector('.cmts-sec')) return;
  var m = /^\/story-(\d+)$/.exec(location.pathname.replace(/\/+$/, '') || '/');
  if (m && app.querySelector('.reader')) {
    app.insertAdjacentHTML('beforeend', sectionHTML('s' + m[1], 'تعليقات الجمهور', 'قول رأيك في القصة دي! 💬'));
  } else if (!m && app.querySelector('footer.foot')) {
    app.querySelector('footer.foot').insertAdjacentHTML('beforebegin', sectionHTML('general', 'كلام الجمهور', 'عجبك الموقع؟ عندك فكرة لقصة؟ اكتبها هنا!'));
  } else return;
  var sec = app.querySelector('.cmts-sec');
  if (sec) initSection(sec);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
function boot() {
  place();
  var app = document.getElementById('app');
  if (app && 'MutationObserver' in window) {
    new MutationObserver(function () { place(); }).observe(app, { childList: true });
  }
}
})();
