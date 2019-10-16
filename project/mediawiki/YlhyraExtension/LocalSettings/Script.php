<?php
require_once "$IP/extensions/HeadScript/HeadScript.php";

/*
  To use Ylhýra development mode, run the script in setDevelopmentMode.js
*/
$wgHeadScriptCode = <<<'START_END_MARKER'
<script type='text/javascript' src='https://app.ylhyra.is/app.js?build=cd495e1'></script>
START_END_MARKER;

if ($_COOKIE and $_COOKIE['development']=='true') {
  $wgHeadScriptCode = <<<'START_END_MARKER'
<script type='text/javascript' src='https://localhost:8000/app.js'></script>
START_END_MARKER;
}
