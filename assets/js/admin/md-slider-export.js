/**
 * @file
 * @author Duynv
 * Date: 4/9/13
 */
(function($) {
    Drupal.behaviors.export_import_cuteslider = {
        attach: function(context, settings) {
            $('input[name=export-button]', context).click(function() {
                var selected = new Array();
                $('#edit-sliders input:checked', context).each(function() {
                    selected.push($(this).val());
                });

                if (selected.length == 0) {
                    alert('You must choose sliders to export.');
                }
                else {
                    $.post(settings.basePath + settings.pathPrefix + '?q=admin/structure/md-slider/export-data', {slids: selected.join(',')}, function(response) {
                        $('#edit-export-data', context).val(response);
                    });
                }
            });
        }
    }
})(jQuery);
