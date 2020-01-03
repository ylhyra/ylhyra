
<!-- in public function parse() -->
$text = preg_replace("/`(.*?)`/", "<span class='icelandic' data-translate='true' style='font-family:monospace'>$1</span>", $text);
