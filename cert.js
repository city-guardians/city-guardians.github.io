/* Certificate v2: comic-style landscape A4 card. Art is drawn in code, all Arabic text is real fonts. */
(function () {
'use strict';
var W = 1754, H = 1240, RED = '#d7261e', YEL = '#ffcc1a', INK = '#1b1712', NAVY = '#15348a', BLUE = '#2a7fd4', ORG = '#f07c12', CREAM = '#fffaf0';
var photo = null, zoom = 1, offX = 0, offY = 0;
function loadHero(cb) { cb(); }
function cover(x, im, dx, dy, dw, dh) {
  var iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
  var sc = Math.max(dw / iw, dh / ih) * zoom, sw = dw / sc, sh = dh / sc;
  var sx = (iw - sw) / 2 + offX * (iw - sw) / 2, sy = (ih - sh) / 2 + offY * (ih - sh) / 2;
  sx = Math.max(0, Math.min(iw - sw, sx)); sy = Math.max(0, Math.min(ih - sh, sy));
  x.drawImage(im, sx, sy, sw, sh, dx, dy, dw, dh);
}
function who(x, cx, cy, k, fill) {
  x.save(); x.translate(cx, cy); x.scale(k, k); x.fillStyle = fill;
  x.beginPath(); x.arc(0, -40, 62, 0, 7); x.fill();
  x.beginPath(); x.moveTo(-120, 130); x.quadraticCurveTo(-120, 40, 0, 40); x.quadraticCurveTo(120, 40, 120, 130); x.closePath(); x.fill();
  x.restore();
}
function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function burst(x, cx, cy, r1, r2, n, fill, stroke, lw, rot) {
  x.beginPath();
  for (var i = 0; i < n * 2; i++) { var a = rot + Math.PI * i / n, r = i % 2 ? r1 : r2; x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.lineJoin = 'round'; x.stroke(); }
}
function star(x, cx, cy, r, fill, rot) { burst(x, cx, cy, r * 0.45, r, 5, fill || YEL, INK, Math.max(3, r / 7), (rot || 0) - Math.PI / 2); }
function bolt(x, cx, cy, s, fill) {
  var p = [[0.1, -1], [-0.55, 0.1], [-0.08, 0.1], [-0.35, 1], [0.55, -0.15], [0.05, -0.15], [0.45, -1]];
  x.beginPath(); p.forEach(function (q, i) { x[i ? 'lineTo' : 'moveTo'](cx + q[0] * s, cy + q[1] * s); }); x.closePath();
  x.fillStyle = fill || YEL; x.fill(); x.strokeStyle = INK; x.lineWidth = Math.max(4, s / 10); x.lineJoin = 'round'; x.stroke();
}
function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function dots(x, x0, y0, w, h, step, maxr, col, alpha, fx, fy) {
  x.save(); x.fillStyle = col; x.globalAlpha = alpha;
  for (var j = 0; j * step < h; j++) for (var i = 0; i * step < w; i++) {
    var px = x0 + i * step + (j % 2) * step / 2, py = y0 + j * step;
    var d = Math.sqrt(Math.pow((px - fx) / w, 2) + Math.pow((py - fy) / h, 2)); var r = maxr * Math.max(0, 1 - d * 1.1);
    if (r > 0.6) { x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
  } x.restore();
}
function skyline(x, base, hmin, hmax, col, seed, win) {
  var r = rng(seed), px = -20;
  while (px < W) {
    var w = 70 + r() * 90, h = hmin + r() * (hmax - hmin);
    x.fillStyle = col; x.fillRect(px, base - h, w, h + 5);
    x.strokeStyle = INK; x.lineWidth = 4; x.strokeRect(px, base - h, w, h + 5);
    if (r() > 0.6) { x.fillStyle = col; x.fillRect(px + w * 0.4, base - h - 40, 8, 40); }
    if (win) { for (var wy = base - h + 22; wy < base - 18; wy += 34) for (var wx = px + 14; wx < px + w - 22; wx += 26) { if (r() > 0.45) { x.fillStyle = '#ffe27a'; x.fillRect(wx, wy, 12, 17); } } }
    px += w;
  }
}
function txt(x, s, cx, cy, font, fill, stroke, lw, maxw) {
  x.font = font;
  if (maxw) { var m = x.measureText(s).width; if (m > maxw) { var f = maxw / m; x.font = font.replace(/(\d+)px/, function (_, n) { return Math.floor(n * f) + 'px'; }); } }
  x.lineJoin = 'round';
  if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.strokeText(s, cx, cy); }
  x.fillStyle = fill; x.fillText(s, cx, cy);
}
function logo(x, cx, cy, k) {
  x.save(); x.translate(cx, cy); x.rotate(-0.04); x.scale(k, k);
  x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowOffsetX = 8; x.shadowOffsetY = 8; x.fillStyle = INK; x.fillRect(-252, -62, 504, 124); x.shadowColor = 'transparent';
  x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = '#fff'; x.font = '86px Lalezar';
  var hw = x.measureText('حراس').width, hx = 82; x.fillText('حراس', hx, 32);
  x.fillRect(hx - hw / 2 - 16, -50, hw + 32, 6); x.fillRect(hx - hw / 2 - 16, 46, hw + 32, 6);
  x.font = '48px Lalezar'; var mw = x.measureText('المدينة').width, bw = mw + 34, bx = -222;
(function () {
'use strict';
var W = 1754, H = 1240, RED = '#d7261e', YEL = '#ffcc1a', INK = '#1b1712', NAVY = '#15348a', BLUE = '#2a7fd4', ORG = '#f07c12', CREAM = '#fffaf0';
var photo = null, zoom = 1, offX = 0, offY = 0;
var sino = new Image(); sino.src = '/assets/sino.jpg';
function loadHero(cb) { if (sino.complete && sino.naturalWidth) cb(); else { sino.addEventListener('load', cb, { once: true }); sino.addEventListener('error', cb, { once: true }); } }
function cover(x, im, dx, dy, dw, dh) {
  var iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
  var sc = Math.max(dw / iw, dh / ih) * zoom, sw = dw / sc, sh = dh / sc;
  var sx = (iw - sw) / 2 + offX * (iw - sw) / 2, sy = (ih - sh) / 2 + offY * (ih - sh) / 2;
  sx = Math.max(0, Math.min(iw - sw, sx)); sy = Math.max(0, Math.min(ih - sh, sy));
  x.drawImage(im, sx, sy, sw, sh, dx, dy, dw, dh);
}
function who(x, cx, cy, k, fill) {
  x.save(); x.translate(cx, cy); x.scale(k, k); x.fillStyle = fill;
  x.beginPath(); x.arc(0, -40, 62, 0, 7); x.fill();
  x.beginPath(); x.moveTo(-120, 130); x.quadraticCurveTo(-120, 40, 0, 40); x.quadraticCurveTo(120, 40, 120, 130); x.closePath(); x.fill();
  x.restore();
}
function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
function burst(x, cx, cy, r1, r2, n, fill, stroke, lw, rot) {
  x.beginPath();
  for (var i = 0; i < n * 2; i++) { var a = rot + Math.PI * i / n, r = i % 2 ? r1 : r2; x[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
  x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.lineJoin = 'round'; x.stroke(); }
}
function star(x, cx, cy, r, fill, rot) { burst(x, cx, cy, r * 0.45, r, 5, fill || YEL, INK, Math.max(3, r / 7), (rot || 0) - Math.PI / 2); }
function bolt(x, cx, cy, s, fill) {
  var p = [[0.1, -1], [-0.55, 0.1], [-0.08, 0.1], [-0.35, 1], [0.55, -0.15], [0.05, -0.15], [0.45, -1]];
  x.beginPath(); p.forEach(function (q, i) { x[i ? 'lineTo' : 'moveTo'](cx + q[0] * s, cy + q[1] * s); }); x.closePath();
  x.fillStyle = fill || YEL; x.fill(); x.strokeStyle = INK; x.lineWidth = Math.max(4, s / 10); x.lineJoin = 'round'; x.stroke();
}
function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function dots(x, x0, y0, w, h, step, maxr, col, alpha, fx, fy) {
  x.save(); x.fillStyle = col; x.globalAlpha = alpha;
  for (var j = 0; j * step < h; j++) for (var i = 0; i * step < w; i++) {
    var px = x0 + i * step + (j % 2) * step / 2, py = y0 + j * step;
    var d = Math.sqrt(Math.pow((px - fx) / w, 2) + Math.pow((py - fy) / h, 2)); var r = maxr * Math.max(0, 1 - d * 1.1);
    if (r > 0.6) { x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); }
  } x.restore();
}
function skyline(x, base, hmin, hmax, col, seed, win) {
  var r = rng(seed), px = -20;
  while (px < W) {
    var w = 70 + r() * 90, h = hmin + r() * (hmax - hmin);
    x.fillStyle = col; x.fillRect(px, base - h, w, h + 5);
    x.strokeStyle = INK; x.lineWidth = 4; x.strokeRect(px, base - h, w, h + 5);
    if (r() > 0.6) { x.fillStyle = col; x.fillRect(px + w * 0.4, base - h - 40, 8, 40); }
    if (win) { for (var wy = base - h + 22; wy < base - 18; wy += 34) for (var wx = px + 14; wx < px + w - 22; wx += 26) { if (r() > 0.45) { x.fillStyle = '#ffe27a'; x.fillRect(wx, wy, 12, 17); } } }
    px += w;
  }
}
function txt(x, s, cx, cy, font, fill, stroke, lw, maxw) {
  x.font = font;
  if (maxw) { var m = x.measureText(s).width; if (m > maxw) { var f = maxw / m; x.font = font.replace(/(\d+)px/, function (_, n) { return Math.floor(n * f) + 'px'; }); } }
  x.lineJoin = 'round';
  if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.strokeText(s, cx, cy); }
  x.fillStyle = fill; x.fillText(s, cx, cy);
}
function logo(x, cx, cy, k) {
  x.save(); x.translate(cx, cy); x.rotate(-0.04); x.scale(k, k);
  x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowOffsetX = 8; x.shadowOffsetY = 8; x.fillStyle = INK; x.fillRect(-252, -62, 504, 124); x.shadowColor = 'transparent';
  x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = '#fff'; x.font = '86px Lalezar';
  var hw = x.measureText('حراس').width, hx = 82; x.fillText('حراس', hx, 32);
  x.fillRect(hx - hw / 2 - 16, -50, hw + 32, 6); x.fillRect(hx - hw / 2 - 16, 46, hw + 32, 6);
  x.font = '48px Lalezar'; var mw = x.measureText('المدينة').width, bw = mw + 34, bx = -222;
  x.fillStyle = RED; x.fillRect(bx, -42, bw, 84); x.fillStyle = '#fff'; x.fillText('المدينة', bx + bw / 2, 20);
  x.restore();
}
function medal(x, cx, cy) {
  x.save(); x.translate(cx, cy);
  [[-1, RED], [1, '#2a5fd0']].forEach(function (o) { x.save(); x.rotate(o[0] * 0.28); x.fillStyle = o[1]; x.strokeStyle = INK; x.lineWidth = 5; x.beginPath(); x.moveTo(-26, -20); x.lineTo(26, -20); x.lineTo(26 + o[0] * 14, -112); x.lineTo(0 + o[0] * 14, -96); x.lineTo(-26 + o[0] * 14, -112); x.closePath(); x.fill(); x.stroke(); x.restore(); });
  var g = x.createRadialGradient(-18, -18, 6, 0, 0, 78); g.addColorStop(0, '#fff2a8'); g.addColorStop(0.5, '#ffcc1a'); g.addColorStop(1, '#d9930a');
  x.beginPath(); x.arc(0, 0, 76, 0, 7); x.fillStyle = g; x.fill(); x.strokeStyle = INK; x.lineWidth = 6; x.stroke();
  x.beginPath(); x.arc(0, 0, 58, 0, 7); x.strokeStyle = '#a86a00'; x.lineWidth = 4; x.stroke();
  star(x, 0, 2, 40, RED, 0); x.restore();
}
function seal(x, cx, cy) {
  x.save(); x.translate(cx, cy);
  burst(x, 0, 0, 70, 84, 20, RED, INK, 5, 0);
  x.beginPath(); x.arc(0, 0, 60, 0, 7); x.strokeStyle = '#fff'; x.lineWidth = 4; x.stroke();
  x.beginPath(); x.arc(0, 0, 50, 0, 7); x.strokeStyle = YEL; x.lineWidth = 2; x.stroke();
  x.direction = 'rtl'; x.textAlign = 'center'; txt(x, 'حراس', 0, -4, '32px Lalezar', '#fff', null, 0); txt(x, 'المدينة', 0, 30, '30px Lalezar', YEL, null, 0);
  star(x, 0, -34, 10, YEL, 0);
  x.restore();
}

function draw(c, name, scale) {
  scale = scale || 1; c.width = Math.round(W * scale); c.height = Math.round(H * scale);
  var x = c.getContext('2d'); x.setTransform(scale, 0, 0, scale, 0, 0); x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  /* sky */
  var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b53c9'); g.addColorStop(0.55, '#5fb4f5'); g.addColorStop(1, '#bfe6ff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  /* rays */
  x.save(); x.translate(1000, 620); for (var i = 0; i < 32; i++) { x.rotate(Math.PI / 16); x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.moveTo(0, 0); x.lineTo(2400, -90); x.lineTo(2400, 90); x.closePath(); x.fill(); } x.restore();
  var sun = x.createRadialGradient(1000, 620, 20, 1000, 620, 700); sun.addColorStop(0, 'rgba(255,240,170,.75)'); sun.addColorStop(1, 'rgba(255,240,170,0)'); x.fillStyle = sun; x.fillRect(0, 0, W, H);
  dots(x, 0, 0, 640, 520, 22, 8, NAVY, 0.28, 0, 0); dots(x, W - 640, 0, 640, 520, 22, 8, NAVY, 0.28, 640, 0);
  dots(x, 0, 700, 560, 540, 22, 8, '#e8590c', 0.35, 0, 540);
  /* skyline */
  skyline(x, H + 6, 200, 430, '#2f63c4', 11, false); skyline(x, H + 6, 90, 250, '#173a8f', 29, true);
  /* hero side */
  burst(x, 305, 640, 300, 400, 16, YEL, INK, 8, 0.1); burst(x, 305, 640, 250, 330, 16, '#fff3b0', null, 0, 0.3);
  bolt(x, 90, 190, 80, YEL); bolt(x, 520, 150, 60, '#ff8a1f'); star(x, 80, 1010, 50, YEL, 0.2); star(x, 520, 1000, 36, '#fff', -0.2);
  /* text card */
  var cx = 1125; x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowOffsetX = 14; x.shadowOffsetY = 16; rr(x, 560, 70, 1130, 1000, 26); x.fillStyle = CREAM; x.fill(); x.restore();
  rr(x, 560, 70, 1130, 1000, 26); x.strokeStyle = INK; x.lineWidth = 9; x.stroke();
  rr(x, 584, 94, 1082, 952, 16); x.strokeStyle = RED; x.lineWidth = 5; x.stroke(); rr(x, 598, 108, 1054, 924, 10); x.strokeStyle = YEL; x.lineWidth = 3; x.stroke();
  dots(x, 600, 110, 1050, 920, 26, 7, YEL, 0.22, 1100, 40);
  logo(x, cx, 192, 0.8);
  txt(x, 'شهادة العضوية الرسمية', cx, 345, '104px Lalezar', RED, INK, 9, 1000);
  txt(x, 'تشهد حراس المدينة بأن البطل', cx, 440, '700 56px "Aref Ruqaa"', INK, null, 0, 1000);
  /* name ribbon */
  var rg = x.createLinearGradient(0, 470, 0, 610); rg.addColorStop(0, '#ffe680'); rg.addColorStop(1, '#f2a900');
  x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowOffsetY = 8; x.beginPath(); x.moveTo(740, 480); x.lineTo(1510, 480); x.lineTo(1560, 545); x.lineTo(1510, 610); x.lineTo(740, 610); x.lineTo(690, 545); x.closePath(); x.fillStyle = rg; x.fill(); x.restore();
  x.strokeStyle = INK; x.lineWidth = 6; x.lineJoin = 'round'; x.beginPath(); x.moveTo(740, 480); x.lineTo(1510, 480); x.lineTo(1560, 545); x.lineTo(1510, 610); x.lineTo(740, 610); x.lineTo(690, 545); x.closePath(); x.stroke();
  var nm = (name || '').trim() || '........'; txt(x, nm, cx, 575, '116px Lalezar', NAVY, '#fff', 8, 700);
  txt(x, 'أصبح عضواً رسمياً في فريق حراس المدينة!', cx, 710, '700 52px "Aref Ruqaa"', INK, null, 0, 1000);
  /* headline */
  burst(x, cx, 830, 70, 110, 14, RED, INK, 6, 0); rr(x, cx - 270, 770, 540, 120, 60); x.fillStyle = RED; x.fill(); x.strokeStyle = INK; x.lineWidth = 7; x.stroke();
  txt(x, 'مبروك يا بطل!', cx, 858, '92px Lalezar', YEL, INK, 8, 480);
  star(x, cx - 330, 830, 34, YEL, 0.3); star(x, cx + 330, 830, 34, YEL, -0.3);
  medal(x, 790, 965); seal(x, 1460, 975);
  txt(x, 'عضو رسمي', 1125, 985, '40px Lalezar', NAVY, null, 0); txt(x, 'ختم حراس المدينة', 1125, 1030, '30px Lalezar', RED, null, 0, 360);
  /* hero panel */
  x.save(); x.translate(305, 640); x.rotate(-0.05);
  x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowOffsetX = 12; x.shadowOffsetY = 14; x.fillStyle = '#fff'; x.fillRect(-236, -314, 472, 628); x.shadowColor = 'transparent';
  if (photo) { x.save(); x.beginPath(); x.rect(-222, -300, 444, 592); x.clip(); cover(x, photo, -222, -300, 444, 592); x.restore(); }
  else {
    var pg = x.createLinearGradient(0, -300, 0, 292); pg.addColorStop(0, '#5fb4f5'); pg.addColorStop(1, '#1b53c9'); x.fillStyle = pg; x.fillRect(-222, -300, 444, 592);
    dots(x, -222, -300, 444, 592, 20, 7, NAVY, 0.25, 0, 0);
    who(x, 0, -30, 1.9, 'rgba(255,255,255,.88)'); x.strokeStyle = INK; x.lineWidth = 0;
    x.save(); x.beginPath(); x.rect(-222, -300, 444, 592); x.clip(); x.restore();
    x.beginPath(); x.arc(150, -210, 46, 0, 7); x.fillStyle = YEL; x.fill(); x.strokeStyle = INK; x.lineWidth = 6; x.stroke();
    x.fillStyle = INK; x.fillRect(142, -232, 16, 44); x.fillRect(128, -218, 44, 16);
    x.direction = 'rtl'; x.textAlign = 'center'; txt(x, 'ضيف صورتك', 0, 150, '78px Lalezar', YEL, INK, 12, 400);
  }
  x.strokeStyle = INK; x.lineWidth = 7; x.strokeRect(-236, -314, 472, 628); x.strokeStyle = YEL; x.lineWidth = 5; x.strokeRect(-222, -300, 444, 592);
  x.restore();
  txt(x, 'بطل حراس المدينة', 215, 1005, '56px Lalezar', YEL, INK, 10, 330);
  star(x, 560, 300, 40, YEL, 0.2);
  /* round face badge */
  x.save(); x.translate(500, 930); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowOffsetX = 6; x.shadowOffsetY = 8;
  burst(x, 0, 0, 92, 106, 24, YEL, INK, 6, 0); x.shadowColor = 'transparent';
  x.beginPath(); x.arc(0, 0, 80, 0, 7); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = RED; x.lineWidth = 8; x.stroke();
  x.save(); x.beginPath(); x.arc(0, 0, 70, 0, 7); x.clip();
  x.fillStyle = '#5fb4f5'; x.fillRect(-70, -70, 140, 140);
  if (sino.complete && sino.naturalWidth) x.drawImage(sino, 125, 12, 310, 310, -70, -70, 140, 140); else who(x, 0, 18, 0.5, 'rgba(255,255,255,.9)');
  x.restore();
  x.beginPath(); x.arc(0, 0, 70, 0, 7); x.strokeStyle = INK; x.lineWidth = 4; x.stroke(); x.restore();
}

var busy = false;
function enhance() {
  var box = document.getElementById('certbox'); if (!box) return;
  var cert = box.querySelector('.cert'); if (!cert || cert.getAttribute('data-v2')) return;
  var inp = cert.querySelector('#cname'), old = cert.querySelector('#csave'); if (!inp || !old) return;
  cert.setAttribute('data-v2', '1'); cert.className = 'cert cert2';
  var inn = cert.querySelector('.cert-in'); inn.className = 'cert-in2'; inn.removeAttribute('style');
  Array.prototype.slice.call(inn.children).forEach(function (el) { if (el !== inp && el !== old) el.style.display = 'none'; });
  var cv = document.createElement('canvas'); cv.className = 'cert2-cv'; cv.setAttribute('aria-label', 'شهادة عضوية حراس المدينة');
  inn.insertBefore(cv, inp);
  var lbl = document.createElement('p'); lbl.className = 'cert2-lbl'; lbl.textContent = 'اكتب اسم البطل وضيف صورته:'; inn.insertBefore(lbl, inp);
  var row = document.createElement('div'); row.className = 'cert2-row'; inn.insertBefore(row, inp); row.appendChild(inp);
  var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'btn cream cert2-pb'; pb.textContent = '\ud83d\udcf7 ضيف صورتك'; row.appendChild(pb);
  var fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.style.setProperty('display', 'none', 'important'); fi.setAttribute('aria-hidden', 'true'); inn.appendChild(fi);
  var zr = document.createElement('div'); zr.className = 'cert2-zoom'; zr.hidden = true;
  zr.innerHTML = '<span>قرّب</span><input type="range" min="1" max="3" step="0.05" value="1" aria-label="تقريب الصورة"><button type="button" class="btn cream cert2-rm">شيل الصورة</button>';
  inn.insertBefore(zr, nbPlace());
  function nbPlace() { return inn.querySelector('#csave') || old; }
  var nb = old.cloneNode(true); old.parentNode.replaceChild(nb, old);
  var fonts = function () { try { return Promise.all([document.fonts.load('40px Lalezar', 'الخارقون'), document.fonts.load('700 30px "Aref Ruqaa"', 'شهادة')]); } catch (e) { return Promise.resolve(); } };
  var paint = function () { draw(cv, inp.value, 0.6); };
  var rg2 = zr.querySelector('input'), rm = zr.querySelector('.cert2-rm');
  pb.addEventListener('click', function () { fi.click(); });
  fi.addEventListener('change', function () {
    var f = fi.files && fi.files[0]; if (!f) return;
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      var m = 1000, sc = Math.min(1, m / Math.max(im.naturalWidth, im.naturalHeight)), c2 = document.createElement('canvas');
      c2.width = Math.max(1, Math.round(im.naturalWidth * sc)); c2.height = Math.max(1, Math.round(im.naturalHeight * sc));
      c2.getContext('2d').drawImage(im, 0, 0, c2.width, c2.height); URL.revokeObjectURL(u);
      photo = c2; zoom = 1; offX = 0; offY = 0; rg2.value = 1; zr.hidden = false; pb.textContent = '\ud83d\udcf7 غيّر الصورة'; paint();
    };
    im.onerror = function () { URL.revokeObjectURL(u); };
    im.src = u; fi.value = '';
  });
  rg2.addEventListener('input', function () { zoom = parseFloat(rg2.value) || 1; paint(); });
  rm.addEventListener('click', function () { photo = null; zoom = 1; zr.hidden = true; pb.textContent = '\ud83d\udcf7 ضيف صورتك'; paint(); });
  var drag = null;
  cv.style.touchAction = 'pan-y';
  loadHero(function () { fonts().then(paint, paint); });
  inp.addEventListener('input', function () { loadHero(paint); });
  nb.textContent = 'حفظ الشهادة';
  nb.addEventListener('click', function () {
    if (busy) return; busy = true;
    loadHero(function () { fonts().then(function () {
      var big = document.createElement('canvas'); draw(big, inp.value, 1);
      var url = big.toDataURL('image/png'), m = document.getElementById('modal'); m.hidden = false;
      m.innerHTML = '<div class="mbox"><img alt="" src="' + url + '"><p>اضغط مطولاً على الصورة واحفظها، أو نزّلها وهتطلع A4 بالعرض.</p><div class="row"><a class="btn big" download="شهادة-حراس-المدينة.png" href="' + url + '">نزّل الصورة</a><button type="button" class="btn cream big" id="mclose2">قفل</button></div></div>';
      var close = function () { m.hidden = true; m.innerHTML = ''; };
      document.getElementById('mclose2').onclick = close; m.onclick = function (e) { if (e.target === m) close(); };
      busy = false;
    }, function () { busy = false; }); });
  });
}
window.KHCert = { draw: draw, loadHero: loadHero, setPhoto: function (p) { photo = p; } };
var box = document.getElementById('app') || document.body;
new MutationObserver(function () { try { enhance(); } catch (e) {} }).observe(document.body, { childList: true, subtree: true });
try { enhance(); } catch (e) {}
sino.addEventListener('load', function () { var c = document.querySelector('.cert2-cv'), n = document.querySelector('#cname'); if (c) draw(c, n ? n.value : '', 0.6); });
var st = document.createElement('style');
st.textContent = '.cert2{transform:none!important;padding:8px!important;max-width:760px}.cert-in2{text-align:center;padding:0}.cert2-cv{display:block;width:100%;height:auto;border:3px solid #1b1712;background:#8cc7ff}.cert2-lbl{font:700 20px/1.6 "Aref Ruqaa",serif;margin:10px 0 0}.cert2-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin:4px 0 10px}.cert2-pb,.cert2-rm{transform:none!important;font-size:17px!important;min-height:48px;padding:6px 14px!important;flex:0 0 auto}.cert2-zoom{display:flex;gap:10px;align-items:center;justify-content:center;margin:0 0 12px;font:700 20px Aref Ruqaa,serif}.cert2-zoom[hidden]{display:none}.cert2-zoom input{width:min(50%,220px)!important;margin:0!important;border:0!important;min-height:32px!important}.cert2-row input{margin:0!important;flex:1 1 120px;min-width:0;font-size:28px!important}.cert2 input{display:block;margin:4px auto 10px;width:min(100%,360px);font:700 34px "Aref Ruqaa",serif;text-align:center;border:0;border-bottom:3px dashed #1b1712;background:transparent;color:#2a7fd4;min-height:54px}';
document.head.appendChild(st);
})();
