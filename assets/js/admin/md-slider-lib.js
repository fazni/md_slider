/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013
 # ------------------------------------------------------------------------
 # Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
 --------------------------------------------------------------------------*/

(function($) {

    $.fn.triggerItemEvent = function() {
        var slidepanel = $(this).data("slidepanel");
        if(slidepanel == null)
            return;
        var $self = $(this);
        $self.draggable({
            containment: "parent",
            stop: function( event, ui ) {
                var left = Math.round($(ui.helper).position().left),
                    top =  Math.round($(ui.helper).position().top);
                $self.data("left", left);
                $self.data("top", top);
                slidepanel.mdSliderToolbar.changePositionValue(left, top);
            }
        });
        $self.resizable({
            handles: "e, s, se",
            containment: "parent",
            resize: function(event, ui) {
                var width = Math.round($(ui.helper).width()),
                    height = Math.round($(ui.helper).height());
                $self.data("width", width);
                $self.data("height", height);
                slidepanel.mdSliderToolbar.changeSizeValue(width, height);
            }
        });

        // Event key up - down for OS MAC
        if (navigator.appVersion.indexOf("Mac") !=-1) {

            $(document).keyup(function(event){
                $self.data('keySelect', '');
            });
            $(document).keydown(function(event){
                $self.data('keySelect', event.keyCode);
            });    
        }
        
        $self.bind('mousedown', function(e) {
            var keySelect = e.ctrlKey,
                isChrome = navigator.userAgent.indexOf('Chrome') != -1,
                isFireFox = navigator.userAgent.indexOf('Firefox') != -1,
                isSafari = navigator.userAgent.indexOf('Safari') != -1;
            if (navigator.appVersion.indexOf("Mac")!=-1 && $self.data('keySelect') != undefined ){
                var temp = $self.data('keySelect');
                if ((temp == 224 && isFireFox) || (temp == 91 && (isChrome || isSafari)))
                    keySelect = true;
                else 
                    keySelect = false;
            };

            if(keySelect) {
                $(this).addClass("ui-selected");
            } else {
                if(!$(this).hasClass("ui-selected")) {
                    $(this).siblings(".slider-item").removeClass("ui-selected");
                    $(this).addClass("ui-selected");
                } else {
                    $(this).siblings(".slider-item.ui-selected").removeClass("ui-selected");
                }
            }
            slidepanel.triggerChangeSelectItem();
        });
        return this;
    }
    function pad (str, max) {
        return str.length < max ? pad("0" + str, max) : str;
    }
    $.fn.getItemValues = function() {
        if($(this).hasClass("slider-item")) {
            var values = {
                width: $(this).data("width"),
                height: $(this).data("height"),
                left: $(this).data("left"),
                top: $(this).data("top"),
                starttime: $(this).data("starttime") ? Math.round($(this).data("starttime")) : 0,
                stoptime: $(this).data("stoptime") ? Math.round($(this).data("stoptime")) : 0,
                startani: $(this).data("startani"),
                stopani: $(this).data("stopani"),
                opacity: $(this).data("opacity"),
                mdtclass: $(this).data("mdtclass"),
                style: $(this).data("style"),
                zindex: $(this).css("z-index"),
                type: $(this).data("type"),
                title: $(this).data("title"),
                backgroundcolor: ($(this).data("backgroundcolor") == undefined ||  $(this).data("backgroundcolor") === "")? null : ($(this).data("backgroundcolor") == 0 ? "#000000" : $.fixHex($(this).data("backgroundcolor").toString())),
                backgroundtransparent: $(this).data("backgroundtransparent"),
                borderposition: $(this).data("borderposition"),
                borderwidth: $(this).data("borderwidth"),
                borderstyle: $(this).data("borderstyle"),
                bordercolor: ($(this).data("bordercolor") == undefined || $(this).data("bordercolor") === "") ? null : ($(this).data("bordercolor") == 0 ? "#000000" : $.fixHex($(this).data("bordercolor").toString())),
                bordertopleftradius: $(this).data("bordertopleftradius"),
                bordertoprightradius: $(this).data("bordertoprightradius"),
                borderbottomrightradius: $(this).data("borderbottomrightradius"),
                borderbottomleftradius: $(this).data("borderbottomleftradius"),
                paddingtop: $(this).data("paddingtop"),
                paddingright: $(this).data("paddingright"),
                paddingbottom: $(this).data("paddingbottom"),
                paddingleft: $(this).data("paddingleft"),
                link: $(this).data("link")
            };

            if($(this).data("type") == "text") {
                $.extend(values, {
                    fontsize: $(this).data("fontsize"),
                    fontfamily: $(this).data("fontfamily"),
                    fontweight: $(this).data("fontweight"),
                    fontstyle: $(this).data("fontstyle"),
                    textdecoration: $(this).data("textdecoration"),
                    texttransform: $(this).data("texttransform"),
                    textalign: $(this).data("textalign"),
                    color: ($(this).data("color") == undefined || $(this).data("color") === "") ? null : ($(this).data("color") == 0 ? "#000000" : $.fixHex($(this).data("color").toString()))
                });
            } else {
                $.extend(values, {
                    fileid: $(this).data("fileid"),
                    thumb: $(this).find("img").attr("src")
                });

                if (values.type === 'video')
                    values.displayMode = $(this).data('displayMode');
            }
            return values;
        }
        return null;

    }
    $.fn.setItemValues = function(setting) {
        if($(this).hasClass("slider-item")) {
            var self = $(this);
            $.each(setting, function(key, value){
                self.attr('data-' + key, value);
            })
            return true;
        }
        return null;

    }
    $.fn.setItemStyle = function(setting) {
        if($(this).hasClass("slider-item")) {
            var self = $(this);
            var css = {};
            if(setting.style)
                self.addClass(setting.style);
            if(setting.width)
                css["width"] = setting.width;
            if(setting.height)
                css["height"] = setting.height;
            if(setting.top)
                css["top"] = setting.top;
            if(setting.left)
                css["left"] = setting.left;
            if(setting.opacity)
                css["opacity"] = setting.opacity / 100;
            if(setting.backgroundcolor != null) {
                var bgcolor = setting.backgroundcolor;
                var opacity = parseInt(setting.backgroundtransparent);
                var rgb = $.HexToRGB(bgcolor);
                opacity = opacity ? opacity : 100;
                var itemcolor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (opacity / 100) + ')';
                css["background-color"] = itemcolor;
            }
            if(setting.bordercolor)
                css["border-color"] = setting.bordercolor;
            if(setting.borderwidth)
                css["border-width"] = setting.borderwidth + "px";

            var borderStr = "none";
            if(setting.borderposition && setting.borderstyle) {
                var borderposition = setting.borderposition,
                    borderstyle = setting.borderstyle;

                if(borderposition & 1) {
                    borderStr = borderstyle;
                } else {
                    borderStr = "none";
                }
                if(borderposition & 2) {
                    borderStr += " " + borderstyle;
                } else {
                    borderStr += " none";
                }
                if(borderposition & 4) {
                    borderStr += " " + borderstyle;
                } else {
                    borderStr += " none";
                }
                if(borderposition & 8) {
                    borderStr += " " + borderstyle;
                } else {
                    borderStr += " none";
                }
            }
            css['border-style'] = borderStr;
            if(setting.bordertopleftradius)
                css["border-top-left-radius"] = setting.bordertopleftradius + "px";
            if(setting.bordertoprightradius)
                css["border-top-right-radius"] = setting.bordertoprightradius + "px";
            if(setting.borderbottomrightradius)
                css["border-bottom-right-radius"] = setting.borderbottomrightradius + "px";
            if(setting.borderbottomleftradius)
                css["border-bottom-left-radius"] = setting.borderbottomleftradius + "px";
            if(setting.paddingtop)
                css["padding-top"] = setting.paddingtop + "px";
            if(setting.paddingright)
                css["padding-right"] = setting.paddingright + "px";
            if(setting.paddingbottom)
                css["padding-bottom"] = setting.paddingbottom + "px";
            if(setting.paddingleft)
                css["padding-left"] = setting.paddingleft + "px";

            if(setting.type == "text") {
                if(setting.fontsize)
                    css["font-size"] = setting.fontsize + "px";
                if(setting.fontfamily)
                    css["font-family"] = setting.fontfamily;
                if(setting.fontweight){
                    css["font-weight"] = setting.fontweight;
                    if(isNaN(setting.fontweight))
                        css["font-style"] = 'italic';
                }
                if(setting.fontstyle)
                    css["font-style"] = setting.fontstyle;
                if(setting.textdecoration)
                    css["text-decoration"] = setting.textdecoration;
                if(setting.texttransform)
                    css["text-transform"] = setting.texttransform;
                if(setting.textalign)
                    css["text-align"] = setting.textalign;
                if(setting.color)
                    css["color"] = setting.color;
            }
            self.css(css);
        }
        return false;
    }
    $.fn.setItemHtml = function(setting) {
        if($(this).hasClass("slider-item")) {
            if(setting.type == "text") {
                $(this).find("p").html(setting.title.replace(/\n/g, "<br />"));
            } else {
                $(this).find("img").attr("src", setting.thumb);
            }
        }
        return false;
    }
    $.HexToRGB = function (hex) {
        var hex = parseInt(((hex.toString().indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
    }
    $.removeMinusSign = function(str) {
        return str.replace(/-/g, "");
    }
    $.objectToString = function(obj) {
        return JSON.stringify(obj);
    };
    $.stringToObject = function(string) {
        return jQuery.parseJSON(string);
    };
    $.fixHex = function (hex) {
        var len = 6 - hex.length;
        if (len > 0) {
            var o = [];
            for (var i=0; i<len; i++) {
                o.push('0');
            }
            o.push(hex);
            hex = o.join('');
        }
        return hex;
    };
})(jQuery);
