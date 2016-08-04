$(document).ready(function() {
    
	$('.bxslider').bxSlider({
	  mode: 'fade',
	  pager: true,
	  controls:true,
	  auto:false,
	  pause:14000,
	  speed:1200
	});

	$('.bxslider-land').bxSlider({
		mode: 'fade',
		pager: true,
		controls:false,
		auto:true,
		pause:6000,
		speed:1200
	});

	$('.bxslider-feedback').bxSlider({
		pager: true,
		controls: true,
		auto: false,
		pause: 6000,
		speed: 1200
	});

	$('.bxslider-masters').bxSlider({
		pager: true,
		controls: true,
		//minSlides: 4,
		//maxSlides: 4,
		//moveSlides: 1,
		auto: false,
		pause: 6000,
		speed: 1200
	});


	$('.owl-carousel').owlCarousel({
		loop:true,
		margin:-1,
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:true
			},
			600:{
				items:3,
				nav:false
			},
			1000:{
				items:6,
				nav:true,
				loop:false
			}
		}
	});

	$('.owl-carousel2').owlCarousel({
		loop:true,
		margin:0,
		responsiveClass:true,
		responsive:{
			0:{
				items:1,
				nav:true
			},
            400:{
                items:2,
                nav:true
            },
			800:{
				items:3,
				nav:true
			},
			1000:{
				items:4,
				nav:true,
				loop:false
			}
		}
	});

	$('.toogle a.toogle-title').click(function() {
  		$(this).parent().find(".toogle-main").slideToggle("slow", function() { if($(this).parent().hasClass("opened")) $(this).parent().removeClass("opened"); else $(this).parent().addClass("opened");});
  	});

	$( ".gift-close" ).click(function() {
	  $( ".gift" ).addClass('hide')
	});

	$('.select').fancySelect();

	$('.pgwSlideshow').pgwSlideshow();

	$( ".tabs a" ).first().addClass( "current" );
    $('.tab').eq(0).show();
    $('.tabs a').click(function(){
        $(this).addClass('current').siblings().removeClass('current');
        $('.tab').eq($(this).index()).show().siblings('.tab').hide();
    });

	$("body").prepend("<div class='mask'></div>");
	(function($) {
	  $(function() {
	      var popwindow = $('.popwindow');
	      var popbutton = $('.popbutton');
	     
	      function preparewindow(windowobject) {
	        var winwidth = windowobject.data("width");
	        var winheight = windowobject.data("height");
	        var winmargin = winwidth / 2;
	        var wintitle = windowobject.data("title");

	        windowobject.wrap("<div class='box_window'></div>");
	        windowobject.addClass("box_window_in");
	        windowobject.parent(".box_window").prepend("<div class='bw_close'>Закрыть</div>");
	        windowobject.css("cursor","pointer");

	        windowobject.parent(".box_window").prepend("<div class='box_title'>"+wintitle+"</div>");
	        windowobject.parent(".box_window").css({'width':winwidth,'height':winheight,'margin-left':'-'+winmargin})
	        windowobject.css({'height':winheight})
	      }  
	      if (popwindow.length) {
	        preparewindow(popwindow);
	        popbutton.click(function(){
	            var idwind = $(this).data("window");
	            $("#" + idwind).parent(".box_window").fadeIn().addClass("windactiv");
	            $(".mask").fadeIn();
	            $("body").css("overflow", "hidden");
	            $(".windactiv").css("overflow-y", "scroll");
	            $(".to_blur").addClass("blur");
	        });
	      }
	      $(".mask, .bw_close").click(function(){
	          $(".windactiv").fadeOut();
	          $(".windactiv").removeClass("windactiv");
	          $(".mask").fadeOut();
            	$("body").css("overflow", "visible");
	           $(".to_blur").removeClass("blur");
	      });
	  });
	})(jQuery)
});

