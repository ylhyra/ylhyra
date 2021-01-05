<?php

## Uncomment this to disable output compression
# $wgDisableOutputCompression = true;

$wgSitename = "Ylhýra";

## The URL base path to the directory containing the wiki;
## defaults for all runtime URL paths are based off of this.
## For more information on customizing the URLs
## (like /w/index.php/Page_title to /wiki/Page_title) please see:
## https://www.mediawiki.org/wiki/Manual:Short_URL
$wgScriptPath = "";

## The protocol and server name to use in fully-qualified URLs
if(!isset($IS_PRODUCTION)) {
  $wgServer = "http://localhost";
} else {
  $wgServer = "https://ylhyra.is";
}

## The URL path to static resources (images, scripts, etc.)
$wgResourceBasePath = $wgScriptPath;

## The URL path to the logo.  Make sure you change this from the default,
## or else you'll overwrite your logo when you upgrade!
$wgLogo = "$wgResourceBasePath/resources/assets/wiki.png";

# Development mode inside Docker, must be overridden on production
if(!isset($IS_PRODUCTION)) {
  ## Database settings
  $wgDBtype = "mysql";
  $wgDBserver = "database";
  $wgDBname = "mediawiki";
  $wgDBuser = "mediawiki";
  $wgDBpassword = "mediawiki";
}

# MySQL specific settings
$wgDBprefix = "";

# MySQL table options to use during installation or update
$wgDBTableOptions = "ENGINE=InnoDB, DEFAULT CHARSET=binary";

## Shared memory settings
$wgMainCacheType = CACHE_NONE;
$wgMemCachedServers = [];

$wgUseFileCache = true;
$wgUseGzip = true;


## If you use ImageMagick (or any other shell command) on a
## Linux server, this will need to be set to the name of an
## available UTF-8 locale
$wgShellLocale = "C.UTF-8";

## Set $wgCacheDirectory to a writable directory on the web server
## to make your wiki go slightly faster. The directory should not
## be publicly accessible from the web.
#$wgCacheDirectory = "$IP/cache";

# Site language code, should be one of the list in ./languages/data/Names.php
$wgLanguageCode = "en";

// $wgSecretKey = "";

# Changing this will log out all existing sessions.
$wgAuthenticationTokenVersion = "1";

## For attaching licensing metadata to pages, and displaying an
## appropriate copyright notice / icon. GNU Free Documentation
## License and Creative Commons licenses are supported so far.
$wgRightsPage = ""; # Set to the title of a wiki page that describes your license/copyright
$wgRightsUrl = "";
$wgRightsText = "";
$wgRightsIcon = "";

# Path to the GNU diff3 utility. Used for conflict resolution.
$wgDiff3 = "/usr/bin/diff3";

$wgScriptPath       = "";
$wgArticlePath      = "/$1";
$wgUsePathInfo      = true;
$wgScriptExtension  = ".php";

$wgRestrictDisplayTitle = false;
$wgAllowDisplayTitle = true;
//wfLoadExtension( 'Echo' );

$wgAllowUserJs = true;
$wgAllowUserCss = true;

// $wgInvalidateCacheOnLocalSettingsChange = true;

$wgFixDoubleRedirects = true;
