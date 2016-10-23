console.log('init');

document.addEventListener("DOMContentLoaded", ready);



function ready() {
    console.log('script init loaded');

    /*Loading scripts and css*/
    (function(){
        /*adding scipts*/
        addScript('js/first-load.min.js', document.head);
        addScript('js/jquery-1.11.1.min.js', 'js/jquery.fancybox.pack.js', 'js/jquery.mmenu.min.js', 'js/slick.min.js',
            'js/jquery.maskedinput.min.js', 'js/app.min.js');

        /*adding css*/
        addCss('css/normalize.min.css', 'css/jquery.fancybox.min.css',
            'css/jquery.mmenu.min.css', 'css/jquery.mmenu.themes.min.css', 'css/slick.min.css', 'css/slick-theme.min.css',
            'css/styles.min.css', document.head);

        /*IE placeholders support*/
        if  ('IE') {
            addScript('js/placeholder_polyfill.jquery.min.combo.js');
            addCss('css/placeholder_polyfill.min.css', document.head);
        }


        function addScript() { // args:
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

            /*if (typeof lastArg === 'object') {
             parentEl = lastArg;
             } else if (typeof lastArg === 'function') {

             }*/

            var scriptSrcArr = Array.prototype.slice.apply(arguments, [0, arguments.length - offset]);
            var index = 0;

            var promise = new Promise(function (resolve, reject) {
                if (index >= scriptSrcArr.length) {
                    reject();
                    return;
                }

                var script = createScript(scriptSrcArr[index]);

                script = parentEl.insertBefore(script, nextSibling);
                index++;

                script.addEventListener('load', resolve);
            });

            function loadTag() {
                
            }

            /*for(var i = 0; i < scriptSrcArr.length; i++) {
                var script = createScript(scriptSrcArr[i]);

                parentEl.insertBefore(script, nextSibling);
            }*/
        }

        function addCss() { // args:
            var lastArg = arguments[arguments.length - 1];
            var beforeLastArg = arguments[arguments.length - 2];
            var parentEl = document.body;
            var nextSibling = null;

            if (typeof lastArg === 'object' && typeof beforeLastArg === 'object') {
                parentEl = beforeLastArg;
                nextSibling = lastArg;
            } else if (typeof lastArg === 'object' && typeof beforeLastArg === 'string') {
                parentEl = lastArg;
            }

            for(var i = 0; i < arguments.length; i++) {
                var script = createCss(arguments[i]);

                parentEl.insertBefore(script, nextSibling);
            }
        }

        function createScript (src) {
            var script = document.createElement('script');
            script.src = src;

            return script;
        }

        function createCss (href) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            return link;
        }
    })();
    
    
};