export function createScript(src: string, onLoad?: () => any, onErr?: () => any, onExists?: () => any) {
    if (!document.querySelector("script[src='" + src + "']")) { // script hasnt been added
        var head = document.getElementsByTagName('head')[0];
        var scrEl = document.createElement('script');
        scrEl.src = src;
        head.appendChild(scrEl);

        scrEl.onload = function () { // with not work on IE <9
            if (onLoad)
                onLoad();
        };
    }
    else {
        if (onExists)
            onExists();
    }
}

export function createStyle(href: string, onLoad?: () => any, onErr?: () => any, onExists?: () => any) {
    if (!document.querySelector("link[href='" + href + "']")) {
        var head = document.getElementsByTagName('head')[0];
        var linkEl = document.createElement('link');
        linkEl.href = href;
        head.appendChild(linkEl);

        linkEl.onload = function () { // with not work on IE <9
            if (onLoad)
                onLoad();
        };
    }
    else {
        if (onExists)
            onExists();
    }
}