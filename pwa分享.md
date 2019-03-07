## pwa

Progressive Web App, 简称 PWA，是提升 Web App 的体验的一种新方法，能给用户原生应用的体验。

通过应用一些新技术进行改进，优化Web App的安全、性能和体验，PWA 本质上是 Web App，借助一些新技术也具备了 Native App 的一些特性，兼具 Web App 和 Native App 的优点

PWA 的主要特点包括下面三点：

- 可靠 - 即使在不稳定的网络环境下，也能瞬间加载并展现

- 体验 - 快速响应，并且有平滑的动画响应用户的操作

- 粘性 - 像设备上的原生应用，具有沉浸式的用户体验，用户可以添加到桌面


#### PWA中的一些技术

- Web App Manifest

- Service Worker

- Cache API 缓存

- Push&Notification 推送与通知

- Background Sync 后台同步

- 响应式设计


## Manifest

对于PWA来说，有一些重要的特性：

- Web App可以被添加到桌面并有它自己的应用图标；
- 同时，从桌面开启时，会和原生app一样有它自己的“开屏图”；
- 更进一步的，这个Web App在的样子几乎和原生应用一样——没有浏览器的地址栏、工具条，似乎和Native App一样运行在一个独立的容器中。![821551929539_.pic](/Users/jt/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/b6b19d46e7413d25a431d9ae95f83a15/Message/MessageTemp/9e20f478899dc29eb19741386f9343c8/Image/821551929539_.pic.jpg)

![821551929539_.pic](/Users/jt/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/com.tencent.xinWeChat/2.0b4.0.9/b6b19d46e7413d25a431d9ae95f83a15/Message/MessageTemp/9e20f478899dc29eb19741386f9343c8/Image/831551929627_.pic.jpg)

![image-20190307113542650](/Users/jt/Library/Application Support/typora-user-images/image-20190307113542650.png)

Manifest是一个JSON格式的文件，你可以把它理解为一个指定了Web App桌面图标、名称、开屏图标、运行模式等一系列资源的一个清单。

> manifest 的目的是将Web应用程序安装到设备的主屏幕，为用户提供更快的访问和更丰富的体验。 —— MDN

![image-20190307114125705](/Users/jt/Library/Application Support/typora-user-images/image-20190307114125705.png)

#### 属性介绍：

* name, short_name

指定了Web App的名称。`short_name`其实是该应用的一个简称。一般来说，当没有足够空间展示应用的`name`时，系统就会使用`short_name`。可以看到本文的例子中，图书搜索这个应用在桌面上展示的名称就是`short_name`书查。

* start_url

这个属性指定了用户打开该Web App时加载的URL。相对URL会相对于manifest。这里我们指定了`start_url`为`/`，访问根目录。

* display

`display`控制了应用的显示模式，它有四个值可以选择：`fullscreen`、`standalone`、`minimal-ui`和`browser`。

`fullscreen`：全屏显示，会尽可能将所有的显示区域都占满；

 `standalone`：独立应用模式，这种模式下打开的应用有自己的启动图标，并且不会有浏览器的地址栏。因此看起来更像一个Native App；

 `minimal-ui`：与`standalone`相比，该模式会多出地址栏；

 `browser`：一般来说，会和正常使用浏览器打开样式一致。

