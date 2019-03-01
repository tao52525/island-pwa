if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    console.log('service work register');
  }).catch(err => {
    console.log('something wrong! ');
  })
}

window.onload = function () {
  document.body.append('PWA! ')
}
