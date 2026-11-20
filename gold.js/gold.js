(function () {
  // ===== إعدادات (عدّلها هنا) =====
  const REFRESH_SECONDS = 30;     // كل كام ثانية نحدّث السعر (الـ API بيطلب 30 على الأقل)
  const PREMIUM = 1.046;          // فرق السوق المحلي عن العالمي (1.046 = +4.6%)
  const BUY_DISCOUNT = 0.0053;    // الشراء أقل من البيع بـ 0.53%
  const FALLBACK_SELL24 = 6440;   // سعر احتياطي لو الـ API فشل
  const FALLBACK_USD = 48.5;      // سعر دولار احتياطي

  const statusEl = document.getElementById('gold-date');
  let usdEgp = FALLBACK_USD, usdTime = 0;
  let ounce = 0, lastUpdate = 0, problems = [], busy = false;

  const num = n => Math.round(n).toLocaleString('en-US');

  // بيعرض البيع والشراء لكل عيار
  function render(sell24) {
    [24, 21, 18].forEach(k => {
      const sell = sell24 * k / 24;
      const buy  = sell * (1 - BUY_DISCOUNT);
      document.getElementById('sell' + k).textContent = num(sell);
      document.getElementById('buy'  + k).textContent = num(buy);
    });
  }

  async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function update() {
    if (busy) return;
    busy = true;
    problems = [];

    // سعر الدولار: نحدّثه كل 5 دقايق بس
    if (Date.now() - usdTime > 300000) {
      try {
        const fx = await getJson('https://open.er-api.com/v6/latest/USD');
        if (fx.rates && fx.rates.EGP > 0) { usdEgp = fx.rates.EGP; usdTime = Date.now(); }
      } catch (e) { problems.push('الدولار: ' + e.message); }
    }

    // سعر أونصة الذهب
    try {
      const g = await getJson('https://api.gold-api.com/price/XAU');
      if (g.price > 0) {
        ounce = g.price;
        lastUpdate = Date.now();
        // جرام 24 بيع = (الأونصة ÷ 31.1035) × الدولار × فرق السوق
        render((ounce / 31.1035) * usdEgp * PREMIUM);
      }
    } catch (e) { problems.push('الذهب: ' + e.message); }

    busy = false;
  }

  // بيتحرك كل ثانية: عداد آخر تحديث
  function tick() {
    if (!lastUpdate) {
      statusEl.textContent = problems.length
        ? 'سعر تقريبي (تعذر التحديث الحي): ' + problems.join(' | ')
        : 'جاري تحميل السعر الحي...';
      return;
    }
    const secs = Math.round((Date.now() - lastUpdate) / 1000);
    statusEl.textContent =
      `سعر حي | آخر تحديث منذ ${secs} ثانية | الأونصة: $${ounce.toFixed(2)} | الدولار: ${usdEgp.toFixed(2)} جنيه`;
  }

  render(FALLBACK_SELL24);          // اعرض السعر الاحتياطي فوراً
  update();                          // أول تحديث
  setInterval(update, REFRESH_SECONDS * 1000);
  setInterval(tick, 1000);
})();