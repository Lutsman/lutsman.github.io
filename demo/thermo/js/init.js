//document.addEventListener("DOMContentLoaded", ready);

init();

function init() {
    /*Loader class*/
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

        tag = parentEl.insertBefore(tag, nextSibling);
        tag.addEventListener('load', this.loadTagRecur.bind(this, createTagFunc, tagArr, currIndex + 1, parentEl, nextSibling));
    };
    Loader.prototype.addCss = function(links, parentEl, nextSibling) {
        parentEl = parentEl || document.body;
        nextSibling = nextSibling || null;

        for(var i = 0; i < links.length; i++) {
            var link = this.createCss(links[i]);

            parentEl.insertBefore(link, nextSibling);
        }
    };
    Loader.prototype.createCss = function(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        return link;
    };

    /*Loading scripts and css*/
    (function(){
        var loader = new Loader();

        /*adding scipts*/
        var firstLoadScript = ['js/first-load.min.js'];
        var scriptArr = [
            'js/jquery-1.11.1.min.js',
            'js/jquery.fancybox.pack.js',
            'js/jquery.mmenu.min.js',
            'js/slick.min.js',
            'js/jquery.maskedinput.min.js',
            'js/app.min.js',
            'js/placeholder_polyfill.jquery.min.combo.js'
        ];

        loader.addScript(firstLoadScript, document.head);
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


        /*function addScript(links, parentEl, nextSibling) { // args: array, [parentEl (DOM element), nextSibling (DOM element)]
            var index = 0;
            parentEl = parentEl || document.body;
            nextSibling = nextSibling || null;

            loadTag(createScript, links, index, parentEl, nextSibling);
        }

        function createScript (src) {
            var script = document.createElement('script');
            script.src = src;

            return script;
        }

        function loadTag(createTagFunc, tagArr, currIndex, parentEl, nextSibling) {
            if (currIndex >= tagArr.length) return;

            currIndex = currIndex || 0;
            parentEl = parentEl || document.body;
            nextSibling = nextSibling || null;

            var tag = createTagFunc(tagArr[currIndex]);

            tag = parentEl.insertBefore(tag, nextSibling);
            tag.addEventListener('load', loadTag.bind(this, createTagFunc, tagArr, currIndex + 1, parentEl, nextSibling));
        }

        function addCss(links, parentEl, nextSibling) {
            parentEl = parentEl || document.body;
            nextSibling = nextSibling || null;

            for(var i = 0; i < links.length - offset; i++) {
                var link = createCss(links[i]);

                parentEl.insertBefore(link, nextSibling);
            }
        }

        function createCss (href) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            return link;
        }*/
    })();
};