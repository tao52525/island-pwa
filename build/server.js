const Koa = require('koa');
const Static = require('koa-static');
const path = require('path');

const app = new Koa();
const staticPath = './src';

app.use(Static(path.resolve(__dirname, staticPath)));
app.listen(8081);
console.log('http://localhost:8081');
