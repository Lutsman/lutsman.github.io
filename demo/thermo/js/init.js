//document.addEventListener("DOMContentLoaded", ready);


(function(){
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

    /*Loading scripts and css*/
    (function(){
        var loader = new Loader();

        /*adding scipts*/
        var scriptArr = [
            'js/jquery-1.11.1.min.js',
            'js/jquery.fancybox.pack.js',
            'js/jquery.mmenu.min.js',
            'js/slick.min.js',
            'js/jquery.maskedinput.min.js',
            'js/app.min.js',
            'js/placeholder_polyfill.jquery.min.combo.js'
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
            'css/styles.min.css',
            'css/placeholder_polyfill.min.css'
        ];

        loader.addCss(cssArr, document.head);
    })();
})();