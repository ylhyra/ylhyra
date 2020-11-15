<?php


// Creates answer boxes
$wgHooks['InternalParseBeforeLinks'][] = function( &$parser, &$text, &$stripState ) {
  $text = preg_replace('/\$cot\$/', '<div data-type="collapse" class="collapse">', $text);
  $text = preg_replace('/\$cob\$/', '</div>', $text);
  return true;
};


// Converts text inside backticks to "<span class=icelandic></span>".
// Author: User:Sk4p on https://www.mediawiki.org/wiki/Extension_talk:BacktickCode
$wgHooks['InternalParseBeforeLinks'][] = function( &$parser, &$text, &$stripState ) {
  $fixprefix = preg_replace('/`/', '~', Parser::MARKER_PREFIX);
  $fixsuffix = preg_replace('/`/', '~', Parser::MARKER_SUFFIX);
  $text = str_replace(Parser::MARKER_PREFIX, $fixprefix, $text);
  $text = str_replace(Parser::MARKER_SUFFIX, $fixsuffix, $text);
  $text = preg_replace('/([^\\\\]|^)`([^`\x7f]*)`/', '$1<span class="short-translated-text" data-translate="true">$2</span>', $text);
  $text = preg_replace('/\\\\\`/', '`', $text);
  $text = str_replace($fixprefix, Parser::MARKER_PREFIX, $text);
  $text = str_replace($fixsuffix, Parser::MARKER_SUFFIX, $text);
  return true;
};
