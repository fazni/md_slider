<?php

/**
 * @file
 * Contains \Drupal\md_slider\Slider\MDSliderImport.
 */

namespace Drupal\md_slider\Slider;

use Drupal\md_slider\MDSlide;
use Drupal\md_slider\MDSlider;

class MDSliderImport {
  /**
   * List array images from file import
   * @var array
   */
  public $images;

  /**
   * List array slider data from file import
   * @var array
   */
  public $slider_data;


  /**
   * Get Data from file import and save data to array
   * @param $file_path
   * @param $destination_dir
   */
  public function getDataImport($file_path, $destination_dir) {
    $zip = zip_open($file_path);
    while (($entry = zip_read($zip))) {
      $entry_name = zip_entry_name($entry);
      if ($entry_name == "images/")
        continue;

      // Process import images
      if (strpos($entry_name, "images/") !== FALSE) {
        $image_name = explode("/", $entry_name);
        $image_name = $image_name[1];

        // Get image content
        zip_entry_open($zip, $entry);
        $entry_content = zip_entry_read($entry, zip_entry_filesize($entry));
        $image = file_save_data($entry_content, "{$destination_dir}/{$image_name}", FILE_EXISTS_RENAME);
        if ($image !== FALSE)
          $images[$image_name] = $image;
        zip_entry_close($entry);
      }
      elseif (strpos($entry_name, "md_slider_") !== FALSE) {
        // Get slider data
        zip_entry_open($zip, $entry);
        $sliders[] = zip_entry_read($entry, zip_entry_filesize($entry));
        zip_entry_close($entry);
      }
    }
    zip_close($zip);

    $this->images = $images;
    $this->slider_data = $sliders;
  }

  /**
   * Import data form file import
   *
   */
  public function importDataSlider() {
    $sliders = $this->slider_data;
    $images = $this->images;
    $md_slider = new MDSlider();
    $md_slide = new MDSlide();

    foreach ($sliders as $slider_data) {
      // Get slider data
      $slider_data = unserialize($slider_data);
      $slider = $slider_data["slider"];
      $slides = $slider_data["slides"];

      // Save slider to database
      $slider->id = NULL;
      $md_slider->title = $slider->title;
      $md_slider->machine_name = $slider->machine_name;
      if ($md_slider::isSlider($slider->machine_name)){
        $md_slider->machine_name = "{$slider->machine_name}-".time();
        $md_slider->title = "{$slider->title}-".time();
      }
      $md_slider->description = $slider->description;
      $md_slider->settings = $slider->settings;
      $slid = $md_slider->saveDataSlider();
      $style = array();
      if (!$slid) {
        drupal_set_message(t("MD Slider: Import unsuccessful!"), "error");
        return;
      }

      // Save slides to database
      foreach ($slides as $slide) {
        $md_slide->sid = NULL;
        $md_slide->slid = $slid;

        // Get background and thumbnail settings after import
        if ($slide->settings['background_image'] != -1 && isset($images[$slide->settings['background_image']]))
          $slide->settings['background_image'] = $images[$slide->settings['background_image']]->id();
        else
          $slide->settings['background_image'] = -1;

        if ($slide->settings['custom_thumbnail'] != -1 && isset($images[$slide->settings['custom_thumbnail']]))
          $slide->settings['custom_thumbnail'] = $images[$slide->settings['custom_thumbnail']]->id();
        else
          $slide->settings['custom_thumbnail'] = -1;

        // Get file id of image and video item
        foreach ($slide->layers as &$layer) {
          switch ($layer["type"]) {
            case "video":
              if ($layer['fileid'] && isset($images[$layer['fileid']]))
                $layer['fileid'] = $images[$layer['fileid']]->id();
              break;

            case "image":
              if ($layer["fileid"] && isset($images[$layer["fileid"]]))
                $layer["fileid"] = $images[$layer["fileid"]]->id();
              break;
          }
        }
        $md_slide->position = $slide->position;
        $md_slide->settings = $slide->settings;
        $md_slide->layers = $slide->layers;
        $sid = $md_slide->saveDataSlider();
        foreach ($md_slide->layers as $key => &$layer) {
          $index = array($slid, $sid, $key);
          $css = new MDSliderRenderCss((object) $layer);
          $style = array_merge($style, $css->getCSS($index, $layer));
        }
      }
      MDSliderRenderCss::saveFileCss($md_slider->machine_name, $style);
    }
  }
}