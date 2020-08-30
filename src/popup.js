let storage = chrome.storage.sync || chrome.storage.local;
let myId = get("myId");
let peerId = get("peerId");
let tips = document.getElementsByClassName("tip");
let tip0 = tips[0];
let tip1 = tips[1];


function get(id) {
    return document.getElementById(id);
}

function on(elem, type, listener) {
    console.log(elem);
    get(elem).addEventListener(type, listener, false);
}
function restore() {
    storage.get(
        {
            myId: '',
            peerId: '',
        },
        item => {
            myId.value = item.myId;
            peerId.value = item.peerId;
        }
    );
}
function connectToPeerServer() {
    console.log("sign in clicked");
    storage.set(
        {
            myId: myId.value,
        },
        () => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
            chrome.runtime.sendMessage({ event: 'connectToPeerServer' }, response => {
                console.log(response);
                get("connectToPeerServer").innerHTML = "<div class='button'></div>"
            });
        }
    );
}


function connectToYourPeer() {
    storage.set(
        {
            peerId: peerId.value,
        },
        () => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            }
            chrome.runtime.sendMessage({ event: 'connectToYourPeer' }, response => {
                if (response.success) {
                    window.close();
                }
            });
        }
    );
}

function getBack() {
    return chrome.extension.getBackgroundPage();
    
}

function initAddress() {
    let back = getBack();
    if(back) {
        let address = back.methodExpose.getAddress();
        if(address) {
            let elem = get("remoteVideo");
            elem.innerText = address;
            elem.setAttribute("href", address);
        }
    }
}



chrome.runtime.sendMessage({ event: "haslogin" }, response => {
    console.log(response)
    if (response.haslogin) {
        document.body.classList.add("moveToLeft");
    } else {
        document.body.classList.remove("moveToLeft");
    }
});

on("connectToPeerServer", "click", connectToPeerServer);
on("connectToYourPeer", "click", connectToYourPeer);
restore();
initAddress();


window.methodExpose = {
    setLogin: function (value) {
        storage.set({
            login: value
        });
    },
    loginSuccess: function () {
        document.body.classList.add("toleft");
        //还需完善登录逻辑，把按钮内部的html改回文字
    },
    loginFail: function () {
        let t = get("connectToPeerServer");
        console.log(t);
        t.innerText = "Connect faild";
        t.classList.add("fail-button");

        setTimeout(function () {
            t.innerText = "Sign in";
            t.style.backgroundColor = "#E6E6E6";
            t.classList.remove("fail-button");
        }, 500)
    },
    updateAddress: function (address, title) {
        let elem = get("remoteVideo");
        console.log(address);
        elem.innerText = title;
        elem.setAttribute("href", address);
    },
    closeWindow() {
        window.close();
    },
    connectSuccess: function(peer) {
        let elem = get("peerIdTip");
        elem.innerText = "You have connected to " + peer + " .";
    },
};


