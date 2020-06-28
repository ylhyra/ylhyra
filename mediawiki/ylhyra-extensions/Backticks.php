<?php

// Converts text inside backticks to "<span class=icelandic></span>".
// Author: User:Sk4p on https://www.mediawiki.org/wiki/Extension_talk:BacktickCode
$wgHooks['InternalParseBeforeLinks'][] = function( &$parser, &$text, &$stripState ) {
  $fixprefix = preg_replace('/`/', '~', Parser::MARKER_PREFIX);
  $fixsuffix = preg_replace('/`/', '~', Parser::MARKER_SUFFIX);
  $text = str_replace(Parser::MARKER_PREFIX, $fixprefix, $text);
  $text = str_replace(Parser::MARKER_SUFFIX, $fixsuffix, $text);
  $text = preg_replace('/([^\\\\]|^)`([^`\x7f]*)`/', '$1<span class="icelandic">$2</span>', $text);
  $text = preg_replace('/\\\\\`/', '`', $text);
  $text = str_replace($fixprefix, Parser::MARKER_PREFIX, $text);
  $text = str_replace($fixsuffix, Parser::MARKER_SUFFIX, $text);
  return true;
};
