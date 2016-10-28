//document.addEventListener("DOMContentLoaded", ready);
/*custom event IE9+*/
(function(){
    try {
        new CustomEvent("IE has CustomEvent, but doesn't support constructor");
    } catch (e) {

        window.CustomEvent = function(event, params) {
            var evt;
            params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
            evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        CustomEvent.prototype = Object.create(window.Event.prototype);
    }
})();

/*Loader class*/

// default adding SCRIPT to BODY
// default adding CSS to HEAD
function Loader() {}
Loader.prototype.addScript = function(links, parentEl, nextSibling) { // args: array, [parentEl (DOM element), nextSibling (DOM element)]
    var index = 0;
    parentEl = parentEl || document.body;
    nextSibling = nextSibling || null;

    this.loadTagRecur(this.createScript, links, index, parentEl, nextSibling);
};
Loader.prototype.createScript = function(src) {
    var script = document.createElement('script');
    script.src = src;

    return script;
};
Loader.prototype.loadTagRecur = function(createTagFunc, tagArr, currIndex, parentEl, nextSibling) {
    if (currIndex >= tagArr.length) return;

    currIndex = currIndex || 0;
    parentEl = parentEl || document.body;
    nextSibling = nextSibling || null;

    var tag = createTagFunc(tagArr[currIndex]);
    var tagAddedEvent = this.createEvent('tagAdded', tag, tagArr[currIndex]);
    var tagLoadedEvent = this.createEvent('tagLoaded', tag, tagArr[currIndex]);

    tag = parentEl.insertBefore(tag, nextSibling);
    tag.dispatchEvent(tagAddedEvent);

    tag.addEventListener('load', function () {
        tag.dispatchEvent(tagLoadedEvent);
        this.loadTagRecur(createTagFunc, tagArr, currIndex + 1, parentEl, nextSibling);
    }.bind(this));
};
Loader.prototype.addCss = function(links, parentEl, nextSibling) {
    parentEl = parentEl || document.head;
    nextSibling = nextSibling || null;

    for(var i = 0; i < links.length; i++) {
        var link = this.createCss(links[i]);
        var linkAddedEvent = this.createEvent('linkAdded', link, links[i]);
        var linkLoadedEvent = this.createEvent('linkLoaded', link, links[i]);
        var triggeredEl = link;

        parentEl.insertBefore(link, nextSibling);


        if (link.closest('head')) { //if link in HEAD, not possible to trigger event on it
            triggeredEl = document.body;
        } else {
            link.addEventListener('load', link.dispatchEvent.bind(this, linkLoadedEvent)); // if link situated not in head we can get loading event
        }

        triggeredEl.dispatchEvent(linkAddedEvent);
    }
};
Loader.prototype.createCss = function(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    return link;
};
Loader.prototype.createEvent = function (eventName, elem, src) {
    var elemLoaded = new CustomEvent(eventName, {
        bubbles: true,
        detail: {
            el: elem,
            src: src
        }
    });

    return elemLoaded;
};
Loader.prototype.detectIE = function () {
    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
};


/*Loading scripts and css*/
function init(){
    var loader = new Loader();

    /*adding scipts*/
    var scriptArr = [
        'js/jquery-1.11.1.min.js',
        'js/jquery.fancybox.pack.js',
        'js/jquery.mmenu.min.js',
        'js/slick.min.js',
        'js/jquery.maskedinput.min.js',
        'js/app.min.js'
    ];

    loader.addScript(scriptArr);

    /*adding css*/
    var cssArr = [
        'https://fonts.googleapis.com/css?family=Roboto:400,700,700italic,900,900italic,400italic,300,300italic,500,500italic&subset=latin,cyrillic',
        'css/normalize.min.css',
        'css/jquery.fancybox.min.css',
        'css/jquery.mmenu.min.css',
        'css/jquery.mmenu.themes.min.css',
        'css/slick.min.css',
        'css/slick-theme.min.css',
        'css/styles.min.css'
    ];

    loader.addCss(cssArr);


    /*if IE 9 loading placeholders polyfill*/
    document.body.addEventListener('tagLoaded', function (e) {
        if (loader.detectIE() !== 9) return;

        var compareSrc = 'js/jquery-1.11.1.min.js';
        var targetSrc = e.detail.src;

        if (compareSrc !== targetSrc) return;

        loader.addScript(['js/placeholder_polyfill.jquery.min.combo.js']);
        loader.addCss(['css/placeholder_polyfill.min.css']);
    });

}


/*if body not ready waiting for it*/
(function(){
    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();


