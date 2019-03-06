// 首先引入 Workbox 框架
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! workbox is loaded 🎉`, workbox);
}
else {
  console.log(`Boo! workbox didn't load 😬`);
}
workbox.precaching.precacheAndRoute([
  // 注册成功后要立即缓存的资源列表
  '/index.js',
  '/index.html',
  './style.css',
  'https://unpkg.com/axios/dist/axios.min.js',
  '/movie/in_theaters',
  '/'
]);

// html的缓存策略
workbox.routing.registerRoute(
  new RegExp('.*\.html'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*\.(?:js|css)'),
  workbox.strategies.cacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*/movie/in_theaters'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp('https://unpkg\.com/*'),
  workbox.strategies.cacheFirst({
    cacheName: 'example:img'
  })
);

self.addEventListener('push', function (e) {
  var data = e.data;
  if (e.data) {
    data = data.text();
    console.log('push的数据为：', data);
    self.registration.showNotification(data);
  } else {
    console.log('push没有任何数据');
  }
});
