// Uji aturan link (jalankan: node test-links.js)
const assert = require('assert');
const { isAppUrl, toWhatsAppTargets } = require('./links');

assert.strictEqual(isAppUrl('https://andiarifin171-prog.github.io/lds-pertagas-ora/'), true);
assert.strictEqual(isAppUrl('https://andiarifin171-prog.github.io/lds-pertagas-ora/index.html'), true);
assert.strictEqual(isAppUrl('https://andiarifin171-prog.github.io/lds-pertagas-ora'), true);
assert.strictEqual(isAppUrl('https://andiarifin171-prog.github.io/lain/'), false);
assert.strictEqual(isAppUrl('https://wa.me/628123'), false);

let t = toWhatsAppTargets('https://wa.me/6282283155402?text=' + encodeURIComponent('*ALARM LDS*\nTIKET 071 + KP 04+580'));
assert.strictEqual(t.desktop, 'whatsapp://send?phone=6282283155402&text=*ALARM%20LDS*%0ATIKET%20071%20%2B%20KP%2004%2B580');
assert.strictEqual(t.web, 'https://web.whatsapp.com/send?phone=6282283155402&text=*ALARM%20LDS*%0ATIKET%20071%20%2B%20KP%2004%2B580');
assert.strictEqual(decodeURIComponent(new URL(t.web).searchParams.get('text')), '*ALARM LDS*\nTIKET 071 + KP 04+580');

t = toWhatsAppTargets('https://wa.me/?text=' + encodeURIComponent('Siap Laksanakan @SPO'));
assert.strictEqual(t.desktop, 'whatsapp://send?text=Siap%20Laksanakan%20%40SPO');

t = toWhatsAppTargets('https://api.whatsapp.com/send?phone=+62 822-8315-5402&text=halo');
assert.strictEqual(t.desktop, 'whatsapp://send?phone=6282283155402&text=halo');

assert.strictEqual(toWhatsAppTargets('https://github.com/'), null);
assert.strictEqual(toWhatsAppTargets('bukan url'), null);
console.log('Semua uji link lolos');
