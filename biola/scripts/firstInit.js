'use strict';

/* Polyfills */
/* closest for IE8+ */
(function () {
    'use strict';

    if(!Element.prototype.closest) {
        Element.prototype.closest = function (selector) {
            var elem = this;

            do {
                if (elem.matches(selector)) {
                    return elem;
                }

                elem = elem.parentElement;
            } while (elem);

            return null;
        };
    }
})();
/* matches for IE8+ */
(function () {
    'use strict';

    if (!Element.prototype.matches) {
        Element.prototype.matches = function (selector) {
            var elemColl = this.parentNode.querySelectorAll(selector);

            for(var i = 0; i < elemColl.length; i++) {
                if (elemColl[i] === this) return true;
            }

            return false;
        }
    }
})();
/*classList for IE9+ */
(function(){
    /*
     * Minimal classList shim for IE 9
     * By Devon Govett
     * MIT LICENSE
     */


    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }

                var ret = {
                    add: update(function(classes, index, value) {
                        ~index || classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        ~index && classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        ~index ? classes.splice(index, 1) : classes.push(value);
                    }),

                    contains: function(value) {
                        return !!~self.className.split(/\s+/).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.split(/\s+/)[i] || null;
                    }
                };

                Object.defineProperty(ret, 'length', {
                    get: function() {
                        return self.className.split(/\s+/).length;
                    }
                });

                return ret;
            }
        });
    }
})();



document.addEventListener('DOMContentLoaded', ready);

function ready() {
    /*Scale*/
    (function(){
        'use strict';
        
        var element = document.querySelector('.page-wrap');
        var fixViewport = function () {
            element.style.minHeight = document.documentElement.clientHeight + 'px';
        };

        // listen window height
        window.addEventListener('resize', fixViewport, true);
        fixViewport();
    })();
}


/*Yandex metrika and targets*/
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter38158930 = new Ya.Metrika({
                id:38158930,
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
            });
        } catch(e) { }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://mc.yandex.ru/metrika/watch.js";

    s.addEventListener('load', function () {
        'use strict';

        var yandexTargets = function (e) {
            var target = e.target;
            var attr = target.getAttribute('data-yaTarget');

            if(!attr) return;

            yaCounter38158930.reachGoal(attr);
        };

        document.body.addEventListener('click', yandexTargets);
    });

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
