/*------------------------------------------------------------------------
# MD Slider - March 18, 2013
# ------------------------------------------------------------------------
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/

(function($, Drupal) {
    var MdSliderToolbar = function(panel) {
        var self = this;
        this.panel = panel;
        this.selectedItem = null;
        this.init = function() {
            $("#md-toolbar a").click(function() {
                if ($(this).hasClass("mdt-text")) {
                    self.panel.addBoxItem("text");
                } else if ($(this).hasClass("mdt-image")) {
                    self.panel.addBoxItem("image");
                }  else if ($(this).hasClass("mdt-video")) {
                    self.panel.addBoxItem("video");
                } else if ($(this).hasClass("mdt-align-left")) {
                    self.panel.alignLeftSelectedBox();
                } else if ($(this).hasClass("mdt-align-right")) {
                    self.panel.alignRightSelectedBox();
                } else if ($(this).hasClass("mdt-align-center")) {
                    self.panel.alignCenterSelectedBox();
                } else if ($(this).hasClass("mdt-align-top")) {
                    self.panel.alignTopSelectedBox();
                } else if ($(this).hasClass("mdt-align-bottom")) {
                    self.panel.alignBottomSelectedBox();
                } else if ($(this).hasClass("mdt-align-vcenter")) {
                    self.panel.alignMiddleSelectedBox($("input.mdt-spacei", "#md-toolbar").val());
                } else if ($(this).hasClass("mdt-spacev")) {
                    self.panel.spaceVertical($("input.mdt-spacei", "#md-toolbar").val());
                } else if ($(this).hasClass("mdt-spaceh")) {
                    self.panel.spaceHorizontal($("input.mdt-spacei", "#md-toolbar").val());
                }
                return false;
            });
            $("input.mdt-width", "#md-toolbar").keyup(function() {
                if ($("a.mdt-proportions", "#md-toolbar").hasClass("mdt-proportions-yes")) {
                    var proportions = $("a.mdt-proportions", "#md-toolbar").data("proportions");
                    if(proportions > 0) {
                        $("input.mdt-height", "#md-toolbar").val(Math.round($(this).val() / proportions));
                    }
                }
            });

            $("input.mdt-height", "#md-toolbar").keyup(function() {
                if ($("a.mdt-proportions", "#md-toolbar").hasClass("mdt-proportions-yes")) {
                    var proportions = $("a.mdt-proportions", "#md-toolbar").data("proportions");
                    if(proportions > 0) {
                        $("input.mdt-width", "#md-toolbar").val(Math.round($(this).val() * proportions));
                    }
                }
            });
            $("input, select", "#md-toolbar").keypress(function(event){
                var keyCode = event.keyCode || event.which;
                if(keyCode == 13){
                    $(this).trigger("change");
                    event.preventDefault();
                }
            });
            $("input.mdt-input, select.mdt-input", "#md-toolbar").change(function() {
                var name = $(this).attr("name");
                switch (name) {
                    case "background-transparent":
                    case "background-color":
                        self.panel.setItemBackground(name, $(this).val());
                        return true;
                        break;
                    case "left":
                    case "top":
                        self.panel.setItemAttribute(name, $(this).val());
                        break;
                    case "width":
                    case "height":
                        self.panel.setItemSize($("input.mdt-width", "#md-toolbar").val(), $("input.mdt-height", "#md-toolbar").val());
                        break;
                    case "font-size":
                        self.panel.setItemFontSize(name, $(this).val());
                        break;
                    case "style":
                        self.panel.setItemStyle(name, $(this).val());
                        break;
                    case "opacity":
                        self.panel.setItemOpacity(name, $(this).val());
                        break;
                    case "mdtclass":
                        self.panel.setItemClass(name, $(this).val());
                        break;
                    case "color":
                        self.panel.setItemColor($(this).val());
                        break;
                    case "border-color":
                        self.panel.setItemBorderColor(name, $(this).val());
                        break;
                    case "border-width":
                        self.panel.setItemCssPx(name, $(this).val());
                        break;
                    case "border-style":
                        self.panel.changeBorderStyle($(this).val());
                        break;
                    default:
                        self.panel.setItemCss(name, $(this).val());
                }
                return false;
            });
            $("a.button-style", "#md-toolbar").click(function() {
                if($(this).hasClass("active")) {
                    self.panel.setItemCss($(this).attr("name"), $(this).attr("normal"));
                    $(this).removeClass("active");
                } else {
                    self.panel.setItemCss($(this).attr("name"), $(this).attr("active"));
                    $(this).addClass("active");
                }
                return false;
            });
            $("a.button-align", "#md-toolbar").click(function() {
                if($(this).hasClass("active")) {
                    if($(this).hasClass("mdt-left-alignment")) return;
                    self.panel.setItemCss("text-align", "left");
                    $("a.mdt-left-alignment", "#md-toolbar").addClass("active");
                    $(this).removeClass("active");
                } else {
                    self.panel.setItemCss("text-align", $(this).attr("value"));
                    $("a.button-align", "#md-toolbar").removeClass("active");
                    $(this).addClass("active");
                }
                return false;
            });
            $("textarea", "#md-toolbar").keyup(function() {
                self.panel.setItemTitle($(this).val());
            });
            $("a.mdt-proportions", "#md-toolbar").click(function() {
                if(!($("#md-toolbar").attr("disabled")) || $("#md-toolbar").attr("disabled") == "false") {
                    if ($(this).hasClass("mdt-proportions-yes")) {
                        $(this).removeClass("mdt-proportions-yes");
                    } else {
                        var width = $("input.mdt-width", "#md-toolbar").val();
                        var height = $("input.mdt-height", "#md-toolbar").val();
                        var proportions = 1;
                        if (width > 0 && height > 0)
                            proportions = width / height;
                        $(this).data("proportions", proportions);
                        $(this).addClass("mdt-proportions-yes");
                    }
                }
            });

            $("#dlg-video").dialog({
                resizable: false,
                autoOpen: false,
                draggable: false,
                modal: true,
                width: 680,
                buttons: {
                    OK: function () {
                        self.updateVideo($("#videoid").val(), $("#videoname").val(), $("#videothumb").attr("src"));
                        $(this).dialog("close");
                    }
                },
                open: function() {
                    var videovalue = self.getVideoValue();
                    $("#videoid").val(videovalue.id);
                    $("#videoname").val(videovalue.name);
                    $("#videothumb").attr("src", videovalue.thumbsrc);
                },
                close: function() {
                    $(this).empty();
                }
            });
            $("input[name=background-color]", "#md-toolbar").spectrum({
                showInput: true,
                allowEmpty: true,
                preferredFormat: "hex",
                showButtons: false,
                move: function(color) {
                    if (color)
                        $("input[name=background-color]", "#md-toolbar").val(color.toHexString()).trigger("change");
                    else
                        $("input[name=background-color]", "#md-toolbar").val("").trigger("change");
                },
                hide: function() {
                    var backgroundColor = $("input[name=background-color]", "#md-toolbar").val();
                    if (backgroundColor != "") {
                        $("input[name=background-transparent]", "#md-toolbar").removeAttr("disabled");
                        $("input[name=background-color]", "#md-toolbar").spectrum("set", backgroundColor);
                    }

                    else {
                        $("input[name=background-transparent]", "#md-toolbar").attr("disabled", "disabled");
                        $("input[name=background-color]", "#md-toolbar").spectrum("set", "");
                    }
                }
            });
            $("input.mdt-color", "#md-toolbar").spectrum({
                showInput: true,
                allowEmpty: true,
                preferredFormat: "hex",
                showButtons: false,
                move: function(color) {
                    if (color)
                        $("input.mdt-color", "#md-toolbar").val(color.toHexString()).trigger("change");
                    else
                        $("input.mdt-color", "#md-toolbar").val("").trigger("change");
                },
                hide: function() {
                    var color = $("input.mdt-color", "#md-toolbar").val();
                    if (color != "")
                        $("input.mdt-color", "#md-toolbar").spectrum("set", color);
                    else
                        $("input.mdt-color", "#md-toolbar").spectrum("set", "");
                }
            });

            $("body").on('click', '#btn-search', function() {
                var videoUrl = $("#txtvideoid").val();
                var url = drupalSettings.MDSlider.jsonConfigURL;
                $.post(url, {action: 'getVideoInfo', url: videoUrl}, function(response) {
                    switch (response.type) {
                        case 'youtube':
                            if(response.data) {
                                var info = response.data;
                                $("#videoid").val(response.fid);
                                $("#videoname").val(info.title);
                                $("#videothumb").attr("src", info.thumbnail_url);
                            }
                            break;

                        case 'vimeo':
                            if(response.data) {
                                var info = response.data[0];
                                console.log(info);
                                $("#videoid").val(info.id);
                                $("#videoname").val(info.title);
                                $("#videothumb").attr("src", info.thumbnail_large);
                            }
                            break;

                        default :
                            alert('Could not find video info for this link. Try again!');
                            break;
                    }
                    if ($("#videothumb").length <= 0) {
                      $("#videothumb").parent().append('<a class="panel-change-videothumb" href="#">[Change video thumb]</a>');
                    }
                });
            });
            $("#change-video").click(function() {
                var video_data = self.getVideoValue(),
                    isChange = (video_data.id != '') ? 1 : 0,
                    url = drupalSettings.MDSlider.htmlConfigURL;
                $.post(url, {'action': 'formVideoSettings', change: isChange}, function(data) {
                    $("#dlg-video").append(data).dialog("open");
                });
                return false;
            });
            $('.video-display-mode', '#md-toolbar').change(function() {
                if (self.panel.selectedItem) {
                    $(self.panel.selectedItem).data("displayMode", $(this).val())
                }
            })

            $('.mdt-type-image').change(function(){
               var fid =  $('input.mdt-image-fileid').val(),
                   src = $("img.mdt-imgsrc").attr('src'),
                   alt = $("textarea.mdt-imgalt").val();
                self.panel.setImageData(fid, alt, src);
            });

            $("#md-toolbar select.mdt-font-family").change(function() {
                self.panel.changeFontFamily($(this).val());
                self.changeFontWeightOption($("option:selected" ,this).data("fontweight"));
            });
            $("#md-toolbar select.mdt-font-weight").change(function() {
                var value =  $(this).val();
                $(this).data("value", value);
                self.panel.setItemFontWeight(value);
            });

            $("#border-position a").click(function() {
                if($(this).hasClass("bp-all")) {
                  var siblings = $(this).siblings();
                  if(siblings.filter(".active").length < 4) {
                    siblings.addClass("active");
                  } else {
                    siblings.removeClass("active");
                  }
                } else {
                  $(this).toggleClass("active");
                }
                self.changeBorderPosition();
            });
            $("#border-color", "#md-toolbar").spectrum({
                showInput: true,
                preferredFormat: "hex",
                showButtons: false,
                move: function(color) {
                    if (color)
                        $("#border-color", "#md-toolbar").val(color.toHexString()).trigger("change");
                    else
                        $("#border-color", "#md-toolbar").val("").trigger("change");
                },
                hide: function(color) {
                    var color = $("#border-color", "#md-toolbar").val();
                    $("#border-color", "#md-toolbar").spectrum("set", color);
                }
            });

            $("#md-toolbar input.mdt-border-radius").change(function() {
               if($(this).val() != "" && !isNaN($(this).val())) {
                   if($(this).siblings("input.mdt-border-radius").filter(function(){
                         return $(this).val();
                       }).length < 3) {
                       var radius = parseInt($(this).val());
                       $(this).siblings("input.mdt-border-radius").each(function() {
                          $(this).val(radius);
                          self.panel.setItemCssPx($(this).attr("name"), radius);
                       });
                   }
               } else {
                   $(this).val(0);
               }
                self.panel.setItemCssPx($(this).attr("name"), $(this).val());
            });
            $("#md-toolbar input.mdt-padding").change(function() {
                if($(this).val() != "" && !isNaN($(this).val())) {
                    if($(this).siblings("input.mdt-padding").filter(function(){
                            return $(this).val();
                        }).length < 3) {
                        var padding = parseInt($(this).val());
                        $(this).siblings("input.mdt-padding").each(function() {
                            $(this).val(padding);
                            self.panel.setItemCssPx($(this).attr("name"), padding);
                        });
                    }
                } else {
                    $(this).val(0);
                }
                self.panel.setItemCssPx($(this).attr("name"), $(this).val());
            });

            $("#md-toolbar input.mdt-custom-class").change(function() {
                var value =  $(this).val();
                $(this).data("value", value);
                self.panel.setItemClass(value);
            });
            // link text
            $("#md-toolbar a.mdt-addlink").click(function() {
                var itemValues = self.selectedItem.getItemValues();
                var link = $.extend({value:"",title:"",color:"",background:"",transparent:"",border:"", target: ""}, itemValues.link);
                $("#mdt-linkexpand input.mdt-link-value").val(link.value);
                $("#mdt-linkexpand input.mdt-link-title").val(link.title);
                $("#mdt-linkexpand input.link-color").val(link.color);
                $("#mdt-linkexpand select.mdt-link-target").val(link.target);

                if (link.color)
                    $("#mdt-linkexpand input.link-color").spectrum("set", "#" + link.color);
                else
                    $("#mdt-linkexpand input.link-color").spectrum("set", "");
                $("#mdt-linkexpand input.link-background").val(link.background);
                if (link.background)
                    $("#mdt-linkexpand input.link-background").spectrum('set', '#' + link.background)
                else
                    $("#mdt-linkexpand input.link-background").spectrum('set', '');
                $("#mdt-linkexpand input.link-background-transparent").val(link.transparent);
                $("#mdt-linkexpand input.link-border").val(link.border)
                if (link.border)
                    $("#mdt-linkexpand input.link-border").spectrum('set', '#' + link.border)
                else
                    $("#mdt-linkexpand input.link-border").spectrum('set', '');
                $("#mdt-linkexpand").data("item", self.selectedItem).show();
                $(document).bind('click', hideLinkPopup);
            });
            $("#mdt-linkexpand a.mdt-link-close").click(function() {
                $("#mdt-linkexpand").data("item", null);
                $("#mdt-linkexpand").hide();
            });

            $("#link-color, #link-background, #link-border").spectrum({
                allowEmpty: true,
                preferredFormat: "hex",
                showInput: true,
                showButtons: false,
                move: function(color) {
                    if (color)
                        $(this).val(color.toHexString())
                    else
                        $(this).val("");
                },
                hide:function() {
                    var color = $(this).val();
                    $(this).spectrum("set", color);
                }
            });
            $("#mdt-linkexpand a.mdt-link-save").click(function() {
                self.saveLinkData();
                $("#mdt-linkexpand").hide();
                $(document).unbind('click', hideLinkPopup);
            });
            $("#mdt-linkexpand a.mdt-link-remove").click(function() {
                var item = $("#mdt-linkexpand").data("item");
                if(item != null) {
                    $(item).data("link", null);
                }
                $("#mdt-linkexpand").data("item", null);
                $("#mdt-linkexpand").hide();
            });
            self.disableToolbar();
        };
        this.saveLinkData = function() {
            var item = $("#mdt-linkexpand").data("item"),
                link = {
                value: $("#mdt-linkexpand input.mdt-link-value").val(),
                title: $("#mdt-linkexpand input.mdt-link-title").val(),
                target: $("#mdt-linkexpand select.mdt-link-target").val(),
                color: $("#mdt-linkexpand input.link-color").val(),
                background: $("#mdt-linkexpand input.link-background").val(),
                transparent: $("#mdt-linkexpand input.link-background-transparent").val(),
                border: $("#mdt-linkexpand input.link-border").val()
            };

            $("#link-color, #link-background, #link-border").spectrum("hide");

            if(link.value != "" && item != null) {
                $(item).data("link", link);
            }
        }
        this.changeBorderPosition = function() {
            var borderTop = $("#border-position a.bp-top").hasClass("active") ? 1 : 0,
                borderRight = $("#border-position a.bp-right").hasClass("active") ? 2 : 0,
                borderBottom = $("#border-position a.bp-bottom").hasClass("active") ? 4 : 0,
                borderLeft = $("#border-position a.bp-left").hasClass("active") ? 8 : 0;
            self.panel.changeBorderPosition(borderTop + borderRight + borderBottom + borderLeft);
        };
        this.weightArray  = {
            '100': 'Thin',
            '100italic': 'Thin Italic',
            '100i': 'Thin Italic',
            '200': "Extra Light",
            '200italic': "Extra Light Italic",
            '200i': "Extra Light Italic",
            '300': 'Light',
            '300italic': 'Light Italic',
            '300i': 'Light Italic',
            '400': 'Normal',
            '400italic': 'Italic',
            '400i': 'Italic',
            '500': 'Medium',
            '500italic': 'Medium Italic',
            '500i': 'Medium Italic',
            '600': 'Semi Bold',
            '600italic': 'Semi Bold Italic',
            '600i': 'Semi Bold Italic',
            '700': 'Bold',
            '700italic': 'Bold Italic',
            '700i': 'Bold Italic',
            '800': 'Extra Bold',
            '800italic': 'Extra Bold Italic',
            '800i': 'Extra Bold Italic',
            '900': 'Heavy',
            '900italic': 'Heavy Italic',
            '900i': 'Heavy Italic'
        }
        this.changeFontWeightOption = function(fontweight) {
            var options = '<option value=""></option>';
            var oldoption = $("#md-toolbar select.mdt-font-weight").data("value");
            if(fontweight) {
                var fontweight = ''+fontweight+'',
                    fontweights = (fontweight.search(",") != -1) ?  fontweight.split(",") : [fontweight],
                    weightArray = self.weightArray;
                for(var i = 0; i < fontweights.length; i++) {
                    var weight = fontweights[i];
                    options += '<option value="'+weight+'">'+ weightArray[weight] +'</option>'
                }
            }
            $("#md-toolbar select.mdt-font-weight").html(options).val(oldoption);
        }

        this.changeSelectItem = function(item) {
            this.selectedItem = item;
            this.triggerChangeSelectItem();
        }
        this.triggerChangeSelectItem = function() {
            self.saveLinkData();
            $("#mdt-linkexpand").hide();
            if(this.selectedItem == null) {
                this.disableToolbar();
            } else {
                this.changeToolbarValue();
                if($("#md-toolbar").attr("disabled")) {
                    this.enableToolbar();
                }
            }
        }
        this.disableToolbar = function() {
            $("input, select, textarea", "#md-toolbar").not("input.mdt-spacei").val("").attr("disabled", true);
            $("#md-toolbar div.mdt-item-type").hide();
            $("#md-toolbar").attr("disabled", true);
        }
        this.enableToolbar = function() {
            $("input, select, textarea", "#md-toolbar").removeAttr("disabled");
            $("#md-toolbar").attr("disabled", false);
        }
        this.changeToolbarValue = function() {
            if (this.selectedItem != null) {
                var itemValues = this.selectedItem.getItemValues();
                $("input.mdt-width", "#md-toolbar").val(itemValues.width);
                $("input.mdt-height", "#md-toolbar").val(itemValues.height);
                $("input.mdt-left", "#md-toolbar").val(itemValues.left);
                $("input.mdt-top", "#md-toolbar").val(itemValues.top);
                $("input.mdt-starttime", "#md-toolbar").val(itemValues.starttime);
                $("input.mdt-stoptime", "#md-toolbar").val(itemValues.stoptime);
                $("select.mdt-startani", "#md-toolbar").val(itemValues.startani);
                $("select.mdt-stopani", "#md-toolbar").val(itemValues.stopani);
                $("input.mdt-opacity", "#md-toolbar").val(itemValues.opacity);
                $("input.mdt-custom-class", "#md-toolbar").val(itemValues.mdtclass);
                $("select.mdt-style", "#md-toolbar").val(itemValues.style);
                $("input.mdt-background", "#md-toolbar").val(itemValues.backgroundcolor);
                if (itemValues.backgroundcolor)
                    $("input[name=background-color]", "#md-toolbar").spectrum("set", "#" + itemValues.backgroundcolor)
                else
                    $("input[name=background-color]", "#md-toolbar").spectrum("set", "");
                $("input.mdt-background-transparent", "#md-toolbar").val(itemValues.backgroundtransparent);
                $("#border-position a").removeClass("active");
                var border = itemValues.borderposition;
                if(border & 1) {
                    $("#border-position a.bp-top").addClass("active");
                }
                if(border & 2) {
                    $("#border-position a.bp-right").addClass("active");
                }
                if(border & 4) {
                    $("#border-position a.bp-bottom").addClass("active");
                }
                if(border & 8) {
                    $("#border-position a.bp-left").addClass("active");
                }

                $("input.mdt-border-width", "#md-toolbar").val(itemValues.borderwidth);
                $("select.mdt-border-style", "#md-toolbar").val(itemValues.borderstyle);
                if (itemValues.bordercolor)
                    $("#border-color", "#md-toolbar").spectrum("set", "#" + itemValues.bordercolor);
                else
                    $("#border-color", "#md-toolbar").spectrum("set", "");
                $("input.border-color", "#md-toolbar").val(itemValues.bordercolor);

                $("input.mdt-br-topleft", "#md-toolbar").val(itemValues.bordertopleftradius);
                $("input.mdt-br-topright", "#md-toolbar").val(itemValues.bordertoprightradius);
                $("input.mdt-br-bottomright", "#md-toolbar").val(itemValues.borderbottomrightradius);
                $("input.mdt-br-bottomleft", "#md-toolbar").val(itemValues.borderbottomleftradius);

                $("input.mdt-p-top", "#md-toolbar").val(itemValues.paddingtop);
                $("input.mdt-p-right", "#md-toolbar").val(itemValues.paddingright);
                $("input.mdt-p-bottom", "#md-toolbar").val(itemValues.paddingbottom);
                $("input.mdt-p-left", "#md-toolbar").val(itemValues.paddingleft);
                var proportions = 1;
                if (itemValues.width > 0 && itemValues.height > 0)
                    proportions = itemValues.width / itemValues.height;
                $("a.mdt-proportions", "#md-toolbar").data("proportions", proportions);
                var divType = $("#md-toolbar div.mdt-item-type").hide();

                // disable shufferLetter animation
                $('select.mdt-startani > option[value="shuffleLetter"]', '#md-toolbar').hide();

                if(itemValues.type == "text") {
                    $('select.mdt-startani > option[value="shuffleLetter"]', '#md-toolbar').show();
                    $("textarea.mdt-textvalue", "#md-toolbar").val(itemValues.title);
                    $(divType).filter(".mdt-type-text").show();
                    $("input.mdt-fontsize", "#md-toolbar").val(itemValues.fontsize);
                    $("select.mdt-font-family", "#md-toolbar").val(itemValues.fontfamily).trigger("change");
                    $("select.mdt-font-weight", "#md-toolbar").val(itemValues.fontweight);
                    $("a.mdt-font-bold", "#md-toolbar").toggleClass("active", (itemValues.fontweight == "bold"));
                    $("a.mdt-font-italic", "#md-toolbar").toggleClass("active", (itemValues.fontstyle == "italic"));
                    $("a.mdt-font-underline", "#md-toolbar").toggleClass("active", (itemValues.textdecoration == "underline"));
                    $("a.mdt-font-allcaps", "#md-toolbar").toggleClass("active", (itemValues.texttransform == "uppercase"));
                    $("a.mdt-left-alignment", "#md-toolbar").toggleClass("active", (itemValues.textalign == "left"));
                    $("a.mdt-center-alignment", "#md-toolbar").toggleClass("active", (itemValues.textalign == "center"));
                    $("a.mdt-right-alignment", "#md-toolbar").toggleClass("active", (itemValues.textalign == "right"));
                    $("a.mdt-justified-alignment", "#md-toolbar").toggleClass("active", (itemValues.textalign == "justified"));
                    $("input.mdt-color", "#md-toolbar").val(itemValues.color);
                    if (itemValues.color)
                        $("input.mdt-color", "#md-toolbar").spectrum("set", "#"+itemValues.color);
                    else
                        $("input.mdt-color", "#md-toolbar").spectrum("set", "");
                } else if(itemValues.type == "image") {
                    $("textarea.mdt-imgalt", "#md-toolbar").val(itemValues.title);
                    $("img.mdt-imgsrc", "#md-toolbar").attr("src", itemValues.thumb);
                    $("input.mdt-fileid", "#md-toolbar").val(itemValues.fileid);
                    $(divType).filter(".mdt-type-image").show();
                } else if(itemValues.type == "video") {
                    $("textarea.mdt-videoname", "#md-toolbar").val(itemValues.title);
                    $("input.mdt-video-fileid", "#md-toolbar").val(itemValues.fileid);
                    $("img.mdt-videosrc", "#md-toolbar").attr("src", itemValues.thumb);
                    $(divType).filter(".mdt-type-video").show();
                    $("#md-toolbar input.mdt-color").attr("disabled", true);
                    if (itemValues.displayMode != undefined)
                        $('select.video-display-mode', '#md-toolbar').val(itemValues.displayMode);
                    else
                        $('select.video-display-mode', '#md-toolbar').val('inline');
                }
            }
        }
        this.changePositionValue = function(left, top) {
            $("input.mdt-left", "#md-toolbar").val(Math.round(left));
            $("input.mdt-top", "#md-toolbar").val(Math.round(top));
        }
        this.changeSizeValue = function(width, height) {
            $("input.mdt-width", "#md-toolbar").val(Math.round(width));
            $("input.mdt-height", "#md-toolbar").val(Math.round(height));
        }
        this.getItemSetting = function() {
            return {
                starttime: $("input.mdt-starttime", "#md-toolbar").val(),
                stoptime: $("input.mdt-stoptime", "#md-toolbar").val(),
                startani: $("select.mdt-startani", "#md-toolbar").val(),
                stopani: $("select.mdt-stopani", "#md-toolbar").val(),
                //opacity: $("input.mdt-opacity", "#md-toolbar").val(),
                customclass: $("input.mdt-custom-class", "#md-toolbar").val(),
                style: $("select.mdt-style", "#md-toolbar").val()
            };
        }
        this.changeTimelineValue = function() {
            if (this.selectedItem != null) {
                $("input.mdt-starttime", "#md-toolbar").val(Math.round(this.selectedItem.data("starttime")));
                $("input.mdt-stoptime", "#md-toolbar").val(Math.round(this.selectedItem.data("stoptime")));
            }
        }
        this.updateVideo = function(id, name, src) {
            $("textarea.mdt-videoname", "#md-toolbar").val(name);
            $("input.mdt-video-fileid", "#md-toolbar").val(id);
            $("img.mdt-videosrc", "#md-toolbar").attr("src", src);
            self.panel.setVideoData(id, name, src);
        }
        this.getVideoValue = function() {
            return {
                name: $("textarea.mdt-videoname", "#md-toolbar").val(),
                thumbsrc: $("img.mdt-videosrc", "#md-toolbar").attr("src"),
                id: $("input.mdt-video-fileid", "#md-toolbar").val(),
            }
        }
        this.focusEdit = function() {
            if (this.selectedItem != null) {
                var type = this.selectedItem.data("type");
                if(type == "text") {
                    $("textarea.mdt-textvalue", "#md-toolbar").focus();
                } else if (type == "image") {
                    $("#change-image").trigger("click");
                } else if (type == "video") {
                    $("#change-video").trigger("click");
                }
            }
        }
        var hideLinkPopup = function(ev) {
            if (!isChildOf($("#mdt-linkexpand").get(0), ev.target, $("#mdt-linkexpand").get(0))) {
                self.saveLinkData();
                $("#mdt-linkexpand").data("item", null);
                $("#mdt-linkexpand").hide();
                $(document).unbind('click', hideLinkPopup);
            }
        },
        isChildOf = function(parentEl, el, container) {
            if (parentEl == el) {
                return true;
            }
            if (parentEl.contains) {
                return parentEl.contains(el);
            }
            if ( parentEl.compareDocumentPosition ) {
                return !!(parentEl.compareDocumentPosition(el) & 16);
            }
            var prEl = el.parentNode;
            while(prEl && prEl != container) {
                if (prEl == parentEl)
                    return true;
                prEl = prEl.parentNode;
            }
            return false;
        };

        this.init();
    };
    window.MdSliderToolbar = MdSliderToolbar;
})(jQuery, Drupal);
