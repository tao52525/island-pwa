// 首先引入 Workbox 框架
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! workbox is loaded 🎉`, workbox);
} else {
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
  if (data) {
    const title = data.text();
    var options = {
      icon: '/images/icons/icon144.png',
      body: '去看看',
      actions: [{
        action: 'show-book',
        title: '去看看'
      }, {
        action: 'contact-me',
        title: '联系我'
      }],
      tag: 'pwa-demo',
      renotify: true
    };
    self.registration.showNotification(title, options);
  } else {
    console.log('push没有任何数据');
  }
});

self.addEventListener('notificationclick', function (e) {
  var action = e.action;
  console.log(`action tag: ${e.notification.tag}`, `action: ${action}`);

  switch (action) {
    case 'show-book':
      console.log('show-book');
      break;
    case 'contact-me':
      console.log('contact-me');
      break;
    default:
      console.log(`未处理的action: ${e.action}`);
      action = 'default';
      break;
  }
  e.notification.close();
  // 当用户切换到其他Tab时，点击提醒会立刻回到网站的tab；
  // 当用户未打开该网站时，点击提醒可以直接打开网站。
  e.waitUntil(
    // 获取所有clients
    self.clients.matchAll().then(function (clients) {
      if (!clients || clients.length === 0) {
        // 当不存在client时，打开该网站
        self.clients.openWindow && self.clients.openWindow('http://127.0.0.1:8082');
        return;
      }
      // 切换到该站点的tab
      clients[0].focus && clients[0].focus();
      clients.forEach(function (client) {
        // 使用postMessage进行通信
        client.postMessage(action);
      });
    })
  );
});