const cacheName = 'island';
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/index.js',
        '/index.html',
        './style.css',
        'https://unpkg.com/axios/dist/axios.min.js',
        '/movie/in_theaters',
        '/'
      ]);
    })
  );
});

// 激活时触发 activate 事件
self.addEventListener('activate', function(e) {
  // active 事件中通常做一些过期资源释放的工作，匹配到就从 caches 中删除
  var cacheDeletePromises = caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(name => {
      console.log(name, cacheName)
      if (name !== cacheName) {
        return caches.delete(name);
      } else {
        return Promise.resolve();
      }
    }));
  });

  e.waitUntil(
    Promise.all([cacheDeletePromises])
  );
});

self.addEventListener('fetch', function (e) {
  // 需要缓存的xhr请求
  var cacheRequestUrls = [
    '/movie/in_theaters'
  ];
  // 判断当前请求是否需要缓存
  var needCache = cacheRequestUrls.some(function (url) {
    return e.request.url.indexOf(url) > -1;
  });
  /**** 这里是对XHR数据缓存的相关操作 ****/
  if (needCache) {
    // 需要缓存的请求
    e.respondWith(
      caches.match(e.request).then(function (cache) {
        if (cache) {
          return cache;
        } else {
          var fetchRequest = e.request.clone();
          return fetch(fetchRequest).then(
            function (response) {
              // 检测请求是否有效
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              var responseToCache = response.clone();
              console.log('event.request', event.request)
              caches.open(cacheName)
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        }
      })
    )
  } else {
    // 非api请求，直接查询cache, 如果有cache则直接返回，否则通过fetch请求
    e.respondWith(
      caches.match(e.request).then(function (cache) {
        return cache || fetch(e.request);
      }).catch(function (err) {
        console.log(err);
        return fetch(e.request);
      })
    );
  }
});

// sw.js
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