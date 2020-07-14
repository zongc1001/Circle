import Peer from "peerjs"
let storage = chrome.storage.sync || chrome.storage.local;
let peer = null;
let conn = null;

let circleOptions = {};

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
            peer.on('error', function (err) {
                console.error(err);
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
                chrome.browserAction.setBadgeText({ text: 'ON' });
                chrome.browserAction.setBadgeBackgroundColor({ color: [30, 255, 30, 255] });
                console.log('Connected to: ' + conn.peer)
            })


        }
    );
}

function join(peerId) {
    conn = peer.connect(peerId, {
        label: 'Circle',
        reliable: false
    })
    conn.on("open", function () {
        chrome.browserAction.setBadgeText({ text: 'ON' });
        chrome.browserAction.setBadgeBackgroundColor({ color: [30, 255, 30, 255] });
        console.log('Connected to: ' + conn.peer)

    })

    conn.on("error", function(err) {
        console.error(err);
    })
}


function inject() {
    // if (chrome.runtime.lastError) {
    //     console.error(chrome.runtime.lastError.message);
    // }
    chrome.tabs.executeScript(null, {
        file: 'inject.js',
        allFrames: true
    }, function (e) {
        
    });
    console.log('Injector executed.');
}

function checkAutoInject() {
    chrome.webNavigation.onCompleted.addListener(inject, {
        url: [
            {
                urlMatches:
                    '(?:^|.)(youku.com|sohu.com|tudou.com|qq.com|iqiyi.com|youtube.com|acfun.cn|bilibili.com|mgtv.com|vimeo.com)(?:/|$)'
            }
        ]
    });
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
    console.log(message);
    if (message.event === 'optionschange') {
        console.log('Options changed and re-init...');
        peer.destroy();
        initPeer();
        respond({ success: true, response: "已收到消息" }, function (e) {
            console.log(e);
        });
    }
    if (message.from === "player") {
        console.log("get msg from player");
        
        console.log(typeof message.action)
        conn.send(message.action)
        respond({ success: true, response: "已收到消息" }, function (e) {
            console.log(e);
        })
    }
});
initPeer();
checkAutoInject();
