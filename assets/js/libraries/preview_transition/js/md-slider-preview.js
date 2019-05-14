/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013 xxxxxxx
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
        var self= $(this), slideItems = [], oIndex, activeIndex = -1, numItem = 0, slideWidth, slideHeight, lock = true,
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
            slideWidth = options.responsive ? self.width() : options.width;
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
                    var fx = options.transitions;
                    //Generate random transition
                    if (options.transitions.toLowerCase() == 'random') {
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

                    //Run random transition from specified set (eg: effect:'strip-left-fade,right-curtain')
                    if (options.transitions.indexOf(',') != -1) {
                        var transitions = options.transitions.split(',');
                        fx = transitions[Math.floor(Math.random() * (transitions.length))];
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
                $div2 = $('<div class="mdslider-slit"/>').append($image.clone().css("top", "-=" + (slideHeight/2) + "px"));
            if(fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="mdslider-slit"/>').append($image.clone().css("left", "-=" + (slideWidth/2) + "px"));

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

        function slideReady() {
            self.removeClass("loading-image");
            setTimer();
        }
        
        init();
		slideReady();
    }
    $.fn.reverse = [].reverse;
})(jQuery);