![display](https://upload-images.jianshu.io/upload_images/6476654-1f9c956ccf2a2589.png)

* icons， background_color

`icons`用来指定应用的桌面图标。icons本身是一个数组，每个元素包含三个属性：

- sizes：图标的大小。通过指定大小，系统会选取最合适的图标展示在相应位置上。
- src：图标的文件路径。注意相对路径是相对于manifest。
- type：图标的图片类型。

“开屏图”其实是背景颜色+图标的展示模式（并不会设置一张所谓的开屏图）。`background_color`是在应用的样式资源为加载完毕前的默认背景，因此会展示在开屏界面。`background_color`加上我们刚才定义的`icons`就组成了Web App打开时的“开屏图”。

* theme_color

定义应用程序的默认主题颜色。 这有时会影响操作系统显示应用程序的方式（例如，在Android的任务切换器上，主题颜色包围应用程序）。此外，还可以在meta标签中设置theme_color：`<meta name="theme-color" content="#5eace0"/>`

```html
<!-- 在index.html中添加以下meta标签 -->
<link rel="manifest" href="/manifest.json">
```



## Service Worker

使用Service Worker来实现资源的缓存、消息的推送、消息的通知以及后台同步

Service Worker 有以下功能和特性：

- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。(在 Web Worker 的基础上加上了持久离线缓存能力)
- 一旦被 install，就永远存在，除非被手动 unregister
- 用到的时候可以直接唤醒，不用的时候自动睡眠
- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
- 离线内容开发者可控
- 能向客户端推送消息
- 不能直接操作 DOM
- 必须在 HTTPS 环境下才能工作 (或者本地localhost)
- 异步实现，内部大都是通过 Promise 实现



### 生命周期

![Service Worker çå½å¨æ](https://gss0.bdstatic.com/9rkZbzqaKgQUohGko9WTAnF6hhy/assets/pwa/projects/1515671916268/sw-lifecycle.png)

 service worker 所有支持的事件

![install, activate, message, fetch, sync, push](https://mdn.mozillademos.org/files/12632/sw-events.png)

我们可以看到生命周期分为这么几个状态 `安装中`, `安装后`, `激活中`, `激活后`, `废弃`

 

- **安装( installing )**：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存。

`install` 事件回调中有两个方法：

- `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
- `self.skipWaiting()`：`self` 是当前 context 的 global 变量，执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。
- **安装后( installed )**：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭。
- **激活( activating )**：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联缓存的旧缓存资源，等待新的 Service Worker 线程被激活。

`activate` 回调中有两个方法：

- `event.waitUntil()`：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
- `self.clients.claim()`：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。旧的 Service Worker 脚本不再控制着页面，之后会被停止。
- **激活后( activated )**：在这个状态会处理 `activate` 事件回调 (提供了更新缓存策略的机会)。并可以处理功能性的事件 `fetch (请求)`、`sync (后台同步)`、`push (推送)`。
- **废弃状态 ( redundant )**：这个状态表示一个 Service Worker 的生命周期结束。

这里特别说明一下，进入废弃 (redundant) 状态的原因可能为这几种：

- 安装 (install) 失败
- 激活 (activating) 失败
- 新版本的 Service Worker 替换了它并成为激活状态

### 缓存静态资源

![image-20190307144902090](/Users/jt/Library/Application Support/typora-user-images/image-20190307144902090.png)

> Cache 接口提供缓存的 Request / Response 对象对的存储机制。Cache 接口像 workers 一样, 是暴露在 window 作用域下的。尽管它被定义在 service worker 的标准中,  但是它不必一定要配合 service worker 使用。——MDN

![image-20190307145414117](/Users/jt/Library/Application Support/typora-user-images/image-20190307145414117.png)

fetch要写得太多，需要根据不同文件的扩展名把不同的资源通过不同的策略缓存在 caches 中，各种 CSS，JS，HTML，图片，都需要单独搞一套缓存策略

### Workbox 3

Workbox被定义为 PWA 相关的工具集合，其实围绕它的还有一些列工具，如 workbox-cli、gulp-workbox、webpack-workbox-plagin 等等，可以把 Workbox 理解为 Google 官方的 PWA 框架

![image-20190307153144562](/Users/jt/Library/Application Support/typora-user-images/image-20190307153144562.png)

##### Stale-While-Revalidate

![img](https://gw.alicdn.com/tfs/TB1LNY7JFOWBuNjy0FiXXXFxVXa-1014-492.png)

##### Cache First

![img](https://gw.alicdn.com/tfs/TB1kmv2JKSSBuNjy0FlXXbBpVXa-1004-496.png)

##### Network First

![img](https://gw.alicdn.com/tfs/TB1Il7mJQCWBuNjy0FaXXXUlXXa-1014-492.png)

##### Network Only

![img](https://gw.alicdn.com/tfs/TB1LYbuJKOSBuNjy0FdXXbDnVXa-1014-345.png)

##### Cache Only

![img](https://gw.alicdn.com/tfs/TB1oveWJFGWBuNjy0FbXXb4sXXa-1013-344.png)

离线访问

![image-20190307153938132](/Users/jt/Library/Application Support/typora-user-images/image-20190307153938132.png)



## 消息推送

消息推送与提醒是两个功能——Push API 和 Notification API

Push API 和 Notification API其实是两个独立的技术，完全可以分开使用；不过Push API 和 Notification API相结合是一个常见的模式。

#### 消息推送的三个重要“角色”

浏览器：就是我们的客户端

Push Service：专门的Push服务，可以认为是一个第三方服务，目前chrome与firefox都有自己的Push Service Service。理论上只要浏览器支持，可以使用任意的Push Service

后端服务：这里就是指我们自己的后端服务

#### 消息推送流程

下图来自[Web Push协议草案](https://tools.ietf.org/html/draft-ietf-webpush-protocol-12)，是Web Push的整个流程

```
    +-------+           +--------------+       +-------------+
    |  UA   |           | Push Service |       | Application |
    +-------+           +--------------+       |   Server    |
        |                      |               +-------------+
        |      Subscribe       |                      |
        |--------------------->|                      |
        |       Monitor        |                      |
        |<====================>|                      |
        |                      |                      |
        |          Distribute Push Resource           |
        |-------------------------------------------->|
        |                      |                      |
        :                      :                      :
        |                      |     Push Message     |
        |    Push Message      |<---------------------|
        |<---------------------|                      |
        |                      |                      |
```

- subscribe，首先是订阅： 
  1. Ask Permission：这一步不再上图的流程中，这其实是浏览器中的策略。浏览器会询问用户是否允许通知，只有在用户允许后，才能进行后面的操作。
  2. Subscribe：浏览器（客户端）需要向Push Service发起订阅（subscribe），订阅后会得到一个[`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)对象
  3. Monitor：订阅操作会和Push Service进行通信，生成相应的订阅信息，Push Service会维护相应信息，并基于此保持与客户端的联系；
  4. Distribute Push Resource：浏览器订阅完成后，会获取订阅的相关信息（存在于`PushSubscription`对象中），我们需要将这些信息发送到自己的服务端，在服务端进行保存。

![img](https://upload-images.jianshu.io/upload_images/6476654-cb7ad657b75dd56b)

- Push Message，然后是推送： 
  1. Push Message阶段一：我们的服务端需要推送消息时，不直接和客户端交互，而是通过Web Push协议，将相关信息通知Push Service；
  2. Push Message阶段二：Push Service收到消息，通过校验后，基于其维护的客户端信息，将消息推送给订阅了的客户端；
  3. 最后，客户端收到消息，完成整个推送过程。



![img](https:////upload-images.jianshu.io/upload_images/6476654-8527cec32ef612d8)

Web Push分为这几个部分：

1. 浏览器发起订阅，并将订阅信息发送至后端；
2. 将订阅信息保存在服务端，以便今后推送使用；
3. 服务端推送消息，向Push Service发起请求；
4. 浏览器接收Push信息并处理。

#### 保证Push的安全性

![img](https://upload-images.jianshu.io/upload_images/6476654-cac8f994ff71bee3)

Web Push协议的请求封装、加密处理相关操作非常繁琐。因此，Web Push为各种语言的开发者提供了一系列对应的库：[Web Push Libaray](https://github.com/web-push-libs)



## 在Chrome中调试你的PWA