$(document).ready(function() {
/**
 *Animate
 */
 (function(){
   $(".scroll").each(function () {
     var block = $(this);
     $(window).bind({
       scroll : function() {
         var top = block.offset().top;
         var bottom = block.height()+top;
         top = top - $(window).height();
         var scroll_top = $(this).scrollTop();
         if ((scroll_top > top) && (scroll_top < bottom)) {
           if (!block.hasClass("animated")) {
             block.addClass("animated");
           }
         }
       },
       load : function() {
         var top = block.offset().top;
         var bottom = block.height()+top;
         top = top - $(window).height();
         var scroll_top = $(this).scrollTop();
         if ((scroll_top > top) && (scroll_top < bottom)) {
           if (!block.hasClass("animated")) { // если забыли добавить анимацию, все же добавляем
             //block.addClass("animated");
           }
         } else {
           block.removeClass("animated");
         }
       }
     });
   });
 })();


/**
 * Validate and send mail
 */
  (function(){
    $(".phone").mask("+7 (999) 999-99-99");  //init mask

    $(".submit").click(function(e) {
      var form = $(this).parent();

      if(validateForm(form)) {
        sendForm(form);
      }
    });

    function validateForm(formObj) {
      var vResult = true;

      $('input[name!="submit"], textarea', formObj).each(function() {
        var vVal = $(this).val(),
            requiredField = $(this).attr('required');

        if($(this).hasClass('form-fail')) { //чистим классы, если остались после прошлого раза
          $(this).removeClass('form-fail');
        }else if( $(this).hasClass('form-success')) {
          $(this).removeClass('form-success');
        }

        if (vVal.length == 0  && requiredField) {
          $(this).val('').attr('placeholder', 'Заполните поле!').addClass('form-fail');
          vResult = false;
        }else if($(this).attr('name') == 'email' && requiredField) {
          var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;

          if (pattern.test($(this).val())) {
            $(this).addClass('form-success');
          } else {
            $(this).val('').addClass('form-fail');
            vResult = false;
          }

        }else if($(this).attr('name') == 'phone'  && requiredField && vVal.length) {
          $(this).addClass('form-success');
        }else if($(this).is('textarea') && vVal.length < 10 && vVal.length > 0  && requiredField) {
          $(this).val('').attr('placeholder', 'Вопрос слишком короткий!').addClass('form-fail');
          vResult = false;
        }else if(requiredField) {
          $(this).addClass('form-success');
        }
      });
      return vResult;
    }

    function sendForm(formObj) {
      var form_data = formObj.serialize(); //собераем все данные из формы

      $.ajax({
        type: 'POST',
        url: 'sendmail.php',
        data: form_data,
        success: function() {
          //код в этом блоке выполняется при успешной отправке сообщения
          showNewWindow('thanks.html');
          if(formObj.parent().attr('id') == 'ask' || formObj.parent().attr('id') == 'callback') {
            popupHide('#' + formObj.parent().attr('id'));
          }
        }
      });
    }

    function showNewWindow(windowPath) {
      var newWindow = window.open(windowPath, '_self');
    }
  })();


/**
 * Pop Up
 */
  (function(){
    $('.btn-call').click(function() {
      setSubj('#callback', this);
      popupShow('#callback');
    });
    $('.btn-request').click(function() {
      popupShow('#request');
    });
    $('p.questions').find('a').click(function() {
      popupShow('#ask');
    });

    $('.close, .pop-up-wrap').click(function() {
      popupHide('#ask');
      popupHide('#callback');
      popupHide('#request');
    });

    function popupShow(popupForm) {
      $(popupForm).fadeIn({queue : false, duration: 400});
      $('.pop-up-wrap').fadeIn(400);
    }

    function popupHide(popupForm) {
      $(popupForm).fadeOut({queue : false, duration: 400});
      $('.pop-up-wrap').fadeOut(400);
    }

    /**
     * Устанавливаем заголовок для формы (если привязываем больше одной кнопки на форму)
     */
    function setSubj(popupForm, requestBtn) {
      var formSubjectField = $('input[name="subject"]', popupForm),
          btnSubject = $(requestBtn).attr('data-subject');

      if(btnSubject && formSubjectField.length) {
        formSubjectField.val(btnSubject);
        return true;
      }
      return false;
    }
  })();



/**
 * Smooth scroll
 */
  (function(){
    $('.menu a[href^="#"]').bind('click.smoothscroll',function (e) {
      e.preventDefault();

      var target = this.hash;

      $('html, body').stop().animate({
        'scrollTop' : $(target).offset().top -90
      }, 500, 'swing', function () {
        window.location.hash = target;
      });
    });
  })();



  /*ScrollUp button*/
  (function(){
    var buttonUp = '<div id="scrollUp"><i class="upButton">▲</i></div>';
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
        $('#scrollUp').fadeOut({queue : false, duration: 400});
        $('#scrollUp').animate({'bottom' : '-20px'}, 400);
        flag = false;
      }
    });
  })();

  /**
   * Fancybox
   */

  (function(){
    $("#privateP").fancybox({
      maxWidth	: 800,
      maxHeight	: 600,
      fitToView	: false,
      width		: '70%',
      height		: '70%',
      autoSize	: false,
      closeClick	: false,
      openEffect	: 'fade',
      closeEffect	: 'fade',
      openSpeed : 400,
      closeSpeed : 400,
      helpers : {
        overlay : {
          locked : false
        }
      }
    });
  })();




