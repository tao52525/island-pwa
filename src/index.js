// index.js
// import axios from 'axios'
const host = ''

function subscribeUserToPush(registration, publicKey) {
  var subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  };
  return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}

function sendSubscriptionToServer(body) {
  axios.post(host + '/subscription', body).then(res => {
    console.log('success: ', res);
  }).catch(err => {
    console.log('err: ', err);
  })
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0, max = rawData.length; i < max; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function createCard(data) {
  const subjects = data.subjects;
  document.querySelector('.title').innerText = '影院热映';
  const container = document.querySelector('.content');
  subjects.forEach(item => {
    const block = document.createElement('div');
    const img = new Image;
    img.src = item.images.small;
    block.appendChild(img);
    container.appendChild(block);
  })
}
function getMovieInTheaters() {
  axios.get('movie/in_theaters').then(res => {
    createCard(res.data)
  }).catch(err => {
    console.log('err: ', err)
  })
}

// index.js
if ('serviceWorker' in navigator && 'PushManager' in window) {
  var publicKey = 'BOh7UQsSHU5REe402EtN02fQGwM0tlhugWcLpPfjQeIqDez5GI7Caj1ZluAx4fhm2GafWw8Q7xB3yQX9NU3YwNo';
  // 注册service worker
  navigator.serviceWorker.register('./sw2.js').then(function (registration) {
    console.log('Service Worker 注册成功');

    // 在client中监听message事件
    navigator.serviceWorker.addEventListener('message', function (e) {
      var action = e.data;
      if (action === 'contact-me') {
        alert('email: 891585360@qq.com')
      }
    });
    // 开启该客户端的消息推送订阅功能
    return subscribeUserToPush(registration, publicKey);
  }).then(function (subscription) {
    var body = {
      subscription: subscription
    };
    // 为了方便之后的推送，为每个客户端简单生成一个标识
    body.uniqueid = new Date().getTime();
    console.log('uniqueid', body.uniqueid);
    // 将生成的客户端订阅信息存储在自己的服务器上
    return sendSubscriptionToServer(body);
  }).then(function (res) {
    console.log(res);
  }).catch(function (err) {
    console.log(err);
  });
}

window.onload = function () {
  getMovieInTheaters()
}
