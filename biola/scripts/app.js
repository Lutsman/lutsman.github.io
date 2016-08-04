jQuery(document).ready(function ($) {
    /*Pop-Up*/
    (function(){
        /*PopUp Control class*/
        function PopUpList(options) {
            this._$bg = $(options.popUpBg);
            this._$wrapper = $(options.popUpWrapper);
            this._panelList = this._$wrapper.children();
            this._currPanelIndex = -1;
            this._nameSpaceAtrr = {
                action: 'data-action',
                target: 'data-target'
            };
            this._openAttr = {
                fullName: 'data-action="open"',
                value: 'open'
            };
            this._closeAttr = {
                fullName: 'data-action="close"',
                value: 'close'
            };
            this._nextAttr = {
                fullName: 'data-action="next"',
                value: 'next'
            };
            this._prevAttr = {
                fullName: 'data-action="prev"',
                value: 'prev'
            };
            this._goToAttr = {
                fullName: 'data-action="goto"',
                value: 'goto'
            };
        }
        PopUpList.prototype.init = function () {
            if (!this._$wrapper.length) return;

            $('body').click(this.openListener.bind(this));
            this._$bg.click(this.closeListener.bind(this));
            this._$wrapper.click(this.navigatePopUpListeners.bind(this));
        };
        PopUpList.prototype.openPopUp = function () {
            if (arguments.length) {
                this._currPanelIndex = $(arguments[0]).index();
            } else if(!~this._currPanelIndex) {
                this._currPanelIndex = 0;
            }

            this.openPanel(this._panelList[this._currPanelIndex]);
            this.openPanel(this._$bg);
        };
        PopUpList.prototype.closePopUp = function () {
            if(!~this._currPanelIndex) return;

            this.closePanel(this._panelList[this._currPanelIndex]);
            this.closePanel(this._$bg);
            this._currPanelIndex = -1;
        };
        PopUpList.prototype.openPanel = function (panel) {
            $(panel).fadeIn('normal');
        };
        PopUpList.prototype.closePanel = function (panel) {
            $(panel).fadeOut('normal');
        };
        PopUpList.prototype.nextPanel = function () {
            if (this._currPanelIndex === this._panelList.length - 1) return;

            this.closePanel(this._panelList[this._currPanelIndex]);
            this.openPanel(this._panelList[this._currPanelIndex + 1]);
            this._currPanelIndex++;
        };
        PopUpList.prototype.prevPanel = function () {
            if (this._currPanelIndex === 0)  return;

            this.closePanel(this._panelList[this._currPanelIndex]);
            this.openPanel(this._panelList[this._currPanelIndex - 1]);
            this._currPanelIndex--;
        };
        PopUpList.prototype.goToIndex = function (index) {
            if (!this._panelList[index]) return;

            $(this._panelList[this._currPanelIndex]).fadeOut('normal');
            $(this._panelList[index]).fadeIn('normal');
            this._currPanelIndex = index;
        };
        PopUpList.prototype.goToSelector = function (selector) {
            var targetPanel = this._$wrapper.children(selector)[0];
            var targetIndex = $(targetPanel).index();

            if (!targetPanel) return;

            this.closePanel(this._panelList[this._currPanelIndex]);
            this.openPanel(targetPanel);
            this._currPanelIndex = targetIndex;
        };
        PopUpList.prototype.openListener = function (e) {
            var elem = e.target;
            var opentAttrSelector = '[' + this._openAttr.fullName + ']';
            var openBtn = elem.closest(opentAttrSelector);

            if(!openBtn) return;

            var href = openBtn.getAttribute('href');

            if(!(document.querySelector(href).parentNode === this._$wrapper[0])) return;

            this.openPopUp(href);
            e.preventDefault();
        };
        PopUpList.prototype.closeListener = function (e) {
            var elem = e.target;
            var closeAttrSelector = '[' + this._closeAttr.fullName + ']';
            //var closeBtn = elem.closest(closeAttrSelector);

            if (!elem.matches(closeAttrSelector)) return;

            this.closePopUp();
            e.preventDefault();
        };
        PopUpList.prototype.navigatePopUpListeners = function (e) {
            var elem = e.target;
            var nameSpace = this._nameSpaceAtrr;
            var elemActionValue = $(elem).attr(nameSpace.action);

            if (!elemActionValue) return;

            if (elemActionValue === this._nextAttr.value) {
                this.nextPanel();
            }
            if (elemActionValue === this._prevAttr.value) {
                this.prevPanel();
            }
            if (elemActionValue === this._goToAttr.value) {
                var goToTargetValue = $(elem).attr(nameSpace.target);

                if (this.isNumeric(goToTargetValue)) {
                    this.goToIndex(+goToTargetValue);
                } else {
                    this.goToSelector(goToTargetValue);
                }
            }
        };
        PopUpList.prototype.isNumeric = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };

        var popList = new PopUpList({
            popUpBg: '#pop-up-bg',
            popUpWrapper: '#form-wrapper'
        });
        popList.init();

        var honorPop = new PopUpList({
            popUpBg: '#honor-bg',
            popUpWrapper: '#honor-wrapper'
        });
        honorPop.init();

        /*Econom/Business toggler */
       /* var hash = window.location.hash;
        var pattern = '#choosen_';
        var $menu = $('.top-menu');

        if(~hash.indexOf(pattern)) {
            if(hash.length > pattern.length) {
                var target = '#' + hash.split('_')[1];

                $('html, body').stop().animate({
                    'scrollTop' : $(target)[0].offsetTop - $menu[0].offsetHeight
                }, 500, 'swing', function () {
                    window.location.hash = target;
                });
            }
        } else {
            var intro = new PopUpList({
                popUpBg: '#intro-bg',
                popUpWrapper: '#introwrapper'
            });
            intro.init();
            intro.openPopUp();
        }*/
    })();

    /*Fixed menu & smooth scroll to anchor */
    (function(){
        /*Menu controller fixed & smooth scroll to anchor */
        function FixedMenu(options) {
            this._menu = options.menu;
            this._fixedClass = options.fixedClass || 'js-top-fixed';
            this._menuIsFixed = false;
            this._staticMenuPosition = -1;

        }
        FixedMenu.prototype.init = function () {
            var self = this;

            $(window).load(function () {
                self._staticMenuPosition = self.getCoords(self._menu).top;
                self.toggleMenuPosition();

                $(window).scroll(self.toggleMenuPosition.bind(self));
            });

            self.smoothScrollLink();
            self.pageScrollListener();
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
        FixedMenu.prototype.smoothScrollLink = function () {
            var self = this;

            $('a[href^="#"]', $(this._menu)).click(function (e) {
                e.preventDefault();

                var target = this.hash;

                if(! $(target)[0]) return;

                $('html, body').stop().animate({
                    'scrollTop' : $(target).offset().top - self._menu.offsetHeight
                }, 500, 'swing', function () {
                    window.location.hash = target;
                });
            });
        };
        FixedMenu.prototype.pageScrollListener = function () {
            var isActive = false;
            var activeLink = null;
            var activeSection = null;
            var links = this._menu.querySelectorAll('a[href^="#"]');
            var self = this;

            var checkMenuPos = function () {
                var coordsMenu = self._menu.getBoundingClientRect();
                var elem = document.elementFromPoint(self._menu.offsetWidth/2, coordsMenu.bottom + 10);

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

            $(document).on('scroll', checkMenuPos);
            checkMenuPos();
        };

        var topMenu = new FixedMenu({
            menu: document.querySelector('.top-menu')
        });

        topMenu.init();
    })();

    /* ScrollUp button */
    (function(){
        var buttonUp = '<div id="scrollUp"><i class="upButton"></i></div>';
        var flag = false;

        $('body').append($(buttonUp));


        $('#scrollUp').click( function(){
            $("html, body").animate({scrollTop: 0}, 500);
            return false;
        });

        $(window).scroll(function(){
            if ( $(document).scrollTop() > $(window).height() && !flag ) {
                $('#scrollUp').fadeIn({queue : false, duration: 400});
                $('#scrollUp').animate({'bottom' : '40px'}, 400);
                flag = true;
            } else if ( $(document).scrollTop() < $(window).height() && flag ) {
                $('#scrollUp').fadeOut({queue : false, duration: 400})
                $('#scrollUp').animate({'bottom' : '-20px'}, 400);
                flag = false;
            }
        });
    })();

    /*Forms*/
    (function(){
        /* form control class*/
        function FormController(options) {
            this._submitCelector = options.submitCelector || 'input[type="submit"]';
            this._listenedBlock = options.listenedBlock || 'body';
            this._beforeSend = options.beforeSend || null;
            this._resolve = options.resolve || null;
            this._reject = options.reject || null;
        }
        FormController.prototype.init = function () {
            $(this._listenedBlock).click(this.formListeners.bind(this));
        };
        FormController.prototype.validateForm = function (form) {
            var vResult = true;

            $('input[name!="submit"], textarea', $(form)).each(function () {
                var vVal = $(this).val(),
                    requiredField = $(this).attr('required');

                if ($(this).hasClass('form-fail')) { //чистим классы, если остались после прошлого раза
                    $(this).removeClass('form-fail');
                } else if ($(this).hasClass('form-success')) {
                    $(this).removeClass('form-success');
                }

                if (vVal.length == 0 && requiredField) {
                    var name = $(this).attr('name');
                    var message = 'Заполните';

                    switch (name) {
                        case 'email-login' :
                            message += ' E-mail или логин!';
                            break;
                        case 'email' :
                            message += ' E-mail!';
                            break;
                        case 'pass' :
                            message += ' пароль!';
                            break;
                        case 'name' :
                            message += ' имя!';
                            break;
                        case 'surname' :
                            message += ' фамилию!';
                            break;
                        case 'phone' :
                            message += ' телефон!';
                            break;
                        default :
                            message += ' поле!';
                            break;
                    }

                    $(this).val('').attr('placeholder', message).addClass('form-fail');

                    vResult = false;
                } else if ($(this).attr('name') == 'email' && vVal.length) {
                    var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

                    if (pattern.test($(this).val())) {
                        $(this).addClass('form-success').attr('placeholder', 'E-mail');
                    } else {
                        $(this).val('').addClass('form-fail').attr('placeholder', 'Введите корректный E-mail!');
                        vResult = false;
                    }
                } else if($(this).attr('name') == 'phone'  && requiredField && vVal.length) {
                    $(this).addClass('form-success');
                }else if($(this).is('textarea') && vVal.length < 10 && vVal.length > 0  && requiredField) {
                    $(this).val('').attr('placeholder', 'Вопрос слишком короткий!').addClass('form-fail');
                    vResult = false;
                } else if (requiredField) {
                    $(this).addClass('form-success');
                }
            });
            return vResult;
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
                this.reset();
            });
        };
        FormController.prototype.resetPlaceholders = function (inputContainer) {
            var $input;

            if (inputContainer.tagName === 'INPUT') {
                $input = $(inputContainer);
            } else {
                $input = $('input[name != submit]', $(inputContainer));
            }

            $input.each(function () {
                var name = $(this).attr('name');

                $(this).removeClass('form-success');
                $(this).removeClass('form-fail');

                switch (name) {
                    case 'name':
                        $(this).attr('placeholder', 'Имя');
                        break;
                    case 'surname':
                        $(this).attr('placeholder', 'Фамилия');
                        break;
                    case 'email-login':
                        $(this).attr('placeholder', 'E-mail или логин');
                        break;
                    case 'email':
                        $(this).attr('placeholder', 'E-mail');
                        break;
                    case 'pass':
                        $(this).attr('placeholder', 'Пароль');
                        break;
                    case 'passCurr':
                        $(this).attr('placeholder', 'Текущий пароль');
                        break;
                    case 'passNew':
                        $(this).attr('placeholder', 'Новый пароль');
                        break;
                }
            });
        };
        FormController.prototype.formListeners = function (e) {
            var elem = e.target;

            if (!elem.matches(this._submitCelector)) return;
            e.preventDefault();

            var form = elem.closest('form');

            if (this.validateForm(form)) {
                this.sendRequest(form, this._resolve, this._reject, this._beforeSend);
            }
        };
        FormController.prototype.sendRequest = function (form, resolve, reject, beforeSend) {
            var formData = $(form).serializeArray(); //собираем все данные из формы
            var self = this;
            console.dir(formData);

            beforeSend.call(this, formData, form);

            this.showPending(form);

            $.ajax({
                type: form.method,
                url: form.action,
                data: $.param(formData),
                success: function (response) {
                    self.hidePending(form);

                    if (response) {
                        self.showSuccess(form);

                        if (resolve) {
                            resolve.apply(self, [form, response]);
                        }
                    } else {
                        self.showError(form);

                        if (reject) {
                            reject.apply(self, [form, response]);
                        }
                    }

                    form.reset();
                    self.resetForms(form);
                },
                error: function (response) {
                    throw new Error(response);

                    form.reset();
                    self.hidePending(form);
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
        FormController.prototype.hidePending = function (form) {
            var $pendingBlock = $('.pend-block', $(form));

            $pendingBlock.fadeOut('normal');
        };

        $(".phone").mask("+7 (999) 999-99-99");  //init mask
        
        var formsListControl = new FormController({
            submitCelector: '.button.order__submit',
            resolve: function () {
                if($('body').hasClass('business')) {
                    goToNewUrl('thanks-business.html');
                } else {
                    goToNewUrl('thanks-econom.html');
                }
            },
            reject: function (status) {
                throw new Error(status);
                console.log('Error');
            },
            beforeSend: function (formData, form) {
                if($('body').hasClass('business')) {
                    formData.push({name: 'page-status', value: 'Бизнес'});
                } else {
                    formData.push({name: 'page-status', value: 'Эконом'});
                }
            }
        });
        formsListControl.init();
        function goToNewUrl(windowPath) {
            window.open(windowPath, '_self');
        }
    })();

    /*Slider*/
    (function(){
    	$('#slider').slick({
    	    dots: false,
            arrows: true
        });
    })();


});

