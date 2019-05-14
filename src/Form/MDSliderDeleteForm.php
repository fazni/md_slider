<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderDeleteForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\md_slider\MDSlider;
use Drupal\md_slider\MDSliderDataBase;

class MDSliderDeleteForm extends ConfirmFormBase {
  /**
   * Machine Name Slider
   * @var string
   */
  protected $slider;

  /**
   * Class MDSlider
   * @var class
   */
  protected $md_slider = NULL;

  /**
   * {@inheritdoc}
   */
  public function getDescription() {
    return $this->t('This action cannot be undone.');
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Delete');
  }



  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    // TODO: Implement getQuestion() method.
    return t('Do you want to delete slider %id?', array('%id' => $this->slider));
  }

  /**
   * {@inheritdoc}
   */
  public function getCancelUrl() {
    // TODO: Implement getCancelUrl() method.
    return new Url('md_slider.admin');
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    // TODO: Implement getFormId() method.
    return 'md_slider_delete';
  }

  /**
   * {@inheritdoc}
   *
   * @param int $id
   *   (optional) The ID of the item to be deleted.
   */
  public function buildForm(array $form, FormStateInterface $form_state, $slider = '') {
    $this->slider = $slider;
    $md_slider = new MDSlider();
    if ($md_slider->isSlider($slider)) {
      $md_slider->machine_name = $slider;
      $this->md_slider = $md_slider;
      return parent::buildForm($form, $form_state);
    }
    else{
      $form['joke'] = array(
        '#markup' => '<h3>'. $this->t('Are you kidding me?') .'</h3>'
      );
      return $form;
    }
  }


  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    if ($this->md_slider) {
      $this->md_slider->getDataSlider($this->md_slider->machine_name);
      $response = $this->md_slider->deleteDataSlider($this->md_slider->slid);
      if ($response)
        drupal_set_message($this->t('Slider %slider has been deleted.', array('%slider' => $this->md_slider->title)));
      $form_state->setRedirect('md_slider.admin');
    }
  }
}