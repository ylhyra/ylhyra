<?php

$wgNamespacesWithSubpages[NS_MAIN] = true;

// Define constants for my additional namespaces.
define("NS_DATA", 3000); // This MUST be even.
define("NS_DATA_TALK", 3001); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_DATA] = "Data";
$wgExtraNamespaces[NS_DATA_TALK] = "Data_talk"; // Note underscores in the namespace name.

define("NS_MANUAL", 3002); // This MUST be even.
define("NS_MANUAL_TALK", 3003); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_MANUAL] = "Software";
$wgExtraNamespaces[NS_MANUAL_TALK] = "Software_talk"; // Note underscores in the namespace name.
$wgNamespaceAliases['Manual'] = NS_MANUAL;
$wgNamespacesWithSubpages[NS_MANUAL] = true;

define("NS_TEXT", 3004); // This MUST be even.
define("NS_TEXT_TALK", 3005); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_TEXT] = "Text";
$wgExtraNamespaces[NS_TEXT_TALK] = "Text_talk"; // Note underscores in the namespace name.
$wgNamespaceAliases['Snippet'] = NS_TEXT;
$wgNamespacesWithSubpages[NS_TEXT] = true;

define("NS_GAME", 3006); // This MUST be even.
define("NS_GAME_TALK", 3007); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_GAME] = "Game";
$wgExtraNamespaces[NS_GAME_TALK] = "Game_talk"; // Note underscores in the namespace name.
$wgNamespaceAliases['Games'] = NS_GAME;
$wgNamespacesWithSubpages[NS_GAME] = true;

define("NS_PRIVATE", 3100); // This MUST be even.
define("NS_PRIVATE_TALK", 3101); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_PRIVATE] = "Skjöl";
$wgExtraNamespaces[NS_PRIVATE_TALK] = "Skjöl_talk"; // Note underscores in the namespace name.
$wgNamespacesWithSubpages[NS_PRIVATE] = true;

wfLoadExtension('Lockdown');
$wgNamespacePermissionLockdown[NS_PRIVATE]['read'] = [ 'sysop' ];
$wgNamespacePermissionLockdown[NS_PRIVATE_TALK]['read'] = [ 'sysop' ];
$wgNonincludableNamespaces[] = NS_PRIVATE;
$wgNonincludableNamespaces[] = NS_PRIVATE_TALK;

define("NS_OTHER", 3008); // This MUST be even.
define("NS_OTHER_TALK", 3009); // This MUST be the following odd integer.
$wgExtraNamespaces[NS_OTHER] = "Other";
$wgExtraNamespaces[NS_OTHER_TALK] = "Other_talk"; // Note underscores in the namespace name.
$wgNamespacesWithSubpages[NS_OTHER] = true;

//$wgContentNamespaces[] = NS_MANUAL;
//$wgContentNamespaces[] = NS_PROJECT;

$wgNamespaceContentModels[NS_DATA] = CONTENT_MODEL_JSON;
