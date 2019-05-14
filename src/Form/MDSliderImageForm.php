<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderImageForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\md_slider\Ajax\ImageDialogSave;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityStorageInterface;

/**
 * Provides an image dialog for text editors.
 */
class MDSliderImageForm extends FormBase {

  /**
   * The file storage service.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $fileStorage;

  /**
   * Constructs a form object for image dialog.
   *
   * @param \Drupal\Core\Entity\EntityStorageInterface $file_storage
   *   The file storage service.
   */
  public function __construct(EntityStorageInterface $file_storage) {
    $this->fileStorage = $file_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity.manager')->getStorage('file')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'md_slider_image_config';
  }

  /**
   * {@inheritdoc}
   *
   * @param \Drupal\filter\Entity\FilterFormat $filter_format
   *   The filter format for which this dialog corresponds.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $disabled = FALSE;
    if (isset($form_state->getUserInput()['image_object'])) {
      $image_element = $form_state->getUserInput()['image_object'];
      $fid = $image_element['fid'];
      $file = $this->fileStorage->load($fid);
//      if ($file)
//        $disabled = TRUE;
      $form_state->set('image_element', $image_element);
      $form_state->setCached(TRUE);
    }
    else {
      $image_element = $form_state->get('image_element') ?: [];
    }

    $form['#tree'] = TRUE;
    $form['#prefix'] = '<div id="md-slider-image-dialog-form">';
    $form['#suffix'] = '</div>';

    $form['form_type'] = array(
      '#type' => 'hidden',
      '#value' => $image_element['type']
    );
    $form['browser'] = array(
      '#type'=>'markup',
      '#markup'=>'<a href="#" class="js-open-browser">Open File Browser</a>'
    );
    
    $form['fid'] = array(
      '#title' => $this->t('Image'),
      '#type' => 'managed_file',
      '#upload_location' => 'public://md-slider-image',
      '#default_value' => (isset($fid) && $fid) ? array($fid) : NULL,
      '#upload_validators' => array(
        'file_validate_extensions' => array('gif png jpg jpeg'),
      ),
      '#disabled' => $disabled,
      '#required' => TRUE,
    );

    $alt = isset($image_element['alt']) ? $image_element['alt'] : '';
    if ($alt === '' && !empty($image_element['src'])) {
      $alt = '""';
    }
    $form['attributes']['alt'] = array(
      '#title' => $this->t('Alternative text'),
      '#placeholder' => $this->t('Short description for image'),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#required_error' => $this->t('Alternative text is required.'),
      '#default_value' => $alt,
      '#maxlength' => 2048,
    );

    $form['actions'] = array(
      '#type' => 'actions',
    );
    $form['actions']['save_modal'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Save'),
      '#submit' => array(),
      '#ajax' => array(
        'callback' => '::submitForm',
        'event' => 'click',
      ),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();

    $fid = $form_state->getValue(array('fid', 0));
    if (!empty($fid)) {
      $file = $this->fileStorage->load($fid);
      $file->setPermanent();
      $this->fileStorage->save($file);
      $file_url = file_create_url($file->getFileUri());
      // Transform absolute image URLs to relative image URLs: prevent problems
      // on multisite set-ups and prevent mixed content errors.
      $file_url = file_url_transform_relative($file_url);
      $form_state->setValue(array('attributes', 'src'), $file_url);
      $form_state->setValue(array('attributes', 'data-entity-uuid'), $file->uuid());
      $form_state->setValue(array('attributes', 'data-entity-type'), 'file');
    }
    // When the alt attribute is set to two double quotes, transform it to the
    // empty string: two double quotes signify "empty alt attribute". See above.
    if (trim($form_state->getValue(array('attributes', 'alt'))) === '""') {
      $form_state->setValue(array('attributes', 'alt'), '');
    }

    if ($form_state->getErrors()) {
      unset($form['#prefix'], $form['#suffix']);
      $form['status_messages'] = [
        '#type' => 'status_messages',
        '#weight' => -10,
      ];
      $response->addCommand(new HtmlCommand('#md-slider-image-dialog-form', $form));
    }
    else {
      //Set status file to FILE_STATUS_PERMANENT

      $response->addCommand(new ImageDialogSave($form_state->getValues()));
      $response->addCommand(new CloseModalDialogCommand());
    }

    return $response;
  }

}
