// Service worker: เปิดแบบเก็บข้อมูลได้แม้ไม่มีอินเทอร์เน็ต (หลังจากเคยเปิดครั้งแรกแล้ว)
// ใช้ network-first สำหรับไฟล์ของเว็บ เพื่อให้ได้เวอร์ชันล่าสุดเสมอเมื่อออนไลน์
const CACHE = 'kks-survey-v1';
const SHELL = ['./', 'index.html', 'app.js', 'style.css', 'icon.svg', 'manifest.webmanifest', 'google-apps-script.gs'];
const CDN = ['https://cdnjs.cloudflare.com/', 'https://fonts.googleapis.com/', 'https://fonts.gstatic.com/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  // ไม่ยุ่งกับการส่ง/ดึงข้อมูล Google Sheet และโดเมนอื่นที่ไม่ใช่ฟอนต์/ไลบรารี
  if (!sameOrigin && !CDN.some(p => req.url.startsWith(p))) return;

  e.respondWith(fetch(req)
    .then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    })
    .catch(() => caches.match(req, { ignoreSearch: sameOrigin })
      .then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
