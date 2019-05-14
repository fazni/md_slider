<?php

/**
 * @file
 * Contains \Drupal\md_slider\MDCommon.
 */

namespace Drupal\md_slider;

use Drupal;

class MDCommon {
  public static $in_effects = array(
    'bounceIn',
    'bounceInDown',
    'bounceInUp',
    'bounceInLeft',
    'bounceInRight',
    'fadeIn',
    'fadeInUp',
    'fadeInDown',
    'fadeInLeft',
    'fadeInRight',
    'fadeInUpBig',
    'fadeInDownBig',
    'fadeInLeftBig',
    'fadeInRightBig',
    'flipInX',
    'flipInY',
    'foolishIn', //-
    'lightSpeedIn',
    'puffIn', //-
    'rollIn',
    'rotateIn',
    'rotateInDownLeft',
    'rotateInDownRight',
    'rotateInUpLeft',
    'rotateInUpRight',
    'twisterInDown', //-
    'twisterInUp', //-
    'swap', //-
    'swashIn', //-
    'tinRightIn', //-
    'tinLeftIn', //-
    'tinUpIn', //-
    'tinDownIn', //-
    'vanishIn', //-,
    'shuffleLetter'
  );

  public static $out_effects = array(
    'bombRightOut', //-
    'bombLeftOut', //-
    'bounceOut',
    'bounceOutDown',
    'bounceOutUp',
    'bounceOutLeft',
    'bounceOutRight',
    'fadeOut',
    'fadeOutUp',
    'fadeOutDown',
    'fadeOutLeft',
    'fadeOutRight',
    'fadeOutUpBig',
    'fadeOutDownBig',
    'fadeOutLeftBig',
    'fadeOutRightBig',
    'flipOutX',
    'flipOutY',
    'foolishOut', //-
    'hinge',
    'holeOut', //-
    'lightSpeedOut',
    'puffOut', //-
    'rollOut',
    'rotateOut',
    'rotateOutDownLeft',
    'rotateOutDownRight',
    'rotateOutUpLeft',
    'rotateOutUpRight',
    'rotateDown', //-
    'rotateUp', //-
    'rotateLeft', //-
    'rotateRight', //-
    'swashOut', //-
    'tinRightOut', //-
    'tinLeftOut', //-
    'tinUpOut', //-
    'tinDownOut', //-
    'vanishOut' //-
  );

  public static $default_layers = array(
    'text' => array(
      'type' => 'text',
      'width' => 100,
      'height' => 20,
      'left' => 0,
      'top' => 0,
      'starttime' => 0,
      'stoptime' => 30,
      'startani' => 'none',
      'stopani' => 'none',
      'style' => 'style1',
      'zindex' => 1000,
      'title' => 'Text',
      'background' => '',
      'backgroundtransparent' => 100,
      'fontsize' => '',
      'fontstyle' => '',
      'textalign' => '',
      'color' => '',
      'transparent' => 100,
    ),
    'image' => array(
      'type' => 'image',
      'width' => 100,
      'height' => 20,
      'left' => 0,
      'top' => 0,
      'starttime' => 0,
      'stoptime' => 30,
      'startani' => 'none',
      'stopani' => 'none',
      'style' => 'style1',
      'zindex' => 1000,
      'title' => '',
      'fileid' => '',
      'background' => '',
      'backgroundtransparent' => 100,
      'transparent' => 100,
    ),
    'video' => array(
      'type' => 'video',
      'width' => 100,
      'height' => 20,
      'left' => 0,
      'top' => 0,
      'starttime' => 0,
      'stoptime' => 30,
      'startani' => 'none',
      'stopani' => 'none',
      'style' => 'style1',
      'zindex' => 1000,
      'title' => '',
      'fileid' => '',
      'background' => '',
      'backgroundtransparent' => 100,
      'transparent' => 100,
    ),
  );

  public function processVideoUrl($url) {
    $output = array();
    if (strpos($url, 'youtube') !== FALSE || strpos($url, 'youtu.be') !== FALSE) {
      $output['type'] = 'youtube';
      $output['id'] = MDCommon::getYoutubeID($url);
    }
    elseif (strpos($url, 'vimeo') !== FALSE) {
      $output['type'] = 'vimeo';
      $output['id'] = MDCommon::getVimeoID($url);
    }

    return $output;
  }

  public static function  getYoutubeID($url) {
    $pattern = '#^(?:https?://)?(?:www\.)?(?:youtu\.be/|youtube\.com(?:/embed/|/v/|/watch\?v=|/watch\?.+&v=))([\w-]{11})(?:.+)?$#x';
    preg_match($pattern, $url, $matches);
    return isset($matches[1]) ? $matches[1] : '';
  }

  public static function getVimeoID($url) {
    preg_match('/(?:vimeo\.com).*\/([0-9]*)/i', $url, $matches);
    return isset($matches[1]) ? $matches[1] : "";
  }

  public static function getVideoData($type, $fid) {
    switch ($type) {
      case 'youtube':
        $output['type'] = 'youtube';
        $output['fid'] = $fid;
        $url = "http://www.youtube.com/oembed?url=https://youtu.be/{$fid}&format=json";

        $response = Drupal::httpClient()->get($url);
        if ($response->getStatusCode() == '200') {
          $data = $response->getBody()->__toString();
          $output['data'] = json_decode($data);
        }
        break;

      case 'vimeo':
        $output['type'] = 'vimeo';
        $url = "http://vimeo.com/api/v2/video/{$fid}.php";
        $response = Drupal::httpClient()->get($url);
        if ($response->getStatusCode() == '200') {
          $info = $response->getBody()->__toString();
          $output['data'] = unserialize($info);
        }
        break;
    };

    return $output;
  }

  /**
   * Generate video embeded link
   */
  public static function getVideoUrl($video_id) {
    if (strlen($video_id) == 11) {
      # Youtube video
      return "https://www.youtube.com/embed/{$video_id}";
    } else {
      # Vimeo video
      return "https://player.vimeo.com/video/{$video_id}";
    }
  }

  public static function getGoogleWebFont($fonts) {
    preg_match('/([^\?]+)(\?family=)?([^&\']+)/i', $fonts, $matches);
    $gfonts = explode("|", $matches[3]);

    for ($i = 0; $i < count($gfonts); $i++) {
      $gfontsdetail = explode(":", $gfonts[$i]);
      $gfontname = str_replace("+", " ", $gfontsdetail['0']);
      $gfontweigth = "";
      if (array_key_exists('1', $gfontsdetail)) {
        $gfontweigth = $gfontsdetail['1'];
      }
      $fontvars[] = array(
        'CSS' => $gfontname,
        'Weight' => $gfontweigth,
      );
    }

    return $fontvars;
  }


}