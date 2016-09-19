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
    /*BlockToggler*/
    (function(){
        function BlockToggler(options) {
            this._block = options.block;
            this._target = $(this._block).attr('data-target');
            this._getTarget = options.getTarget || null; //func, arg: block, return: target
            this._groupName = $(this._block).attr('data-group-name');
            this._isActive = false;
            this._animate = options.animate || 'slide';  // 'none', 'slide', 'fade'
            this._onOpen = options.onOpen || null;
            this._onClose = options.onClose || null;
            this._onAfterOpen = options.onAfterOpen || null;
            this._onAfterClose = options.onAfterClose || null;
        }
        BlockToggler.prototype.init = function () {
            var throttledToggler = this.throttle(this.toggler, 405);

            $(this._block).on('click', throttledToggler.bind(this));

            $('body').on({
                'openBlock': this.openBlockListener.bind(this),
                'closeGroup': this.closeGroupListener.bind(this)
            });
        };
        BlockToggler.prototype.toggler = function (e) {
            e.preventDefault();

            if (this._isActive) {
                this.hideBlock(function () {
                    $(this._block).removeClass('active');

                    if (this._onAfterClose) {
                        this._onAfterClose(this);
                    }
                }.bind(this));

                $(this._block).trigger('blockClose', [this._block, this._groupName]);

                if (this._onClose) {
                    this._onClose(this);
                }
            } else {
                $(this._block).addClass('active');
                this.showBlock(function () {
                    if (this._onAfterOpen) {
                        this._onAfterOpen(this);
                    }
                }.bind(this));

                $(this._block).trigger('openBlock', [this._block, this._groupName]);

                if (this._onOpen) {
                    this._onOpen(this);
                }
            }
        };
        BlockToggler.prototype.openBlockListener = function (e, block, groupName) {
            if (block === this._block || groupName !== this._groupName || groupName === undefined || !this._isActive) return;

            $(this._block).removeClass('active');
            this.hideBlock();
        };
        BlockToggler.prototype.closeGroupListener = function (e, groupName) {
            if (groupName !== this._groupName || groupName === undefined || !this._isActive) return;

            this.hideBlock(function () {
                $(this._block).removeClass('active');

                if (this._onAfterClose) {
                    this._onAfterClose(this);
                }
            }.bind(this));

            $(this._block).trigger('blockClose', [this._block, this._groupName]);

            if (this._onClose) {
                this._onClose(this);
            }
        };
        BlockToggler.prototype.showBlock = function (callback) {
            var target = this._target;

            if (!this._target && typeof this._getTarget === 'function') {
                target = this._getTarget(this._block);
            }

            switch (this._animate) {
                case 'none':
                    $(target).show();
                    if (typeof callback === 'function') callback();
                    break;
                case 'slide':
                    $(target).slideDown('normal', 'linear', callback);
                    break;
                case 'fade':
                    $(target).fadeIn('normal', 'linear', callback);
                    break;
            }

            this._isActive = true;
        };
        BlockToggler.prototype.hideBlock = function (callback) {
            var target = this._target;

            if (!this._target && typeof this._getTarget === 'function') {
                target = this._getTarget(this._block);
            }

            switch (this._animate) {
                case 'none':
                    $(target).hide();
                    if (typeof callback === 'function') callback();
                    break;
                case 'slide':
                    $(target).slideUp('normal', 'linear', callback);
                    break;
                case 'fade':
                    $(target).fadeOut('normal', 'linear', callback);
                    break;
            }
            this._isActive = false;
        };
        BlockToggler.prototype.throttle = function (func, ms) {

            var isThrottled = false,
                savedArgs,
                savedThis;

            function wrapper() {

                if (isThrottled) { // (2)
                    savedArgs = arguments;
                    savedThis = this;
                    return;
                }

                func.apply(this, arguments); // (1)

                isThrottled = true;

                setTimeout(function() {
                    isThrottled = false; // (3)
                    if (savedArgs) {
                        wrapper.apply(savedThis, savedArgs);
                        savedArgs = savedThis = null;
                    }
                }, ms);
            }

            return wrapper;
        };

        $.fn.blockToggler = function () {
            var options = typeof arguments[0] === 'object' ? arguments[0] : {};

            $(this).each(function () {
                options.block = this;

                var currBlockToggler = new BlockToggler(options);
                currBlockToggler.init();
            });
        }

    })();

    /*menu*/
    (function(){
        /*Main menu*/
        (function(){
            var $mainMenuDesctop = $('[data-group-name="main-menu"]');

            $mainMenuDesctop.blockToggler({
                onOpen: function () {
                    $('[data-offset="main-menu"]').addClass('active-menu');
                    //$('[data-offset="main-menu"]')[0].style.height = '';
                    //.animate({height: '411px'}, "normal");
                },
                onClose: function () {
                    //$('[data-offset="main-menu"]').animate({height: '130px'}, "normal");
                },
                onAfterClose: function () {
                    $('[data-offset="main-menu"]').removeClass('active-menu');
                }
            });
        })();

        /*Main mobile menu*/
        (function(){
            $('#main-hamburger').blockToggler({
                animate: 'fade',
                onOpen: function () {
                    //$('.logo').hide();
                    $('[data-offset="main-menu"]').addClass('active-menu');
                },
                onClose: function () {
                    var $offsetBlock = $('[data-offset="main-menu"]');
                    $('body').trigger('openBlock', ['', 'main-mobile-menu']);
                    $offsetBlock.animate({height: '130px'}, "normal", function () {
                        $offsetBlock.css('height', '');
                    });
                },
                onAfterClose: function () {
                    //$('.logo').show();
                    $('[data-offset="main-menu"]').removeClass('active-menu');
                }
            });

            $('[data-group-name="main-mobile-menu"]').blockToggler({
                getTarget: function (block) {
                    return block.nextElementSibling;
                },
                onOpen: function () {
                    if (document.documentElement.clientWidth < 1024 && document.documentElement.clientWidth > 767) {
                        $('[data-offset="main-menu"]').animate({height: '480px'}, "normal");
                    }
                    //$('[data-offset="main-menu"]').animate({height: '480px'}, "normal");
                },
                onClose: function () {
                    var $offsetBlock = $('[data-offset="main-menu"]');

                    if (document.documentElement.clientWidth < 1024 && document.documentElement.clientWidth > 767) {
                        $offsetBlock.animate({height: '130px'}, "normal", function () {
                            $offsetBlock.css('height', '');
                        });
                    }
                    //$('[data-offset="main-menu"]').animate({height: '130px'}, "normal");
                }
            });
        })();

        /*Secondary menu*/
        (function(){
            $('[data-group-name="secondary-menu"]').blockToggler({
                onOpen: function () {
                    $('[data-offset="secondary-menu"]').addClass('active-menu');

                    //$('[data-offset="secondary-menu"]').animate({height: '316px'}, "normal");
                },
                onAfterClose: function () {
                    $('[data-offset="secondary-menu"]').removeClass('active-menu');

                    /*var $offsetBlock = $('[data-offset="secondary-menu"]');
                     $offsetBlock.animate({height: '-=316px'}, "normal", function () {
                     $offsetBlock.css('height', '');
                     });*/
                }
            });
        })();

        /*Secondary mobile menu*/
        (function(){
            $('#secondary-hamburger').blockToggler({
                animate: 'fade',
                onOpen: function () {
                    //$('.logo').hide();
                    $('[data-offset="secondary-menu"]').addClass('active-menu');
                },
                onClose: function () {
                    var $offsetBlock = $('[data-offset="secondary-menu"]');
                    $('body').trigger('openBlock', ['', 'secondary-mobile-menu']);
                    $offsetBlock.animate({height: '130px'}, "normal", function () {
                        $offsetBlock.css('height', '');
                    });
                },
                onAfterClose: function () {
                    //$('.logo').show();
                    $('[data-offset="secondary-menu"]').removeClass('active-menu');
                }
            });

            $('[data-group-name="secondary-mobile-menu"]').blockToggler({
                getTarget: function (block) {
                    return block.nextElementSibling;
                },
                onOpen: function () {
                    if (document.documentElement.clientWidth < 1024 && document.documentElement.clientWidth > 767) {
                        $('[data-offset="secondary-menu"]').animate({height: '480px'}, "normal");
                    }
                    //$('[data-offset="main-menu"]').animate({height: '480px'}, "normal");
                },
                onClose: function () {
                    var $offsetBlock = $('[data-offset="secondary-menu"]');

                    if (document.documentElement.clientWidth < 1024 && document.documentElement.clientWidth > 767) {
                        $offsetBlock.animate({height: '130px'}, "normal", function () {
                            $offsetBlock.css('height', '');
                        });
                    }
                    //$('[data-offset="main-menu"]').animate({height: '130px'}, "normal");
                }

            });
        })();

        /*menu on resize hidding*/
        (function(){
            var closeMenus = closeOnResize();
            
            $(window).on('resize', closeMenus);

            function closeOnResize() {
                var $mainDesktopMenu = $('[data-group-name="main-menu"]');
                var $secondaryDesktopMenu = $('[data-group-name="secondary-menu"]');
                var desktopMenus = [$mainDesktopMenu, $secondaryDesktopMenu];

                var $mainMobileMenuHam = $('#main-hamburger');
                var $mainMobileMenu = $('[data-group-name="main-mobile-menu"]');
                var $secondaryMobileMenuHam = $('#secondary-hamburger');
                var $secondaryMobileMenu = $('[data-group-name="secondary-mobile-menu"]');
                var mobileMenus = [$mainMobileMenuHam, $mainMobileMenu, $secondaryMobileMenuHam, $secondaryMobileMenu];

                var savedWidth = 0;
                var desktopWidth = 1024;
                var tabletWidth = 767;

                return function () {
                    var wWidth = document.documentElement.clientWidth;

                    if (!savedWidth) {
                        savedWidth = wWidth;
                        return;
                    }
                    
                    if(wWidth > desktopWidth && savedWidth < desktopWidth) {
                        closeGroup(mobileMenus);
                    } else if (wWidth < desktopWidth && savedWidth >= desktopWidth) {
                        closeGroup(desktopMenus);
                    } else if (wWidth < desktopWidth && wWidth >= tabletWidth && savedWidth < tabletWidth) {
                        closeGroup(mobileMenus);
                    } else if (wWidth < tabletWidth && savedWidth >= tabletWidth) {
                        closeGroup(mobileMenus);
                        closeGroup(desktopMenus);
                    }

                    savedWidth = wWidth;
                }
            }

            function closeGroup(toggler) {
                $.each(toggler, function () {
                    $(this).trigger('closeGroup', [$(this).attr('data-group-name')]);
                });
            }
        })();
    })();

    /*slider*/
    (function(){

        /*Main page slider*/
        (function(){
            var $gridSlider = $('.grid-slider');


            if (!$gridSlider.length) return;

            $gridSlider.on('init reInit afterChange', function (e, slick) {
                var currSlideIndex = slick.currentSlide > 9 ? slick.currentSlide + 1 : '0' + (slick.currentSlide + 1);
                $('.grid-slider-index').text(currSlideIndex);
            });

            $gridSlider.slick({
                dots: true,
                vertical: true,
                verticalSwiping: true
            });

            /*Resize hack*/
            (function(){
                var throttledSetPos = throttle(setPos, 500);

                function throttle(func, ms) {

                    var isThrottled = false,
                        savedArgs,
                        savedThis;

                    function wrapper() {

                        if (isThrottled) { // (2)
                            savedArgs = arguments;
                            savedThis = this;
                            return;
                        }

                        func.apply(this, arguments); // (1)

                        isThrottled = true;

                        setTimeout(function() {
                            isThrottled = false; // (3)
                            if (savedArgs) {
                                wrapper.apply(savedThis, savedArgs);
                                savedArgs = savedThis = null;
                            }
                        }, ms);
                    }

                    return wrapper;
                }

                function setPos() {
                    $('.grid-slider').slick('setPosition');
                }

                $(window).on('resize', throttledSetPos);
            })();
        })();

        /*Pageheader slider*/
        (function(){
            $(".pageheader-slider").slick({
                arrows: false,
                dots: true,
                dotsClass: 'category',
                customPaging : function(slider, i) {
                    var name = $(slider.$slides[i]).data('name');
                    return name;
                },
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        dots: false
                    }
                }]
            });
        })();

        /*Secondary pageheader slider*/
        (function(){
            var $slider = $(".secondary-pageheader-slider");

            $slider.on('init reInit afterChange', function (e, slick) {
                var currSlideIndex = slick.currentSlide + 1;
                $('.secondary-pageheader-slider-index').text(currSlideIndex);
            });


            $slider.slick({
                arrows: false,
                dots: true,
                dotsClass: 'category',
                customPaging : function(slider, i) {
                    var name = $(slider.$slides[i]).data('name');
                    //var $slide = $(slider.$slides[i]);
                    //var slideIndex = $slide.data().slickIndex;

                    //$slide.find('.slide-index').text(slideIndex + 1);

                    return name;
                },
                responsive: [{
                    breakpoint: 1365,
                    settings: {
                        dots: false
                    }
                }]
            });
        })();

        /*Photo block slider*/
        (function(){
            var $photoBlock = $('.photo-block');
            var $photoBlockSlider = $('.photo-block-slider', $photoBlock);
            var $counter = $('.photo-block-slider-counter', $photoBlock);

            if (!$photoBlockSlider.length) return;


            $photoBlockSlider.on('init reInit afterChange', function (e, slick) {
                var currSlideHtml = '<span class="accent">' + (slick.currentSlide + 1) + '</span>';
                var slideCountHTML = '<span>' + slick.slideCount + '</span>';

                $counter.html(currSlideHtml + '/' + slideCountHTML);
            });

            $photoBlockSlider.slick();
        })();
    })();

    /*square block into slide*/
    (function(){
        //setUpGridLines();
        //$(window).on('resize', setUpGridLines);

        function setUpGridLines() {
            if (!$('.grid-line > div').length) return;

            var wWidth = document.documentElement.clientWidth;
            var blockWidthStr = getComputedStyle($('.grid-line > div')[0]).width;
            var $gridLines = $('.grid-line');

            if (wWidth > 1367) {
                $gridLines.each(function () {
                    this.style.height = blockWidthStr;
                });
            } else if (wWidth <= 1367 && $gridLines[0].style.height) {
                $gridLines.each(function () {
                    this.style.height = '';
                });
            }
        }
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

    /*ScrollToAnchor class*/
    (function(){
        function ScrollToAnchor(options) {
            this._listenedBlock = options.listenedBlock || document.body;
            this._translationElementSelector = options.translation || false;
        }
        ScrollToAnchor.prototype.init = function () {
            this._listenedBlock.addEventListener('click', this.anchorClickListener.bind(this));
        };
        ScrollToAnchor.prototype.anchorClickListener = function (e) {
            var elem = e.target;
            var anchorWithHash = elem.closest('a[href^="#"]:not([data-scroll="disable"])');

            if (!anchorWithHash || !anchorWithHash.hash.length) return;

            e.preventDefault();

            var target = anchorWithHash.hash;
            var translation = 0;

            if (anchorWithHash.hasAttribute('data-translation')) {
                translation = anchorWithHash.getAttribute('data-translation');
            } else if (this._translationElementSelector) {
                translation = document.querySelector(this._translationElementSelector).offsetHeight;
            }

            if(! document.querySelector(target)) return;

            this.smoothScroll(target, translation);
        };
        ScrollToAnchor.prototype.smoothScroll = function (selector, translation) {
            $("html, body").animate({
                    scrollTop: $(selector).offset().top - (translation||0)},
                500
            );
        };

        var anchorScroller = new ScrollToAnchor({});
        anchorScroller.init();
    })();

    /*Animate touch event mobile*/
    (function(){
        var scroller=false,
            button = $('#scrollUp'),
            clickable;

        $(button).bind({
            touchstart: function(event){
                var elem=$(this);
                clickable = setTimeout(function () { elem.addClass('active');}, 100);
            },

            touchmove: function(event){
                clearTimeout(clickable);
                scroller=true;
            },

            touchend: function(event){
                var elem=$(this);
                clearTimeout(clickable);

                if(!scroller)
                {
                    elem.addClass('active');
                    setTimeout(function () { elem.removeClass('active');}, 50);
                }
                else
                {
                    elem.removeClass('active');
                }
            }
        });
    })();

    /*Viewport fix safary*/
    (function(){
        'use strict';
        var element = document.querySelector('.page-wrap');
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {

            window.addEventListener('resize', fixViewport.bind(null, element), true);
            fixViewport(element);
        }

        function fixViewport (element) {
            element.style.height = document.documentElement.clientHeight + 'px';
        }
    })();
});