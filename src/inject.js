(function () {
    function loadScript(url, callback) {
        
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.addEventListener("load", callback, false);
        
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function getFullUrl(url) {
        return chrome.runtime.getUrl(url);
    }

    



});