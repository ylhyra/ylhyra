<?php
// require_once "$IP/extensions/YlhyraBackendParse.php";

// Register as an extention
$wgExtensionCredits['ylhyra_backend_parse'][] = array(
  'name' => 'BacktickCode',
  'version' => '1.0',
  'url' => '',
  'author' => 'Joel Thornton',
  'description' => '',
);

// Register hooks
$wgHooks['ParserAfterTidy'][] = function( Parser &$parser, &$text ) {
  if (strpos($a, 'data-document-start') !== false) {
    // $text = "START____".$text."END____";

    $opts = array('http' =>
      array(
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query(
          array(
            'html' => $text,
          )
        )
      )
    );

    $result = file_get_contents('http://localhost:9090/api/render', false, stream_context_create($opts));

    if($result) {
      $text = $result;
    }

  }
  return true;
};
