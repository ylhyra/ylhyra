<?php
// require_once "$IP/extensions/YlhyraBackendParse.php";

// Register as an extention
$wgExtensionCredits['ylhyra_backend_parse'][] = array(
  'name' => 'YlhyraServerSideRendering',
  'version' => '1.0',
  'url' => '',
  'author' => 'Egill',
  'description' => '',
);

// Register hooks
$wgHooks['ParserAfterTidy'][] = function( Parser &$parser, &$text ) {
  if (strpos($text, 'data-document-start') !== false) {
    if(function_exists('curl_version')) { // Check if CURL is installed
      if ($_COOKIE and $_COOKIE['development']=='true') { // Development mode?
        return true;
      } else {
        $url = 'http://localhost:9123/api/render';
        $timeout=2;
        $payload = json_encode(array(
          'html' => $text
        ));
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLINFO_HEADER_OUT, false);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_FAILONERROR, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
          'Content-Type: application/json',
          'Content-Length: ' . strlen($payload))
        );
        $result = curl_exec($ch);
        curl_close($ch);
        if($result) {
          $text = $result;
        }
      }
    }
  }
  return true;
};
