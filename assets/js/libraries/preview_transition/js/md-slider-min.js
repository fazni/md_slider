/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms3d-csstransitions-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

/**
 * hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
 * <http://cherne.net/brian/resources/jquery.hoverIntent.html>
 *
 * @param  f  onMouseOver function || An object with configuration options
 * @param  g  onMouseOut function  || Nothing (use configuration options object)
 * @author    Brian Cherne brian(at)cherne(dot)net
 */
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);
/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013
 # ------------------------------------------------------------------------
 # Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
 --------------------------------------------------------------------------*/

(function ($) {
    $.fn.mdSlider = function(options) {
        var defaults = {
            className: 'md-slide-wrap',
            itemClassName: 'md-slide-item',
            transitions: 'strip-down-left', // name of transition effect (fade, scrollLeft, scrollRight, scrollHorz, scrollUp, scrollDown, scrollVert)
            transitionsSpeed: 800, // speed of the transition (millisecond)
            width: 990, // responsive = false: this appear as container width; responsive = true: use for scale ;fullwidth = true: this is effect zone width
            height: 420, // container height
            responsive: true,
            fullwidth: true,
            styleBorder: 0, // Border style, from 1 - 9, 0 to disable
            styleShadow: 0, // Dropshadow style, from 1 - 5, 0 to disable
            posBullet: 2, // Bullet position, from 1 to 6, default is 5
            posThumb: 1, // Thumbnail position, from 1 to 5, default is 1
            stripCols: 20,
            stripRows: 10,
            slideShowDelay: 6000, // stop time for each slide item (millisecond)
            slideShow: true,
            loop: false,
            pauseOnHover: false,
            showLoading: true, // Show/hide loading bar
            loadingPosition: 'bottom', // choose your loading bar position (top, bottom)
            showArrow: true, // show/hide next, previous arrows
            showBullet: true,
            showThumb: true, // Show thumbnail, if showBullet = true and showThumb = true, thumbnail will be shown when you hover bullet navigation
            enableDrag: true, // Enable mouse drag
            touchSensitive: 50,
            onEndTransition: function() {  },	//this callback is invoked when the transition effect ends
            onStartTransition: function() {  }	//this callback is invoked when the transition effect starts
        };
        options = $.extend({}, defaults, options);
        var self = $(this), slideItems = [], oIndex, activeIndex = -1, numItem = 0, slideWidth, slideHeight, lock = true,
            wrap,
            hoverDiv,
            hasTouch,
            arrowButton,
            buttons,
            loadingBar,
            timerGlow,
            slideThumb,
            minThumbsLeft = 0,
            touchstart,
            mouseleft,
            thumbsDrag = false,
            slideShowDelay = 0,
            play = false,
            pause = false,
            timer,
            step = 0;

        // init
        function init() {
            self.addClass("loading-image");
            self.wrap('<div class="md-slide-fullwidth"><div class="md-item-wrap"></div></div>');
            hoverDiv = self.parent();
            wrap = hoverDiv.parent();
            slideWidth = options.width;
            slideHeight = options.height;
            self.css({width: slideWidth, height: slideHeight});
            slideItems = [];
            self.find('.' + options.itemClassName).each(function (index) {
                numItem++;
                slideItems[index] = $(this);
                if(index > 0)
                    $(this).hide();
            });
        }
        var lock = false;
        function slide(index) {
            step = 0;
            slideShowDelay = slideItems[index].data("timeout") ? slideItems[index].data("timeout") : options.slideShowDelay;
            if (index != activeIndex) {
                oIndex = activeIndex;
                activeIndex = index;
                if (slideItems[oIndex]) {
                    var fx = self.data("transitions") || "";
                    //Generate random transition
                    if (fx.toLowerCase() == 'random') {
                        var transitions = new Array(
                            'slit-horizontal-left-top',
                            'slit-horizontal-top-right',
                            'slit-horizontal-bottom-up',
                            'slit-vertical-down',
                            'slit-vertical-up',
                            'strip-up-right',
                            'strip-up-left',
                            'strip-down-right',
                            'strip-down-left',
                            'strip-left-up',
                            'strip-left-down',
                            'strip-right-up',
                            'strip-right-down',
                            'strip-right-left-up',
                            'strip-right-left-down',
                            'strip-up-down-right',
                            'strip-up-down-left',
                            'left-curtain',
                            'right-curtain',
                            'top-curtain',
                            'bottom-curtain',
                            'slide-in-right',
                            'slide-in-left',
                            'slide-in-up',
                            'slide-in-down');
                        fx = transitions[Math.floor(Math.random() * (transitions.length + 1))];
                        if (fx == undefined) fx = 'fade';
                        fx = $.trim(fx.toLowerCase());
                    }

                    //Custom transition as defined by "data-transition" attribute
                    if (slideItems[activeIndex].data('transition')) {
                        var transitions = slideItems[activeIndex].data('transition').split(',');
                        fx = transitions[Math.floor(Math.random() * (transitions.length))];
                        fx = $.trim(fx.toLowerCase());
                    }
                    if(!(this.support = Modernizr.csstransitions && Modernizr.csstransforms3d) && (fx == 'slit-horizontal-left-top' || fx == 'slit-horizontal-top-right' || fx == 'slit-horizontal-bottom-up' || fx == 'slit-vertical-down' || fx == 'slit-vertical-up')) {
                        fx = 'fade';
                    }
                    lock = true;
                    runTransition(fx);
                } else {
                    slideItems[activeIndex].css({top:0, left:0}).show();
                    lock = false;
                }
            }
        }
        function setTransition(fx) {
            options.transitions = fx;
        }
        function setTimer() {
            slide(0);
            timer = setInterval(next, 40);
        }
        function next() {
            if(lock) return false;
            step += 40;
            if(step > slideShowDelay) {
                slideNext();
            }
        }

        function slideNext() {
            if(lock) return false;
            var index = activeIndex;
            index++;
            if(index >= numItem && options.loop) {
                index = 0;
                slide(index);
            } else if(index < numItem) {
                slide(index);
            }
        }
        function slidePrev() {
            if(lock) return false;
            var index = activeIndex;
            index--;
            if(index < 0 && options.loop) {
                index = numItem - 1;
                slide(index);
            } else if(index >= 0) {
                slide(index);
            }
        }

        //When Animation finishes
        function transitionEnd() {
            options.onEndTransition.call(self);
            $('.md-strips-container', self).remove();
            slideItems[oIndex].hide();
            slideItems[activeIndex].show();
            lock = false;
        }
        // Add strips
        function addStrips(vertical, opts) {
            var strip,
                opts = (opts) ? opts : options;;
            var stripsContainer = $('<div class="md-strips-container"></div>');
            var stripWidth = Math.round(slideWidth / opts.strips),
                stripHeight = Math.round(slideHeight / opts.strips),
                $image = $(".md-mainimg img", slideItems[activeIndex]);
            for (var i = 0; i < opts.strips; i++) {
                var top = ((vertical) ? (stripHeight * i) + 'px' : '0px'),
                    left = ((vertical) ? '0px' : (stripWidth * i) + 'px'),
                    width, height;

                if (i == opts.strips - 1) {
                    width = ((vertical) ? '0px' : (slideWidth - (stripWidth * i)) + 'px'),
                        height = ((vertical) ? (slideHeight - (stripHeight * i)) + 'px' : '0px');
                } else {
                    width = ((vertical) ? '0px' : stripWidth + 'px'),
                        height = ((vertical) ? stripHeight + 'px' : '0px');
                }

                strip = $('<div class="mdslider-strip"></div>').css({
                    width: width,
                    height: height,
                    top: top,
                    left: left,
                    opacity: 0
                }).append($image.clone().css({
                        marginLeft: vertical ? 0 : -(i * stripWidth) + "px",
                        marginTop: vertical ? -(i * stripHeight) + "px" : 0
                    }));
                stripsContainer.append(strip);
            }
            self.append(stripsContainer);
        }
        // Add strips
        function addTiles(x, y, index) {
            var tile;
            var stripsContainer = $('<div class="md-strips-container"></div>');
            var tileWidth = slideWidth / x,
                tileHeight = slideHeight / y,
                $image = $(".md-mainimg img", slideItems[index]);
            for(var i = 0; i < y; i++) {
                for(var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                    tile = $('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append($image.clone().css({
                            marginLeft: "-" + left,
                            marginTop: "-" + top
                        }));
                    stripsContainer.append(tile);
                }
            }
            self.append(stripsContainer);
        }
        // Add strips
        function addStrips2() {
            var strip,
                images = [$(".md-mainimg img", slideItems[oIndex]), $(".md-mainimg img", slideItems[activeIndex])];
            var stripsContainer = $('<div class="md-strips-container"></div>');
            for (var i = 0; i < 2; i++) {
                strip = $('<div class="mdslider-strip"></div>').css({
                    width: slideWidth,
                    height: slideHeight
                }).append(images[i].clone());
                stripsContainer.append(strip);
            }
            self.append(stripsContainer);
        }
        // Add strips
        function addSlits(fx) {
            var $stripsContainer = $('<div class="md-strips-container ' + fx + '"></div>'),
                $image = $(".md-mainimg img", slideItems[oIndex]),
                $div1 = $('<div class="mdslider-slit"/>').append($image.clone()),
                $div2 = $('<div class="mdslider-slit"/>').append($image.clone().css("top", "-75px"));
            if(fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="mdslider-slit"/>').append($image.clone().css("left", "-145px"));

            $stripsContainer.append($div1).append($div2);
            self.append($stripsContainer);
        }
        function runTransition(fx) {
            switch (fx) {
                case 'slit-horizontal-left-top':
                case 'slit-horizontal-top-right':
                case 'slit-horizontal-bottom-up':
                case 'slit-vertical-down':
                case 'slit-vertical-up':
                    addSlits(fx);
                    $(".md-object", slideItems[activeIndex]).hide();
                    slideItems[oIndex].hide();
                    slideItems[activeIndex].show();
                    var slice1 = $('.mdslider-slit', self).first(),
                        slice2 = $('.mdslider-slit', self).last();
                    var transitionProp = {
                        'transition' : 'all ' + options.transitionsSpeed + 'ms ease-in-out',
                        '-webkit-transition' : 'all ' + options.transitionsSpeed + 'ms ease-in-out',
                        '-moz-transition' : 'all ' + options.transitionsSpeed + 'ms ease-in-out',
                        '-ms-transition' : 'all ' + options.transitionsSpeed + 'ms ease-in-out'
                    };
                    $('.mdslider-slit', self).css(transitionProp);
                    setTimeout( function() {
                        slice1.addClass("md-trans-elems-1");
                        slice2.addClass("md-trans-elems-2");
                    }, 50 );
                    setTimeout(function() {
                        options.onEndTransition.call(self);
                        $('.md-strips-container', self).remove();
                        lock = false;
                    }, options.transitionsSpeed);
                    break;
                case 'strip-up-right':
                case 'strip-up-left':
                    addTiles(options.stripCols, 1, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripCols / 2,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-up-right') strips = $('.mdslider-tile', self).reverse();
                    strips.css({
                        height: '1px',
                        bottom: '0px',
                        top: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                height: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == options.stripCols - 1) transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-down-right':
                case 'strip-down-left':
                    addTiles(options.stripCols, 1, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripCols / 2,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-down-right') strips = $('.mdslider-tile', self).reverse();
                    strips.css({
                        height: '1px',
                        top: '0px',
                        bottom: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                height: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == options.stripCols - 1) transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-left-up':
                case 'strip-left-down':
                    addTiles(1, options.stripRows, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripRows / 2,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-left-up') strips = $('.mdslider-tile', self).reverse();
                    strips.css({
                        width: '1px',
                        left: '0px',
                        right: "auto"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                width: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == options.stripRows - 1) transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-right-up':
                case 'strip-right-down':
                    addTiles(1, options.stripRows, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripRows / 2,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-left-right-up') strips = $('.mdslider-tile', self).reverse();
                    strips.css({
                        width: '1px',
                        left: 'auto',
                        right: "1px"
                    });
                    strips.each(function (i) {
                        var strip = $(this);
                        setTimeout(function () {
                            strip.animate({
                                width: '100%',
                                opacity: '1.0'
                            }, speed, 'easeInOutQuart', function () {
                                if (i == options.stripRows - 1) transitionEnd();
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-right-left-up':
                case 'strip-right-left-down':
                    addTiles(1, options.stripRows, oIndex);
                    slideItems[oIndex].hide();
                    slideItems[activeIndex].show();
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripRows,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-right-left-up') strips = $('.mdslider-tile', self).reverse();
                    strips.filter(':odd').css({
                        width: '100%',
                        right: '0px',
                        left: "auto",
                        opacity: 1
                    }).end().filter(':even').css({
                            width: '100%',
                            right: 'auto',
                            left: "0px",
                            opacity: 1
                        });;
                    strips.each(function (i) {
                        var strip = $(this);
                        var css = (i%2 == 0) ? {left: '-50%',opacity: '0'} : {right: '-50%', opacity: '0'};
                        setTimeout(function () {
                            strip.animate(css, speed, 'easeOutQuint', function () {
                                if (i == options.stripRows - 1) {
                                    options.onEndTransition.call(self);
                                    $('.md-strips-container', self).remove();
                                    lock = false;
                                }
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'strip-up-down-right':
                case 'strip-up-down-left':
                    addTiles(options.stripCols, 1, oIndex);
                    slideItems[oIndex].hide();
                    slideItems[activeIndex].show();
                    var strips = $('.mdslider-tile', self),
                        timeStep = options.transitionsSpeed / options.stripCols / 2 ,
                        speed = options.transitionsSpeed / 2;
                    if (fx == 'strip-up-down-right') strips = $('.mdslider-tile', self).reverse();
                    strips.filter(':odd').css({
                        height: '100%',
                        bottom: '0px',
                        top: "auto",
                        opacity: 1
                    }).end().filter(':even').css({
                            height: '100%',
                            bottom: 'auto',
                            top: "0px",
                            opacity: 1
                        });;
                    strips.each(function (i) {
                        var strip = $(this);
                        var css = (i%2 == 0) ? {top: '-50%',opacity: 0} : {bottom: '-50%', opacity: 0};
                        setTimeout(function () {
                            strip.animate(css, speed, 'easeOutQuint', function () {
                                if (i == options.stripCols - 1) {
                                    options.onEndTransition.call(self);
                                    $('.md-strips-container', self).remove();
                                    lock = false;
                                }
                            });
                        }, i * timeStep);
                    });
                    break;
                case 'left-curtain':
                    addTiles(options.stripCols, 1, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        width = slideWidth / options.stripCols,
                        timeStep = options.transitionsSpeed / options.stripCols / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        strip.css({left: width * i, width: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                width: width,
                                opacity: '1.0'
                            }, options.transitionsSpeed / 2, function () {
                                if (i == options.stripCols - 1) transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'right-curtain':
                    addTiles(options.stripCols, 1, activeIndex);
                    var strips = $('.mdslider-tile', self).reverse(),
                        width = slideWidth / options.stripCols,
                        timeStep = options.transitionsSpeed / options.stripCols / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        strip.css({right: width * i, left: "auto", width: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                width: width,
                                opacity: '1.0'
                            }, options.transitionsSpeed / 2, function () {
                                if (i == options.stripCols - 1) transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'top-curtain':
                    addTiles(1, options.stripRows, activeIndex);
                    var strips = $('.mdslider-tile', self),
                        height = slideHeight / options.stripRows,
                        timeStep = options.transitionsSpeed / options.stripRows / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        strip.css({top: height * i, height: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                height: height,
                                opacity: '1.0'
                            }, options.transitionsSpeed / 2, function () {
                                if (i == options.stripRows - 1) transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'bottom-curtain':
                    addTiles(1, options.stripRows, activeIndex);
                    var strips = $('.mdslider-tile', self).reverse(),
                        height = slideHeight / options.stripRows,
                        timeStep = options.transitionsSpeed / options.stripRows / 2;
                    strips.each(function (i) {
                        var strip = $(this);
                        strip.css({bottom: height * i, height: 0, opacity: 0});
                        setTimeout(function () {
                            strip.animate({
                                height: height,
                                opacity: '1.0'
                            }, options.transitionsSpeed / 2, function () {
                                if (i == options.stripRows - 1) transitionEnd();
                            });
                        }, timeStep * i);
                    });
                    break;
                case 'slide-in-right':
                    var i = 0;
                    addStrips2();
                    var strips = $('.mdslider-strip', self);
                    strips.each(function() {
                        strip = $(this);
                        var left = i * slideWidth;
                        strip.css({
                            left: left
                        });
                        strip.animate({
                            left: left - slideWidth
                        }, options.transitionsSpeed, function () {
                            transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-left':
                    var i = 0;
                    addStrips2();
                    var strips = $('.mdslider-strip', self);
                    strips.each(function() {
                        strip = $(this);
                        var left = -i * slideWidth;
                        strip.css({
                            left: left
                        });
                        strip.animate({
                            left: slideWidth + left
                        }, (options.transitionsSpeed * 2), function () {
                            transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-up':
                    var i = 0;
                    addStrips2();
                    var strips = $('.mdslider-strip', self);
                    strips.each(function() {
                        strip = $(this);
                        var top = i * slideHeight;
                        strip.css({
                            top: top
                        });
                        strip.animate({
                            top: top - slideHeight
                        }, options.transitionsSpeed, function () {
                            transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'slide-in-down':
                    var i = 0;
                    addStrips2();
                    var strips = $('.mdslider-strip', self);
                    strips.each(function() {
                        strip = $(this);
                        var top = -i * slideHeight;
                        strip.css({
                            top: top
                        });
                        strip.animate({
                            top: slideHeight + top
                        }, options.transitionsSpeed, function () {
                            transitionEnd();
                        });
                        i++;
                    });
                    break;
                case 'fade':
                default:
                    var opts = {
                        strips: 1
                    };
                    addStrips(false, opts);
                    var strip = $('.mdslider-strip:first', self);
                    strip.css({
                        'height': '100%',
                        'width': slideWidth
                    });
                    if (fx == 'slide-in-right') strip.css({
                        'height': '100%',
                        'width': slideWidth,
                        'left': slideWidth + 'px',
                        'right': ''
                    });
                    else if (fx == 'slide-in-left') strip.css({
                        'left': '-' + slideWidth + 'px'
                    });

                    strip.animate({
                        left: '0px',
                        opacity: 1
                    }, options.transitionsSpeed, function () {
                        transitionEnd();
                    });
                    break;
            }
        }
        function preloadImages() {
            var count = $(".md-slide-item .md-mainimg img", self).length;
            self.data('count', count);
            if(self.data('count') == 0)
                slideReady();
            $(".md-slide-item .md-mainimg img", self).each(function() {
                $(this).load(function() {
                    var $image = $(this);
                    if(!$image.data('defW')) {
                        var dimensions = getImgSize($image.attr("src"));
                        changeImagePosition($image, dimensions.width, dimensions.height);
                        $image.data({
                            'defW': dimensions.width,
                            'defH': dimensions.height
                        });
                    }
                    self.data('count', self.data('count') - 1);
                    if(self.data('count') == 0)
                        slideReady();
                });
                if(this.complete) $(this).load();
            });
        }
        function slideReady() {
            self.removeClass("loading-image");
            setTimer();
        }
        function changeImagePosition($background, width, height) {
            var panelWidth = $(".md-slide-item:visible", self).width(),
                panelHeight = $(".md-slide-item:visible", self).height();

            if(height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({width: "auto", height: panelHeight + "px"});
                    if(left < 0) {
                        $background.css({left: (left/2) + "px", top: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                } else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: panelWidth + "px", height: "auto"});
                    if(top < 0) {
                        $background.css({top: (top/2) + "px", left: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                }
            }
        }
        function getImgSize(imgSrc) {
            var newImg = new Image();
            newImg.src = imgSrc;
            var dimensions = {height: newImg.height, width: newImg.width};
            return dimensions;
        }
        function slideReady() {
            self.removeClass("loading-image");
            setTimer();
        }

        init();
        preloadImages();
        return self;
    }
    $.fn.reverse = [].reverse;
})(jQuery);
