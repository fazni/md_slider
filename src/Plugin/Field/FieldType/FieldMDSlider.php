<?php

/**
 * @file
 * Contains Drupal\md_slider\Plugin\Field\FieldType\FieldMDSlider.
 */

namespace Drupal\md_slider\Plugin\Field\FieldType;

use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\TypedData\DataDefinition;

/**
 *
 * @FieldType(
 *   id = "field_md_slider",
 *   label = @Translation("MD Slider"),
 *   module = "md_slider",
 *   description = @Translation("Field use MD Slider."),
 *   default_widget = "md_slider_widget",
 *   default_formatter = "md_slider_formatter"
 * )
 */
class FieldMDSlider extends FieldItemBase {
  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    return array(
      'columns' => array(
        'value' => array(
          'type' => 'text',
          'size' => 'tiny',
          'not null' => FALSE,
        ),
      ),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $value = $this->get('value')->getValue();
    return $value === NULL || $value === '';
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties['value'] = DataDefinition::create('string')
      ->setLabel(t('Slider'));

    return $properties;
  }

}
