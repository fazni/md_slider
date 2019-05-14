<?php

/**
 * @file
 * Contains \Drupal\md_slider\MDSlider.
 */

namespace Drupal\md_slider;


class MDSlider implements MDSliderInterface {

  public $slid;
  public $title;
  public $description;
  public $machine_name;
  public $settings;

  public function __construct() {
    $this->settings = $this->setSettings();
  }


  /**
   * {@inheritdoc}
   */
  public function getDataSlider($slider) {
    $condition = array(
      'machine_name' => $slider
    );
    $slider = MDSliderDataBase::load('md_sliders', $condition);
    $this->slid = $slider['slid'];
    $this->title = $slider['title'];
    $this->description = $slider['description'];
    $this->machine_name = $slider['machine_name'];
    $this->settings = unserialize($slider['settings']);
  }

  public function cloneDataSlider($slider, $machine_name, $title) {
    $this->getDataSlider($slider);
    $this->machine_name = $machine_name;
    $this->title = $title;
    return $this->saveDataSlider();
  }

  /**
   * {@inheritdoc}
   */
  public function saveDataSlider($slid = NULL) {
    $setttings = serialize($this->settings);
    $fields = array(
      'title' => $this->title,
      'description' => $this->description,
      'machine_name' => $this->machine_name,
      'settings' => $setttings,
    );
    if ($slid == NULL) {
      $response = MDSliderDataBase::insert('md_sliders', $fields);
    }
    else {
      $fields['slid'] = $slid;
      $condition = array(
        'slid' => $slid
      );
      $response = MDSliderDataBase::update('md_sliders', $fields,  $condition);
    }

    return $response;
  }


  /**
   * {@inheritdoc}
   */
  public function deleteDataSlider($slid) {
    // TODO: Implement deleteDataSlider() method.
    $condition = array(
      'slid' => $slid
    );
    MDSliderDataBase::delete('md_slides', $condition);
    $response = MDSliderDataBase::delete('md_sliders', $condition);
    return $response;
  }

  public static function isSlider($slider) {
    $condition = array(
      'machine_name' => $slider
    );
    $slider = MDSliderDataBase::load('md_sliders', $condition);

    return $slider ? TRUE : FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function setSettings() {
    $default_settings = array(
      'full_width' => 0,
      'width' => 960,
      'height' => 420,
      'touch_swipe' => 1,
      'responsive' => 1,
      'videobox' => 0,
      'loop' => 1,
      'loadingbar' => 'bar',
      'bar_position' => 'bottom',
      'show_next_prev_button' => 1,
      'enable_key_navigation'=> 0,
      'auto_play' => 1,
      'pause_hover' => 1,
      'show_bullet' => 1,
      'bullet_position' => 5,
      'show_thumbnail' => 1,
      'thumbnail_position' => 1,
      'border_style' => 0,
      'dropshadow_style' => 0,
      'animation' => 'fade',
      'delay' => 8000,
      'transtime' => 800,
      'thumb_style' => 'thumbnail',
      'create_bg_imgstyle' => 1,
      'bg_style' => 'none',
      'dmf_google' => '',
      "on_start" => "",
      "on_end" => "",
      'color_saved' => 'ff9900,CC0000',
    );

    return $default_settings;
  }

}