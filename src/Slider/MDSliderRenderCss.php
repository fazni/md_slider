<?php
/**
 * @file
 * Contains \Drupal\md_slider\Slider\MDSliderRenderCss.
 */

namespace Drupal\md_slider\Slider;

class MDSliderRenderCss{

  /**
   * Store array value css
   * @var array;
   */
  protected $css;

  /**
   * MDSliderRenderCss constructor.
   * @param $layer
   */
  public function __construct($layer){
    $output = array();
    if (isset($layer->backgroundcolor)) {
      if (isset($layer->backgroundtransparent)) {
        $rgb = $this->hexToRgb($layer->backgroundcolor);
        $alpha = $layer->backgroundtransparent / 100;
        $output[] = "background: rgb({$rgb[0]}, {$rgb[1]}, {$rgb[2]});background: rgba({$rgb[0]}, {$rgb[1]}, {$rgb[2]}, {$alpha});\n";
      } else {
        if (is_string($layer->backgroundcolor)) {
          $output[] = "background: {$layer->backgroundcolor};\n";
        } else {
          $output[] = "background: #000;\n";
        }
      }
    }

    // Generate css for z-index of layers
    if (!isset($layer->link) || !is_array($layer->link))
      $output[] = "z-index: {$layer->zindex} !important;";

    # Process style for layer border
    if (isset($layer->borderposition) && isset($layer->borderwidth) && $layer->borderposition > 0 && $layer->borderwidth > 0) {
      $color = (isset($layer->bordercolor)) ? $layer->bordercolor : "#000";
      $border_style = (isset($layer->borderstyle)) ? $layer->borderstyle : "solid";

      # Process border layer position
      $positions = $this->processLayerBorderPosition($layer->borderposition);
      if (count($positions) == 4) {
        $output[] = "border: {$layer->borderwidth}px {$border_style} {$color};\n";
      } else {
        foreach ($positions as $position) {
          $output[] = "border-{$position}: {$layer->borderwidth}px {$border_style} {$color};\n";
        }
      }
    }

    if (isset($layer->bordertopleftradius) && $layer->bordertopleftradius > 0) {
      $output[] = "-webkit-border-top-left-radius: {$layer->bordertopleftradius}px; -moz-border-radius-topleft: {$layer->bordertopleftradius}px; border-top-left-radius: {$layer->bordertopleftradius}px;\n";
    }

    if (isset($layer->bordertoprightradius) && $layer->bordertoprightradius > 0) {
      $output[] = "-webkit-border-top-right-radius: {$layer->bordertoprightradius}px; -moz-border-radius-topright: {$layer->bordertoprightradius}px; border-top-right-radius: {$layer->bordertoprightradius}px;\n";
    }

    if (isset($layer->borderbottomleftradius) && $layer->borderbottomleftradius > 0) {
      $output[] = "-webkit-border-bottom-left-radius: {$layer->borderbottomleftradius}px; -moz-border-radius-bottomleft: {$layer->borderbottomleftradius}px; border-bottom-left-radius: {$layer->borderbottomleftradius}px;\n";
    }

    if (isset($layer->borderbottomrightradius) && $layer->borderbottomrightradius > 0) {
      $output[] = "-webkit-border-bottom-right-radius: {$layer->borderbottomrightradius}px; -moz-border-radius-bottomright: {$layer->borderbottomrightradius}px; border-bottom-right-radius: {$layer->borderbottomrightradius}px;\n";
    }

    // Process for padding settings
    if (isset($layer->paddingtop) && $layer->paddingtop > 0)
      $output[] = "padding-top: {$layer->paddingtop}px;\n";

    if (isset($layer->paddingright) && $layer->paddingright > 0)
      $output[] = "padding-right: {$layer->paddingright}px;\n";

    if (isset($layer->paddingbottom) && $layer->paddingbottom > 0)
      $output[] = "padding-bottom: {$layer->paddingbottom}px;\n";

    if (isset($layer->paddingleft) && $layer->paddingleft > 0)
      $output[] = "padding-left: {$layer->paddingleft}px;\n";

    # Process styles for text layer
    if ($layer->type == 'text') {
      if (isset($layer->color) && $layer->color != '') {
        if ($layer->color == '0')
          $output[] = "color: #000 !important;\n";
        else
          $output[] = "color: {$layer->color} !important;\n";
      }

      if (isset($layer->textalign) && $layer->textalign != '') {
        $output[] = "text-align: {$layer->textalign};\n";
      }

      if (isset($layer->fontsize) && is_numeric($layer->fontsize)) {
        $font_size = $layer->fontsize / 12;
        $output[] = "font-size: {$font_size}em;\n";
      }

      if (isset($layer->fontweight) && $layer->fontweight != '') {
        if (is_numeric($layer->fontweight) === FALSE) {
          $font_w = substr($layer->fontweight, 0, 3);
          $font_s = substr($layer->fontweight, 3);
          if($font_s === 'i')
            $font_s = 'italic';
          $output[] = "font-weight: {$font_w};\n";
          $output[] = "font-style: {$font_s};\n";
        } else
          $output[] = "font-weight: {$layer->fontweight};\n";
      }

      if (isset($layer->fontfamily) && $layer->fontfamily != '') {
        $output[] = "font-family: \"{$layer->fontfamily}\";\n";
      }

      if (isset($layer->textdecoration) && $layer->textdecoration != '') {
        $output[] = "text-decoration: {$layer->textdecoration};\n";
      }

      if (isset($layer->texttransform) && $layer->texttransform != '') {
        $output[] = "text-transform: {$layer->texttransform};\n";
      }
    }

    if (count($output))
      $this->css = " {\n" . implode(' ', $output) . "}";
    else
      $this->css = "";
  }

