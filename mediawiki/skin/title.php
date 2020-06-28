<?php
// use MediaWiki\MediaWikiServices;// MW 1.34

/*
  Derived from MediaWiki's "includes/skins/Skin.php"
  GPLv2+
*/

// $wgHooks['SkinSubPageSubtitle'][] = function( &$output, $skin, $out) {
//   $output = 'HAHAH';
//   $out = 'HAHAHA'.$out;
//   die('lol');
//   return false;
// };

function YlhyraTitle ($object) {
  // $linkRenderer = MediaWikiServices::getInstance()->getLinkRenderer();// MW.134

  // echo print_r(array_keys(($object->data)));
  $titleObject = $object->getSkin()->getTitle();
  $namespace = str_replace('_',' ',$titleObject->getNsText());
  $title = $object->data[ 'titletext' ];

  $output = '';
  $outputParts = [];

  if(!$namespace) {
    $namespace = 'Articles';
  }
  $outputParts[] = array('name' => $namespace, 'seperator' => ':', 'class' => 'namespace');

  if (
    // MediaWikiServices::getInstance()->getNamespaceInfo()->hasSubpages( $titleObject->getNamespace() )// MW 1.34
    MWNamespace::hasSubpages( $titleObject->getNamespace()) // MW 1.33
    AND
    strpos( $title, '/' ) !== false
  ) {
      $links = explode( '/', $title );
      $last = array_pop( $links );
      $growinglink = $namespace.':';
      foreach ( $links as $link ) {
        $growinglink .= $link;
				$linkObj = Title::newFromText( $growinglink );
        if (( is_object( $linkObj ) && $linkObj->isKnown() )) {
          // MW.134
          // $getlink = $linkRenderer->makeKnownLink(
          //   $linkObj, $link
          // );
          // MW.133
          $getlink = Linker::linkKnown(
						$linkObj,
						$link
					);
          $outputParts[] = array('name' => $getlink);
        } else {
          $outputParts[] = array('name' => $link);
        }
        $growinglink .= '/';
      }
      $outputParts[] = array('name' => $last, 'seperator' => '', 'class'=>'last');

  } else {
    $outputParts[] = array('name' => $title, 'seperator' => '', 'class'=>'last');
  }

  $output = '';
  foreach ( $outputParts as $part ) {
    $name = $part['name'];
    $seperator = isset($part['seperator']) ? $part['seperator'] : '/';
    $class = isset($part['class']) ? $part['class'] : '';
    $output .= "<span class='title-part $class'>$name<span class='title-seperator'>$seperator</span></span>";
  }

  return $output;
}
