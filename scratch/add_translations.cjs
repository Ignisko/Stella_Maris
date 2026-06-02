const fs = require('fs');
let code = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const t = {
  en: ["Dismissed Event", "The Church has officially dismissed this event as not supernatural or false. It is shown for informational purposes only."],
  pl: ["Odrzucone wydarzenie", "Kościół oficjalnie odrzucił to wydarzenie jako niesupernaturalne lub fałszywe. Pokazane wyłącznie w celach informacyjnych."],
  es: ["Evento desestimado", "La Iglesia ha desestimado oficialmente este evento por no ser sobrenatural o falso. Se muestra solo con fines informativos."],
  pt: ["Evento descartado", "A Igreja descartou oficialmente este evento como não sobrenatural ou falso. Mostrado apenas para fins informativos."],
  fr: ["Événement rejeté", "L'Église a officiellement rejeté cet événement comme non surnaturel ou faux. Affiché à des fins d'information uniquement."],
  it: ["Evento respinto", "La Chiesa ha ufficialmente respinto questo evento in quanto non soprannaturale o falso. Mostrato solo a scopo informativo."],
  ar: ["حدث مرفوض", "رفضت الكنيسة هذا الحدث رسميًا باعتباره غير خارق للطبيعة أو خاطئًا. معروض لأغراض إعلامية فقط."],
  tl: ["Ibinasurang Kaganapan", "Opisyal na ibinasura ng Simbahan ang kaganapang ito dahil hindi ito supernatural o peke. Ipinapakita para sa layuning impormasyonal lamang."],
  vi: ["Sự kiện bị bác bỏ", "Giáo hội đã chính thức bác bỏ sự kiện này vì không có tính siêu nhiên hoặc là giả mạo. Chỉ hiển thị vì mục đích cung cấp thông tin."],
  tr: ["Reddedilen Olay", "Kilise bu olayı doğaüstü olmadığı veya sahte olduğu için resmen reddetti. Sadece bilgi amaçlı gösterilmektedir."],
  ko: ["거부된 사건", "교회는 이 사건이 초자연적이 아니거나 거짓이라고 공식적으로 기각했습니다. 정보 제공 목적으로만 표시됩니다."]
};

for (const lang of Object.keys(t)) {
  const target = new RegExp(`(${lang}: \\{[^]*?)(themeLight: '[^]*?',)`);
  if (code.match(target)) {
    code = code.replace(target, `$1dismissedWarningTitle: "${t[lang][0]}",\n    dismissedWarningText: "${t[lang][1]}",\n    $2`);
  }
}

fs.writeFileSync('src/utils/i18n.ts', code);
console.log('done');
