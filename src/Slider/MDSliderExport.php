<?php

/**
 * @file
 * Contains \Drupal\md_slider\Slider\MDSliderExport.
 */

namespace Drupal\md_slider\Slider;

use Drupal\file\Entity\File;
use Drupal\md_slider\MDSliderDataBase;

class MDSliderExport {
  protected $zip;
  /**
   * List Image to export
   * @var array
   */
  public $images;

  /**
   * String serialize data sliders
   * @var string
   */
  public $slider_data;

  public function __construct() {
    $this->zip = new MDSliderZip();
  }

  /**
   * MDSliderExport constructor.
   * @param $slider
   */
  public function getDataExport($images, $slider_data, $slider = NULL) {
    if ($slider) {
      $slider->settings = unserialize($slider->settings);
      $conditions = array(
        'slid' => $slider->slid
      );
      $slides = MDSliderDataBase::loadAll('md_slides', $conditions);
      foreach ($slides as &$slide) {
        $slide->settings = unserialize($slide->settings);
        $slide->layers = unserialize($slide->layers);
        if ($slide->settings['background_image'] > 0) {
          $image = File::load($slide->settings['background_image']);
          if ($image) {
            $slide->settings['background_image'] = $image->getFilename();
            $images[$slide->settings['background_image']] = $image;
          }
          else {
            $slide->settings['background_image'] = -1;
          }
        }

        if ($slide->settings['custom_thumbnail'] > 0) {
          $image = File::load($slide->settings['custom_thumbnail']);
          if ($image) {
            $slide->settings['custom_thumbnail'] = $image->getFilename();
            $images[$slide->settings['custom_thumbnail']] = $image;
          }
          else {
            $slide->settings['custom_thumbnail'] = -1;
          }
        }
        foreach ($slide->layers as &$layer) {
          switch ($layer['type']) {
            case "video":
              if ($layer['fileid'] > 0) {
                $image = File::load($layer['fileid']);
                if ($image) {
                  $layer['fileid'] = $image->getFilename();
                  $images[$layer['fileid']] = $image;
                }
                else {
                  $layer['fileid'] = -1;
                  $layer['thumb'] = 'http://placehold.it/350x150';
                }
              }
              break;
            case "image":
              if ($layer['fileid'] > 0) {
                $image = File::load($layer['fileid']);
                if ($image) {
                  $layer['fileid'] = $image->getFilename();
                  $images[$layer['fileid']] = $image;
                }
                else {
                  unset($layer);
                }
              }
              break;
          }
        }
      }

      $slider_data[$slider->machine_name] = serialize(array("slider" => $slider, "slides" => $slides));
    }
    $this->slider_data = $slider_data;
    $this->images = $images;
  }


  /**
   * Export data and images slide to zip.
   */
  public function exportMDSlider() {
    $this->zip->addDirectory("images");
    foreach ($this->slider_data as $name => $data) {
      $this->zip->addFile($data, "md_slider_{$name}.bin");
    }
    foreach ($this->images as $image) {
      $this->zip->addFile(file_get_contents($image->getFileUri()), "images/{$image->getFilename()}");
    }

    // Return export data file
    $time = date('d_m_Y');
    $this->zip->sendZip("md_slider_export_{$time}.zip");
  }

}