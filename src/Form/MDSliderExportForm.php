<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderExportForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\md_slider\MDSliderDataBase;
use Drupal\md_slider\Slider\MDSliderExport;

class MDSliderExportForm extends FormBase {

  /**
   * List object Slider exited
   * @var array
   */
  protected $sliders;

  /**
   * load and set value sliders
   *
   * MDSliderExportForm constructor.
   */
  public function __construct() {
    $this->sliders = MDSliderDataBase::loadAll('md_sliders');
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'md_slider_export';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    // TODO: Implement buildForm() method.
    $sliders = $this->sliders;
    $options = array();
    foreach ($sliders as $index => $slider) {
      $options[$slider->machine_name] = $slider->title;
    }
    $form['sliders'] = array(
      '#type' => 'checkboxes',
      '#options' => $options,
      '#title' => $this->t('Choose Sliders you want export'),
    );
    $form['export'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Export'),
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $exports = $form_state->getValue('sliders');
    $sliders = $this->sliders;
    $images = array();
    $slider_data = array();
    $slider_export = new MDSliderExport($images, $slider_data);
    foreach ($sliders as $index => $slider) {
      if ($exports[$slider->machine_name] !== 0) {
        $slider_export->getDataExport($slider_export->images, $slider_export->slider_data, $slider);
      }
    }
    $slider_export->exportMDSlider();
  }
}
