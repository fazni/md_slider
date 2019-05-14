<?php

/**
 * @file
 * Contains \Drupal\md_slider\Plugin\Block\MDSliderBlock.
 */

namespace Drupal\md_slider\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\md_slider\MDCommon;
use Drupal\md_slider\MDSliderDataBase;

/**
 * Provides blocks which belong to MD Slider.
 *
 *
 * @Block(
 *   id = "md_slider_block",
 *   admin_label = @Translation("MD Slider"),
 *   category = @Translation("MD Slider"),
 *   deriver = "Drupal\md_slider\Plugin\Derivative\MDSliderBlock",
 * )
 *
 */

class MDSliderBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $slider_name = $this->getDerivativeId();
    $entry = array(
      'machine_name' => $slider_name
    );
    $slider = MDSliderDataBase::load('md_sliders', $entry);
    if (!$slider) {
      return array(
        '#markup' => '<h3>' . $this->t('This Slider doesn\'t exit') . '</h3>'
      );
    }
    $settings = unserialize($slider['settings']);
    $settings['fullWidth'] = (boolean)$settings['full_width'];
    $settings['transitionsSpeed'] = intval($settings['transtime']);
    $settings['enableDrag'] = (boolean)$settings['touch_swipe'];
    $settings['responsive'] = (boolean)$settings['responsive'];
    $settings['pauseOnHover'] = (boolean)$settings['pause_hover'];
    $settings['autoPlay'] = (boolean)$settings['auto_play'];
    $settings['loop'] = isset($settings['loop']) ? (boolean)$settings['loop'] : $options['loop'] = TRUE;
    $settings['enableLoadingBar'] = ($settings['loadingbar'] != 'none') ? TRUE : FALSE;
    $settings['loadingBarPosition'] = $settings['bar_position'];
    $settings['enableNextPrevButton'] = (boolean)$settings['show_next_prev_button'];
    $settings['enableKeyNavigation'] = isset($settings['enable_key_navigation']) ? (boolean)$settings['enable_key_navigation'] : false;
    $settings['enableBullet'] = (boolean)$settings['show_bullet'];
    $settings['bulletPosition'] = $settings['bullet_position'];
    $settings['enableThumbnail'] = (boolean)$settings['show_thumbnail'];
    $settings['thumbnailPosition'] = $settings['thumbnail_position'];
    $settings['slideShowDelay'] = $settings['delay'];
    if (isset($settings['on_start']))
      $settings['OnTransitionStart'] = $settings['on_start'];
    if (isset($settings['on_end']))
      $settings['OnTransitionEnd'] = $settings['on_end'];
    if ($settings['border_style'] > 0) {
      $settings['borderStyle'] = $settings['border_style'];
      $settings['enableBorderStyle'] = TRUE;
    }
    $settings['styleShadow'] = $settings['dropshadow_style'];
    $options = array(
      'md_slider'  => array($slider['slid'] => $settings),
      'inEffects' => MDCommon::$in_effects,
      'outEffects' => MDCommon::$out_effects,
    );

    return array(
      '#theme' => 'md_slider',
      '#slider_name' => $this->getDerivativeId(),
      '#slid' => $slider['slid'],
      '#settings' => $settings,
      '#attached' => array(
        'drupalSettings' => $options,
        'library' => array('md_slider/md_slider.front')
      ),
      '#cache' => array(
        'max-age' => 0,
      ),
      '#contextual_links' => array(
        'md_slider_block' => array(
          'route_parameters' => array('slider' => $this->getDerivativeId()),
        ),
      ),
    );
  }
}