(function () {

    if (data("inject")) return;
    data("inject", true);

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

    let video = document.getElementsByTagName("video")[0];
    console.log(video);
    if (video) {
        let actionArr = [
            "pause",
            "playing"
        ];
        actionArr.forEach(x => {
            video.addEventListener(x, function (e) {
                console.log(e);
                chrome.runtime.sendMessage(
                    {
                        greeting: "这里是inject.js",
                        from: "player",
                        action: x,
                        curTime: video.currentTime
                    },
                    (response) => {
                        console.log(response);
                    }
                );
            });
        });
    }

    chrome.runtime.onMessage.addListener((message, sender, respond) => {
        console.log(message);
        if (message.from === "peer") {
            console.log("get msg from peer, the sender is " + sender);
            if (!video) return;
            if (message.curTime &&
                Math.abs(message.curTime - video.currentTime) > 1
            ) {
                video.currentTime = message.curTime;
            }
            switch (message.action) {
                case "playing":
                    video.play();
                    break;
                case "pause":
                    video.pause();
                    break;
                default:
                    console.log("无法处理的消息: " + message);
                    break;
            }
            respond({ success: true, response: "已收到消息" }, function (e) {
                console.log(e);
            });
        }
    });
})();
