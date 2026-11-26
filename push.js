/* Web push opt-in (OneSignal). Fully optional: if the SDK is blocked the site is unaffected. */
(function () {
  'use strict';
  var APP_ID = '672ac5ba-6e9a-487d-836e-00e88f8c5576';
  var PRIMARY = 'city-guardians-comic.pages.dev';
  var SAFARI_ID = 'web.onesignal.auto.6b1e0125-c07a-4d4d-8123-db80df1063df';
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var standalone = window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var onPrimary = location.hostname === PRIMARY;
  var supported = 'serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window;
  if (!supported && !(isIOS && !standalone)) return;
  if (window.Notification && Notification.permission === 'denied') return;
  if (!/^https:$/.test(location.protocol)) return;

  var st = document.createElement('style');
  st.textContent = '#kh-push{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:60;font:700 14px/1 Cairo,sans-serif;background:#d7261e;color:#fff;border:2px solid #1a1a1a;border-radius:999px;padding:9px 14px;box-shadow:0 3px 0 #1a1a1a;cursor:pointer;opacity:.94}' +
    '#kh-push:active{transform:translateY(2px);box-shadow:0 1px 0 #1a1a1a}#kh-push.pulse{animation:khp 1s 3}@keyframes khp{50%{transform:scale(1.12)}}' +
    '#kh-toast{position:fixed;left:12px;right:12px;bottom:calc(64px + env(safe-area-inset-bottom));z-index:61;margin:0 auto;max-width:420px;background:#fff7dc;color:#1a1a1a;border:2px solid #1a1a1a;border-radius:14px;padding:12px 14px;font:700 15px/1.6 Cairo,sans-serif;text-align:center;box-shadow:0 3px 0 #1a1a1a}';
  document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.id = 'kh-push'; btn.type = 'button'; btn.textContent = '🔔 فعّل الإشعارات';
  var tt;
  function toast(msg) {
    var t = document.getElementById('kh-toast');
    if (!t) { t = document.createElement('div'); t.id = 'kh-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; clearTimeout(tt); tt = setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
  }
  function hide() { if (btn.parentNode) btn.parentNode.removeChild(btn); }

  var sdk = null, sdkFailed = false, waiters = [];
  function loadSdk() {
    if (sdk || sdkFailed || !onPrimary || !supported) return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(function (OS) {
      sdk = OS;
      OS.init({ appId: APP_ID, safari_web_id: SAFARI_ID, serviceWorkerPath: 'sw.js', serviceWorkerParam: { scope: '/' }, notifyButton: { enable: false } }).then(function () {
        try { if (OS.User.PushSubscription.optedIn) hide(); } catch (e) {}
        waiters.splice(0).forEach(function (f) { f(); });
      }).catch(function () { sdkFailed = true; sdk = null; });
    });
    var s = document.createElement('script');
    s.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js'; s.async = true;
    s.onerror = function () { sdkFailed = true; };
    document.head.appendChild(s);
  }

  function whenReady(ms) {
    return new Promise(function (res, rej) {
      if (sdk && sdk.Notifications && waiters.indexOf(res) < 0 && ready) return res();
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; rej(new Error('timeout')); } }, ms);
      waiters.push(function () { if (!done) { done = true; clearTimeout(t); res(); } });
      if (ready) { done = true; clearTimeout(t); res(); }
    });
  }
  var ready = false;
  waiters.push(function () { ready = true; });

  btn.addEventListener('click', function () {
    if (isIOS && !standalone) { toast('على الأيفون: دوس مشاركة ← أضف للشاشة الرئيسية، افتح الموقع من الأيقونة وبعدين فعّل الإشعارات.'); return; }
    if (!onPrimary) { location.href = 'https://' + PRIMARY + '/?notify=1'; return; }
    loadSdk();
    toast('ثانية واحدة...');
    whenReady(10000).then(function () {
      return sdk.Notifications.requestPermission().then(function () {
        return sdk.User.PushSubscription.optIn();
      });
    }).then(function () {
      if (Notification.permission === 'granted') { hide(); toast('تمام! هيجيلك إشعار أول ما قصة جديدة تنزل ⚡'); }
      else toast('الإشعارات مش مفعّلة. ممكن تفعّلها من إعدادات المتصفح.');
    }).catch(function () { toast('الإشعارات مش شغالة على شبكتك دلوقتي. جرّب بعدين.'); });
  });

  document.body.appendChild(btn);
  if (/[?&]notify=1/.test(location.search)) { btn.classList.add('pulse'); toast('دوس على 🔔 فعّل الإشعارات'); }
  if (onPrimary && supported) setTimeout(loadSdk, 3000);
})();