$(document).ready(function () {
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
			var anchorWithHash = elem.closest('a[href^="#"]');

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
			var pageScroll = new ScrollToAnchor({});
			pageScroll.init();
		})();
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

	/*input type = number*/
	(function(){
		var $inputNumber =$('input[type = "number"]');
		if (!$inputNumber.length) return;

		$inputNumber.stepper({
			labels: {
				up: "+",
				down: "&minus;"
			}
		}); // Input number styles
	})();

	/*Yandex map*/
	(function(){
		if (!document.getElementById('map')) return;

		var firstScript = document.querySelectorAll('script')[0];
		var script = document.createElement('script');
		var placemarks = {
			0: {
				coords: [55.7385,37.4821],
				hintContent: 'Мультифото!'
			},
			1: {
				coords: [55.7129,37.4855],
				hintContent: 'Мультифото!'
			},
			2: {
				coords: [55.7323,37.5447],
				hintContent: 'Мультифото!'
			},
			3: {
				coords: [55.7012,37.5568],
				hintContent: 'Мультифото!'
			},
			4: {
				coords: [55.7181,37.5732],
				hintContent: 'Мультифото!'
			},
			5: {
				coords: [55.7225,37.6090],
				hintContent: 'Мультифото!'
			},
			6: {
				coords: [55.7193,37.6467],
				hintContent: 'Мультифото!'
			},
			7: {
				coords: [55.7025,37.6695],
				hintContent: 'Мультифото!'
			},
			8: {
				coords: [55.7378,37.6953],
				hintContent: 'Мультифото!'
			},
			9: {
				coords: [55.7253,37.7431],
				hintContent: 'Мультифото!'
			}
		};

		script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
		script.async = true;
		firstScript.parentNode.insertBefore(script, firstScript);

		script.addEventListener('load', function () {
			ymaps.ready(init);
		});

		function init(){
			var myMap = new ymaps.Map('map', {
				center: [55.7207,37.6110], //[55.7207,37.6234],
				zoom: 12
			}, {
				searchControlProvider: 'yandex#search'
			});

			myMap.behaviors.disable('scrollZoom');

			for (var currPlacemark in placemarks) {
				myMap.geoObjects.add(new ymaps.Placemark(placemarks[currPlacemark].coords, {
					hintContent: placemarks[currPlacemark].hintContent
				}, {
					iconLayout: 'default#image',
					iconImageHref: 'images/baloon.png',
					iconImageSize: [28, 40],
					iconImageOffset: [-30, -50]
				}));
			}
		}
	})();
	
	/*Socials*/
	(function(){

		/*share buttons*/
		(function(){
			/*if no social block with class "social-block" no need to download social scripts*/
			if (!$('.social-block').length) return;

			var firstScript = document.querySelectorAll('script')[0];
			var script = document.createElement('script');

			script.src = 'js/social-likes.min.js';
			script.async = true;
			firstScript.parentNode.insertBefore(script, firstScript);

			var firstCss = document.querySelectorAll('link')[0];
			var css = document.createElement('link');

			css.rel = "stylesheet";
			css.href = "css/social-likes_flat.css";
			firstCss.parentNode.insertBefore(css, firstCss);
		})();

		/*like buttons*/
		(function(){
			/*if no social block with class "social-like" no need to download social scripts*/
			if (!$('.social-like').length) return;

			/*facebook*/
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.7";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			/*vkontakt*/
			(function(){
				var firstScript = document.querySelectorAll('script')[0];
				var script = document.createElement('script');

				script.src = '//vk.com/js/api/openapi.js?125';
				script.async = true;
				firstScript.parentNode.insertBefore(script, firstScript);

				script.addEventListener('load', function () {
					VK.init({apiId: 5567897, onlyWidgets: true});
					VK.Widgets.Like("vk_like", {redesign: 1, type: "mini", height: 20});
				});
			})();

			/*tweeter*/
			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
				if (!d.getElementById(id)) {
					js = d.createElement(s);
					js.id = id;
					js.src = p + '://platform.twitter.com/widgets.js';
					fjs.parentNode.insertBefore(js, fjs);
				}
			})(document, 'script', 'twitter-wjs');

			/*google*/
			(function() {
				var po = document.createElement('script');
				po.type = 'text/javascript'; po.async = true;
				po.src = 'https://apis.google.com/js/plusone.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(po, s);
			})();
		})();
	})();

	/*Lightbox (https://github.com/fancyapps/fancyBox)*/
	(function(){
		$('.fancybox').fancybox({
			padding: 10
		});
	})();

	/*Fade block*/
	(function(){
		function FadeBlock(options) {
			this._listenedBlock = options.listenedBlock || 'body'
		}
		FadeBlock.prototype.init = function () {
			var self = this;

			$(self._listenedBlock).click(function (e) {
				self.showBlock(e);
				self.hideBlock(e);
			});
		};
		FadeBlock.prototype.showBlock = function (e) {
			var elem = e.target;
			var openBtn = elem.closest('[data-action="open"]');

			if (!openBtn) return;

			$(openBtn.getAttribute('data-target')).fadeIn();
		};
		FadeBlock.prototype.hideBlock = function (e) {
			var elem = e.target;
			var closeBtn = elem.closest('[data-action="close"]');

			if (!closeBtn) return;

			$(closeBtn.getAttribute('data-target')).fadeOut();
		};

		var searchBlockToggler = new FadeBlock({});
		searchBlockToggler.init();
	})();

	/*Slide block*/
	(function(){
		function SlideToggler(options) {
			this._listenedBlock = options.listenedBlock || 'body'
		}
		SlideToggler.prototype.init = function () {
			var self = this;

			$(self._listenedBlock).click(this.toggler);
		};
		SlideToggler.prototype.toggler = function (e) {
			var elem = e.target;
			var toggleBtn = elem.closest('[data-action="slide-toggler"]');

			if (!toggleBtn) return;

			$(toggleBtn.getAttribute('data-target')).slideToggle();
		};

		var slidingPanels = new SlideToggler({});
		slidingPanels.init();
	})();
});