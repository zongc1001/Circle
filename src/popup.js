let storage = chrome.storage.sync || chrome.storage.local;
let server = get('server');
let key = get('key');
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
            server: '',
            key: ''
        },
        item => {
            myId.value = item.myId;
            peerId.value = item.peerId;
            server.value = item.server;
            key.value = item.key;
        }
    );
}

function connect() {
    storage.set(
        {
            myId: myId.value,
            peerId: peerId.value,
            server: server.value,
            key: key.value,
        },
        () => {
            chrome.runtime.sendMessage({ event: 'connect' }, response => {
                if (response.success) {
                    window.close();
                }
            });
        }
    );
}


on('connect', 'click', connect);
restore();
