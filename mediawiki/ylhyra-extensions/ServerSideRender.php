<?php

$wgHooks['ParserAfterTidy'][] = function( Parser &$parser, &$text ) {
  /*
    It is necessary to check for this string because not only
    articles are sent to ParserAfterTidy, almost all strings are.
  */
  if (strpos($text, 'data-document-start') !== false) {
    /* Check if CURL is installed */
    if(function_exists('curl_version')) {
      /* Development mode, server side rendering off */
      if (isset($_COOKIE['server-side-rendering']) and $_COOKIE['server-side-rendering']=='false') {
        global $wgOut;
        $parser->getOutput()->updateCacheExpiry( 0 );
        $wgOut->enableClientCache( false );
        return true;
      }
      /* Normal mode, server side rendering on */
      else {
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
