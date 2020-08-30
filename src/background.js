import Peer from 'peerjs';
let storage = chrome.storage.sync || chrome.storage.local;
let peer = null;
let conn = null;
let urls =
  '(?:^|.)(youku.com|sohu.com|tudou.com|qq.com|iqiyi.com|youtube.com|acfun.cn|bilibili.com|mgtv.com|vimeo.com|ixigua.com)(?:/|$)'
let address = null;
let title = null;
function initPeer(resolve, reject) {
  // function doCallback() {
  //   if (typeof callback === 'function') {
  //     successCallback()
  //   }
  // }
  storage.get(
    {
      myId: '',
      peerId: '',
      server: '',
      key: ''
    },
    item => {
      console.log(item)
      peer = new Peer(item.myId, {
        host: item.server || 'zongchen.xyz',
        port: 9000,
        path: '/',
        key: item.key || 'peerjs',
        secure: true,
        debug: 3,
        config: {
          iceServers: [
            { url: 'stun:47.95.119.173:3478' },
            {
              url: 'turn:47.95.119.173:3478',
              username: 'zongchen',
              credential: 'onmyown0.'
            }
          ]
        }
      })

      peer.on('open', id => {
        console.log('connected, Id: ' + id)
        console.log(item.peerId);
        callPopup("setLogin", true);
        resolve();
      })
      peer.on('error', function (err) {
        console.log(err)
        setBadge({ text: 'ERR', color: [255, 30, 30, 255] })
      })
      peer.on('connection', c => {
        if (conn && conn.open) {
          c.on('open', function () {
            c.send('Already connected to another client')
            setTimeout(function () {
              c.close()
            }, 500)
          })
          return
        }
        conn = c
        initConn()
        // setBadge({ text: 'ON', color: [30, 255, 30, 255] })

        console.log('Connected to: ' + conn.peer)
      })

      peer.on('disconnected', function () {
        console.log('事件: disconnected')
        setBadge({ text: 'OFF', color: [255, 30, 30, 255] })
        callPopup("setLogin", false);
        reject();
        // if (autoReconnect) {
        //     setTimeout(() => {
        //         console.log("reconneting...");
        //         peer.reconnect();
        //     }, 1000)
        // }
      })

      peer.on('close', function (err) {
        console.log('事件: close')
        callPopup("setLogin", false);
        setBadge({ text: 'OFF', color: [255, 30, 30, 255] })
      })
    }
  )
}

function initConn() {
  // if(conn !== null) return;
  console.log('initConn')
  conn.on('open', function () {
    console.log("conn open");
    setBadge({ text: 'ON', color: [30, 255, 30, 255] })
    // getPopup().methodExpose.connectSuccess();
    console.log('Connected to: ' + conn.peer)
  })

  conn.on("data", function (data) {
    console.log("conn data");
    console.log("data:", data);
    address = data.address;
    title = data.title;
    callPopup("updateAddress", address, title);

    switch (data.action) {
      case 'playing':
        console.log('data received > playing')
        sendMsgToInject({
          from: 'peer',
          action: data.action,
          curTime: data.curTime
        })
        break
      case 'pause':
        console.log('data received > pause')
        sendMsgToInject({
          from: 'peer',
          action: data.action,
          curTime: data.curTime
        })
        break
      default:
        console.log('data received: ' + data)
        break
    }
  })

  conn.on('close', function () {
    console.log('连接中断')
    setBadge({ text: 'OFF', color: [255, 30, 30, 255] })
    conn = null
  })

  conn.on('error', function (err) {
    console.log(err)
  })
}

function join(peerId) {
  conn = peer.connect(peerId, {
    label: 'Circle',
    reliable: true
  })
  initConn()
}

function inject() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message)
  }
  chrome.tabs.executeScript(
    null,
    {
      file: 'inject.js',
      allFrames: true
    },
    function (e) {
      console.log('执行脚本回调：' + e)
    }
  )
  console.log('Injector executed.')
}

function getPopup() {
  let views = chrome.extension.getViews({ type: 'popup' })
  if (views.length > 0) {
    console.log(views[0]);
    return views[0];
  } else {
    return null;
  }
}
/**
 * 
 * @param {String} method 
 * @param {*} args 
 */

function callPopup(method, ...args) {
  let popup = getPopup();
  console.log("args:", args);
  if (popup) {
    return popup.methodExpose[method](...args);
  } else {
    console.log("popup没有打开");
  }
}

function sendMsgToInject(message) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        console.log(response)
      })
    }
  )
}



//设置图标的颜色和字体
function setBadge(option) {
  if (option.color) {
    chrome.browserAction.setBadgeBackgroundColor({ color: option.color })
  }
  if (option.text) {
    chrome.browserAction.setBadgeText({ text: option.text })
  }
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  console.log(message)
  if (message.event === 'optionschange') {
    console.log('Options changed and re-init...')
    peer.disconnect()
    peer = null

    initPeer()
    respond({ success: true, response: '配置变更，已重新连接' }, function (e) {
      console.log(e)
    })
  }

  if (message.event === 'connectToPeerServer') {
    // join(circleOption.peerId);
    if (peer && peer.id) {
      peer.disconnect()
    }

    // initPeer();
    // console.log("peer: ", peer);
    // if (peer) {
    //   console.log("peer.id: ", peer.id);
    // }

    respond({ success: true, response: '已请求连接服务器' }, function (e) {
      console.log(e)
    })

    let t = new Promise(initPeer);
    t.then(function () {
      callPopup("loginSuccess");
    }).catch(function () {
      callPopup("loginFail");
    })
  }
  if (message.event === 'connectToYourPeer') {
    // join(circleOption.peerId);
    storage.get({ peerId: '' }, item => {
      join(item.peerId)
    })
    respond({ success: true, response: 'peer连接成功' }, function (e) {
      console.log(e)
    })
  }

  if (message.from === 'player') {
    console.log('get msg from player')
    if (peer && peer.id) {
      if (conn && conn.open) {
        conn.send(message)
        respond(
          { success: true, response: '已将' + message.action + '消息发出' },
          function (e) {
            console.log(e)
          }
        )
      } else {
        respond({ success: false, respond: '连接还没有打开' }, e => {
          console.log(e)
        })
      }
    } else {
      respond({ success: false, respond: '还未登录' }, e => {
        console.log(e)
      })
    }

  }
  if (message.event === 'haslogin') {
    if (peer && peer.id) {
      respond({ haslogin: true })
    } else {
      respond({ haslogin: false })
    }
  }
})

chrome.webNavigation.onCompleted.addListener(inject, {
  url: [
    {
      urlMatches: urls
    }
  ]
})


window.methodExpose = {
  getAddress: function () {
    return [address, title];
  }
}

setBadge({ text: "OFF", color: [240, 240, 0, 255] });