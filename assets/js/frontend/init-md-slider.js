(function ($, Drupal, drupalSettings) {
    "use strict";
    /**
     * Attaches the JS test behavior to weight div.
     */
    Drupal.behaviors.iniMDSlider = {
        attach: function(context, settings) {
            var effectsIn = drupalSettings.inEffects,
                effectsOut = drupalSettings.outEffects;
            $(window).on('load', function(){
                window.listMegaSlide = [];
                var i = 0,
                    cssInline = '';
                $.each(drupalSettings.md_slider, function(slid, slider) {
                    listMegaSlide[i] = $('#md-slider-' + slid  + '-block').mdSlider(slider);
                    if(slider.device_enable){
                        cssInline += '@media (max-width: ' + slider.device_width + 'px) {\
                            #md-slider-' + slid + '-block .md-objects {\
                              display: none;\
                            }\
                          } ';
                    }
                    
                    if(slider.device_width){
                        cssInline += '@media (max-width: ' + slider.device_width + 'px) {\
                                .hideonmobile {\
                                  display: none !important;\
                                }\
                              }';
                    }
                    
                    i++;
                });
                //$('head').append(`<style>${cssInline}</style>`);
                $('head').append('<style>' +cssInline + '</style>');
            });
        }
    };
})(jQuery, Drupal, drupalSettings);
