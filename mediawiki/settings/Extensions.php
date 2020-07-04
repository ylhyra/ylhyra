<?php

$wgDefaultSkin = "athena";
wfLoadSkin('Athena');

wfLoadExtension('StopForumSpam');
wfLoadExtension('ConfirmEdit');

wfLoadExtension('Interwiki');
$wgGroupPermissions['sysop']['interwiki'] = true;

# Images from Commons
$wgUseInstantCommons = true;

wfLoadExtension('ParserFunctions');
wfLoadExtension('Cite');
//wfLoadExtension( 'TemplateStyles' );

$wgDebugLogGroups = array(
  'resourceloader' => '/var/log/mediawiki/resourceloader.log',
  'exception' => '/var/log/mediawiki/exception.log',
  'error' => '/var/log/mediawiki/error.log',
  'templatestyles' => '/var/log/mediawiki/somegroup.log',
);

unset($wgFooterIcons['poweredby']['mediawiki']);



$wgRestrictDisplayTitle = false;
// $wgDefaultRobotPolicy = 'noindex,nofollow';

$wgRawHtml = true;
$wgAllowImageTag = true;
$wgAllowExternalImages = true;
$wgPFEnableStringFunctions = true;

wfLoadExtension('WikiEditor');
wfLoadExtension('CodeMirror');
$wgDefaultUserOptions['usecodemirror'] = 1;

wfLoadExtension('Renameuser');
wfLoadExtension('InputBox');
wfLoadExtension('Disambiguator');
wfLoadExtension('CategoryTree');
wfLoadExtension('Gadgets');
wfLoadExtension('EmbedVideo');

/*
$wgEnabledTranscodeSet = [
    //'240p.mp4' => true,
];
wfLoadExtension( 'TimedMediaHandler' );
$wgFFmpegLocation = '/usr/bin/ffmpeg';


// If mp4 source assets can be ingested:
$wgTmhEnableMp4Uploads = true;


$wgMaxShellMemory = 300000;

*/
wfLoadExtension('ExternalData');
$edgCacheTable = 'ed_url_cache';
$edgAllowExternalDataFrom = 'https://ylhyra.is';


// wfLoadExtension( 'RandomImageByCategory' );
