<?php

/**
 * @file
 * Contains \Drupal\md_slider\Plugin\Derivative\MDSliderBlock.
 */

namespace Drupal\md_slider\Plugin\Derivative;

use Drupal\Component\Plugin\Derivative\DeriverBase;
use Drupal\md_slider\MDSliderDataBase;

/**
 * Provides blocks which belong to MD Slider.
 */
class MDSliderBlock extends DeriverBase {

  /**
   * {@inheritdoc}
   */
  public function getDerivativeDefinitions($base_plugin_definition) {
    $sliders = MDSliderDataBase::loadAll('md_sliders');
    foreach ($sliders as $index => $slide) {
      $name = $slide->machine_name;
      $this->derivatives[$name] = $base_plugin_definition;
      $this->derivatives[$name]['admin_label'] = $slide->title;
    }
    return $this->derivatives;
  }
}
