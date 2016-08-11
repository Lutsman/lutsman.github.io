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
/*Custom events IE9+*/
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


$(document).ready(function () {
    /*ScrollToAnchor*/
    (function(){
        /*ScrollToAnchor class*/
        function ScrollToAnchor(options) {
            this._listenedBlock = options.listenedBlock || document.body;
            this._translation = options.translation || 0;
        }
        ScrollToAnchor.prototype.init = function () {
            this._listenedBlock.addEventListener('click', this.anchorClickListener.bind(this));
        };
        ScrollToAnchor.prototype.anchorClickListener = function (e) {
            var elem = e.target;
            var anchorWithHash = elem.closest('a[href^="#"]');

            //console.log(anchorWithHash.hash.length);

            if (!anchorWithHash || !anchorWithHash.hash.length) return;

            e.preventDefault();

            var target = anchorWithHash.hash;
            var translation = anchorWithHash.hasAttribute('data-translation') ? +anchorWithHash.getAttribute('data-translation') : this._translation;

            if(! document.querySelector(target)) return;

            this.smoothScroll(target, translation);
        };
        ScrollToAnchor.prototype.smoothScroll = function (selector, translation) {
            $("html, body").animate({
                    scrollTop: $(selector).offset().top - (translation || 0)},
                500
            );
        };

        var pageScroll = new ScrollToAnchor({});
        pageScroll.init();
    })();

    /*ScrollUp button*/
    (function(){
        var buttonUp = '<div id="scrollUp"><i class="upButton"></i></div>';
        var flag = false;

        $('body').append($(buttonUp));


        $('#scrollUp').click( function(){
            $("html, body").animate({scrollTop: 0}, 500);
            return false;
        });

        $(window).scroll(scrollBtnToggler);
        scrollBtnToggler();

        function scrollBtnToggler() {
            if ( $(document).scrollTop() > $(window).height() && !flag ) {
                $('#scrollUp').fadeIn({queue : false, duration: 400});
                $('#scrollUp').animate({'bottom' : '40px'}, 400);
                flag = true;
            } else if ( $(document).scrollTop() < $(window).height() && flag ) {
                $('#scrollUp').fadeOut({queue : false, duration: 400});
                $('#scrollUp').animate({'bottom' : '-20px'}, 400);
                flag = false;
            }
        }
    })();
    
    
    /*Sorting*/
    (function(){
    	$('.projects__menu').on('click', function (e) {
            var target = e.target;
            var sortBtn = target.closest('[data-sort-by]');


            if (!sortBtn) return;
            e.preventDefault();

            var sortingWrapperSelector = '[data-role="sorting-wrapper-projects"]';

            sortBlocks(sortBtn, sortingWrapperSelector);
            setActiveButton(sortBtn);
        });

        function sortBlocks(sortBtn, sortingWrapperSelector) {
            var $sortingWrapper = $(sortingWrapperSelector);
            var $sortableBlocks = $sortingWrapper.find('[data-sortable-by]');
            var sortingSelector = $(sortBtn).attr('data-sort-by');

            if ( sortingSelector === 'all') {
                $sortableBlocks.show();
            } else {
                $sortableBlocks.each(function () {
                    if ($(this).attr('data-sortable-by') === sortingSelector) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                })
            }
        }

        function setActiveButton(button) {
            var activeBtn = button.parentNode.querySelectorAll('.active');

            $(activeBtn).each(function () {
                $(this).removeClass('active');
            });

            $(button).addClass('active');
        }
    })();
    
    /*Metrics Pills*/
    (function(){
        $('.nav-tabs a').click(function(){
            $(this).tab('show');
        })
    })();


});