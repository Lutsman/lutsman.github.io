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
    /*slider*/
    (function(){
        $('.pageheader-slider').slick({
            autoplay: true,
            autoplaySpeed: 7000,
            speed: 3000,
            fade: true,
            dots: true,
            prevArrow: '<span class="slick-prev"></span>',
            nextArrow: '<span class="slick-next"></span>',
            /*easing: 'ease-in',
            vertical: true,
            verticalSwiping: true*/
        });
    })();

    /*ScrollToAnchor && mobile menu*/
    (function(){
        /*ScrollToAnchor class*/
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

        /*page scroll*/
        (function(){
            var pageScroll = new ScrollToAnchor({
                listenedBlock: document.getElementById('.top-menu')
            });
            pageScroll.init();
        })();

        /*mmenu*/
        (function(){
            /*mmenu scroll*/
            var mmenuScroll = new ScrollToAnchor({
                listenedBlock: document.getElementById('#m-menu')
            });


            setUpMmenu();

            function setUpMmenu() {
                var $menu = $('nav#m-menu');
                var $openMenuBtn = $('#hamburger');

                $menu.mmenu({
                    navbar: {
                        title: 'Меню'
                    }
                });

                var selector = false;
                $menu.find( 'li > a' ).on(
                    'click',
                    function( e )
                    {
                        selector = this.hash;
                    }
                );

                var api = $menu.data( 'mmenu' );
                api.bind( 'closed',
                    function() {
                    console.log(selector);
                        if (selector && $(selector).length) {
                            mmenuScroll.smoothScroll(selector);
                        }
                        selector = false;
                    }

                );
                $openMenuBtn.click(function () {
                    api.open();
                });

            }
        })();
    })();

    /*Form*/
    (function(){
        function FormController(options) {
            this._submitSelector = options.submitSelector || 'input[type="submit"]';
            this._listenedBlock = options.listenedBlock || 'body';
            this._resetForm = options.resetForm || true;
            this._beforeSend = options.beforeSend || null;
            this._resolve = options.resolve || null;
            this._reject = options.reject || null;
            this._maxFileSize = options.maxFileSize || 2; //MB
        }
        FormController.prototype.init = function () {
            if(!document.querySelector(this._submitSelector)) return;

            $(this._listenedBlock).click(this.formListeners.bind(this));

            if($(this._listenedBlock).find('input[type="file"]').length) {
                $(this._listenedBlock).change(this.uploadListener.bind(this));
            }
        };
        FormController.prototype.validateForm = function (form) {
            var vResult = true;
            var passCurr = false;
            var self = this;

            $('input[name!="submit"], textarea', $(form)).each(function () {
                var vVal = $(this).val();
                var requiredField = $(this).attr('required');
                var pattern = '';
                var placeholderMess = '';

                $(this).removeClass('form-fail'); //чистим классы, если остались после прошлого раза
                $(this).removeClass('form-success');


                if (vVal.length === 0 && requiredField) {
                    placeholderMess = 'Поле ' + ($(this).attr('data-name') ? '"' + $(this).attr('data-name') + '" ' : '') + 'обязательное!';
                    vResult = false;
                } else if ($(this).attr('name') == 'email' && vVal.length) {
                    pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

                    if (pattern.test($(this).val())) {
                        $(this).addClass('form-success');
                    } else {
                        placeholderMess = 'Введите корректный E-mail!';
                        vResult = false;
                    }
                } else if ($(this).attr('name') == 'phone' && vVal.length) {
                    pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;

                    if (pattern.test($(this).val())) {
                        $(this).addClass('form-success');
                    } else {
                        placeholderMess = 'Введите корректный телефон!';
                        vResult = false;
                    }
                } else if ($(this).attr('name') === 'passCurr' && vVal.length) {
                    passCurr = this;
                } else if ($(this).attr('name') === 'passNew' && vVal.length) {
                    if (vVal === $(passCurr).val()) {
                        $(passCurr).val('').addClass('form-fail').attr('placeholder', 'Новый пароль, не должен совпадать с текущим!');
                        placeholderMess = 'Новый пароль, не должен совпадать с текущим!';
                    } else {
                        $(this).addClass('form-success');
                        $(passCurr).addClass('form-success');
                    }
                }else if($(this).is('textarea') && vVal.length < 10 && vVal.length > 0  && requiredField) {
                    placeholderMess = 'Сообщение слишком короткое!';
                    vResult = false;
                } else if (requiredField && vVal.length) {
                    $(this).addClass('form-success');
                }

                if (placeholderMess) {
                    $(this).attr('data-old-placeholder', $(this).attr('placeholder'));
                    $(this).val('').attr('placeholder', placeholderMess).addClass('form-fail');
                    placeholderMess = '<span class="form-fail">' + placeholderMess + '</span>';
                    self.changeLabel(this, placeholderMess, 'span.placeholder');
                }
            });

            return vResult;
        };
        FormController.prototype.uploadListener = function (e) {
            var elem = e.target;

            if(!elem.matches('input[type="file"]'))  return;

            var size = this.getFileSize(elem);

            if (size < this._maxFileSize * 1024 * 1024) return;

            alert("Файл слишком большой. Размер вашего файла " + (size / 1024 / 1024).toFixed(2) +
                " MB. Загружайте файлы меньше " + this._maxFileSize + "MB.");
            $(elem).val('');
        };
        FormController.prototype.getFileSize = function (input) {
            var file;

            if (typeof ActiveXObject == "function") { // IE
                file = (new ActiveXObject("Scripting.FileSystemObject")).getFile(input.value);
            } else {
                file = input.files[0];
            }

            return file.size;
        };
        FormController.prototype.changeLabel = function (elem, val, insideLabelSelector) {
            var selector = 'label[for="' + $(elem).attr('id') + '"] ' + insideLabelSelector || '';
            var $label = $(selector);

            if ($label.length) {
                $label.each(function () {
                    this.innerHTML = val;
                });
            }
        };
        FormController.prototype.resetForms = function (formContainer) {
            var $form;
            var self = this;

            if (formContainer.tagName === 'FORM') {
                $form = $(formContainer);
            } else {
                $form = $('form', $(formContainer));
            }

            $form.each(function () {
                self.resetPlaceholders(this);
                if (self._resetForm) {
                    this.reset();
                    self.triggerChange(this);
                }
            });
        };
        FormController.prototype.resetPlaceholders = function (inputContainer) {
            var self = this;
            var $input;

            if (inputContainer.tagName === 'INPUT') {
                $input = $(inputContainer);
            } else {
                $input = $('input[name != submit]', $(inputContainer));
            }

            $input.each(function () {
                var name = $(this).attr('name');
                var placeholderMess =  $(this).attr('data-old-placeholder');

                $(this).removeClass('form-success');
                $(this).removeClass('form-fail');

                if (!placeholderMess) return;

                $(this).attr('placeholder', placeholderMess);
                self.changeLabel(this, placeholderMess, 'span.placeholder');
            });
        };
        FormController.prototype.triggerChange = function (inputContainer) {
            var $input = null;

            if (inputContainer.tagName === 'INPUT') {
                $input = $(inputContainer);
            } else {
                $input = $('input[name != submit]', $(inputContainer));
            }

            $input.each(function () {
                $(this).trigger('change');
            });
        };
        FormController.prototype.formListeners = function (e) {
            var elem = e.target;

            if (!elem.matches(this._submitSelector)) return;

            e.preventDefault();

            var form = elem.closest('form');

            if (this.validateForm(form)) {
                this.sendRequest(form, this._resolve, this._reject, this._beforeSend);
            }
        };
        FormController.prototype.sendRequest = function (form, resolve, reject, beforeSend) {
            var formData = $(form).serializeArray(); //собираем все данные из формы
            var self = this;


            if (beforeSend) {
                beforeSend.call(this, formData, form);
            }
            //console.dir(formData);

            this.showPending(form);

            $.ajax({
                type: form.method,
                url: form.action,
                data: $.param(formData),
                success: function (response) {
                    //console.log(response);

                    if (response) {
                        self.hidePending(form, self.showSuccess.bind(self, form));

                        if (resolve) {
                            resolve.call(self, form, response);
                        }
                    } else {
                        self.hidePending(form, self.showError.bind(self, form));

                        if (reject) {
                            reject.call(self, form, response);
                        }
                    }

                    self.resetForms(form);
                },
                error: function (response) {

                    //console.log(response);
                    //throw new Error(response.statusText);
                    self.hidePending(form, self.showError.bind(self, form));
                    self.resetForms(form);

                }
            });
        };
        FormController.prototype.showError = function (form) {
            var $errBlock = $('.err-block', $(form));

            $('.form-success', $(form)).removeClass('form-success');
            $errBlock.fadeIn('normal');

            setTimeout(function () {
                $errBlock.fadeOut('normal');
            }, 10000);
        };
        FormController.prototype.showSuccess = function (form) {
            var $succBlock = $('.succ-block', $(form));

            $('.form-success', $(form)).removeClass('form-success');
            $succBlock.fadeIn('normal');

            setTimeout(function () {
                $succBlock.fadeOut('normal');
            }, 10000);
        };
        FormController.prototype.showPending = function (form) {
            var $pendingBlock = $('.pend-block', $(form));

            $pendingBlock.fadeIn('normal');
        };
        FormController.prototype.hidePending = function (form, callback) {
            var $pendingBlock = $('.pend-block', $(form));

            if (!$pendingBlock[0]) {
                callback();
                return;
            }

            $pendingBlock.fadeOut('normal', 'linear', callback);
        };

        $('[name="phone"]').mask("+7 (999) 999-99-99");  //init mask

        var anyForm = new FormController({});
        anyForm.init();


    })();
    
    /*Fancybox*/
    (function(){
        var $fancyGall = $('.fancy-gall');

        if ($fancyGall.length) {
            $fancyGall.fancybox({
                padding: [0, 0, 0, 0],
                margin: [0, 0, 0, 0],
                nextEffect: 'fade',
                prevEffect: 'fade',
                maxHeight: '80%',
                minHeight: '80%'
            });
        }

    })();

    /*Yandex map*/
    (function(){
        if (!document.getElementById('map')) return;

        var firstScript = document.querySelectorAll('script')[0];
        var script = document.createElement('script');
        var placemark = [55.7097,37.6336];
        var center = [55.7097,37.6336];
        var zoom = 15;

        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        firstScript.parentNode.insertBefore(script, firstScript);

        script.addEventListener('load', function () {
            ymaps.ready(init.bind(this, placemark, center, zoom));
        });

        function init(placemark, center, zoom){
            var myMap = new ymaps.Map('map', {
                center: center,
                zoom: zoom
            }, {
                searchControlProvider: 'yandex#search'
            });

            myMap.behaviors.disable('scrollZoom');

            myMap.geoObjects.add(new ymaps.Placemark(placemark,
                {
                    hintContent: 'dolly',
                    balloonContent: 'hello'
                },
                {
                iconLayout: 'default#image',
                iconImageHref: 'img/hint.png',
                iconImageSize: [45, 61],
                iconImageOffset: [-22, -60]
            }));
        }
    })();
    
    /*Tooltip*/
    (function(){
        function Tooltip(options) {
            this._listenedBlock = options.listenedBlock || document.body; //DOM object
            this.class = options.class; //str, several classes alowed
            this.extraMargin = options.extraMargin || 0;
        }
        Tooltip.prototype.init = function () {
            if (!this._listenedBlock) return;

            this._listenedBlock.addEventListener('mouseover', this.showTooltip.bind(this));
            this._listenedBlock.addEventListener('mouseout', this.removeTooltip.bind(this));
        };
        Tooltip.prototype.showTooltip = function (e) {
            var target = e.target;
            var tooltipText = target.getAttribute('data-tooltip');

            if(!tooltipText) return;

            var tooltip = document.createElement('span');
            tooltip.id = 'tooltip';
            if (this.class) tooltip.className = this.class;
            tooltip.innerHTML = tooltipText;
            document.body.appendChild(tooltip);

            var coordsBtn = this.getCoords(target);
            var coordsTooltip = this.getCoords(tooltip);

            var tooltipWidth = tooltip.offsetWidth;
            var tooltipHeight = tooltip.offsetHeight + this.extraMargin;
            var btnWidth = target.offsetWidth;
            var toolPosXLeft = coordsBtn.left + (btnWidth - tooltipWidth) / 2;
            var toolPosXRight = coordsBtn.right + (tooltipWidth - btnWidth) / 2;
            var wWdith = document.documentElement.clientWidth;
            var toolPosX;

            if (toolPosXLeft < 0) {
                toolPosX = 0;
            } else if (toolPosXRight > wWdith) {
                toolPosX = wWdith - tooltipWidth;
            } else {
                toolPosX = toolPosXLeft;
            }
            tooltip.style.left = toolPosX + 'px';
            tooltip.style.top = (coordsBtn.bottom + this.extraMargin) + 'px';

        };
        Tooltip.prototype.removeTooltip = function (e) {
            var tooltip = document.getElementById('tooltip');

            if(!tooltip) return;

            document.body.removeChild(tooltip);
        };
        Tooltip.prototype.getCoords = function (elem) {
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + pageYOffset,
                bottom: box.bottom + pageYOffset,
                left: box.left + pageXOffset,
                right: box.right + pageXOffset
            };
        };

        var pageTooltip = new Tooltip({
            class: 'tooltip',
            extraMargin: 5
        });

        pageTooltip.init();
    })();
});