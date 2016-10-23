document.addEventListener('DOMContentLoaded', function () {
    

    /*Loading scripts and css*/
    (function(){



        function addScript() { // args:
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

            /*if (typeof lastArg === 'object') {
             parentEl = lastArg;
             } else if (typeof lastArg === 'function') {

             }*/


            for(var i = 0; i < arguments.length; i++) {
                var script = createScript(arguments[i]);

                parentEl.insertBefore(script, nextSibling);
            }
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
    
    
});