<?php
$wgGroupPermissions['*']['edit'] = false;

$wgGroupPermissions['editor']['suppressredirect'] = true;
$wgGroupPermissions['editor']['undelete'] = true;
$wgGroupPermissions['editor']['protect'] = true;
$wgGroupPermissions['editor']['deletedtext'] = true;
$wgGroupPermissions['editor']['deletedhistory'] = true;
$wgGroupPermissions['editor']['delete'] = true;

$wgGroupPermissions['autoconfirmed']['upload_by_url'] = true;
$wgGroupPermissions['editor']['upload_by_url'] = true;
$wgGroupPermissions['sysop']['upload_by_url'] = true;
