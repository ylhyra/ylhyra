<?php

## To enable image uploads, make sure the 'images' directory
## is writable, then set this to true:
$wgEnableUploads = true; # Enable uploads

$wgUseImageMagick = true;
$wgImageMagickConvertCommand = "/usr/bin/convert";

$wgFileExtensions = array( 'png', 'gif', 'jpg', 'jpeg', 'doc',
    'xls', 'mpp', 'pdf', 'ppt', 'tiff', 'bmp', 'docx', 'xlsx',
    'pptx', 'ps', 'odt', 'ods', 'odp', 'odg', 'svg','mp3','mpga','wav','mp4'
);

ini_set('post_max_size', '50M');
ini_set('upload_max_filesize', '50M');
$wgMaxUploadSize = 20000000;
$wgUploadSizeWarning = 1024 * 1024 * 20;

$wgAllowCopyUploads = true;
$wgCopyUploadsFromSpecialUpload = true;
