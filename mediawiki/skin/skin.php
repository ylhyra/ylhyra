<?php
//  Derived from the Athena skin by Felipe Schenone.
//  https://www.mediawiki.org/wiki/Skin:Athena
//  License: GPL-3.0

class SkinAthena extends SkinTemplate {

  public $skinname = 'athena';

  public $template = 'AthenaTemplate';

  static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
    global $wgDefaultSkin;
    if ( $wgDefaultSkin === 'athena' ) {
      $out->addModuleStyles( 'skins.athena' );
    }
  }
}

class AthenaTemplate extends BaseTemplate {

  /**
   * Merge together the views, actions and variants
   * and remove the current action, per useless and confusing
   */
  function getActions() {
    global $mediaWiki;
    $actions = array_merge(
      $this->data['content_navigation']['views'],
      $this->data['content_navigation']['actions'],
      $this->data['content_navigation']['variants']
    );
    if(isset($mediaWiki)) {
      $action = $mediaWiki->getAction();
      unset( $actions[ $action ] ); // Remove the current action (doesn't work with Move)
    }
    return $actions;
  }

  /**
   * Output the page
   */
  function execute() {
    include __DIR__.'/skin.phtml';
  }
}
