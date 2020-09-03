(function () {

    if (data("inject")) {
        console.log(`脚本已存在于${document.title}`);
    }
    console.log(`脚本开始植入${document.title}`);
    data("inject", true);
    let video = null;
    let actionArr = [
        "pause",
        "playing",
        // "seeked",
    ];
    let videoRefindTimes = 33;
    let videoRefindInterval = 3;
    let initVideoCount = 0;

    function loadScript(url, callback) {
        function doCallback() {
            if (typeof callback === 'function') {
                callback();
            }
        }

        var elem = document.createElement('script');
        elem.type = 'text/javascript';
        elem.charset = 'utf-8';
        if (elem.addEventListener) {
            elem.addEventListener('load', doCallback, false);
        } else {
            // IE
            elem.attachEvent('onreadystatechange', doCallback);
        }
        elem.src = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    function loadStyle(url) {
        var elem = document.createElement('link');
        elem.rel = 'stylesheet';
        elem.type = 'text/css';
        elem.href = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    function url(file) {
        return chrome.extension.getURL(file);
    }

    function data(key, value) {
        var dataset = document.body.dataset;
        if (arguments.length === 0) {
            return dataset;
        } else if (arguments.length === 2) {
            dataset[key] = value;
        }
        return dataset[key];
    }



    function addEventListenerToVideo(x) {
        video.addEventListener(x, function (e) {
            console.log(e);

            chrome.runtime.sendMessage(
                {
                    from: "player",
                    action: x,
                    curTime: video.currentTime,
                    address: window.location.href,
                    title: document.title,
                },
                (response) => {
                    console.log(response);
                }
            );
        });
    }

    function abort(e) {
        console.log("video abort,", e);
        setTimeout(function () {
            initVideo(0);
        }, 1000);
    }

    function sendAddress() {
        chrome.runtime.sendMessage(
            {
                from: "player",
                action: "new url",
                address: window.location.href,
                title: document.title,
            },
            (response) => {
                console.log(response);
            }
        );
    }

    function mountVideo() {
        console.log(video);
        console.log("开始挂载方法");
        sendAddress();
        video.addEventListener("abort", abort);
        actionArr.forEach(x => {
            addEventListenerToVideo(x);
        });
        console.log(window.location.href);
    }

    

    function initVideo(count) {
        initVideoCount = count;
        video = document.getElementsByTagName("video")[0];
        if (video) {
            mountVideo();
        } else if(initVideoCount > videoRefindTimes) {
            console.log("获取video对象超时");
        } else {
            console.log(`没有找到video，将在${videoRefindInterval}秒后重新获取`);
            initVideoCount++;
            setTimeout(function(){
                initVideo(initVideoCount);
            }, videoRefindInterval * 1000);
        }
    }

    



    chrome.runtime.onMessage.addListener((message, sender, respond) => {
        console.log(message);
        if (message.from === "peer") {
            console.log("get msg from peer, the sender is " + sender);
            if (!video) return;
            switch (message.action) {
                case "playing":
                    if (message.curTime &&
                        Math.abs(message.curTime - video.currentTime) > 1
                    ) {
                        video.currentTime = message.curTime;
                    }
                    video.play();
                    console.log("视频已播放, curTime:", video.currentTime);
                    break;
                case "pause":
                    video.pause();
                    console.log("视频已暂停, curTime:", video.currentTime);
                    break;
                case "seeked":
                    if (message.curTime &&
                        Math.abs(message.curTime - video.currentTime) > 1
                    ) {
                        video.currentTime = message.curTime;
                    }
                    console.log("视频已跳转, curTime:", video.currentTime);
                default:
                    console.log("无法处理的消息: " + message);
                    break;
            }
            respond({ success: true, response: "已收到消息" }, function (e) {
                console.log(e);
            });
        }
    });

    //重写捕获video的逻辑，如果video为空应该在一段时间后再去获取
    if (video) {
        console.log("video 已获取");
        mountVideo();
    } else {
        console.log("video 未获取，将重新获取");
        initVideo(0);
    }

})();
