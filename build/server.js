const util = require('./util');
const Koa = require('koa');
const path = require('path');
const Static = require('koa-static');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const webpush = require('web-push');

const app = new Koa();
const staticPath = '../src';
const router = new Router();

/**
 * VAPID值
 * 这里可以替换为你业务中实际的值
 */
const vapidKeys = {
  publicKey: 'BOh7UQsSHU5REe402EtN02fQGwM0tlhugWcLpPfjQeIqDez5GI7Caj1ZluAx4fhm2GafWw8Q7xB3yQX9NU3YwNo',
  privateKey: 'qFIdtXrqUt_p6kz4Gks95r-P125c7_a4RCE0z6FIUuY'
};
// 设置web-push的VAPID值
webpush.setVapidDetails(
  'mailto:891585360@qq.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * 向push service推送信息
 * @param {*} subscription 
 * @param {*} data 
 */
function pushMessage(subscription, data = {}) {
  webpush.sendNotification(subscription, data, options = {}).then(data => {
      console.log('push service的相应数据:', JSON.stringify(data));
      return;
  }).catch(err => {
      // 判断状态码，440和410表示失效
      if (err.statusCode === 410 || err.statusCode === 404) {
          return util.remove(subscription);
      }
      else {
          console.log(subscription);
          console.log(err);
      }
  })
}

/**
 * cors 跨域
 */
app.use(cors());

/**
 * 提交subscription信息，并保存
 */
router.post('/subscription', koaBody(), async ctx => {
  let body = ctx.request.body;
  await util.saveRecord(body);
  ctx.response.body = {
    status: 0
  };
});
/**
 * 消息推送API，可以在管理后台进行调用
 * 本例子中，可以直接post一个请求来查看效果
 */
router.post('/push', koaBody(), async ctx => {
  let { uniqueid, payload } = ctx.request.body;
  let list = uniqueid ? await util.find({ uniqueid }) : await util.findAll();
  let status = list.length > 0 ? 0 : -1;

  for (let i = 0; i < list.length; i++) {
    let subscription = list[i].subscription;
    pushMessage(subscription, payload);
  }

  ctx.response.body = {
    status
  };
});
/**
 * 热映电影
 */
router.get('/movie/in_theaters', async (ctx, next) => {
  let url = `https://api.douban.com/v2/movie/in_theaters`;
  let res = await util.get(url);
  ctx.response.body = res;
});


app.use(router.routes());
app.use(Static(path.resolve(__dirname, staticPath)));
app.listen(8082);
console.log('http://localhost:8082');