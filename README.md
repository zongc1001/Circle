# Circle
一个可以让你和异地的小伙伴同步地看视频的插件

> 网站兼容性：B站>西瓜视频>

### 安装方法

1. 把项目下载下来，或者直接在release里下载zip

   ![image-20200829175930099](https://github.com/zongc1001/Circle/blob/master/img/image-20200829175930099.png)

2. 解压缩下载的zip，里面的src文件夹就是解压后的扩展程序了

3. Chrome开启开发者模式，点击加载已解压的扩展程序

   ![image-20200829180355791](https://github.com/zongc1001/Circle/blob/master/img/image-20200829180355791.png)

4. 选择解压出来的src文件夹

   ![image-20200829180437086](https://github.com/zongc1001/Circle/blob/5fd71a7d43cd6792dbfb199413bb6d715a895406/img/image-20200829180437086.png)

### 使用方法

1. 安装好了以后，点击插件的图标，设置一个id，尽量设一个不大会和别人重复的（比如你的名字缩写+生日这样的组合：zc1024），点击sign in

   ![image-20200829183347982](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183347982.png)

2. 登录成功后，输入你的小伙伴设置的id，点击connect就可以与你的小伙伴连接了。最下方的链接是你的小伙伴最后加载的一个视频页面的url，你可以直接在这里跳转到和小伙伴同样的页面。

   ![image-20200829183527151](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183527151.png)

3. 连接成功的话插件的图标上会显示绿色的ON，连接成功就可以开始看视频了。打开插件支持的网站，在有视频的页面中，脚本会在标签页的加载小圈圈停止转动后植入，有时候可能因为视频资源异步加载的原因，脚本植入后同步功能无法立刻挂载成功，需要等待1~2秒，挂载成功后，对方将可以看到你正在看的视频页面的url，并且同步功能将开启。

   ![image-20200829184054654](https://github.com/zongc1001/Circle/blob/master/img/image-20200829183527151.png)
