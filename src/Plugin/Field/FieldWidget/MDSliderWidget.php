<?php

/**
 * @file
 * Contains \Drupal\md_slider\Plugin\field\widget\MDSliderWidget.
 */

namespace Drupal\md_slider\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\md_slider\MDSliderDataBase;

/**
 * Plugin implementation of the 'field_example_text' widget.
 *
 * @FieldWidget(
 *   id = "md_slider_widget",
 *   module = "field_example",
 *   label = @Translation("MD Slider"),
 *   field_types = {
 *     "field_md_slider"
 *   }
 * )
 */
class MDSliderWidget extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $value = isset($items[$delta]->value) ? $items[$delta]->value : '';
    $all_slider = MDSliderDataBase::loadAll('md_sliders');
    if (count($all_slider) == 0) {
      $element += [
        '#type' => 'markup',
        '#markup' => '<h5>'. t('No MegaSlider available. <a href="@link">Add MegaSlider</a>.', array('@link' => \Drupal::url('md_slider.admin.add'))) . '</h5>'
      ];
    }
    else {
      $options = [];
      $options['none'] = t('None');
      foreach ($all_slider as $index => $slider) {
        $options[$slider->machine_name] = $slider->title;
      }
      $element += array(
        '#type' => 'select',
        '#default_value' => $value,
        '#options' => $options,
      );
      
    }
    return array('value' => $element);
  }

}