  /**
   * MDSliderRenderCss constructor.
   * Return array css value
   * @param $index
   * @param $css
   * @param $layer
   * @internal param object $
   */
  public function getCSS($index = array(), $layer) {
    $classes = array();
    $css = $this->css;
    if ($css != "") {
      if (isset($layer['link']) && is_array($layer['link'])) {
        $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]}{font-size: inherit; }";
        $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]} a" . $css;
      }
      else {
        $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]}" . $css;
      }
    }

    // Generate css for hover link
    if (isset($layer['link']) && is_array($layer['link'])) {
      $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]} {z-index: {$layer["zindex"]}!important;}";
      $css = $this->generateLayerLinkCss($layer['link']);
      if ($css != '') {
        if ($layer['type'] != "text") {
          $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]} a:hover img" . $css;
        }
        else {
          $classes[] = ".md-objects .md-object.md-layer-{$index[0]}-{$index[1]}-{$index[2]} a:hover" . $css;
        }
      }
    }

    return $classes;
  }
  /**
   * Convert $border value
   * @param $border
   * @return array
   */
  public function processLayerBorderPosition($border) {
    $border_pos = array();

    if ($border & 1)
      $border_pos[] = "top";

    if ($border & 2)
      $border_pos[] = "right";

    if ($border & 4)
      $border_pos[] = "bottom";

    if ($border & 8)
      $border_pos[] = "left";

    return $border_pos;
  }


  /**
   * Convert $color from hex to rgb
   * @param $color
   * @return array
   */
  public static function hexToRgb($color) {
    $color = str_replace("#", "", $color);

    if (strlen($color) == 3) {
      $r = hexdec(substr($color, 0, 1) . substr($color, 0, 1));
      $g = hexdec(substr($color, 1, 1) . substr($color, 1, 1));
      $b = hexdec(substr($color, 2, 1) . substr($color, 2, 1));
    } else {
      $r = hexdec(substr($color, 0, 2));
      $g = hexdec(substr($color, 2, 2));
      $b = hexdec(substr($color, 4, 2));
    }

    return array($r, $g, $b);
  }

  /**
   *  Return string css from array setting link
   * @param $link
   * @var array
   * @return string
   */
  public function generateLayerLinkCss($link) {
    $output = array();

    if ($link['color'] != '') {
      if ($link['color'] == '0')
        $output[] = "color: #000 !important;\n";
      else
        $output[] = "color: {$link['color']} !important;\n";
    }

    if ($link['background'] != '') {
      if ($link['background'] == '0')
        $output[] = "background-color: #000;\n";
      else
        $output[] = "background-color: {$link['background']};\n";
    }

    if ($link['transparent'] != '' && is_numeric($link['transparent'])) {
      $opacity = $link['transparent'] / 100;
      $output[] = "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity={$link['transparent']})'; filter: alpha(opacity={$link['transparent']}); opacity: {$opacity};";
    }

    if ($link['border'] != '') {
      if ($link['border'] == '0')
        $output[] = "border-color: #000;\n";
      else
        $output[] = "border-color: {$link['border']};\n";
    }

    if (count($output))
      return "{\n" . implode('', $output) . "}";
    else
      return "";
  }

  /**
   * @param $slider_name
   * @param $style
   */
  public static function saveFileCss($slider_name, $style) {
    $css = implode("\r\n", $style);
    $destination_dir = 'public://md-slider-css';
    file_prepare_directory($destination_dir, FILE_CREATE_DIRECTORY);
    file_unmanaged_save_data($css, $destination_dir . "/md-slider-{$slider_name}-layers.css", FILE_EXISTS_REPLACE);
  }
}

