<?php

# Protect against web entry
if (!defined('MEDIAWIKI')) {
    exit;
}

error_reporting( -1 );
ini_set( 'display_errors', 1 );

// // Testing
// ini_set('display_errors', '1');
// ini_set('display_startup_errors', '1');
// error_reporting(E_ALL);


$wgShowExceptionDetails = true;
$wgShowDBErrorBacktrace = true;





require_once(__DIR__.'/LocalSettings.php');
require_once(__DIR__.'/Extensions.php');
require_once(__DIR__.'/Namespaces.php');
require_once(__DIR__.'/Userrights.php');
require_once(__DIR__.'/VisualEditor.php');
require_once(__DIR__.'/Script.php');
require_once(__DIR__.'/Uploads.php');
require_once(__DIR__.'/Email.php');

require_once(__DIR__.'/../ylhyra-extensions/ServerSideRender.php');
require_once(__DIR__.'/../ylhyra-extensions/Backticks.php');
// require_once(__DIR__.'/../ylhyra-extensions/VerifyLogin.php');


$wgExtensionDirectoryOLD = $wgExtensionDirectory;
$wgExtensionDirectory = __DIR__.'/../ylhyra-extensions/';
wfLoadExtension( 'ThirdPartySessionVerification' );
$wgExtensionDirectory = $wgExtensionDirectoryOLD;
