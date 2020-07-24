let storage = chrome.storage.sync || chrome.storage.local;
let myId = get("myId");
let peerId = get("peerId");


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
            peerId: peerId.value,
        },
        () => {
            chrome.runtime.sendMessage({ event: 'connectToPeerServer' }, response => {
                console.log(response);
                if (response.success) {
                    document.body.classList.add("toleft");
                    
                }
            });
        }
    );
}


function connectToYourPeer() {
    storage.set(
        {
            myId: myId.value,
        },
        () => {
            chrome.runtime.sendMessage({ event: 'connectToYourPeer' }, response => {
                if (response.success) {
                    window.close();
                }
            });
        }
    );
}


on("connectToPeerServer", "click", connectToPeerServer);
on("connectToYourPeer", "click", connectToYourPeer);
restore();
