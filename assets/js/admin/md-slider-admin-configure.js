/*------------------------------------------------------------------------
# MD Slider - March 18, 2013
# ------------------------------------------------------------------------
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/

(function($) {
    $(function() {
        $("#edit-full-width").change(function() {
            if ($(this).is(":checked")) {
                $(".form-item-width label").text("Effect zone width");
            }
            else {
                $(".form-item-width label").text("Width");
            }
        }).trigger("change");

        fakeselect('#edit-thumbnail-position', 'tp', 4);
        fakeselect('#edit-border-style', 'bs', 10);
        fakeselect('#edit-dropshadow-style', 'ds', 6);

        function fakeselect($select, $block, $optionnumber){
            var $block_html = '<div class="'+$block+'wrap clearfix">';
            var $tmpval = 0;
            for ($i = 0; $i <= $optionnumber; $i++) {
                $tmpval = $($select + " option:eq("+$i+")").val();
                if ($tmpval) {
                    $block_html += '<div id="'+$block+$tmpval+'" class="slitem"></div>';
                }
            }
            $block_html += '</div>';

            $($select).parent().append($block_html);

            var $tmpselect = $($select + " option[selected]").val();
            $('#' + $block+$tmpselect).addClass('selected');

            $('.'+$block+'wrap .slitem').each(function() {
                $(this).click(function(){
                    $('.'+$block+'wrap .selected').removeClass('selected');
                    $(this).addClass('selected');
                    $($select + " option[selected]").removeAttr("selected");
                    tmpindex = $(this).attr('id').replace($block, "")
                    $($select + " option[value="+tmpindex+"]").attr("selected", "selected");
                });
            });
            $($select).hide();
        }
    });
})(jQuery);
