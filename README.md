# Circle
一个可以让你和异地的小伙伴同步地看视频的插件

| 网站                   | 兼容性   |
| ---------------------- | -------- |
| B站、西瓜视频          | 良好     |
| 腾讯视频、爱奇艺、优酷 | 一般     |
| 其他                   | 还没用过 |

> 在有广告的网站上需要等到广告放完插件才能正常使用。因为网站广告防屏蔽的方式的不同插件的表现会有所不同，在爱奇艺上如果一方的广告没有放完，另一方也无法播放（播放后会立刻被暂停），应该是因为爱奇艺在广告还没有结束的时候拦截了video元素的play方法的调用，直接暂停视频，然后暂停被同步至另一方，导致另一方也不能开始看视频

### 安装方法

1. 把项目下载下来，或者直接在release里下载zip

   ![image-20200829175930099](https://github.com/zongc1001/Circle/blob/master/img/image-20200829175930099.png)

2. 解压缩下载的zip，里面的src文件夹就是解压后的扩展程序了

3. Chrome开启开发者模式，点击加载已解压的扩展程序

   ![image-20200829180355791](https://github.com/zongc1001/Circle/blob/master/img/image-20200829180355791.png)

4. 选择解压出来的src文件夹

   ![image-20200829180437086](https://github.com/zongc1001/Circle/blob/5fd71a7d43cd6792dbfb199413bb6d715a895406/img/image-20200829180437086.png)

### 使用方法

1. 安装好了以后，点击插件的图标，设置id，尽量设一个不大会和别人重复的（比如你的名字缩写+生日这样的组合：zc1024），点击sign in

   ![image-20200829183347982](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183347982.png)

2. 登录成功后，输入你的小伙伴设置的id，点击connect就可以与你的小伙伴连接了。最下方的链接是你的小伙伴最后加载的一个视频页面的url，你可以直接在这里跳转到和小伙伴同样的页面。

   ![image-20200829183527151](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183527151.png)

3. 连接成功的话插件的图标上会显示ON。打开插件支持的网站，在含有视频的页面中，脚本会在标签页的加载小圈圈停止转动后植入，有时候可能因为视频资源异步加载的原因，脚本植入后同步功能无法立刻挂载成功，需要等待1~2秒，挂载成功后，对方将可以看到你正在看的视频页面的url，并且同步功能将开启。

   ![image-20200829184054654](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183527151.png)

### Tips

1. **如果双方的视频不同步的话，只需要一方暂停再播放，另一方的进度就会被同步了**，插件只会在播放事件发生的时候，自动帮助另一方拖动进度条
2. 如果插件使用上有什么问题或者建议，欢迎issue，或者直接邮箱zongchen1001@qq.com
3. peerjs服务器和iceServer都部署在作者的服务器上，如果需要使用的请提前告知

