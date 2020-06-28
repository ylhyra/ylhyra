<?php

$wgHooks['ParserAfterTidy'][] = function( Parser &$parser, &$text ) {
  /*
    It is necessary to check for this string because not only
    articles are sent to ParserAfterTidy, almost all strings are.
  */
  if (strpos($text, 'data-document-start') !== false) {
    if(function_exists('curl_version')) { // Check if CURL is installed
      if ($_COOKIE and is_object($_COOKIE) and $_COOKIE['server-side-rendering']=='false') { // Development mode?
        return true;
      } else {
        $url = 'http://localhost:9123/api/render';
        $timeout=3;
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
