<?php

wfLoadExtension('VisualEditor');
$wgDefaultUserOptions['visualeditor-enable'] = 0;
$wgVirtualRestConfig['modules']['parsoid'] = array(
  // URL to the Parsoid instance
  // Use port 8142 if you use the Debian package
  'url' => 'http://localhost:8142',
  // Parsoid "domain", see below (optional)
  'domain' => 'localhost',
  // Parsoid "prefix", see below (optional)
  'prefix' => 'localhost'
);

$wgVisualEditorAvailableNamespaces = array(
  NS_MAIN => true,
  NS_USER => true,
  NS_HELP => true,
  NS_PROJECT => true,
  NS_MANUAL => true,
  NS_TEXT => true,
  NS_PRIVATE => true,
);
