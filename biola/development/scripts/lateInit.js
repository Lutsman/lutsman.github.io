
jQuery(document).ready(function ($) {
    /*fancybox*/
    (function(){
        var $closeBtn = $('[data-action="fancy-close"]');

        $closeBtn.click(function (e) {
            e.preventDefault();
            $.fancybox.close();
        });

        $(".private > a").click(function(e) {
            e.preventDefault();

            $.fancybox.open({
                href: $(this).attr('href'),
                type: 'iframe',
                autoSize: true,
                autoScale: true,
                closeClick: false,
                openEffect: 'fade',
                closeEffect: 'fade',
                openSpeed: 400,
                closeSpeed: 400
            });
        });
    })();

    /* Yandex map*/
    (function(){
        var centerTarget = [55.67978682782566,37.724871092651355];
        var placemark = [55.68041727745283,37.71706049999999];
        var zoomTarget = 16;



        ymaps.ready(function(){init(centerTarget, zoomTarget, placemark);});

        function init(centerT, zoomT, myPlacemark){
            var myMap = new ymaps.Map ("yaMap", {
                center: centerT,
                zoom: zoomT
            });

            var myPlacemark = new ymaps.Placemark(myPlacemark, {
                balloonContent: 'Профессиональные услуги салона красоты «БиОЛа» в Печатниках!'
            }, {
                preset: 'twirl#redDotIcon'
            });

            myMap.geoObjects.add(myPlacemark);
        }

        /*function loadScript() {

         }*/
    })();
});