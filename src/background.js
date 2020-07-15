import Peer from "peerjs"
let storage = chrome.storage.sync || chrome.storage.local;
let peer = null;
let conn = null;
let urls = '(?:^|.)(bilibili.com)(?:/|$)';
let circleOption = {};
let autoReconnect = true;

function initPeer() {
    storage.get(
        {
            myId: '',
            peerId: '',
            server: '',
            key: ''
        },
        item => {
            console.log(item);
            circleOption = item;
            peer = new Peer(item.myId, {
                host: item.server || "zongchen.xyz",
                port: 9000,
                path: '/',
                key: item.key || "peerjs",
                secure: true,
                debug: 3,
                iceServers: [
                    { url: 'stun:stun.turnservers.com:3478' },
                    { url: 'stun:stun01.sipphone.com' },
                    { url: 'stun:stun.ekiga.net' },
                    { url: 'stun:stun.fwdnet.net' },
                    { url: 'stun:stun.ideasip.com' },
                    { url: 'stun:stun.iptel.org' },
                    { url: 'stun:stun.rixtelecom.se' },
                    { url: 'stun:stun.schlund.de' },
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'stun:stun1.l.google.com:19302' },
                    { url: 'stun:stun2.l.google.com:19302' },
                    { url: 'stun:stun3.l.google.com:19302' },
                    { url: 'stun:stun4.l.google.com:19302' },
                    { url: 'stun:stunserver.org' },
                    { url: 'stun:stun.softjoys.com' },
                    { url: 'stun:stun.voiparound.com' },
                    { url: 'stun:stun.voipbuster.com' },
                    { url: 'stun:stun.voipstunt.com' },
                    { url: 'stun:stun.voxgratia.org' },
                    { url: 'stun:stun.xten.com' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    }
                ]
            })

            peer.on("open", id => {
                console.log("connected, Id: " + id);
                console.log(item.peerId);
                join(item.peerId);
            })
            peer.on("error", function (err) {
                switch (err.type) {
                    case "peer-unavailable":
                        peer.disconnect();
                        break;
                    default:
                        console.log(err);
                        break;
                }
                setBadge({ text: "OFF", color: [255, 30, 30, 255] });
            })
            peer.on("connection", c => {
                if (conn && conn.open) {
                    c.on('open', function () {
                        c.send('Already connected to another client')
                        setTimeout(function () {
                            c.close()
                        }, 500)
                    })
                    return
                }
                conn = c;
                initConn();
                setBadge({ text: "ON", color: [30, 255, 30, 255] });

                console.log('Connected to: ' + conn.peer)
            })

            peer.on("disconnected", function () {
                console.log("事件: disconnected");
                setBadge({ text: "OFF", color: [255, 30, 30, 255] });

                if (autoReconnect) {
                    setTimeout(() => {
                        console.log("reconneting...");
                        peer.reconnect();
                    }, 1000)
                }
            })

            peer.on("close", function (err) {
                console.log("事件: close");
                setBadge({ text: "OFF", color: [255, 30, 30, 255] });

            })
        }
    );
}

function initConn() {
    // if(conn !== null) return;
    console.log("initConn");
    conn.on("open", function () {
        setBadge({ text: "ON", color: [30, 255, 30, 255] });

        console.log('Connected to: ' + conn.peer)

    })

    conn.on("data", function (data) {
        switch (data.action) {
            case "playing":
                console.log("data received > playing");
                sendMsgToInject({ from: "peer", action: data.action, curTime: data.curTime });
                break;
            case "pause":
                console.log("data received > pause");
                sendMsgToInject({ from: "peer", action: data.action, curTime: data.curTime });
                break;
            default:
                console.log("data received: " + data);
                break;
        }
    })

    conn.on("close", function () {
        conn = null;
        console.log("连接中断");
        setBadge({ text: "OFF", color: [255, 30, 30, 255] });

    })

    conn.on("error", function (err) {
        console.log(err);
    })
}

function join(peerId) {
    conn = peer.connect(peerId, {
        label: 'Circle',
        reliable: false
    })
    initConn();
}

function inject() {
    chrome.tabs.executeScript(null, {
        file: 'inject.js',
        // allFrames: true
    }, function (e) {

    });
    console.log('Injector executed.');
}


function sendMsgToInject(message, callback) {
    chrome.tabs.query(
        {
            // active: true,
            currentWindow: true,
            url: [
                "http://*.bilibili.com/video/*",
                "https://*.bilibili.com/video/*"
            ]
        },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                message,
                function (response) {
                    if (callback) callback(response);
                });
        }
    );
}

//设置图标的颜色和字体
function setBadge(option) {
    if (option.color) {
        chrome.browserAction.setBadgeBackgroundColor({ color: option.color });
    }
    if (option.text) {
        chrome.browserAction.setBadgeText({ text: option.text });

    }
}


chrome.runtime.onMessage.addListener((message, sender, respond) => {
    console.log(message);
    if (message.event === "optionschange") {
        console.log('Options changed and re-init...');
        peer.disconnect();
        peer = null;

        initPeer();
        respond({ success: true, response: "已收到消息" }, function (e) {
            console.log(e);
        });
    }

    if (message.event === "connect") {
        // join(circleOption.peerId);
        if (peer && !peer.destroyed) {
            peer.destroy();
            peer = null;
        }
        initPeer();
        respond({ success: true, response: "已收到消息" }, function (e) {
            console.log(e);
        });
    }

    if (message.from === "player") {
        console.log("get msg from player");
        console.log(typeof message.action)
        conn.send(message)
        respond({ success: true, response: "已收到消息" }, function (e) {
            console.log(e);
        })
    }
});

chrome.webNavigation.onCompleted.addListener(inject, {
    url: [
        {
            urlMatches: urls
        }
    ]
});

