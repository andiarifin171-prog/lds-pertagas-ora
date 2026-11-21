// Aturan link untuk aplikasi PC: halaman aplikasi tetap di jendela, link WhatsApp ke WhatsApp Desktop.

const APP_URL = 'https://andiarifin171-prog.github.io/lds-pertagas-ora/';
const APP_ORIGIN = 'https://andiarifin171-prog.github.io';
const APP_PATH = '/lds-pertagas-ora';

// true bila url adalah halaman aplikasi LDS (boleh dibuka di jendela aplikasi)
function isAppUrl(url) {
  try {
    const u = new URL(url);
    return u.origin === APP_ORIGIN && (u.pathname === APP_PATH || u.pathname.startsWith(APP_PATH + '/'));
  } catch (e) {
    return false;
  }
}

// Ubah link wa.me / api.whatsapp.com menjadi link WhatsApp Desktop + cadangan WhatsApp Web.
// Mengembalikan null bila url bukan link WhatsApp.
function toWhatsAppTargets(url) {
  let u;
  try { u = new URL(url); } catch (e) { return null; }
  const host = u.hostname.toLowerCase();
  let phone = '';
  let text = null;
  if (host === 'wa.me') {
    phone = u.pathname.replace(/\//g, '');
    text = u.searchParams.get('text');
  } else if (['api.whatsapp.com', 'web.whatsapp.com', 'whatsapp.com', 'www.whatsapp.com'].includes(host) && u.pathname.startsWith('/send')) {
    phone = u.searchParams.get('phone') || '';
    text = u.searchParams.get('text');
  } else {
    return null;
  }
  phone = phone.replace(/\D/g, '');
  const q = new URLSearchParams();
  if (phone) q.set('phone', phone);
  if (text !== null) q.set('text', text);
  // URLSearchParams menulis spasi sebagai "+", WhatsApp Desktop lebih aman dengan %20 ("+" asli sudah menjadi %2B)
  const qs = q.toString().replace(/\+/g, '%20');
  return {
    desktop: 'whatsapp://send' + (qs ? '?' + qs : ''),
    web: 'https://web.whatsapp.com/send' + (qs ? '?' + qs : '')
  };
}

module.exports = { APP_URL, isAppUrl, toWhatsAppTargets };
