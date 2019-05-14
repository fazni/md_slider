<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderCloneForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;
use Drupal\md_slider\MDSlide;
use Drupal\md_slider\MDSlider;
use Drupal\md_slider\MDSliderDataBase;
use Drupal\md_slider\Slider\MDSliderRenderCss;

class MDSliderCloneForm extends ConfirmFormBase {
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
    return $this->t('Clone Slide with machine name %id and %title.', array('%id' => $this->slider));
  }

  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return $this->t('Clone');
  }



  /**
   * {@inheritdoc}
   */
  public function getQuestion() {
    // TODO: Implement getQuestion() method.
    return t('Do you want to clone slider %id?', array('%id' => $this->slider));
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
    return 'md_slider_clone';
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
      $form['label'] = array(
        '#type' => 'textfield',
        '#title' => $this->t('Label'),
        '#maxlength' => 255,
        '#default_value' => '',
        '#description' => $this->t("Label for the Mega Slider."),
        '#required' => TRUE,
      );
      $form['id'] = array(
        '#type' => 'machine_name',
        '#default_value' => '',
        '#machine_name' => array(
          'exists' => '\Drupal\md_slider\MdSlider::isSlider',
        ),
        '#required' => TRUE
      );
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
    $machine_name = $form_state->getValue('id');
    $title = $form_state->getValue('label');
    if ($this->md_slider) {
      $md_slide = new MDSlide();
      $md_slider = $this->md_slider;
      $md_slider->getDataSlider($md_slider->machine_name);
      $slid = $md_slider->cloneDataSlider($md_slider->machine_name, $machine_name, $title);
      $style = array();
      if ($slid) {
        $conditions = array(
          'slid' => $this->md_slider->slid,
        );
        $slides = MDSliderDataBase::loadAll('md_slides', $conditions);
        foreach ($slides as $slide) {
          $md_slide->sid = NULL;
          $md_slide->slid = $slid;
          $md_slide->position = $slide->position;
          $md_slide->settings = unserialize($slide->settings);
          $md_slide->layers = unserialize($slide->layers);
          $sid = $md_slide->saveDataSlider();
          foreach ($md_slide->layers as $key => &$layer) {
            $index = array($slid, $sid, $key);
            $css = new MDSliderRenderCss((object) $layer);
            $style = array_merge($style, $css->getCSS($index, $layer));
          }
        }
        MDSliderRenderCss::saveFileCss($machine_name, $style);
        drupal_set_message($this->t('Clone successfully Slider %title', array('%title' => $title)));
        $form_state->setRedirect('md_slider.admin.edit', array('slider' => $machine_name));
      }
      else {
        drupal_set_message($this->t('Clone Failed Slider %title', array('%title' => $title)));
      }
    }
  }
}