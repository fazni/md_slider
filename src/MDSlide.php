<?php

/**
 * @file
 * Contains \Drupal\md_slider\MDSlide.
 */

namespace Drupal\md_slider;

class MDSlide implements MDSliderInterface {
  public $sid;
  public $slid;
  public $position;
  public $settings;
  public $layers;

  public  function __construct() {
    $this->settings = $this->setSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function getDataSlider($slid) {
    // TODO: Implement getDataSlider() method.
  }

  /**
   * {@inheritdoc}
   */
  public function saveDataSlider($slid = NULL) {
    // TODO: Implement saveDataSlider() method.
    $setttings = serialize($this->settings);
    
    //check error link
    foreach($this->layers as &$layer){
      if(isset($layer['link']) && is_string($layer['link']))
        $layer['link'] = null;
    }

    $fields = array(
      'slid' => $this->slid,
      'name' => 'Slide name',
      'position' => $this->position,
      'settings' => $setttings,
      'layers' => serialize($this->layers),
    );
    if ($slid == NULL) {
      $response = MDSliderDataBase::insert('md_slides', $fields);
    }
    else {
      $fields['sid'] = $slid;
      $condition = array(
        'sid' => $slid
      );
      $response = MDSliderDataBase::update('md_slides', $fields,  $condition);
    }

    return $response;
  }

  public function cloneDataSlider($slid) {


  }

  /**
   * {@inheritdoc}
   */
  public function deleteDataSlider($slid) {

  }

  /**
   * {@inheritdoc}
   */
  public function setSettings() {

    $default_settings = array(
      'background_image' => -1,
      'background_color' => "",
      'background_overlay' => "",
      'timelinewidth' => 80,
      'custom_thumbnail' => -1,
      'disabled' => 0,
      "transitions" => array(),
    );

    return $default_settings;
  }
}