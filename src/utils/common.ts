export function createScript(src: string, onLoad?: () => any, onErr?: () => any, onExists?: () => any) {
    if (!document.querySelector("script[src='" + src + "']")) { // script hasnt been added
        var scrEl = document.createElement('script');
        scrEl.src = src;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag.parentNode)
            firstScriptTag.parentNode.insertBefore(scrEl, firstScriptTag);
        else {
            if (onErr) onErr();
        }

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