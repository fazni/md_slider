/*------------------------------------------------------------------------
# MD Slider - March 18, 2013
# ------------------------------------------------------------------------
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/

(function($) {
    var MdSliderTimeline = function(panel) {
        var self = this;
        this.panel = panel;
        this.selectedItem = null;
        this.textItemTemplate = '<div class="md-item clearfix">'
            + '<div class="mdi-view"><a href="#" class="btn-viewlayer"></a></div>'
            + '<div class="mdi-name">'
            +       '<span class="mdit-text"></span>'
            +       '<span class="title">&nbsp;</span>'
            +       '<a href="#" class="btn-deletelayer"></a>'
            +       '<a href="#" class="btn-clonelayer"></a>'
            + '</div>'
            + '<div class="mdtl-times">'
            +    '<div class="mdi-frame"></div>'
            +  '</div>'
            +'</div>';
        this.imageItemTemplate = '<div class="md-item clearfix">'
            + '<div class="mdi-view"><a href="#" class="btn-viewlayer"></a></div>'
            + '<div class="mdi-name">'
            +       '<span class="mdit-image"></span>'
            +       '<span class="title">&nbsp;</span>'
            +       '<a href="#" class="btn-deletelayer"></a>'
            +       '<a href="#" class="btn-clonelayer"></a>'
            + '</div>'
            + '<div class="mdtl-times">'
            +    '<div class="mdi-frame"></div>'
            +  '</div>'
            +'</div>';
        this.videoItemTemplate = '<div class="md-item clearfix">'
            + '<div class="mdi-view"><a href="#" class="btn-viewlayer"></a></div>'
            + '<div class="mdi-name">'
            +       '<span class="mdit-video"></span>'
            +       '<span class="title">&nbsp;</span>'
            +       '<a href="#" class="btn-deletelayer"></a>'
            +       '<a href="#" class="btn-clonelayer"></a>'
            + '</div>'
            + '<div class="mdtl-times">'
            +    '<div class="mdi-frame"></div>'
            +  '</div>'
            +'</div>';
        this.maxStart = 0;
        this.rulewidth = 7;
        this.init = function() {

            self.rulewidth = $(".mdtl-ruler").width() / 200;
            $("#slideshow-time").css("left", 100 * self.rulewidth);
            $("#timeline-items").width(100 * self.rulewidth + 257);
            $("body").on("click", 'a.btn-viewlayer', function() {
                var timeline = $(this).parent().parent();
                var box = timeline.data("box");
                if(box != null) {
                    if ($(this).hasClass("btn-blank")) {
                        box.show();
                        box.attr("ishidden", "false");
                        timeline.removeClass("box-hide");
                        $(this).removeClass("btn-blank");
                    } else {
                        box.hide();
                        box.attr("ishidden", "true");
                        box.removeClass("ui-selected");
                        timeline.addClass("box-hide");
                        self.panel.triggerChangeSelectItem();
                        $(this).addClass("btn-blank");
                    }
                }
                return false;
            });
            $("body").on("click", 'a.btn-deletelayer', function() {
                var timeline = $(this).parent().parent();
                var box = timeline.data("box");
                if(box != null) {
                    timeline.remove();
                    box.remove();
                    self.panel.triggerChangeSelectItem();
                }
                return false;
            });
            $("body").on("click", 'a.btn-clonelayer', function() {
                var timeline = $(this).parent().parent();
                var box = timeline.data("box");
                if(box != null) {
                    self.panel.cloneBoxItem(box);
                }
                return false;
            });

            $("#timeline-items").sortable({
                handle: ".mdi-name",
                update: function(event, ui) {
                    self.triggerChangeOrderItem();
                },
                placeholder: "md-item"
            });
            $("#slideshow-time").draggable({
                axis: "x",
                grid: [self.rulewidth, 20],
                containment: "parent",
                drag: function(even, ui) {
                    if (ui.position.left <= self.maxStart + self.rulewidth)
                        return false;
                    return self.updateTimelineWidth();
                }
            });

        };
        this.updateTimelineWidth = function() {
            var width =  $("#slideshow-time").position().left;
            self.panel.setTimelineWidth(Math.round(width / self.rulewidth));
            $("#timeline-items").width(257 + width);
            $("#timeline-items .md-item").each(function() {
                var frame = $(this).find(".mdi-frame");
                var box = $(this).data("box");
                if(box != null && frame.position().left + frame.width() > width) {
                    frame.width(width - frame.position().left);
                    box.data("stoptime", width / self.rulewidth * 100);
                    self.panel.changeTimelineValue();
                }
            });
            return true;
        }

        this.addTimelineItem = function(type, box) {
            var item;
            if (type == "text") {
                item = $(this.textItemTemplate).clone();
            } else if (type == "image") {
                item = $(this.imageItemTemplate).clone();
            }  else {
                item = $(this.videoItemTemplate).clone();
            }
            var title = box.data("title");
            item.find("span.title").html(title);
            var starttime = box.data("starttime") ? box.data("starttime") : 0;
            var stoptime = box.data("stoptime") ? box.data("stoptime") : Math.round(($("#timeline-items").width() - 257) / self.rulewidth * 100);
            if(stoptime >  starttime) {
                item.find("div.mdi-frame").css({left: starttime * self.rulewidth / 100, width: (stoptime - starttime) * self.rulewidth / 100});
                if(box.data("starttime") == null || box.data("stoptime") == null) {
                    box.data("starttime", starttime);
                    box.data("stoptime", stoptime);
                    self.panel.changeTimelineValue();
                }
            }
            item.data("box", box);
            if(box.attr("ishidden") == "true") {
                item.addClass("box-hide");
                $("a.btn-viewlayer", item).addClass("btn-blank");
            }

            $("#timeline-items").prepend(item);
            $(item).find("div.mdi-frame").draggable({
                containment: "parent",
                grid: [self.rulewidth, 20],
                stop: function(event, ui) {
                    var item = $(this).parent().parent();
                    var box = item.data("box");
                    if (box != null) {
                        var position = $(ui.helper).position();
                        box.data("starttime", position.left / self.rulewidth * 100);
                        box.data("stoptime", (position.left + $(ui.helper).width()) / self.rulewidth * 100);
                        if (box.hasClass("ui-selected")) {
                            self.panel.triggerChangeSettingItem();
                        }
                    }
                    self.changeMaxStart();
                }
            });

            $(item.find("div.mdi-frame")).resizable({
                handles: "e, w",
                containment: "parent",
                minWidth: 2 * self.rulewidth,
                grid: [self.rulewidth, 20],
                stop: function(event, ui) {
                    var item = $(this).parent().parent();
                    var box = item.data("box");
                    if (box != null) {
                        var position = $(ui.helper).position();
                        box.data("starttime", Math.round(position.left / self.rulewidth * 100));
                        box.data("stoptime", Math.round((position.left + $(ui.helper).width()) / self.rulewidth * 100));
                        if (box.hasClass("ui-selected")) {
                            self.panel.triggerChangeSettingItem();
                        }
                    }
                    self.changeMaxStart();
                }
            });
            $(item).click(function() {
                if(!$(this).hasClass("active") && !$(this).hasClass("box-hide")) {
                    var box = $(this).data("box");
                    if (box != null) {
                        self.panel.changeSelectItem(box);
                    }
                }
            });
            box.data("timeline", item);
        }

        this.changeMaxStart = function() {
            var maxLeft = 0;
            $("#timeline-items .mdtl-times").each(function() {
                var thisLeft = $(this).find("div.mdi-frame").position().left;
                if (thisLeft > maxLeft) {
                    maxLeft = thisLeft;
                }
            });
            self.maxStart = maxLeft;
        }

        this.changeSelectItem = function(item) {
            this.selectedItem = item;
            self.triggerChangeSelectItem();
        }

        this.triggerChangeSelectItem = function() {
            $("#timeline-items > div.md-item.active").removeClass("active");
            if (this.selectedItem != null) {
                var item = this.selectedItem.data("timeline");
                if (item != null) {
                    $(item).addClass("active");
                }
            }
        }
        this.triggerChangeOrderItem = function() {
            $("#timeline-items .md-item").each(function(index) {
                var box = $(this).data("box");
                if (box != null) {
                    box.css("z-index", 1000 - index);
                }
            });
        }
        this.changeSelectedItemTitle = function() {
            if (this.selectedItem != null) {

                var item = this.selectedItem.data("timeline");
                if (item != null) {
                    var title = this.selectedItem.data("title");
                    $(item).find("span.title").html(title);
                }
            }
        }
        this.setTimelineWidth = function(timelinewidth) {
            if(timelinewidth) {
                $("#slideshow-time").css("left", timelinewidth * self.rulewidth);
                self.updateTimelineWidth();
            }

        }
        this.changeActivePanel = function() {
            $("#timeline-items").html("");
            var  timelinewidth = self.panel.getTimelineWidth()
            if(timelinewidth != null) {
                self.setTimelineWidth(timelinewidth);
            }
            else
                self.panel.setTimelineWidth($("#slideshow-time").position().left / self.rulewidth)
            var items = self.panel.getAllItemBox();

            items.sort(function(a, b){
                var aZindex = parseInt($(a).css("z-index"));
                var bZindex = parseInt($(b).css("z-index"));
                return ((aZindex < bZindex) ? -1 : ((aZindex > bZindex) ? 1 : 0));
            });
            items.each(function() {
                self.addTimelineItem($(this).data("type"), $(this));
            });
        }

        this.init();
    };
    window.MdSliderTimeline = MdSliderTimeline;
})(jQuery);