/**
 * Slider
 */
  (function(){
    $('.l-box').slick({
      dots: true,
      infinite: true,
      width : '100%',
      speed: 300,
      slidesToShow: 1,
      centerMode: true,
      variableWidth: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000
    });
  })();






/**
 * Fixed menu
  */
  (function(){
    $('#topMenu').scroolly([
      {
        to: 'con-top',
        css: {
          position: 'absolute',
          top: ''
        }
      },
      {
        from: 'con-top',
        css: {
          position: 'fixed',
          top: '0'
        }
      }
    ], $('.bg-order-1'));
  })();


  /**
   * Mobile menu
   */

  (function(){
    setUpMmenu();

    function setUpMmenu() {
      var $menu = $('nav#m-menu'),
          $html = $('html, body');

      $menu.mmenu({
        extensions: ["effect-menu-slide", "effect-listitems-slide", "theme-dark"],
        dragOpen: true,
        preventTabbing: true,
        navbar : false,
        navbars		: {
          height 	: 2,
          content : [
            '<div class="logo logo-footer"><a href="/"><span>Ателье</span><br><i>“Соболиный<br><span>иней”</span></i></a></div>'
          ]
        },
        onClick : {
          setSelected : false
        }

      });


      var $anchor = false;
      $menu.find( 'li > a' ).on(
          'click',
          function( e )
          {
            $anchor = $(this);
          }
      );

      var api = $menu.data( 'mmenu' );
      api.bind( 'closed',
          function()
          {
            if ( $anchor )
            {
              var href = $anchor.attr( 'href' );
              $anchor = false;

              //	if the clicked link is linked to an anchor, scroll the page to that anchor
              if ( href.slice( 0, 1 ) == '#' )
              {
                $html.stop().animate({
                  'scrollTop' : $(href).offset().top -46
                }, 500, 'swing')
              }
            }
          }
      );
    }
  })();




  /**
   * Yandex map
   */
  (function(){
   var myMap,
       placemark = [55.75282978, 37.78422750],
       center1 = [55.75158331, 37.78791822],
       center2 = [55.75282978, 37.78422750],
       center3 = [55.75181325060135,37.784356246032715],
       zoom1 = 16,
       zoomTarget = 0,
       centerTarget = [],
       deviceWidt = $(window).width();

   if(deviceWidt > 799) {
     centerTarget = center1;
     zoomTarget = zoom1;
   } else if (deviceWidt < 800 && deviceWidt > 600) {
     centerTarget = center2;
     zoomTarget = zoom1;
   } else {
     centerTarget = center3;
     zoomTarget = zoom1;
   }

   ymaps.ready(function(){init(centerTarget, zoomTarget, placemark);});

   function init(centerT, zoomT, myPlacemark){
     myMap = new ymaps.Map ("map", {
       center: centerT,
       zoom: zoomT
     });

     myPlacemark = new ymaps.Placemark(myPlacemark, {
       balloonContent: 'Ателье "Соболиный иней"'
     });

     myMap.geoObjects.add(myPlacemark);
   }
 })();




  /**
   * Animate touch event mobile
   **/
  (function(){
    var scroller=false,
        button = $('a.submit, a.btn');

    $(button).bind({
      touchstart: function(event){
        var elem=$(this);
        clickable=setTimeout(function () { elem.addClass('active');}, 100);
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
});

