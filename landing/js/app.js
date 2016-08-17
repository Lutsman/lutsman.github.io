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
        function Sorting(options) {
            this._listenedBlockSelector = options.listenedBlockSelector;
            this._sotingBtnSelector = options.sotingBtnSelector || '[data-sort-by]';
            this._sortingWrapperSelector = options.sortingWrapperSelector;
            this._CLASSES = {
                active: options.activeClass || 'active'
            };
        }
        Sorting.prototype.init = function () {
            $(this._listenedBlockSelector).on('click', this.eventListener.bind(this));
        };
        Sorting.prototype.eventListener = function (e) {
            var target = e.target;
            var sortBtn = target.closest(this._sotingBtnSelector);

            if (!sortBtn) return;
            e.preventDefault();

            this.sortBlocks(sortBtn, this._sortingWrapperSelector);
            this.setActiveButton(sortBtn);
        };
        Sorting.prototype.sortBlocks = function (sortBtn, sortingWrapperSelector) {
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
        };
        Sorting.prototype.setActiveButton = function (button) {
            var self = this;
            var activeBtn = button.parentNode.querySelectorAll('.' + self._CLASSES.active);


            $(activeBtn).each(function () {
                $(this).removeClass(self._CLASSES.active);
            });

            $(button).addClass(self._CLASSES.active);
        };

        var sortProjects = new Sorting({
            listenedBlockSelector: '.projects__menu',
            sortingWrapperSelector: '[data-role="sorting-wrapper-projects"]'
        });
        sortProjects.init();

    })();

    /*Beauty Scroll*/
    (function(){
        if(!$('.about__scroll').length) return;


        var aboutScrollObj = $('.about__scroll').jScrollPane().data('jsp');
        var throttledScrollReinit = throttle(aboutScrollObj.reinitialise, 300);

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

        $(window).on('resize', function () {
            throttledScrollReinit();
        });
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
                    placeholderMess = 'Field ' + ($(this).attr('data-validate-empty') ? '"' + $(this).attr('data-validate-empty') + '" ' : '') + 'is required!';
                    vResult = false;
                } else if ($(this).attr('name') == 'email' && vVal.length) {
                    pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

                    if (pattern.test($(this).val())) {
                        $(this).addClass('form-success');
                    } else {
                        placeholderMess = 'Enter a valid E-mail!';
                        vResult = false;
                    }
                } else if ($(this).attr('name') == 'phone' && vVal.length) {
                    pattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i;

                    if (pattern.test($(this).val())) {
                        $(this).addClass('form-success');
                    } else {
                        placeholderMess = 'Enter a valid phone number!';
                        vResult = false;
                    }
                } else if ($(this).attr('name') === 'passCurr' && vVal.length) {
                    passCurr = this;
                } else if ($(this).attr('name') === 'passNew' && vVal.length) {
                    if (vVal === $(passCurr).val()) {
                        $(passCurr).val('').addClass('form-fail').attr('placeholder', 'New password should be really new!');
                        placeholderMess = 'New password should be really new!';
                    } else {
                        $(this).addClass('form-success');
                        $(passCurr).addClass('form-success');
                    }
                }else if($(this).is('textarea') && vVal.length < 10 && vVal.length > 0  && requiredField) {
                    placeholderMess = 'Message is too short!';
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

        var anyForm = new FormController({});
        anyForm.init();
    })();


});