<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderConfigForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Form\FormBase;
use Drupal\md_slider\MDSlider;
use Drupal\Core\Form\FormStateInterface;
use Drupal\md_slider\MDSliderDataBase;
use Drupal\image\Entity\ImageStyle;

class MDSliderConfigForm extends FormBase {

  protected $slider;

  protected $image_style;


  public function __construct() {
    $image_style = ImageStyle::loadMultiple();
    $options = array(
      'none' => $this->t('None')
    );
    foreach ($image_style as $name => $style) {
      $options[$name] = $this->t($style->label());
    }
    $this->image_style = $options;
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'md_slider_config';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, MDSlider $slider = NULL) {
    if ($slider == NULL)
      $slider = new MDSlider();
    $this->slider = $slider;
    $settings = $slider->settings;

    $form['#attached']['library'][] = 'md_slider/md_slider.configure';

    $form['label'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Label'),
      '#maxlength' => 255,
      '#default_value' => $slider->title,
      '#description' => $this->t("Label for the Mega Slider."),
      '#required' => TRUE,
      '#disabled' => !empty($slider->machine_name),
    );
    $form['id'] = array(
      '#type' => 'machine_name',
      '#default_value' => $slider->machine_name,
      '#machine_name' => array(
        'exists' => '\Drupal\md_slider\MdSlider::isSlider',
      ),
      '#disabled' => !empty($slider->machine_name),
    );
    $form['is_new'] = array(
      '#type' => 'hidden',
      '#value' => empty($slider->machine_name)
    );
    $form['sls_desc'] = array(
      '#type' => 'textarea',
      '#title' => t('Description'),
      '#default_value' => ($slider) ? $slider->description : '',
      '#resizable' => FALSE,
      '#cols' => '10',
      '#description' => t('The description about this slider.'),
    );

    $form['full_width'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Full width'),
      '#default_value' => isset($settings['full_width']) ? $settings['full_width'] : 0,
    );
    $form['create_bg_imgstyle'] = array(
      '#type' => 'checkbox',
      '#title' => t('Create image style for slide background'),
      '#default_value' => isset($settings['create_bg_imgstyle']) ? $settings['create_bg_imgstyle'] : 0,
    );

    $form['bg_style'] = array(
      '#type' => 'select',
      '#options' => $this->image_style,
      '#states' => array(
        'visible' => array(
          ':input[name="create_bg_imgstyle"]' => array('checked' => TRUE),
        ),
      ),
      '#title' => $this->t('Choose style for background image'),
      '#default_value' => isset($settings['bg_style']) ? $settings['bg_style'] : 'none',
    );


    $form['width'] = array(
      '#type' => 'number',
      '#title' => $this->t('Width'),
      '#default_value' => isset($settings['width']) ? $settings['width'] : 960,
      '#field_suffix' => $this->t('px'),
      '#maxlength' => 255,
      '#size' => 6,
    );

    $form['height'] = array(
      '#type' => 'number',
      '#title' => $this->t('Height'),
      '#default_value' => isset($settings['height']) ? $settings['height'] : 600,
      '#field_suffix' => $this->t('px'),
      '#maxlength' => 255,
      '#size' => 6,
    );

    $form['touch_swipe'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable touch swipe'),
      '#default_value' => isset($settings['touch_swipe']) ? $settings['touch_swipe'] : 0,
    );

    $form['responsive'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable responsive'),
      '#default_value' => isset($settings['responsive']) ? $settings['responsive'] : 0,
    );

    $form['loop'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable loop'),
      '#default_value' => isset($settings['loop']) ? $settings['loop'] : 0,
    );

    $form['pause_hover'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Pause On Hover'),
      '#default_value' => isset($settings['pause_hover']) ? $settings['pause_hover'] : 0,
    );

    $form['videobox'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('View video on lightbox'),
      '#default_value' => isset($settings['videobox']) ? $settings['videobox'] : 0,
    );

    $form['loadingbar'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Loading bar'),
      '#default_value' => isset($settings['loadingbar']) ? $settings['loadingbar'] : 0,
    );

    $form['bar_position'] = array(
      '#type' => 'select',
      '#options' => array(
        'top' => $this->t('Top'),
        'bottom' => $this->t('Bottom'),
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="loadingbar"]' => array('checked' => TRUE),
        ),
      ),
      '#default_value' => isset($settings['bar_position']) ? $settings['bar_position'] : 'top',
      '#title' => $this->t('Loading bar'),
    );

    $form['show_next_prev_button'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Show next previous button'),
      '#default_value' => isset($settings['show_next_prev_button']) ? $settings['show_next_prev_button'] : 0,
    );
    $form['enable_key_navigation'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Enable key navigation'),
      '#default_value' => isset($settings['enable_key_navigation']) ? $settings['enable_key_navigation'] : 0,
    );

    $form['auto_play'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Auto play slides'),
      '#default_value' => isset($settings['auto_play']) ? $settings['auto_play'] : 0,
    );

    $form['show_bullet'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Show Bullet'),
      '#default_value' => isset($settings['show_bullet']) ? $settings['show_bullet'] : 0,
    );

    $form['bullet_position'] = array(
      '#type' => 'select',
      '#options' => array(
        '1' => $this->t('Bottom left'),
        '2' => $this->t('Bottom center'),
        '3' => $this->t('Bottom right'),
        '4' => $this->t('Top left'),
        '5' => $this->t('Top center'),
        '6' => $this->t('Top right'),
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="show_bullet"]' => array('checked' => TRUE),
        ),
      ),
      '#title' => $this->t('Bullet position'),
      '#default_value' => isset($settings['bullet_position']) ? $settings['bullet_position'] : 1,
    );

    $form['show_thumbnail'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Show thumbnail'),
      '#default_value' => isset($settings['show_thumbnail']) ? $settings['show_thumbnail'] : 0,
    );

    $form['thumbnail_position'] = array(
      '#type' => 'select',
      '#title' => t('Thumbnail position'),
      '#options' => array(
        '1' => t('Center 1'),
        '2' => t('Center 2'),
        '3' => t('Left'),
        '4' => t('Right'),
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="show_thumbnail"]' => array('checked' => TRUE),
          ':input[name="show_bullet"]' => array('checked' => FALSE),
        ),
      ),
      '#default_value' => isset($settings['thumbnail_position']) ? $settings['thumbnail_position'] : 1,
    );

    $form['thumb_style'] = array(
      '#type' => 'select',
      '#options' => $this->image_style,
      '#states' => array(
        'visible' => array(
          ':input[name="show_thumbnail"]' => array('checked' => TRUE),
        ),
      ),
      '#title' => $this->t('Choose style thumb image'),
      '#default_value' => isset($settings['thumb_style']) ? $settings['thumb_style'] : 'none',
    );

    $form['device_width'] = array(
      '#type' => 'number',
      '#title' => $this->t('Device Width'),
      '#description' => $this->t('When you add class hideonmobile for a layer on the slider, this layer will be hidden if the device width is <= the above value'),
      '#default_value' => isset($settings['device_width']) ? $settings['device_width'] : 460,
      '#field_suffix' => $this->t('px'),
      '#maxlength' => 255,
      '#size' => 6,
    );

    $form['device_enable'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Hide all object with device width'),
      '#description' => $this->t('All layers on slider will be hidden except background ifthe device width is <= "device width" value'),
      '#default_value' => isset($settings['device_enable']) ? $settings['device_enable'] : 0
    );

    $form['border_style'] = array(
      '#type' => 'select',
      '#options' => array(
        '0' => $this->t('None'),
        '1' => $this->t('Style 1'),
        '2' => $this->t('Style 2'),
        '3' => $this->t('Style 3'),
        '4' => $this->t('Style 4'),
        '5' => $this->t('Style 5'),
        '6' => $this->t('Style 6'),
        '7' => $this->t('Style 7'),
        '8' => $this->t('Style 8'),
        '9' => $this->t('Style 9'),
      ),
      '#title' => $this->t('Border style'),
      '#default_value' => isset($settings['border_style']) ? $settings['border_style'] : 0 ,
    );

    $form['delay'] = array(
      '#type' => 'number',
      '#title' => $this->t('Slide delay'),
      '#default_value' => isset($settings['delay']) ? $settings['delay'] : 8000,
      '#field_suffix' => $this->t('ms'),
      '#maxlength' => 255,
      '#size' => 10,
    );

    $form['transtime'] = array(
      '#type' => 'number',
      '#title' => $this->t('Slide\'s translation time'),
      '#default_value' => isset($settings['transtime']) ? $settings['transtime'] : 800,
      '#field_suffix' => $this->t('ms'),
      '#maxlength' => 255,
      '#size' => 10,
    );

    $form['sls_settings']['dmf_google'] = array(
      '#type' => 'textfield',
      '#maxlength' => 255,
      '#size' => 125,
      '#title' => t('@import'),
      '#description' => t("For example: &lt;link href='<strong>http://fonts.googleapis.com/css?family=Roboto+Condensed</strong>' rel='stylesheet' type='text/css'&gt"),
      '#default_value' => isset($settings['dmf_google']) ? $settings['dmf_google'] : '',
      '#prefix' => '<div id="customfont-wrap" class="form-subform"><h3>Google Web Fonts</h3>
      <ul class="steps">
      <li>Go to <a href="http://www.google.com/webfonts" target="_blank">www.google.com/webfonts</a>, choose your fonts and add to collection</li>
      <li>Click &quot;Use&quot; in the bottom bar after choose fonts</li>
      <li>Find &quot;Add this code to your website&quot;, copy from <strong>http://</strong> to the nearest <strong>\'</strong> and paste it below to activate.</li>
      </ul>',
    );

    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => !empty($slider->machine_name) ? $this->t('Update') : $this->t('Create'),
    );
    
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $is_new = $form_state->getValue('is_new');
    if ($is_new) {
      $machine_name = $form_state->getValue('id');
      $condition = array(
        'machine_name' => $machine_name
      );
      $slider = MDSliderDataBase::load('md_sliders', $condition);
      if ($slider) {
        $form_state->setErrorByName('id', $this->t('The machine-readable name is already in use. It must be unique.'));
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $slider = $this->slider;
    $settings = $slider->settings;
    $values = $form_state->getValues();
    foreach ($values as $setting => $value) {
      $settings[$setting] = $value;
    }
    $slider->settings = $settings;
    $slider->title = $form_state->getValue('label');
    $slider->machine_name = $form_state->getValue('id');
    $slider->description = $form_state->getValue('sls_desc');
    $is_new = $form_state->getValue('is_new');
    if ($is_new) {
      $response = $slider->saveDataSlider();
      if ($response) {
        $css_content = '';
        $destination_dir = 'public://md-slider-css';
        file_prepare_directory($destination_dir, FILE_CREATE_DIRECTORY);
        file_unmanaged_save_data($css_content, $destination_dir . "/md-slider-{$slider->machine_name}-layers.css", FILE_EXISTS_REPLACE);
        drupal_set_message($this->t('Slider %slider has been created.', array('%slider' => $slider->title)));
        \Drupal::service('library.discovery')->clearCachedDefinitions();
        $cache = \Drupal::cache('discovery');
        $cache->delete('block_plugins');

        $form_state->setRedirect('md_slider.admin.edit', array(
          'slider' => $slider->machine_name
        ));
      }
    }
    else {
      $response = $slider->saveDataSlider($slider->slid);
      \Drupal::service('library.discovery')->clearCachedDefinitions();
      if ($response) {
        //fix error cache
        \Drupal::service('router.builder')->rebuild();
        drupal_set_message($this->t('Slider %slider has been updated.', array('%slider' => $slider->title)));
      }
    }
  }
}