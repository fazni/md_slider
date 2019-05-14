/**
 * @file
 * AJAX commands used by Editor module.
 */

(function ($, Drupal) {

    'use strict';
    
    /**
    * Global container for helper methods.
    */
   var imceFileField = window.imceFileField = {};

    Drupal.AjaxCommands.prototype.imageDialogSave = function (ajax, response, status) {
        var values = response.values;
        if (values.form_type == 'background') {
            $("#slide-backgroundimage").val(values.fid[0]);
            $('#custom-bg-alt').val(values.attributes.alt);
            $('#slide-background-preview').find('img').attr('src', values.attributes.src);
            $('#slide-background-preview').show();
        }

        if (values.form_type == 'thumbnail') {
            $("#slide-thumbnail").val(values.fid[0]);
            $('#custom-thumb-alt').val(values.attributes.alt);
            $('#slide-thumbnail-preview').find('img').attr('src', values.attributes.src);
            $('#slide-thumbnail-preview').show();
        }
        if (values.form_type == 'image') {
            $("textarea.mdt-imgalt", "#md-toolbar").val(values.attributes.alt);
            $("img.mdt-imgsrc", "#md-toolbar").attr("src", values.attributes.src);
            $("input.mdt-image-fileid", "#md-toolbar").val(values.fid[0]);
            $('.mdt-type-image').trigger('change');
        }
        if (values.form_type == 'videothumb') {
            $("#videothumb").attr("src", values.attributes.src);
        }
    };

    Drupal.imageAjaxDialog = function(values) {
        var classes = [],
            dialogSettings = {};
        classes.push('ui-dialog--narrow');
        dialogSettings.dialogClass = classes.join(' ');
        dialogSettings.autoResize = window.matchMedia('(min-width: 600px)').matches;
        dialogSettings.width = 'auto';
        var imageAjaxDialog = Drupal.ajax({
            dialog: dialogSettings,
            dialogType: 'modal',
            selector: '#dlg-video',
            url: Drupal.url('md-slider/image'),
            progress: {type: 'throbber'},
            submit: {
                image_object: values
            }
        });
        imageAjaxDialog.execute();
    },

    Drupal.behaviors.MDSliderImage = {
        attach: function (context, settings) {

            $('.choose-image', context).click(function(){
                var values = {};
                values.type = 'background';
                values.fid = $(this).next('#slide-backgroundimage').val();
                values.src = $(this).find('#slide-background-preview').find('img').attr('src');
                values.alt = $(this).find('#custom-bg-alt').val();
                Drupal.imageAjaxDialog(values);
            });

            $('.choose-thumbnail', context).click(function() {
                var values = {};
                values.type = 'thumbnail';
                values.fid = $('#slide-thumbnail', context).val();
                values.src = $('#slide-thumbnail-preview', context).find('img').attr('src');
                values.alt = $('#custom-thumb-alt', context).val();

                Drupal.imageAjaxDialog(values);
            });

            $('body').on('click', '.panel-change-videothumb', function(event){
                event.preventDefault();
                var values = {};
                values.type = 'videothumb';
                values.fid = -1;
                Drupal.imageAjaxDialog(values);
            });

            $("#change-image").click(function() {
                var values = {};
                values.type = 'image';
                values.fid = -1;
                Drupal.imageAjaxDialog(values);
            });
            
            $('.js-open-browser').click(function(e){
                var url = 'imce/public?sendto=imceFileField.sendto&fieldId=edit-fid',
                    id = $('[data-drupal-selector="edit-fid-upload"]').attr('id');
                //url += id;
                var baseUrl = drupalSettings.path.baseUrl;
                url = baseUrl + url;
                window.open(url, '', 'width=760,height=560,resizable=1');
                e.preventDefault();
            });
        },
     };
     
     /**
    * Handler for imce sendto operation.
    */
   imceFileField.sendto = function (File, win) {
     var imce = win.imce;
     var items = imce.getSelection();
     var fieldId = imce.getQuery('fieldId');
     var exts = "gif,png,jpg,jpeg"; //imceFileField.getFieldExts(fieldId);
     console.log(exts);
     // Check extensions
     if (exts && !imce.validateExtensions(items, exts)) {
       return;
     }
     // Submit form with selected item paths
     imceFileField.submit(fieldId, imce.getItemPaths(items));
     win.close();
   };
   
   /**
   * Returns allowed extensions for a field.
   */
  imceFileField.getFieldExts = function (fieldId) {
    var settings = drupalSettings.file;
    var elements = settings && settings.elements;
    return elements ? elements['#' + fieldId] : false;
  };

  /**
   * Submits a field widget with selected file paths.
   */
  imceFileField.submit = function (fieldId, paths) {
    $.post(drupalSettings.url_get_file, {path: paths}, function(data){
        if(data){
            data = JSON.parse(data);
            $('[data-drupal-selector="' + fieldId + '-fids"]').val(data.fid).closest('form').find('.js-form-submit').trigger('click');
        }
    });  
    //$('[data-drupal-selector="' + fieldId + '-fids"]').val(paths.join(':'));
    //$('[data-drupal-selector="' + fieldId + '-upload-button"]').mousedown();
  };

})(jQuery, Drupal);
