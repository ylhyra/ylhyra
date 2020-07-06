<?php
/*
  To use Ylhýra development mode, run the script in setDevelopmentMode.js
*/
$script = "https://app.ylhyra.is/app.js?build=000000";
$css = "https://app.ylhyra.is/app.css?build=000000";

if ($_COOKIE and isset($_COOKIE['development']) and $_COOKIE['development']=='true') {
  $script = "https://localhost:8000/app.js";
  $css = "https://localhost:8000/app.css";
}

$wgHooks['BeforePageDisplay'][] = 'LoadScriptInHeader';
function LoadScriptInHeader(OutputPage &$out, Skin &$skin) {
  global $script;
  $out->addHeadItem('viewport', '<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  $out->addHeadItem('ylhyra_js', '<script type="text/javascript" src="'.$script.'"></script>');
	$out->addHeadItem('ylhyra_css', '<link rel="stylesheet" href="'.$css.'">');
	return true;
}
