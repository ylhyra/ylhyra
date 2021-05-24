<?php
$wgServer = "https://login.ylhyra.is";
$wgDBname = "login_wiki";
$wgGroupPermissions['*']['edit'] = false;
$wgGroupPermissions['user']['edit'] = false;
$wgGroupPermissions['sysop']['edit'] = true;

$wgDefaultUserOptions['rememberpassword'] = 1;
$wgHiddenPrefs[] = 'realname';
