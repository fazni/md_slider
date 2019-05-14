<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderEditForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Form\FormBase;
use Drupal\md_slider\MDSlide;
use Drupal\md_slider\MDSlider;
use Drupal\Core\Form\FormStateInterface;
use Drupal\md_slider\Slider\MDSliderRenderCss;
use Drupal\md_slider\MDCommon;
use Drupal\Core\Url;

class MDSliderEditForm extends FormBase {

  protected $slider;

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'md_slider_edit';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, MDSlider $slider = NULL) {
    if ($slider->slid == NULL) {
      $form['slider_msg'] = array(
        '#markup' => '<h3>This slider not exist. Please try again!</h3>',
      );
    }
    else{
      $this->slider = $slider;
      $settings = $slider->settings;
      $form['#attached']['library'][] = 'md_slider/md_slider.admin';
      $form['#attached']['drupalSettings']['url_get_file'] = Url::fromRoute('md_slider.admin.getfile', [], ['absolute' => TRUE])->toString();
      $form['slider_main'] = array(
        '#theme' => 'slider_edit_form',
        '#slid' => $slider->slid,
        '#slider_name' => $slider->machine_name,
        '#settings' => $settings
      );

      $form['slider_data_save'] = array(
        '#type' => 'textarea',
        '#default_value' => '',
        '#resizable' => FALSE,
      );

      $form['slider_id'] = array(
        '#type' => 'hidden',
        '#default_value' => $slider->slid,
      );

      $form['color_saved'] = array(
        '#type' => 'hidden',
        '#default_value' => $settings['color_saved'],
      );

      $form['slider_save'] = array(
        '#type' => 'submit',
        '#value' => $this->t('Save'),
      );
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $slider = $this->slider;
    $values = $form_state->getValues('');
    $slides = Json::decode($values['slider_data_save']);
    $slider_id = $values['slider_id'];
    $md_slides = new MDSlide();
    $style = array();
    foreach ($slides as $index => $slide) {
      $settings = $md_slides->settings;
      $settings['background_image'] = isset($slide['itemsetting']['background_image']) ? $slide['itemsetting']['background_image'] : '';
      $settings['background_image_alt'] = isset($slide['itemsetting']['background_image_alt']) ? $slide['itemsetting']['background_image_alt'] : '';
      $settings['background_overlay'] = isset($slide['itemsetting']['background_overlay']) ? $slide['itemsetting']['background_overlay'] : '';
      $settings['timelinewidth'] = $slide['itemsetting']['timelinewidth'];
      $settings['custom_thumbnail'] = $slide['itemsetting']['custom_thumbnail'];
      $settings['custom_thumbnail_alt'] = isset($slide['itemsetting']['custom_thumbnail_alt']) ? $slide['itemsetting']['custom_thumbnail_alt'] : '';
      $settings['transitions'] = $slide['itemsetting']['transitions'];
      $settings['background_color'] = $slide['itemsetting']['background_color'];
      $settings['disabled'] = isset($slide['itemsetting']['disabled']) ? $slide['itemsetting']['disabled'] : 0;
      $sid = $slide['itemsetting']['slide_id'] != -1 ? $slide['itemsetting']['slide_id'] : NULL;

      $md_slides->slid = $slider_id;
      $md_slides->position = $index;
      $md_slides->settings = $settings;
      $md_slides->layers = $slide['boxitems'];
      $new_sid = $md_slides->saveDataSlider($sid);
      $sid = is_object($new_sid) ? $sid : $new_sid;
      foreach ($slide['boxitems'] as $key => &$layer) {
        $index = array($slider->slid, $sid, $key);
        $css = new MDSliderRenderCss((object) $layer);
        $style = array_merge($style, $css->getCSS($index, $layer));
      }
    }
    $file = MDSliderRenderCss::saveFileCss($slider->machine_name, $style);
    //fix error cache
    \Drupal::service('router.builder')->rebuild();
    drupal_set_message($this->t('Slider %slider has been updated.', array('%slider' => $slider->title)));
  }
}