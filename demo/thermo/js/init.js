document.addEventListener("DOMContentLoaded", ready);


function ready() {

    /*Loading scripts and css*/
    (function(){
        /*adding scipts*/
        addScript('js/first-load.min.js', document.head);
        addScript('js/jquery-1.11.1.min.js', 'js/jquery.fancybox.pack.js', 'js/jquery.mmenu.min.js', 'js/slick.min.js',
            'js/jquery.maskedinput.min.js', 'js/app.min.js', 'js/placeholder_polyfill.jquery.min.combo.js');

        /*adding css*/
        addCss('css/normalize.min.css', 'css/jquery.fancybox.min.css',
            'css/jquery.mmenu.min.css', 'css/jquery.mmenu.themes.min.css', 'css/slick.min.css', 'css/slick-theme.min.css',
            'css/styles.min.css', 'css/placeholder_polyfill.min.css', document.head);


        function addScript() { // args: str, [parentEl (DOM element), nextSibling (DOM element)]
            var lastArg = arguments[arguments.length - 1];
            var beforeLastArg = arguments[arguments.length - 2];
            var parentEl = document.body;
            var nextSibling = null;
            var offset = 0;

            if (typeof lastArg === 'object' && typeof beforeLastArg === 'object') {
                parentEl = beforeLastArg;
                nextSibling = lastArg;
                offset = 2;
            } else if (typeof lastArg === 'object' && typeof beforeLastArg === 'string') {
                parentEl = lastArg;
                offset = 1;
            }

            var scriptSrcArr = Array.prototype.slice.apply(arguments, [0, arguments.length - offset]);
            var index = 0;

            loadTag(createScript, scriptSrcArr, index, parentEl, nextSibling);
        }

        function createScript (src) {
            var script = document.createElement('script');
            script.src = src;

            return script;
        }

        function loadTag(createTagFunc, tagArr, currIndex, parentEl, nextSibling) {
            if (currIndex >= tagArr.length) return;

            var tag = createTagFunc(tagArr[currIndex]);

            tag = parentEl.insertBefore(tag, nextSibling);
            tag.addEventListener('load', loadTag.bind(this, createTagFunc, tagArr, currIndex + 1, parentEl, nextSibling));
        }

        function addCss() { // args:
            var lastArg = arguments[arguments.length - 1];
            var beforeLastArg = arguments[arguments.length - 2];
            var parentEl = document.body;
            var nextSibling = null;
            var offset = 0;

            if (typeof lastArg === 'object' && typeof beforeLastArg === 'object') {
                parentEl = beforeLastArg;
                nextSibling = lastArg;
                offset = 2;
            } else if (typeof lastArg === 'object' && typeof beforeLastArg === 'string') {
                parentEl = lastArg;
                offset = 1;
            }

            for(var i = 0; i < arguments.length - offset; i++) {
                var link = createCss(arguments[i]);

                parentEl.insertBefore(link, nextSibling);
            }
        }

        function createCss (href) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            return link;
        }
    })();
};