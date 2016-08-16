'use strict';

document.addEventListener('DOMContentLoaded', ready);

function ready() {
    /*Adaptive toggler*/
    (function(){
        //var throttledToggler = throttle(adaptiveToggler, 500);

        adaptiveToggler();

        //window.addEventListener('resize', throttledToggler);

        function adaptiveToggler() {
            var winWidth = document.documentElement.clientWidth;
            var viewportTag = document.querySelector('[name="viewport"]');
            var changingPoint = 640;
            var attrName = 'content';
            var adptiveAttrVal = 'width=device-width, initial-scale=1';
            var scaleAttrVal1 = 'initial-scale=0';
            var scaleAttrVal2 = 'width=640';

            //console.log(winWidth);

            if (winWidth < changingPoint && viewportTag.getAttribute(attrName) !== scaleAttrVal2) {
                viewportTag.setAttribute(attrName, scaleAttrVal1);
                viewportTag.setAttribute(attrName, scaleAttrVal2);
            } else if (winWidth >= changingPoint && viewportTag.getAttribute(attrName) !== adptiveAttrVal) {
                viewportTag.setAttribute(attrName, adptiveAttrVal);
            }
        }

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
        };
    })();
}