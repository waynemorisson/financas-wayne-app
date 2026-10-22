const CACHE='fw-pub-v16';
// v13: novas versões entram na hora (skipWaiting + clients.claim) e a página nunca vem do cache HTTP velho (no-store)
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon.svg'].map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting();if(e.data==='versao'&&e.source)e.source.postMessage({versao:CACHE});});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url); if(url.origin!==location.origin)return;
  if(e.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/sw.js')){e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok&&e.request.mode==='navigate'){const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));}return r;}).catch(()=>caches.match('./index.html')));return;}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;})));
});
