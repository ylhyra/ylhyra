<?php
/*
  License: 	GNU General Public License 2.0
  Author: Joel Thornton
*/

// Register as an extention
$wgExtensionCredits['ylhyra_backticks'][] = array(
  'name' => 'YlhyraBackticks',
  'version' => '1.0',
  'url' => '',
  'author' => 'Egill',
  'description' => '',
);

// Register hooks
$wgHooks['InternalParseBeforeLinks'][] = function( &$parser, &$text, &$stripState ) {
  $text = preg_replace("/`(.*?)`/", "{{translate|$1}}",$text);
  // $text = preg_replace("/`(.*?)`/", "<span class='icelandic'>$1</span>",$text);
  // $text = preg_replace('/([^\\\\]|^)`([^`]*)`/', '$1{{translate|$2}}', $text);
  // $text = preg_replace('/\\\\\`/', '`', $text);
  return true;
};
