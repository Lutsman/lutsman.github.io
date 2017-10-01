
/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
(function(w){
  "use strict";
    /* exported loadCSS */
  var loadCSS = function( href, before, media ){
    // Arguments explained:
    // `href` [REQUIRED] is the URL for your CSS file.
    // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
    // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
    // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
    var doc = w.document;
    var ss = doc.createElement( "link" );
    var ref;
    if( before ){
      ref = before;
    }
    else {
      var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
      ref = refs[ refs.length - 1];
    }

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = "only x";

    // wait until body is defined before injecting link. This ensures a non-blocking load in IE11.
    function ready( cb ){
      if( doc.body ){
        return cb();
      }
      setTimeout(function(){
        ready( cb );
      });
    }
    // Inject link
    // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
    // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    ready( function(){
      ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
    });
    // A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.
    var onloadcssdefined = function( cb ){
      var resolvedHref = ss.href;
      var i = sheets.length;
      while( i-- ){
        if( sheets[ i ].href === resolvedHref ){
          return cb();
        }
      }
      setTimeout(function() {
        onloadcssdefined( cb );
      });
    };

    function loadCB(){
      if( ss.addEventListener ){
        ss.removeEventListener( "load", loadCB );
      }
      ss.media = media || "all";
    }

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    if( ss.addEventListener ){
      ss.addEventListener( "load", loadCB);
    }
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined( loadCB );
    return ss;
  };
  // commonjs
  if( typeof exports !== "undefined" ){
    exports.loadCSS = loadCSS;
  }
  else {
    w.loadCSS = loadCSS;
  }
}( typeof global !== "undefined" ? global : this ));

//document.addEventListener("DOMContentLoaded", init);
init();

function init() {
    /*Loading scripts and css*/
    (function(){
        if (!loadCSS) return;

        /*adding css*/
        var cssArr = [
            'https://fonts.googleapis.com/css?family=Roboto:400,700,700italic,900,900italic,400italic,300,300italic,500,500italic&subset=latin,cyrillic',
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
            'css/normalize.css',
            'css/jquery.mmenu.css',
            'css/jquery.mmenu.themes.css',
            'css/slick.css',
            'css/slick-theme.css',
            'css/styles.css'
        ];

        cssArr.forEach(function (css) {
          loadCSS(css, document.head.children[document.head.children.length - 1]);
        });
    })();
};