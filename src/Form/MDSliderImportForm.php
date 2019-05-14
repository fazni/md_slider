<?php

/**
 * @file
 * Contains \Drupal\md_slider\Form\MDSliderImportForm.
 */

namespace Drupal\md_slider\Form;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;
use Drupal\md_slider\MDSlide;
use Drupal\md_slider\MDSlider;
use Drupal\md_slider\Slider\MDSliderImport;
use Symfony\Component\DependencyInjection\ContainerInterface;

class MDSliderImportForm extends FormBase {

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
    return 'md_slider_import';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $form['file'] = array(
      "#title" => $this->t("Choose file to import"),
      '#type' => 'managed_file',
      '#upload_location' => 'public://md-slider-import',
      '#upload_validators' => array(
        'file_validate_extensions' => array('zip'),
      ),
      "#description" => $this->t("The export data file."),
      '#required' => TRUE,
    );

    $form['import'] = array(
      '#type' => 'submit',
      '#value' => $this->t('Import'),
    );
    return $form;
  }


  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $destination_dir = 'public://md-slider-image';
    $writable = file_prepare_directory($destination_dir, FILE_CREATE_DIRECTORY);
    if (!$writable) {
      drupal_set_message($this->t());
      $form_state->setError($form, t('The directory %dir does not exist and could not be created.', array('%dir' =>  $destination_dir)));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

    $fid = $form_state->getValue('file');
    $file = File::load($fid[0]);
    $file_path = drupal_realpath($file->getFileUri());
    $destination_dir = 'public://md-slider-image';
    $import = new MDSliderImport();
    $import->getDataImport($file_path, $destination_dir);
    $import->importDataSlider();
    drupal_set_message($this->t("MD Slider: Import successful!"));
  }
}