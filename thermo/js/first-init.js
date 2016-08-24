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
    /*Задаем одинаковой высоты столбцы секции */
    (function(){

    })();
}