$(document).ready(function () {
    /*Fixed menu */
    (function(){
        /*Menu controller fixed*/
        function FixedMenu(options) {
            this._menu = options.menu;
            this._fixedClass = options.fixedClass || 'js-top-fixed';
            this._menuIsFixed = false;
            this._staticMenuPosition = -1;

        }
        FixedMenu.prototype.init = function () {
            var self = this;
            var setActiveLi = self.pageScrollListener.call(self);

            self._staticMenuPosition = self.getCoords(self._menu).top;
            self.toggleMenuPosition();
            setActiveLi();

            $(window)
                .scroll(self.toggleMenuPosition.bind(self))
                .scroll(setActiveLi);
        };
        FixedMenu.prototype.getCoords = function (elem) {
            var box = elem.getBoundingClientRect();

            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        };
        FixedMenu.prototype.toggleMenuPosition = function () {
            if (window.pageYOffset <= this._staticMenuPosition && this._menuIsFixed) {
                $(this._menu).removeClass(this._fixedClass);
                this._menuIsFixed = false;
            } else if (window.pageYOffset > this._staticMenuPosition && !this._menuIsFixed){
                $(this._menu).addClass(this._fixedClass);
                this._menuIsFixed = true;
            }
        };
        FixedMenu.prototype.pageScrollListener = function () {
            var activeLink = null;
            var activeSection = null;
            var links = this._menu.querySelectorAll('a[href^="#"]');
            var self = this;

            var checkMenuPos = function () {
                var coordsMenu = self._menu.getBoundingClientRect();
                var elem = document.elementFromPoint(self._menu.offsetWidth/2, coordsMenu.bottom + 50);

                if (!elem && activeLink) {
                    activeLink.closest('li').classList.remove('active');
                    activeLink = null;
                    activeSection = null;
                    return;
                } else if (!elem) {
                    return;
                }

                if (activeLink && activeSection && activeSection.contains(elem)) {
                    return;
                }

                for (var i = 0; i < links.length; i++) {
                    var href = links[i].getAttribute('href');

                    if(href.length < 2) continue;

                    var targetSection = elem.closest(href);

                    if (targetSection) {
                        if (activeLink) {
                            activeLink.closest('li').classList.remove('active');
                        }
                        activeSection = targetSection;
                        activeLink = links[i];
                        activeLink.closest('li').classList.add('active');
                        return;
                    }
                }

                if(activeLink) {
                    activeLink.closest('li').classList.remove('active');
                    activeLink = null;
                    activeSection = null;
                }

            };

            return checkMenuPos;
        };


        var topMenu = new FixedMenu({
            menu: document.getElementById('top-menu')
        });

        topMenu.init();
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
                    placeholderMess = 'Поле ' + ($(this).attr('data-validate-empty') ? '"' + $(this).attr('data-validate-empty') + '" ' : '') + 'обязательное!';
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

        //init mask
        $('input[name="phone"]').mask("+7 (999) 999-99-99");
        $('input[name^="time"]').mask("99:99");

        var anyForm = new FormController({
            resolve: function () {
                window.open('thanks.html', '_self');
            }
        });
        anyForm.init();
    })();

    /*ScrollToAnchor && mobile menu*/
    (function(){
        /*ScrollToAnchor class*/
        function ScrollToAnchor(options) {
            this._listenedBlock = options.listenedBlock || document.body;
            this._translationElementSelector = options.translation;
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
                listenedBlock: document.getElementById('#top-menu'),
                translation: '#top-menu'
            });
            pageScroll.init();
        })();

        /*mmenu*/
        (function(){
            /*mmenu scroll*/
            var mmenuScroll = new ScrollToAnchor({
                listenedBlock: document.getElementById('#m-menu'),
                translation:  '#top-menu'
            });


            setUpMmenu();

            function setUpMmenu() {
                var $menu = $('nav#m-menu');
                var $openMenuBtn = $('#hamburger');

                $menu.mmenu({
                    "extensions": ["theme-dark"]
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
                        if (selector) {
                            mmenuScroll.smoothScroll(selector,  document.querySelector(mmenuScroll._translationElementSelector).offsetHeight);
                            selector = false;
                        }
                    }

                );
                $openMenuBtn.click(function () {
                    api.open();
                });

            }
        })();
    })();

    /*Yandex map*/
    (function(){
        if (!document.getElementById('map')) return;

        var winWidth = window.innerWidth;
        var firstScript = document.querySelectorAll('script')[0];
        var script = document.createElement('script');
        var coords = [55.30239172, 38.72978195];
        var center = [];
        var zoom = false;


        if (winWidth > 992) {
            center = [55.30089800, 38.722];
            zoom = 16;
        } else if (winWidth < 992 && winWidth > 450) {
            center = [55.30089800, 38.72666033];
            zoom = 16;
        } else {
            center = [55.30089800, 38.72666033];
            zoom = 15;
        }

        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
        script.async = true;
        firstScript.parentNode.insertBefore(script, firstScript);

        script.addEventListener('load', function () {
            ymaps.ready(init);
        });

        function init(){
            var myMap = new ymaps.Map('map', {
                center: center,
                zoom: zoom
            }, {
                searchControlProvider: 'yandex#search'
            });

            var currPlacemark = new ymaps.Placemark(coords,
                {
                    hintContent: 'Россия, Московская область, <br/> Воскресенск, Благодатная улица, <br/> 25 ООО Строй-Мастер +7925-869-77-70'
                }, {
                    preset:'islands#redDotIcon'
                });

            /*линия*/
            var myPolyline = new ymaps.Polyline(
                [
                    [55.30004719, 38.72523340], [55.29990028, 38.72961076], [55.29996149, 38.73074802], [55.30234863, 38.72980388]
                ], {

                }, {
                    strokeWidth: 3
                });

            myMap.geoObjects.add(currPlacemark);
            myMap.geoObjects.add(myPolyline);
            myMap.behaviors.disable('scrollZoom');
        }
    })();
    
    /*Fancybox*/
    (function(){
        var fancyOpen = 'fancy-open';
        var fancyFrameOpen = 'fancy-frame-open';
        var fancyRender = 'fancy-render';
        var fancyClose = 'fancy-close';
        var fancyCloseBtn = '<p class="close"><a href="javascript:void(0)" data-action="close">×</a></p>';
        var $fancyHonorsGal = $('[data-fancybox-group="honors"]');
        var $fancyPortfolio = $('[data-fancybox-group="honors_portfolio"]');

        $fancyHonorsGal.fancybox({
            padding: [0, 0, 0, 0],
            margin: [0, 0, 0, 0],
            nextEffect: 'fade',
            prevEffect: 'fade',
            maxHeight: '80%',
            minHeight: '80%',
            tpl: {
                closeBtn: fancyCloseBtn
            },
            helpers : {
                overlay : {
                    locked : false
                }
            }
        });

        $fancyPortfolio.fancybox({
            padding: [0, 0, 0, 0],
            margin: [0, 0, 0, 0],
            type: 'image',
            maxHeight: '80%',
            maxWidth: '80%',
            nextEffect: 'fade',
            prevEffect: 'fade',
            tpl: {
                closeBtn: fancyCloseBtn
            },
            helpers : {
                overlay : {
                    locked : false
                }
            }
        });

        $('body').click(function (e) {
            var target = e.target;
            var actionBtn = target.closest('[data-action]');

            if (!actionBtn) return;
            e.preventDefault();
            
            var href = actionBtn.getAttribute('data-target') || actionBtn.getAttribute('href');
            var subjectInput = $(href).find('input[name="subject"]')[0];

            switch (actionBtn.getAttribute('data-action')) {
                case fancyOpen :
                    if (actionBtn.getAttribute('data-subject')) {
                        subjectInput.value = actionBtn.getAttribute('data-subject');
                    }
                    $.fancybox.open({
                        href: href,
                        padding: [0, 0, 0, 0],
                        margin: [0, 0, 0, 0],
                        maxWidth: '80%',
                        tpl: {
                            closeBtn: fancyCloseBtn
                        },
                        helpers : {
                            overlay : {
                                locked : false
                            }
                        }
                    });
                    break;
                case fancyFrameOpen :
                    $.fancybox.open({
                        href: href,
                        type: 'iframe',
                        maxWidth: '80%',
                        maxHeight: '90%',
                        //maxHeight: '90%',
                        padding: [0, 0, 0, 0],
                        margin: [0, 0, 0, 0],
                        tpl: {
                            closeBtn: fancyCloseBtn
                        },
                        helpers : {
                            overlay : {
                                locked : false
                            }
                        }
                    });
                    break;
                case fancyRender :
                    var prodName = target.parentNode.querySelector('.title').textContent;
                    $(href).find('.prod-name').text(prodName);
                    subjectInput.value += ' ' + prodName;

                    $.fancybox.open({
                        href: href,
                        padding: [0, 0, 0, 0],
                        margin: [0, 0, 0, 0],
                        maxWidth: '80%',
                        tpl: {
                            closeBtn: fancyCloseBtn
                        },
                        helpers : {
                            overlay : {
                                locked : false
                            }
                        }
                    });
                    break;
                case fancyClose :
                    $.fancybox.close();
                    break;
            }
        });
    })();

    /*Slider*/
    (function(){
    	/*feedback*/
    	$('.feedback-slider').slick();

        /*portfolio*/
        $('.portfolio-slider').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true
        });
    })();

    /*BlockToggler*/
   (function(){
       var $toggleBtn = $('[data-action="block-toggle"]');

       $toggleBtn.click(function (e) {
           var targetSelector = $(this).attr('data-target');
           var $target = $(this).parent().find(targetSelector);
           e.preventDefault();

           $(this).toggleClass('active');
           //$target.slideToggle();

           if ($(this).hasClass('active')) {
               $target.slideDown();
           } else {
               $target.slideUp();
           }
       })
   })();

    /*Compare_table same column height*/
    (function(){
        setSameRowHeight();
        $(window).resize(setSameRowHeight);

        function setSameRowHeight() {
            var $table = $('.compare__table');

            if (!$table.length) return;

            var $columns = $table.find('.table-column');

            for (var i = 1; i < $columns[0].children.length; i++) {
                var maxHeight = 0;

                for (var j = 0; j < $columns.length; j++) {
                    $columns[j].children[i].style.height = '';
                    var currRowHeight = $columns[j].children[i].offsetHeight;
                    maxHeight = maxHeight > currRowHeight ? maxHeight : currRowHeight;
                }

                for (var k = 0; k < $columns.length; k++) {
                    //если это колонка с именами, то к первому и последнему блоку добавляем 1px из-за разницы в границе
                    if (k === 0 && (i === 1 || i === $columns[0].children.length - 1)) {
                        $columns[k].children[i].style.height = maxHeight + 1 + 'px';
                    } else {
                        $columns[k].children[i].style.height = maxHeight + 'px';
                    }
                }
            }
        }
    })();

    /**
     *Animate
     */
    (function(){
        $(".scroll").each(function () {
            var block = this;

            animateOnLoad(block);

            $(window).on({
                scroll : animateOnScroll.bind(this, block)
            });
        });

        function animateOnScroll(block) {
            var coords = block.getBoundingClientRect();
            var clienHeight = document.documentElement.clientHeight;

            if ((coords.bottom > 0 && coords.bottom <= clienHeight) || (coords.top > 0 && coords.top <= clienHeight)) {
                if (!block.classList.contains("animated")) {
                    block.classList.add("animated");
                }
            }
        }

        function animateOnLoad(block) {
            var coords = block.getBoundingClientRect();
            var clienHeight = document.documentElement.clientHeight;

            if (coords.bottom < 0 || coords.bottom > clienHeight || coords.top < 0 || coords.bottom > clienHeight) {
                if (block.classList.contains("animated")) {
                    block.classList.remove("animated");
                }
            }
        }
    })();
    
    
});