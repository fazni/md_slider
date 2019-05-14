/**
 * File: md-slider.js
 * Author: MegaDrupal
 * Version: 2.0
 *
 * Control slide show with text, video, hotspot, image items
 */
(function ($) {
    var transitionEffects = [
            "slit-horizontal-left-top",
            "slit-horizontal-top-right",
            "slit-horizontal-bottom-up",
            "slit-vertical-down",
            "slit-vertical-up",
            "strip-up-right",
            "strip-up-left",
            "strip-down-right",
            "strip-down-left",
            "strip-left-up",
            "strip-left-down",
            "strip-right-up",
            "strip-right-down",
            "strip-right-left-up",
            "strip-right-left-down",
            "strip-up-down-right",
            "strip-up-down-left",
            "left-curtain",
            "right-curtain",
            "top-curtain",
            "bottom-curtain",
            "slide-in-right",
            "slide-in-left",
            "slide-in-up",
            "slide-in-down",
            "fade"
        ],
        effectsIn = [
            "bounceIn",
            "bounceInDown",
            "bounceInUp",
            "bounceInLeft",
            "bounceInRight",
            "fadeIn",
            "fadeInUp",
            "fadeInDown",
            "fadeInLeft",
            "fadeInRight",
            "fadeInUpBig",
            "fadeInDownBig",
            "fadeInLeftBig",
            "fadeInRightBig",
            "flipInX",
            "flipInY",
            "foolishIn",
            "lightSpeedIn",
            "puffIn",
            "rollIn",
            "rotateIn",
            "rotateInDownLeft",
            "rotateInDownRight",
            "rotateInUpLeft",
            "rotateInUpRight",
            "twisterInDown",
            "twisterInUp",
            "swap",
            "swashIn",
            "tinRightIn",
            "tinLeftIn",
            "tinUpIn",
            "tinDownIn",
            "vanishIn"
        ],
        effectsOut = [
            "bombRightOut",
            "bombLeftOut",
            "bounceOut",
            "bounceOutDown",
            "bounceOutUp",
            "bounceOutLeft",
            "bounceOutRight",
            "fadeOut",
            "fadeOutUp",
            "fadeOutDown",
            "fadeOutLeft",
            "fadeOutRight",
            "fadeOutUpBig",
            "fadeOutDownBig",
            "fadeOutLeftBig",
            "fadeOutRightBig",
            "flipOutX",
            "flipOutY",
            "foolishOut",
            "hinge",
            "holeOut",
            "lightSpeedOut",
            "puffOut",
            "rollOut",
            "rotateOut",
            "rotateOutDownLeft",
            "rotateOutDownRight",
            "rotateOutUpLeft",
            "rotateOutUpRight",
            "rotateDown",
            "rotateUp",
            "rotateLeft",
            "rotateRight",
            "swashOut",
            "tinRightOut",
            "tinLeftOut",
            "tinUpOut",
            "tinDownOut",
            "vanishOut"
        ];
    var MDSlider = function ($element, options) {
        var default_options = {
            autoPlay: true,
            loop: true,
            width: 960,
            height: 420,
            responsive: true,
            fullWidth: true,
            pauseOnHover: true,
            enableLoadingBar: true,
            loadingBarPosition: 1,
            enableNextPrevButton: true,
            hoverNextPrevButton: true,
            enableKeyNavigation: true,
            enableBullet: false,
            bulletPosition: 2,
            hoverBullet: 0,
            enableThumbnail: true,
            thumbnailPosition: 3,
            thumbnailWidth: 80,
            thumbnailHeight: 50,
            enableBorderStyle: false,
            borderStyle: 1, // from 1-9
            enableDropShadow: false,
            dropShadowStyle: 1, // from 1 - 5
            enableDrag: true, // Allow mouse drag to change slide
            defaultTransitions: "fade", // Default transition effect when slide transition effect not choose
            defaultTransitionSpeed: 1000, // Default time to play transition slide effect. Calculate by milliseconds
            defaultSlideTime: 6000, // Default time for slides (millisecond)
            stripCols: 20,
            stripRows: 10,
            touchSensitive: 50,
            onInit: function () {
            },	// this callback is invoked when init slide show
            onEndTransition: function () {
            },	// this callback is invoked when the transition effect ends
            onStartTransition: function () {
            },	// this callback is invoked when the transition effect starts
            lightBoxVideoWidth: 640,
            lightBoxVideoHeight: 350,
            lightBoxOverlay: 0.8,
            onVideoClick: function () {
            }
        }

        this.slider = $element;
        this.options = $.extend(default_options, options);
        this.slideTime = this.options.defaultSlideTime;
        this.slides = [];
        this.playTime = 0;
        this.timeUnit = 40;
        this.itemsTimer = [];
        this.active = -1;
        this.prev = -1;
        this.numberSlides = 0;
        this.hasTouch = ("ontouchstart" in window || "createTouch" in document);
        this.width = 0;
        this.height = 0;
        this.lock = false;
        this.pause = false;
        this.supportCss3 = (window.Modernizr.csstransitions && window.Modernizr.csstransforms3d);
        this.tooltipDistance = 50;

        this.init();
    }
    MDSlider.prototype = {
        constructor: MDSlider,
        init: function () {
            var self = this,
                inActiveTime = false;

            // Add class loading-image to start initialize for slide show
            this.slider.addClass("loading-image");

            // Create wrap element for slide show
            this.slider.wrap('<div class="md-slider-wrap"><div class="md-slide-wrap"></div></div>');
            this.wrap = this.slider.parent().parent();
            this.wrap.addClass(this.slider.attr("id") + "-wrap");

            // Init slide show classes configure
            if (this.options.responsive)
                this.wrap.addClass("md-slider-responsive");
            if (this.options.fullWidth)
                this.wrap.addClass("md-slider-full-width");

            if (this.options.responsive && !this.options.fullWidth)
                this.wrap.css("max-width", this.options.width + "px");

            if (this.options.enableBullet && this.options.bulletPosition)
                this.wrap.addClass("md-slider-bullet-" + this.options.bulletPosition);
            if (!this.options.enableBullet && this.options.enableThumbnail && this.options.thumbnailPosition);
            this.wrap.addClass("md-slider-thumb-" + this.options.thumbnailPosition);

            // Initialize width and height of slide
            this.width = (this.options.responsive) ? this.slider.width() : this.options.width;
            this.height = this.options.height;

            // Initialize slides
            this.numberSlides = $(".md-slide-item", this.slider).length;
            $(".md-slide-item", this.slider).each(function (index) {
                self.slides[index] = $(this);

                // Initialize for items in slide
                $(".md-object", $(this)).each(function () {
                    var top = $(this).data("y") ? $(this).data("y") : 0,
                        left = $(this).data("x") ? $(this).data("x") : 0,
                        width = $(this).data("width") ? $(this).data("width") : 0,
                        height = $(this).data("height") ? $(this).data("height") : 0;
                    width = 100 * width/self.options.width;
                    height = 100 * height / self.options.height;

                    top = 100 * top/self.options.height;
                    left = 100 * left / self.options.width;

                    if (width > 0)
                        $(this).width(width + "%");
                    if (height > 0)
                        $(this).height(height + "%");

                    $(this).css({top: top + "%", left: left + "%"});
                    $(this).hide();
                });
                if (index > 0)
                    $(this).hide();
            });

            // Load slide show elements
            this.initControl();
            this.initDrag();
            this.initVideo();
            this.initHotSpot();

            // Load images to play slide
            this.loadImages();
            this.removeLoader();
            //

            // Invoke custom init callback
            this.options.onInit.call(self.slider);

            // process when un-active tab
            $(window).blur(function () {
                inActiveTime = (new Date()).getTime();
            });
            $(window).focus(function () {
                if (inActiveTime) {
                    var duration = (new Date()).getTime() - inActiveTime;

                    if (duration > self.slideTime - self.playTime)
                        self.playTime = self.slideTime - 200;
                    else
                        self.playTime += duration;
                    inActiveTime = false;
                }
            });

            $(window).resize(function () {
                self.resize();
            }).trigger("resize");
        },
        initControl: function () {
            var self = this;

            // Initialize loading bar
            if (this.options.enableLoadingBar) {
                var loadingContainer = $('<div class="loading-bar-hoz loading-bar-' + this.options.loadingBarPosition + '"><div class="br-timer-glow" style="left: -100px;"></div><div class="br-timer-bar" style="width:0px"></div></div>');
                this.wrap.append(loadingContainer);
            }

            // Initialize pause on hover
            if (this.options.pauseOnHover) {
                $(".md-slide-wrap", this.wrap).mouseenter(function () {
                    self.pauseSlide();
                });
                $(".md-slide-wrap", this.wrap).mouseleave(function () {
                    self.unPauseSlide();
                });
            }

            // Initialize border
            if (this.options.enableBorderStyle && this.options.borderStyle) {
                var borderDivs = '<div class="border-top border-style-' + this.options.borderStyle + '"></div><div class="border-bottom border-style-' + this.options.borderStyle + '"></div>';

                if (!this.options.fullWidth) {
                    borderDivs += '<div class="border-left border-style-' + this.options.borderStyle + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                    borderDivs += '<div class="border-right border-style-' + this.options.borderStyle + '"><div class="edge-top"></div><div class="edge-bottom"></div></div>';
                }
                this.wrap.append(borderDivs);
            }

            // Initialize for shadow
            if (this.options.enableDropShadow && this.options.dropShadowStyle) {
                var shadowDiv = '<div class="md-shadow md-shadow-style-' + this.options.dropShadowStyle + '"></div>';
                this.wrap.append(shadowDiv);
            }

            // Initialize bullets
            if (this.options.enableBullet && this.options.bulletPosition) {
                var $bullets = $('<div class="md-bullets"></div>');
                $(".md-slide-wrap", this.wrap).append($bullets);

                for (var i = 0; i < this.numberSlides; i++) {
                    $bullets.append('<div class="md-bullet"  rel="' + i + '"><a></a></div>');
                }

                if (this.options.hoverBullet) {
                    $bullets.css("opacity", 0);
                    $(".md-slide-wrap", this.wrap).hover(
                        function () {
                            $bullets.stop().animate({opacity: 1.0}, "fast");
                        },
                        function () {
                            $bullets.stop().animate({opacity: 0}, "fast");
                        }
                    );
                }

                // Show thumbnail is set => Hover bullet would be show thumbnail
                if (this.options.enableThumbnail) {
                    var thumbW = parseInt(this.slider.data("thumb-width")),
                        thumbH = parseInt(this.slider.data("thumb-height"));

                    for (var i = 0; i < this.numberSlides; i++) {
                        var thumbSrc = this.slides[i].data("thumb"),
                            thumbType = this.slides[i].data("thumb-type"),
                            thumbAlt = this.slides[i].data("thumb-alt");
                        if (thumbSrc) {
                            var thumb;
                            if (thumbType == "image")
                                thumb = $('<img />').attr("src", thumbSrc).attr("alt", this.slides[i].data("thumb-alt")).css({
                                    top: -(9 + thumbH) + "px",
                                    left: -(thumbW / 2 - 2) + "px",
                                    opacity: 0
                                })
                            else
                                thumb = $("<span></span>").attr("style", thumbSrc).css({
                                    top: -(9 + thumbH) + "px",
                                    left: -(thumbW / 2 - 2) + "px",
                                    opacity: 0
                                });
                            $("div.md-bullet:eq(" + i + ")", $bullets).append(thumb).append('<div class="md-thumb-arrow" style="opacity: 0"></div>');
                        }
                    }
                    $("div.md-bullet", $bullets).hover(
                        function () {
                            $(this).addClass("md-hover");
                            $("img, span", this).show().animate({'opacity': 1}, 200);
                            $('.md-thumb-arrow', this).show().animate({'opacity': 1}, 200);
                        },
                        function () {
                            $(this).removeClass('md_hover');
                            $('img, span', this).animate({'opacity': 0}, 200, function () {
                                $(this).hide();
                            });
                            $('.md-thumb-arrow', this).animate({'opacity': 0}, 200, function () {
                                $(this).hide();
                            });
                        }
                    );
                }
                $("div.md-bullet", this.wrap).click(function () {
                    if ($(this).hasClass("md-current"))
                        return false;

                    self.slide($(this).attr("rel"));
                });
            }
            else if (this.options.enableThumbnail && this.options.thumbnailPosition) {
                var $thumbnailContainer = $('<div class="md-thumb"><div class="md-thumb-container"><div class="md-thumb-items"></div></div></div>'),
                    $thumbnails = $(".md-thumb-items", $thumbnailContainer);

                for (var i = 0; i < this.numberSlides; i++) {
                    var thumbSrc = this.slides[i].data("thumb");
                    if (thumbSrc) {
                        var link = $('<a class="md-thumb-item" />').attr("rel", i).append($('<img />').attr("src", thumbSrc));
                        $thumbnails.append(link);
                    }
                }
                this.wrap.append($thumbnailContainer);

                $("a", $thumbnails).click(function () {
                    if ($(this).hasClass("md-current"))
                        return false;

                    self.slide($(this).attr("rel"));
                });
            }

            // initialize next previous button
            if (this.options.enableNextPrevButton) {
                $(".md-slide-wrap", self.wrap).append('<div class="md-arrow"><div class="md-arrow-left"><span></span></div><div class="md-arrow-right"><span></span></div></div>');
                $(".md-arrow-right", self.wrap).bind("click", function () {
                    self.nextSlide();
                });
                $(".md-arrow-left", self.wrap).bind("click", function () {
                    self.prevSlide();
                });

                if (this.options.hoverNextPrevButton) {
                    $(".md-arrow", self.wrap).css("opacity", 0);
                    $(".md-slide-wrap", self.wrap).hover(
                        function () {
                            $(".md-arrow", self.wrap).stop().animate({opacity: 1}, "fast");
                        },
                        function () {
                            $(".md-arrow", self.wrap).stop().animate({opacity: 0}, "fast");
                        }
                    );
                }
            }

            // Next, Prev slides with key navigation
            if (this.options.enableKeyNavigation) {
                $(window).keydown(function (event) {
                    var key = event.keyCode || event.which;

                    if (key == 37 || key == 38)
                        self.nextSlide();
                    else if (key == 39 || key == 40)
                        self.prevSlide();
                });
            }
        },
        initDrag: function () {
            var self = this,
                touchStart = false,
                isScrolling = false,
                mouseLeft = 0;

            if (this.hasTouch) {
                this.slider.bind("touchstart", function (event) {
                    if (touchStart) return false;
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    touchStart = true;
                    isScrolling = undefined;
                    self.slider.mouseY = event.pageY;
                    self.slider.mouseX = event.pageX;
                });
                this.slider.bind("touchmove", function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (touchStart) {
                        var pageX = (event.pageX || event.clientX),
                            pageY = (event.pageY || event.clientY);

                        if (typeof isScrolling == 'undefined')
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.slider.mouseY) > Math.abs(pageX - self.slider.mouseX));

                        if (isScrolling)
                            touchStart = false;
                        else
                            mouseLeft = pageX - self.slider.mouseX;
                    }
                    return;
                });
                this.slider.bind("touchend", function (event) {
                    if (touchStart) {
                        touchStart = false;

                        if (mouseLeft > self.options.touchSensitive) {
                            self.nextSlide();
                            mouseLeft = 0;
                        }
                        else if (mouseLeft < -self.options.touchSensitive) {
                            self.nextSlide();
                            mouseLeft = 0;
                            return false;
                        }
                    }
                });
            }
            else {
                $(".md-slide-wrap", this.wrap).hover(
                    function () {
                        if ($(".md-arrow", self.wrap))
                            $(".md-arrow", self.wrap).stop(true, true).animate({opacity: 1}, 200);
                    },
                    function () {
                        if ($(".md-arrow", self.wrap))
                            $(".md-arrow", self.wrap).stop(true, true).animate({opacity: 0}, 200);
                    }
                ).trigger("hover");
            }

            if (this.options.enableDrag) {
                this.slider.mousedown(function (event) {
                    if (!touchStart) {
                        touchStart = true;
                        isScrolling = undefined;
                        self.slider.mouseY = event.pageY;
                        self.slider.mouseX = event.pageX;
                    }
                    ;
                    return false;
                });

                this.slider.mousemove(function (event) {
                    if (touchStart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if (typeof isScrolling == 'undefined')
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.slider.mouseY) > Math.abs(pageX - self.slider.mouseX))

                        if (isScrolling)
                            touchStart = false;
                        else
                            mouseLeft = pageX - self.slider.mouseX;
                    }
                });

                this.slider.mouseup(function (event) {
                    if (touchStart) {
                        touchStart = false;

                        if (mouseLeft > self.options.touchSensitive)
                            self.prevSlide();
                        else if (mouseLeft < -self.options.touchSensitive)
                            self.nextSlide();

                        mouseLeft = 0;
                        return false;
                    }
                });
                this.slider.mouseleave(function (event) {
                    self.slider.mouseup();
                });
            }
            ;
        },
        initVideo: function () {
            var self = this;

            $(".md-video", this.slider).each(function () {
                var $video = $(this),
                    display = $(this).parent().data("display"),
                    videoSrc = $video.attr("href")+'?autoplay=1';

                switch (display) {
                    case "lightbox":
                        var videoBoxOptions = {
                            videoWidth: self.options.lightBoxVideoWidth,
                            videoHeight: self.options.lightBoxVideoHeight,
                            overlay: self.options.lightBoxOverlay,
                            onClick: self.options.onVideoClick
                        }
                        $(this).mdVideoBox(self, videoBoxOptions);
                        break;

                    case "full":
                        var $videoContainer = $('<div class="md-video-control md-loading" style="display: none"></div>');

                        // Add video container
                        self.wrap.append($videoContainer);
                        $videoContainer.hover(
                            function () {
                                self.pauseSlide();
                            },
                            function () {
                            }
                        );

                        // Process when click to video
                        $video.click(function () {
                            var $closeBtn = $('<a href="#" class="md-close-video" title="close"></a>'),
                                $videoFrame = $('<iframe frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');

                            // Process for close video button click
                            $closeBtn.click(function () {
                                $videoContainer.html("").hide();
                                self.unPauseSlide();
                                return false;
                            });

                            // Load video content
                            $videoFrame.attr("src", videoSrc).css({
                                width: "100%",
                                height: "100%"
                            });
                            $videoContainer.append($videoFrame).append($closeBtn).show();

                            return false;
                        });
                        break;

                    default :
                        $video.click(function () {
                            var $videoContainer = $video.parent(),
                                $videoFrame = $('<iframe frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');

                            $videoContainer.addClass("md-loading");
                            $video.hide();
                            $videoFrame.attr("src", videoSrc);
                            $videoFrame.css({
                                width: $videoContainer.width(),
                                height: $videoContainer.height()
                            });

                            $videoContainer.append($videoFrame);
                            return false;
                        });
                        break;
                }
            });
        },
        initHotSpot: function () {
            var self = this;

            $(".md-object .md-hotspot", this.slider).hover(
                function () {

                    var $tooltip = $(".md-hotspot-tooltip", $(this).parent()).clone(),
                        position;

                    self.wrap.append($tooltip);
                    position = self.getTooltipPosition($(this), $tooltip);
                    if (position != false) {
                        self.wrap.append($tooltip);
                        $tooltip.addClass("active");
                        $tooltip.addClass(position.class);
                        $tooltip.offset({
                            left: position.left,
                            top: position.top
                        }).animate({opacity: 1}, "fast");
                    }
                },
                function () {
                    $(".md-hotspot-tooltip.active", self.wrap).remove();
                }
            ).click(function () {
                    return false;
                }
            );

            $(".md-object .transBg-diamond", this.slider).hover(
                function () {
                    $(this).addClass("animation");
                    $(".darkBg-diamond", $(this)).addClass("animation");
                    $(".hoverBg-diamond", $(this)).addClass("animation");
                    $(".content-diamond", $(this)).addClass("animation");
                    $(".transBg-diamond .diamon-title", $(this)).addClass("animation");
                    $(".border", $(this).parent()).addClass("animation");
                },
                function () {
                    $(this).removeClass("animation");
                    $(".darkBg-diamond", $(this)).removeClass("animation");
                    $(".hoverBg-diamond", $(this)).removeClass("animation");
                    $(".transBg-diamond .diamon-title", $(this)).removeClass("animation");
                    $(".content-diamond", $(this)).removeClass("animation");
                    $(".border", $(this).parent()).removeClass("animation");
                }
            );
        },
        getTooltipPosition: function ($hotSpot, $tooltip) {
            var $itemObj = $hotSpot.parent(),
                direction = $itemObj.data("tooltip-direction") ? $itemObj.data("tooltip-direction") : "left",
                responsive = $itemObj.data("tooltip-responsive") ? $itemObj.data("tooltip-responsive") : 0,
                position = $hotSpot.offset(),
                pointWidth = $hotSpot.width(),
                pointHeight = $hotSpot.height(),
                width = $tooltip.width(),
                height = $tooltip.height(),
                top = 0,
                left = 0,
                directionClass = "md-hotspot-tooltip-" + direction;

            if (width > $(window).width())
                return false;

            if (direction == "auto")
                return this.autoTooltipPosition($hotSpot, $tooltip);
            else {
                switch (direction) {
                    case "left":
                        top = position.top - (height - pointHeight) / 2;
                        left = position.left - width - 10;
                        $tooltip.offset({
                            left: left - this.tooltipDistance,
                            top: top
                        });
                        break;

                    case "top":
                        top = position.top - height - 10;
                        left = position.left - (width - pointWidth) / 2;
                        $tooltip.offset({
                            left: left,
                            top: top - this.tooltipDistance
                        });
                        break;

                    case "right":
                        top = position.top - (height - pointHeight) / 2;
                        left = position.left + pointWidth + 10;
                        $tooltip.offset({
                            left: left + this.tooltipDistance,
                            top: top
                        });
                        break;

                    case "bottom":
                        top = position.top + pointHeight + 10;
                        left = position.left - (width - pointWidth) / 2;
                        $tooltip.offset({
                            left: left,
                            top: top + this.tooltipDistance
                        });
                        break;
                }

                if ((left < 0 || top < 0 || left + width > $(window).width() || top + height > $(window).height()) && responsive)
                    return this.autoTooltipPosition($hotSpot, $tooltip);

                return {left: left, top: top, class: directionClass};
            }
        },
        autoTooltipPosition: function ($hotSpot, $tooltip) {
            var $itemObj = $hotSpot.parent(),
                direction = $itemObj.data("tooltip-direction") ? $itemObj.data("tooltip-direction") : "left",
                responsive = $itemObj.data("tooltip-responsive") ? $itemObj.data("tooltip-responsive") : 0,
                position = $hotSpot.offset(),
                pointWidth = $hotSpot.width(),
                pointHeight = $hotSpot.height(),
                width = $tooltip.width(),
                height = $tooltip.height(),
                top = position.top - (height - pointHeight) / 2,
                left = position.left - width - 10,
                directionClass = "md-hotspot-tooltip-left";

            if (top < 0) {
                top = position.top + pointHeight + 10;
                if (top + height > $(window).height())
                    return false;

                left = position.left - (width - pointWidth) / 2;
                if (left < 0) {
                    left = 0;
                    $(".md-hotspot-tooltip-arrow", $tooltip).css({
                        top: "-10px",
                        bottom: "auto",
                        left: position.left + pointWidth / 2,
                        right: "auto"
                    });
                }
                else if (left + width > $(window).width()) {
                    left += ($(window).width() - (left + width));
                    $(".md-hotspot-tooltip-arrow", $tooltip).css({
                        top: "-10px",
                        bottom: "auto",
                        left: position.left + pointWidth / 2 - left,
                        right: "auto"
                    });
                }
                directionClass = "md-hotspot-tooltip-bottom";
                $tooltip.offset({top: top + this.tooltipDistance, left: left});
            }
            else {
                if (left < 0) {
                    directionClass = "md-hotspot-tooltip-top";
                    left = position.left - (width - pointWidth) / 2;
                    top = position.top - height - 10;

                    if (top < 0) {
                        directionClass = "md-hotspot-tooltip-right";
                        top = position.top - (height - pointHeight) / 2;
                        left = position.left + pointWidth + 10;

                        if (left + width > $(window).width()) {
                            directionClass = "md-hotspot-tooltip-bottom";
                            top = position.top + pointHeight + 10;
                            left = position.left + (width - pointWidth) / 2;

                            if (top + height > $(window).height())
                                return false;

                            if (left < 0) {
                                left = 0;
                                $(".md-hotspot-tooltip-arrow", $tooltip).css({
                                    top: "-10px",
                                    bottom: "auto",
                                    left: position.left + pointWidth / 2
                                });
                            }
                            else if (left + width > $(window).width()) {
                                left += ($(window).width() - (left + width));
                                $(".md-hotspot-tooltip-arrow", $tooltip).css({
                                    top: "-10px",
                                    bottom: "auto",
                                    left: position.left + pointWidth / 2 - left,
                                    right: "auto"
                                });
                            }
                            $tooltip.offset({
                                top: top + this.tooltipDistance,
                                left: left
                            });
                        }
                        else
                            $tooltip.offset({
                                top: top,
                                left: left + this.tooltipDistance
                            });
                    }
                    else {
                        if (left < 0) {
                            left = 0;
                            $(".md-hotspot-tooltip-arrow", $tooltip).css({
                                top: "auto",
                                bottom: "-10px",
                                left: position.left + pointWidth / 2
                            });
                        }
                        else if (left + width > $(window).width()) {
                            left += ($(window).width() - (left + width));
                            $(".md-hotspot-tooltip-arrow", $tooltip).css({
                                top: "auto",
                                bottom: "-10px",
                                left: position.left + pointWidth / 2 - left
                            });
                        }

                        $tooltip.offset({
                            top: top - this.tooltipDistance,
                            left: left
                        });
                    }
                }
                else
                    $tooltip.offset({
                        top: top,
                        left: left - this.tooltipDistance
                    });
            }

            return {left: left, top: top, class: directionClass}
        },
        timer: function () {
            if (this.lock)
                return;

            if (!this.pause) {
                this.playTime += this.timeUnit;
                if (this.playTime > this.slideTime) {
                    if (this.options.autoPlay)
                        this.nextSlide();
                }
                else {
                    if (this.options.enableLoadingBar) {
                        var width = this.playTime * this.width / this.slideTime;
                        $(".br-timer-bar", this.wrap).width(width);
                        $(".br-timer-glow", this.wrap).css({left: width - 100 + "px"});
                    }
                }
            }
        },
        play: function () {
            var self = this;

            this.slider.removeClass("loading-image")
            this.slide(0);
            setInterval(function () {
                self.timer();
            }, this.timeUnit);
        },
        slide: function (index) {
            index = parseInt(index);
            if (this.lock)
                return;

            this.lock = true;
            this.playTime = 0;
            this.slideTime = this.slides[index].data("timeout") ? this.slides[index].data("timeout") : this.options.defaultSlideTime;
            if (this.options.enableLoadingBar) {
                $(".br-timer-bar", this.wrap).width(0);
                $(".br-timer-glow", this.wrap).css({left: "-100px"});
            }
            this.prev = this.active;
            this.active = index;
            // Clear effect classes in slide items
            $(".md-object", this.slides[this.active]).each(function () {
                $(this).removeClass(effectsIn.join(" "));
                $(this).removeClass(effectsOut.join(" "));
                $(this).hide();
            });

            // Invoke custom onTransitionBegin
            this.options.onStartTransition.call(this.slider);

            if (this.slides[this.prev]) {
                $("div.md-bullet:eq(" + this.prev + ")", this.wrap).removeClass("md-current");
                $("a:eq(" + this.prev + ")", this.wrap).removeClass("md-current");

                // Clear items timer
                this.clearItemsTimer();

                // Reset video item with inline display style
                $(".md-video", this.slides[this.prev]).each(function () {
                    var $itemObject = $(this).parent();
                    if (!$itemObject.data("display") || $itemObject.data("display") == "inline")
                        $("iframe", $itemObject).remove();

                    $(this).show();
                });

                // Get slide transition effect
                var fx = this.slides[this.active].data("transition") ? this.slides[this.active].data("transition") : this.options.defaultTransitions;
                fx = fx.trim();

                if (fx.toLowerCase() == "random") {
                    fx = transitionEffects[Math.floor(Math.random() * transitionEffects.length)];
                    if (fx == undefined)
                        fx = "fade";
                    fx = $.trim(fx.toLowerCase());
                }
                else if (fx.indexOf(",") != -1) {
                    var transitions = fx.split(",");
                    fx = transitions[Math.floor(Math.random() * transitions.length)];
                    if (fx == undefined)
                        fx = "fade";
                    fx = $.trim(fx.toLowerCase());
                }

                if (!this.supportCss3 && fx.indexOf("slit-") != -1)
                    fx = "fade";

                // Play transition effect
                this.playTransition(fx);
                this.setCurrent();
            }
            else {
                this.slides[this.active].css({top: 0, left: 0}).show();
                this.playSlideItems();
                this.setCurrent();
            }
        },
        nextSlide: function () {
            if (this.lock)
                return;

            var index = this.active + 1;
            if (index < this.numberSlides)
                this.slide(index)
            else if (this.options.loop)
                this.slide(0);
        },
        prevSlide: function () {
            if (this.lock)
                return;

            if (this.active - 1 >= 0)
                this.slide(this.active - 1);
            else if (this.options.loop)
                this.slide(this.numberSlides - 1);
        },
        pauseSlide: function () {
            this.pause = true;
            if (!this.lock)
                this.clearItemsTimer();
        },
        unPauseSlide: function () {
            this.pause = false;
            if (!this.lock)
                this.playSlideItems();
        },
        clearItemsTimer: function () {
            $.each(this.itemsTimer, function (index, timer) {
                clearTimeout(timer);
            });

            this.itemsTimer = [];
        },
        playSlideItems: function () {
            var self = this,
                activeSlide = this.slides[this.active];
            $(".md-object", activeSlide).each(function () {
                var $caption = $(this),
                    inFx = $caption.data("easein") ? $caption.data("easein") : "",
                    outFx = $caption.data("easeout") ? $caption.data("easeout") : "",
                    start = $caption.data("start") ? $caption.data("start") : 0,
                    stop = $caption.data("stop") ? $caption.data("stop") : 0;

                // Get effect in and out
                if (inFx.toLowerCase() == "random")
                    inFx = effectsIn[Math.floor(Math.random() * effectsIn.length)];
                if (outFx.toLowerCase() == "random")
                    outFx = effectsOut[Math.floor(Math.random() * effectsOut.length)];

                // Process start for slide item
                if (stop - self.playTime >= 0) {
                    if (start - self.playTime >= 0) {
                        // Remove class effect out and hide caption
                        $caption.removeClass(effectsOut.join(" "));
                        $caption.removeClass(effectsIn.join(" "));
                        $caption.hide();

                        var timer = setTimeout(
                            function () {
                                if (inFx == "" || !self.supportCss3 || (inFx == "shuffleLetter" && !jQuery().shuffleLetters))
                                    $caption.show();
                                else {
                                    if (inFx !== "shuffleLetter") {
                                        var fxDuration = $caption.data("duration-in");
                                        if (fxDuration != undefined && fxDuration > 0) {
                                            $caption.css({
                                                "animation-duration": fxDuration + "ms",
                                                "-webkit-animation-duration": fxDuration + "ms",
                                                "-moz-animation-duration": fxDuration + "ms",
                                                "-ms-animation-duration": fxDuration + "ms"
                                            });
                                        }
                                        $caption.show().addClass(inFx);
                                    }
                                    else {
                                        var shuffleLetterOpt = {fps: 25};
                                        if (fxDuration && fxDuration > 0) {
                                            shuffleLetterOpt.fps = 25/(fxDuration/1000)
                                        }
                                        $caption.show().shuffleLetters(shuffleLetterOpt);
                                    }
                                }
                            },
                            start - self.playTime
                        );

                        self.itemsTimer.push(timer);
                    }
                    else
                        $caption.show();

                    // Process for stop slide item
                    if (stop - self.playTime >= 0) {
                        var timer = setTimeout(
                            function () {
                                if (outFx == "" || !self.supportCss3)
                                    $caption.fadeOut();
                                else {
                                    var fxDuration = $caption.data("duration-out");
                                    if (fxDuration != undefined && fxDuration > 0) {
                                        $caption.css({
                                            "animation-duration": fxDuration + "ms",
                                            "-webkit-animation-duration": fxDuration + "ms",
                                            "-moz-animation-duration": fxDuration + "ms",
                                            "-ms-animation-duration": fxDuration + "ms"
                                        });
                                    }
                                    $caption.addClass(outFx);
                                }

                                $caption.removeClass(inFx);
                            },
                            stop - self.playTime
                        );

                        self.itemsTimer.push(timer);
                    }
                }
                else
                    $caption.hide();
            });
            this.lock = false;

            if (this.options.pauseOnHover && this.pause)
                $(".md-slide-wrap", this.wrap).trigger("mouseenter");
        },
        loadImages: function () {
            var self = this,
                count = $(".md-slide-item .md-main-img img", this.slider).length;
            if(count){
                $(".md-slide-item .md-main-img img", this.slider).each(function () {
                    $(this).on('load', function () {
                        var $image = $(this);
                        if (!$image.data("defW")) {
                            var imgSize = self.getImageSize($image.attr("src"));

                            self.changeBackgroundPosition($image, imgSize.width, imgSize.height);
                            $image.data({
                                defW: imgSize.width,
                                defH: imgSize.height
                            });
                        }

                    count--;
                        if (count == 0)
                            self.play();
                    });

                    if (this.complete)
                        $(this).trigger('load');
                });
            }else{
                self.play();
            }
        },
        changeBackgroundPosition: function ($background, width, height) {
            var panelWidth = $(".md-slide-item:visible", this.slider).width(),
                panelHeight = $(".md-slide-item:visible", this.slider).height();

            if (height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({
                        width: "auto",
                        height: panelHeight + "px"
                    });
                    if (left < 0)
                        $background.css({left: (left / 2) + "px", top: 0});
                    else
                        $background.css({left: 0, top: 0});
                }
                else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: panelWidth + "px", height: "auto"});
                    if (top < 0)
                        $background.css({top: (top / 2) + "px", left: 0});
                    else
                        $background.css({left: 0, top: 0});
                }
            }
        },
        getImageSize: function (src) {
            var image = new Image();

            image.src = src;
            return {width: image.width, height: image.height}
        },
        resize: function () {
            this.width = this.options.responsive ? this.wrap.width() : this.options.width;
            if (this.options.responsive && (this.width < this.options.width)) {
                this.height = Math.round(this.options.height * this.width / this.options.width);
            }
            else
                this.height = this.options.height;

            this.wrap.height(this.height);
            $(".md-slide-item", this.slider).height(this.height);

            if (this.options.fullWidth) {
                var bulletSpace = 20;

                if ((this.wrap.width() - this.options.width) / 2 > 20)
                    bulletSpace = (this.wrap.width() - this.options.width) / 2;

                $(".md-bullets", this.wrap).css({
                    left: bulletSpace,
                    right: bulletSpace
                });
                $(".md-thumb", this.wrap).css({
                    left: bulletSpace,
                    right: bulletSpace
                });
                $(".md-objects", this.slider).width(this.options.width);
            }

            if (this.options.responsive && this.wrap.width() < this.options.width)
                $(".md-objects", this.slider).width(this.width);

            this.resizeBackgroundImages();
            this.resizeThumbnail();
            this.resizeFont();
            this.resizePadding();
            this.setThumbnailPosition();
        },
        resizeBackgroundImages: function () {
            var self = this;

            $(".md-slide-item", this.slider).each(function () {
                var $background = $(".md-main-img img", this);
                if($background.length){
                    if ($background.data("defW") && $background.data("defH")) {
                        self.changeBackgroundPosition($background, $background.data("defW"), $background.data("defH"));
                    }
                }else{
                    $(".md-main-img", $(this)).width($(".md-slide-item:visible", self.slider).width()).height($(".md-slide-item:visible", self.slider).height())
                }
            });
        },
        resizeThumbnail: function () {
            var self = this;

            if (this.options.enableThumbnail && !this.options.enableBullet) {
                var $thumbnailItems = $(".md-thumb-items", this.wrap),
                    thumbnailsWidth = $("a", $thumbnailItems).width() * this.numberSlides,
                    $thumbnailContainer = $(".md-thumb", this.wrap);

                $thumbnailItems.unbind("touchstart").unbind("touchmove").unbind("touchend").css("left", 0);
                $(".md-thumb-next", $thumbnailContainer).remove();
                $(".md-thumb-prev", $thumbnailContainer).remove();

                if (thumbnailsWidth > $(".md-thumb-container", $thumbnailContainer).width()) {
                    var thumbWidthInvisible = $(".md-thumb-container", this.wrap).width() - thumbnailsWidth;

                    $thumbnailItems.width(thumbnailsWidth);

                    // Add scroll thumbnail button
                    $thumbnailContainer.append('<div class="md-thumb-prev"></div><div class="md-thumb-next"></div>');
                    $(".md-thumb-prev", $thumbnailContainer).click(function () {
                        self.scrollThumbnail("right");
                    });
                    $(".md-thumb-next", $thumbnailContainer).click(function () {
                        self.scrollThumbnail("left");
                    });
                    this.enableThumbnailArrow(thumbWidthInvisible);

                    if (this.hasTouch) {
                        var thumbTouch = false,
                            thumbLeft = 0;

                        $(".md-thumb-items", this.wrap).bind("touchstart", function (event) {
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = true;
                            this.mouseX = event.pageX;
                            thumbLeft = $thumbnailItems.position().left;
                            return false;
                        });
                        $thumbnailItems.bind("touchmove", function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            if (thumbTouch)
                                $thumbnailItems.css("left", thumbLeft + event.pageX - this.mouseX);

                            return false;
                        });
                        $thumbnailItems.bind("touchend", function (event) {
                            event.preventDefault();
                            event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            thumbTouch = false;
                            if (Math.abs(event.pageX - this.mouseX) < self.options.touchSensitive) {
                                var item = $(event.target).closest("a.md-thumb-item");

                                if (item.length)
                                    self.slide(item.attr("rel"));

                                $thumbnailItems.stop(true, true).animate({left: thumbLeft}, 400);
                                return false;
                            }

                            if ($thumbnailItems.position().left < thumbWidthInvisible)
                                $thumbnailItems.stop(true, true).animate({left: thumbWidthInvisible}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });
                            else if ($thumbnailItems.position().left > 0)
                                $thumbnailItems.stop(true, true).animate({left: 0}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });

                            thumbLeft = 0;
                            return false;
                        });
                    }
                }
            }
        },
        scrollThumbnail: function (direction) {
            var self = this,
                $thumbnailItems = $(".md-thumb-items", this.wrap),
                thumbnailsWidth = $("a", $thumbnailItems).width() * this.numberSlides;

            if (this.options.enableThumbnail && !this.options.enableBullet) {
                var thumbWidthInvisible = $(".md-thumb-container", this.wrap).width() - thumbnailsWidth;

                switch (direction) {
                    case "left":
                        var thumbLeft = $thumbnailItems.position().left;

                        if (thumbLeft > thumbWidthInvisible) {
                            var containerWidth = $(".md-thumb-container", self.wrap).width();
                            if ((thumbLeft - containerWidth) > thumbWidthInvisible)
                                $thumbnailItems.stop(true, true).animate({left: thumbLeft - containerWidth}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });
                            else
                                $thumbnailItems.stop(true, true).animate({left: thumbWidthInvisible}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible)
                                });
                        }
                        break;

                    case "right":
                        var thumbLeft = $thumbnailItems.position().left;
                        if (thumbLeft < 0) {
                            var containerWidth = $(".md-thumb-container", self.wrap).width();
                            if (thumbLeft + containerWidth < 0)
                                $thumbnailItems.stop(true, true).animate({left: thumbLeft + containerWidth}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });
                            else
                                $thumbnailItems.stop(true, true).animate({left: 0}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });
                        }
                        break;

                    default :
                        var thumbCurrent = $("a", $thumbnailItems).index($("a.md-current", $thumbnailItems));
                        if (thumbCurrent >= 0) {
                            var thumbLeft = $thumbnailItems.position().left;
                            var currentLeft = thumbCurrent * $("a", $thumbnailItems).width();
                            if (currentLeft + thumbLeft < 0)
                                $thumbnailItems.stop(true, true).animate({left: -currentLeft}, 400, function () {
                                    self.enableThumbnailArrow(thumbWidthInvisible);
                                });
                            else {
                                var currentRight = currentLeft + $("a", $thumbnailItems).width(),
                                    containerWidth = $(".md-thumb-container", self.wrap).width();

                                if (currentRight + thumbLeft > containerWidth)
                                    $thumbnailItems.stop(true, true).animate({left: containerWidth - currentRight}, 400, function () {
                                        self.enableThumbnailArrow(thumbWidthInvisible);
                                    });
                            }
                        }
                        break;
                }
            }
        },
        enableThumbnailArrow: function (minThumbsLeft) {
            var thumbLeft = $(".md-thumb-items", this.wrap).position().left;

            if (thumbLeft > minThumbsLeft)
                $(".md-thumb-next", this.wrap).show();
            else
                $(".md-thumb-next", this.wrap).hide();

            if (thumbLeft < 0)
                $(".md-thumb-prev", this.wrap).show();
            else
                $(".md-thumb-prev", this.wrap).hide();
        },
        setThumbnailPosition: function () {
            if (this.options.enableThumbnail && !this.options.enableBullet) {
                var thumbHeight = this.slider.data("thumb-height");

                if (this.options.thumbnailPosition == 1) {
                    var thumbBottom = thumbHeight / 2;
                    $(".md-thumb", this.wrap).css({
                        height: thumbHeight + 20,
                        bottom: -thumbBottom - 10
                    });
                    this.wrap.css({"margin-bottom": thumbBottom + 10})
                }
                else {
                    $(".md-thumb", this.wrap).css({
                        height: thumbHeight + 20,
                        bottom: -(thumbHeight + 20)
                    });
                    this.wrap.css({"margin-bottom": thumbHeight + 50})
                }
            }
        },
        resizeFont: function () {
            var fontDiff = 1;

            if (parseInt($.browser.version, 10) < 9)
                fontDiff = 6;
            if (this.wrap.width() < this.options.width)
                $(".md-objects", this.slider).css({"font-size": 100 * this.wrap.width() / this.options.width - fontDiff + "%"});
            else
                $(".md-objects", this.slider).css({"font-size": 100 - fontDiff + "%"});
        },
        resizePadding: function () {
            var self = this;

            if (this.wrap.width() < this.options.width && this.options.responsive) {
                $(".md-objects > div", this.slider).each(function () {
                    var objectRatio = self.wrap.width() / self.options.width,
                        $_object = $(this),
                        objectPadding = {};

                    if ($_object.data("paddingtop")) objectPadding["padding-top"] = $_object.data("paddingtop") * objectRatio;
                    if ($_object.data("paddingright")) objectPadding["padding-right"] = $_object.data("paddingright") * objectRatio;
                    if ($_object.data("paddingbottom")) objectPadding["padding-bottom"] = $_object.data("paddingbottom") * objectRatio;
                    if ($_object.data("paddingleft")) objectPadding["padding-left"] = $_object.data("paddingleft") * objectRatio;
                    if ($_object.find("a").length)
                        $_object.find("a").css(objectPadding);
                    else
                        $_object.css(objectPadding);
                });
            }
            else {
                $(".md-objects > div", this.slider).each(function () {
                    var $_object = $(this),
                        objectPadding = {};

                    if ($_object.data("paddingtop")) objectPadding["padding-top"] = $_object.data("paddingtop");
                    if ($_object.data("paddingright")) objectPadding["padding-right"] = $_object.data("paddingright");
                    if ($_object.data("paddingbottom")) objectPadding["padding-bottom"] = $_object.data("paddingbottom");
                    if ($_object.data("paddingleft")) objectPadding["padding-left"] = $_object.data("paddingleft");
                    if ($_object.find("a").length)
                        $_object.find("a").css(objectPadding);
                    else
                        $_object.css(objectPadding);
                });
            }
        },
        playTransition: function (fx) {
            var self = this,
                transitionSpeed = this.options.transitionsSpeed ? this.options.transitionsSpeed : this.options.defaultTransitionSpeed;
            switch (fx) {
                case "slit-horizontal-left-top":
                case "slit-horizontal-top-right":
                case "slit-horizontal-bottom-up":
                case "slit-vertical-down":
                case "slit-vertical-up":
                    this.addSlit(fx);
                    $(".md-object", this.slides[this.active]).hide();
                    this.slides[this.prev].hide();
                    this.slides[this.active].show();
                    var slice1 = $(".md-slider-slit", this.slider).first(),
                        slice2 = $(".md-slider-slit", this.slider).last(),
                        transitionProp = {
                            "transition": "all " + transitionSpeed + "ms ease-in-out",
                            "-webkit-transition": "all " + transitionSpeed + "ms ease-in-out",
                            "-moz-transition": "all " + transitionSpeed + "ms ease-in-out",
                            "-ms-transition": "all " + transitionSpeed + "ms ease-in-out"
                        };

                    $(".md-slider-slit", this.slider).css(transitionProp);
                    setTimeout(function () {
                        slice1.addClass("md-transition-elements-1");
                        slice2.addClass("md-transition-elements-2");
                    }, 50);
                    setTimeout(function () {
                        self.transitionEnd();
                    }, transitionSpeed);
                    break;
                case "strip-up-right":
                case "strip-up-left":
                    this.addTiles(this.options.stripCols, 1, this.active);
                    var strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripCols / 2,
                        speed = transitionSpeed / 2;
                    if (fx == "strip-up-right")
                        strips = $(".md-slider-title", this.slider).reverse();
                    strips.css({height: "1px", bottom: 0, top: "auto"});
                    strips.each(function (i) {
                        var strip = $(this);

                        setTimeout(
                            function () {
                                strip.animate({
                                    height: "100%",
                                    opacity: "1.0"
                                }, speed, "easeInOutQuart", function () {
                                    if (i == self.options.stripCols - 1)
                                        self.transitionEnd();
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "strip-down-right":
                case "strip-down-left":
                    this.addTiles(this.options.stripCols, 1, this.active);
                    var $strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripCols / 2,
                        speed = transitionSpeed / 2;

                    if (fx == "strip-down-right")
                        $strips = $(".md-slider-title", this.slider).reverse();
                    $strips.css({height: "1px", top: 0, bottom: "auto"});
                    $strips.each(function (i) {
                        var $strip = $(this);
                        setTimeout(
                            function () {
                                $strip.animate({
                                    height: "100%",
                                    opacity: "1.0"
                                }, speed, "easeInOutQuart", function () {
                                    if (i == self.options.stripCols - 1)
                                        self.transitionEnd();
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "strip-left-up":
                case "strip-left-down":
                    this.addTiles(1, this.options.stripRows, this.active);
                    var $strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripRows / 2,
                        speed = transitionSpeed / 2;

                    if (fx == "strip-left-up")
                        $strips = $(".md-slider-title", this.slider).reverse();
                    $strips.css({width: "1px", left: 0, right: "auto"});
                    $strips.each(function (i) {
                        var $strip = $(this);
                        setTimeout(
                            function () {
                                $strip.animate({
                                    width: "100%",
                                    opacity: "1.0"
                                }, speed, "easeInOutQuart", function () {
                                    if (i == self.options.stripRows - 1)
                                        self.transitionEnd();
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "strip-right-up":
                case "strip-right-down":
                    this.addTiles(1, this.options.stripRows, this.active);
                    var $strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripRows / 2,
                        speed = transitionSpeed / 2;
                    if (fx == "strip-left-right-up")
                        $strips = $(".md-slider-title", self).reverse();
                    $strips.css({width: "1px", left: "auto", right: "1px"});
                    $strips.each(function (i) {
                        var $strip = $(this);
                        setTimeout(
                            function () {
                                $strip.animate({
                                    width: "100%",
                                    opacity: "1.0"
                                }, speed, "easeInOutQuart", function () {
                                    if (i == self.options.stripRows - 1)
                                        self.transitionEnd();
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "strip-right-left-up":
                case "strip-right-left-down":
                    this.addTiles(1, this.options.stripRows, this.prev);
                    this.slides[this.prev].hide();
                    this.slides[this.active].show();

                    var $strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripRows,
                        speed = transitionSpeed / 2;

                    if (fx == "strip-right-left-up")
                        $strips = $(".md-slider-title", this.slider).reverse();
                    $strips.filter(":odd").css({
                        width: "100%",
                        right: 0,
                        left: "auto",
                        opacity: 1
                    }).end().filter(":even").css({
                        width: "100%",
                        right: "auto",
                        left: "0px",
                        opacity: 1
                    });
                    $strips.each(function (i) {
                        var $strip = $(this),
                            css = (i % 2 == 0) ? {
                                left: "-50%",
                                opacity: 0
                            } : {right: "-50%", opacity: 0};

                        setTimeout(
                            function () {
                                $strip.animate(css, speed, "easeOutQuint", function () {
                                    if (i == self.options.stripRows - 1) {
                                        self.transitionEnd();
                                    }
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "strip-up-down-right":
                case "strip-up-down-left":
                    this.addTiles(this.options.stripCols, 1, this.prev);
                    this.slides[this.prev].hide();
                    this.slides[this.active].show();

                    var $strips = $(".md-slider-title", this.slider),
                        timeStep = transitionSpeed / this.options.stripCols / 2,
                        speed = transitionSpeed / 2;

                    if (fx == "strip-up-down-right")
                        $strips = $(".md-slider-title", this.slider).reverse();

                    $strips.filter(":odd").css({
                        height: "100%",
                        bottom: 0,
                        top: "auto",
                        opacity: 1
                    }).end().filter(":even").css({
                        height: "100%",
                        bottom: "auto",
                        top: 0,
                        opacity: 1
                    });
                    $strips.each(function (i) {
                        var $strip = $(this),
                            css = (i % 2 == 0) ? {
                                top: "-50%",
                                opacity: 0
                            } : {bottom: "-50%", opacity: 0};

                        setTimeout(
                            function () {
                                $strip.animate(css, speed, "easeOutQuint", function () {
                                    if (i == self.options.stripCols - 1)
                                        self.transitionEnd();
                                });
                            },
                            i * timeStep
                        );
                    });
                    break;
                case "left-curtain":
                    this.addTiles(this.options.stripCols, 1, this.active);
                    var $strips = $(".md-slider-title", this.slider),
                        stripItemWidth = this.getWidthStripItem(),
                        _self = this,
                        timeStep = transitionSpeed / this.options.stripCols / 2;

                    $strips.each(function (i) {
                        var $strip = $(this);
                        var width = (i == _self.options.stripCols - 1) ? stripItemWidth.last : stripItemWidth.normal,
                            left = (i == _self.options.stripCols - 1) ? (_self.width - stripItemWidth.last) : (width * i);
                        $strip.css({left: left, width: 0, opacity: 0});
                        setTimeout(
                            function () {
                                $strip.animate({
                                    width: width,
                                    opacity: 1
                                }, transitionSpeed / 2, function () {
                                    if (i == self.options.stripCols - 1)
                                        self.transitionEnd();
                                });
                            },
                            timeStep * i
                        );
                    });
                    break;
                case "right-curtain":
                    this.addTiles(this.options.stripCols, 1, this.active);

                    var $strips = $(".md-slider-title", this.slider).reverse(),
                        stripItemWidth = this.getWidthStripItem(),
                        _self = this,
                        timeStep = transitionSpeed / this.options.stripCols / 2;
                    //right-curtain neu de item cuoi cung co width la last thi js transition se chuyen cai last nay thanh first va gay loi
                    //vay nen ta lam nguoc lai, cho item first chua width last
                    $strips.each(function (i) {
                        var $strip = $(this);
                        var width = (i == 0) ? stripItemWidth.last : stripItemWidth.normal,
                            right = i ? ((width * (i -1)) + stripItemWidth.last) : 0;
                        $strip.css({
                            right: right,
                            left: "auto",
                            width: 0,
                            opacity: 0
                        });
                        setTimeout(
                            function () {
                                $strip.animate({
                                    width: width,
                                    opacity: 1
                                }, transitionSpeed / 2, function () {
                                    if (i == self.options.stripCols - 1)
                                        self.transitionEnd();
                                });
                            },
                            timeStep * i
                        );
                    });
                    break;
                case "top-curtain":
                    this.addTiles(1, this.options.stripRows, this.active);

                    var $strips = $(".md-slider-title", this.slider),
                        stripItemHeight = this.getHeightStripItem(),
                        _self = this,
                        timeStep = transitionSpeed / this.options.stripRows / 2;

                    $strips.each(function (i) {
                        var $strip = $(this);
                        var height = (i == _self.options.stripRows - 1) ? stripItemHeight.last : stripItemHeight.normal,
                            top = (i == _self.options.stripRows - 1) ? (_self.height - stripItemHeight.last) : (height * i);
                        $strip.css({top: top, height: 0, opacity: 0});
                        setTimeout(
                            function () {
                                $strip.animate({
                                    height: height,
                                    opacity: 1
                                }, transitionSpeed / 2, function () {
                                    if (i == self.options.stripRows - 1)
                                        self.transitionEnd();
                                });
                            },
                            timeStep * i
                        );
                    });
                    break;
                case "bottom-curtain":
                    this.addTiles(1, this.options.stripRows, this.active);
                    var $strips = $(".md-slider-title", this.slider).reverse(),
                        stripItemHeight = this.getHeightStripItem(),
                        _self = this,
                        timeStep = transitionSpeed / this.options.stripRows / 2;
                    //bottom-curtain neu de item cuoi cung co height la last thi js transition se chuyen cai last nay thanh first va gay loi
                    //vay nen ta lam nguoc lai, cho item first chua height last
                    $strips.each(function (i) {
                        var $strip = $(this);
                        var height = (i == 0) ? stripItemHeight.last : stripItemHeight.normal,
                            bottom = i ? ((height * (i -1)) + stripItemHeight.last) : 0;
                        $strip.css({bottom: bottom, height: 0, opacity: 0});
                        setTimeout(
                            function () {
                                $strip.animate({
                                    height: height,
                                    opacity: 1
                                }, transitionSpeed / 2, function () {
                                    if (i == self.options.stripRows - 1)
                                        self.transitionEnd();
                                });
                            },
                            timeStep * i
                        );
                    });
                    break;
                case "slide-in-right":
                    this.addStrips2();

                    var $strips = $(".md-slider-strip", this.slider);

                    $strips.each(function (i) {
                        var left = i * self.width,
                            $strip = $(this);

                        $strip.css({left: left}).animate({left: left - self.width}, transitionSpeed, function () {
                            self.transitionEnd();
                        });
                    });
                    break;
                case "slide-in-left":
                    this.addStrips2();
                    var $strips = $(".md-slider-strip", this.slider);

                    $strips.each(function (i) {
                        var left = -i * self.width,
                            $strip = $(this);

                        $strip.css({left: left}).animate({left: self.width + left}, transitionSpeed * 2, function () {
                            self.transitionEnd();
                        });
                    });
                    break;
                case "slide-in-up":
                    this.addStrips2();
                    var $strips = $(".md-slider-strip", this.slider);

                    $strips.each(function (i) {
                        var top = i * self.height,
                            $strip = $(this);

                        $strip.css({top: top}).animate({top: top - self.height}, transitionSpeed, function () {
                            self.transitionEnd();
                        });
                    });
                    break;
                case "slide-in-down":
                    this.addStrips2();
                    var $strips = $(".md-slider-strip", this.slider);

                    $strips.each(function (i) {
                        var top = -i * self.height,
                            $strip = $(this);

                        $strip.css({top: top}).animate({top: self.height + top}, transitionSpeed, function () {
                            self.transitionEnd();
                        });
                    });
                    break;
                case "fade":
                default:
                    this.addStrips(false, {strips: 1});

                    var $strip = $(".md-slider-strip:first", this.slider);

                    $strip.css({height: "100%", width: self.width});
                    if (fx == "slide-in-right")
                        $strip.css({
                            height: "100%",
                            width: self.width + "px",
                            left: self.width + "px",
                            right: "auto"
                        });
                    else if (fx == "slide-in-left")
                        $strip.css({
                            left: "-" + self.width + "px"
                        });

                    $strip.animate({
                        left: 0,
                        opacity: 1
                    }, transitionSpeed, function () {
                        self.transitionEnd();
                    });
                    break;
            }
        },
        getWidthStripItem: function(){
            var width = this.width / this.options.stripCols,
                result = {};
            result.normal = Math.round(width);
            result.last = this.width - (result.normal * (this.options.stripCols - 1));
            return result;
        },
        getHeightStripItem: function(){
            var height = this.height / this.options.stripRows,
                result = {};
            result.normal = Math.round(height);
            result.last = this.height - (result.normal * (this.options.stripRows - 1));
            return result;
        },
        addSlit: function (fx) {
            var $slitContainer = $('<div class="md-strips-container ' + fx + '"></div>'),
                $image = $(".md-main-img img", this.slides[this.prev]).length ? $(".md-main-img img", this.slides[this.prev]) : $(".md-main-img ", this.slides[this.prev]),
                $div1 = $('<div class="md-slider-slit"/>').append($image.clone()),
                position = $image.position(),
                $div2 = $('<div class="md-slider-slit"/>').append($image.clone().css("top", position.top - (this.height / 2) + "px"));
            if (fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="md-slider-slit"/>').append($image.clone().css("left", position.left - (this.width / 2) + "px"));

            $slitContainer.append($div1).append($div2);
            this.slider.append($slitContainer);
        },
        addStrips: function (vertical, opts) {
            var $strip,
                opts = (opts) ? opts : this.options,
                stripsContainer = $('<div class="md-strips-container"></div>'),
                stripWidth = Math.round(this.width / opts.strips),
                stripHeight = Math.round(this.height / opts.strips),
                $image = $(".md-main-img img", this.slides[this.active]);

            for (var i = 0; i < opts.strips; i++) {
                var top = ((vertical) ? (stripHeight * i) + "px" : 0),
                    left = ((vertical) ? 0 : (stripWidth * i) + "px"),
                    width,
                    height;

                if (i == opts.strips - 1) {
                    width = ((vertical) ? 0 : (this.width - (stripWidth * i)) + "px");
                    height = ((vertical) ? (this.height - (stripHeight * i)) + "px" : 0);
                }
                else {
                    width = ((vertical) ? 0 : stripWidth + "px");
                    height = ((vertical) ? stripHeight + "px" : 0);
                }

                $strip = $('<div class="md-slider-strip"></div>').css({
                    width: width,
                    height: height,
                    top: top,
                    left: left,
                    opacity: 0
                });
                $strip.append($image.clone().css({
                    marginLeft: vertical ? 0 : -(i * stripWidth) + "px",
                    marginTop: vertical ? -(i * stripHeight) + "px" : 0
                }));
                stripsContainer.append($strip);
            }
            this.slider.append(stripsContainer);
        },
        addStrips2: function () {
            var $strip,
                images = [this.slides[this.prev].children(), $(".md-main-img img", this.slides[this.active])];
            var stripsContainer = $('<div class="md-strips-container"></div>');
            for (var i = 0; i < 2; i++) {
                var cloneHtml = images[i].clone();
                if(i == 0){
                    $('.md-object', cloneHtml).removeClass(effectsIn.join(" "));
                }
                $strip = $('<div class="md-slider-strip"></div>').css({
                    width: this.width,
                    height: this.height
                }).append(cloneHtml);
                stripsContainer.append($strip);
            }
            this.slider.append(stripsContainer);
        },
        addTiles: function (x, y, index) {
            var $title,
                $stripsContainer = $('<div class="md-strips-container"></div>'),
                titleWidth = this.width / x,
                titleHeight = this.height / y,
                $image = $(".md-main-img img", this.slides[index]),
                specialHeight = 0,
                specialWidth = 0;
                
            if ($image.length == 0)
                $image = $(".md-main-img", this.slides[index]);
        
            // fix make round width height
            if(x > 1){
                var titleWidthRound = Math.round(titleWidth);
                specialWidth = titleWidthRound - titleWidth;
                titleWidth = titleWidthRound;
            }else if(y > 1){
                var titleHeightRound = Math.round(titleHeight);
                specialHeight = titleHeightRound - titleHeight;
                titleHeight = titleHeightRound;
            }
        
            for (var i = 0; i < y; i++) {
                for (var j = 0; j < x; j++) {                    
                    var top = (titleHeight * i) + 'px',
                        left = (titleWidth * j) + 'px';
                    
                    // fix increase / decrease with/height in last col / last row
                    if(x > 1 && specialWidth && j === (x-1)){
                        var titleWidthNew = titleWidth - x * specialWidth;
                        left = (x-1)*titleWidth + 'px';
                        titleWidth = titleWidthNew;
                    }
                    else if(y > 1 && specialHeight && i == (y-1)){
                        var titleHeightNew = titleHeight - y * specialHeight;
                        top = (y-1)*titleHeight + 'px';
                        titleHeight = titleHeightNew;
                    }
                    
                    $title = $('<div class="md-slider-title"/>').css({
                        width: titleWidth,
                        height: titleHeight,
                        top: top,
                        left: left
                    });
                    $title.append($image.clone().css({
                        marginLeft: "-" + left,
                        marginTop: "-" + top
                    }));

                    $stripsContainer.append($title);
                }
            }
            this.slider.append($stripsContainer);
        },
        transitionEnd: function () {
            this.options.onEndTransition.call(this.slider);
            $(".md-strips-container", this.slider).remove();
            if (this.numberSlides != 1)
                this.slides[this.prev].hide();
            this.slides[this.active].show();
            this.playSlideItems();
        },
        setCurrent: function () {
            if (this.options.enableBullet)
                $("div.md-bullet:eq(" + this.active + ")", this.wrap).addClass("md-current");
            if (this.enableThumbnail && !this.options.enableBullet)
                $("a:eq(" + this.active + ")", this.wrap).addClass("md-current");
            this.scrollThumbnail("");
        },
        removeLoader: function() {
            $('.wrap-loader-slider').addClass('fadeOut');
            $('.md-slide-items').css('min-height','');
        }
    }
    $.fn.mdSlider = function (options) {
        return new MDSlider($(this), options);
    }
    $.fn.reverse = [].reverse;
})(jQuery);

(function($) {
    var MDVideoBox = function($element, slider, options) {
        var default_options = {
            videoWidth: 640,
            videoHeight: 350,
            overlay: 0.8,
            onClick: function(){}
        };

        this.video = $element;
        this.slider = slider;
        this.options = $.extend(default_options, options);
        this.height = this.options.videoHeight;
        this.width = this.options.videoWidth;

        this.init();
    }

    MDVideoBox.prototype = {
        constructor: MDVideoBox,
        init: function() {
            var self = this;

            if($("#md-overlay").length == 0) {
                $("body").append('<div id="md-overlay" class="md-overlay" style="display: none"></div>');
                $("body").append('<div id="md-video-container" class="md-video-container" style="display: none"><div id="md-video-embed"></div><div class="md-description clearfix"><div class="md-caption"></div><a id="md-close-btn" class="md-close-btn" href="#"></a></div></div>');
            }

            this.video.click(function() {
                self.open();
                return false;
            });

            $("#md-overlay").click(function() {
                self.close();
            });

            $("#md-video-container #md-close-btn").click(function() {
                self.close();
            });

            $(window).resize(function() {
                self.resize();
            });
            $(window).keydown(function(event) {
                var key = event.keyCode || event.which;

                if (key == 27)
                    self.close();
            });
        },
        open: function() {
            var self = this,
                $videoContainer = $("#md-video-container");

            // Pause slide
            $videoContainer.hover(
                function() {
                    self.slider.pauseSlide();
                },
                function() {}
            );
            $("#md-video-embed", $videoContainer).hover(
                function() {
                    self.slider.pauseSlide();
                },
                function() {}
            );

            // Invoke custom on click video element callback
            this.options.onClick.call(this.video);

            // Implements set size for video box elements
            var docWidth = $(window).width(),
                docHeight = $(window).height();

            if (docWidth < this.options.videoWidth) {
                this.width = docWidth;
                this.height = this.options.videoHeight * docWidth / this.options.videoWidth;

                if (docHeight < this.height) {
                    this.width = docHeight*this.options.videoWidth/this.options.videoHeight;
                    this.height = docHeight;
                }
            }
            $("#md-video-embed", $videoContainer).css({width: this.width + "px", height: this.height + "px"}).addClass("md-loading");
            $(window).trigger("resize");

            $videoContainer.show();
            $(".md-caption", $videoContainer).html(this.video.attr("title"));
            $("#md-overlay").show().fadeTo("fast", this.options.opacity);
            $("#md-video-embed", $videoContainer).fadeIn("slow", function() {
                var $videoFrame = $('<iframe frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'),
                    videoSrc = self.video.attr("href") + '?autoplay=1';

                $videoFrame.attr("src", videoSrc);
                $videoFrame.css({width: self.width, height: self.height});
                $("#md-video-embed", $videoContainer).append($videoFrame);
            });
        },
        close: function() {
            $("#md-overlay").fadeOut("fast");
            $("#md-video-embed").html("");
            $("#md-video-container").hide();
            return false;
        },
        resize: function() {
            var docWidth = $(window).width(),
                docHeight = $(window).height();

            $("#md-video-container").css({left: (docWidth - this.width)/2 + "px", top: (docHeight - this.height)/2 + "px"});
            $("#md-overlay").css({width: docWidth, height: docHeight});
        }
    }
    $.fn.mdVideoBox = function(slider, options) {
        return new MDVideoBox($(this), slider, options);
    }
})(jQuery);
