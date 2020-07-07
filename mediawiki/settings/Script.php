<?php
/*
  To use Ylhýra development mode, run the script in setDevelopmentMode.js
*/
$wgHooks['BeforePageDisplay'][] = 'LoadScriptInHeader';
function LoadScriptInHeader(OutputPage &$out, Skin &$skin) {
  global $_COOKIE;

  $url = "https://app.ylhyra.is";
  if ($_COOKIE and isset($_COOKIE['development']) and $_COOKIE['development']=='true') {
    $url = "https://localhost:8000";
  }

  $out->addHeadItem('viewport', '<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  $out->addHeadItem('ylhyra_js', '<script type="text/javascript" src="'.$url.'/app.js?build=000000"></script>');
	$out->addHeadItem('ylhyra_css', '<link rel="stylesheet" href="'.$url.'/app.css?build=000000">');
	return true;
}
