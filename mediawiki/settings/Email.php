<?php

## UPO means: this is also a user preference option

# (Temporary, allowing overriding elsewhere)
if(!isset($IS_PRODUCTION)) {

  $wgEnableEmail = true;
  $wgEnableUserEmail = true; # UPO

  $wgEmergencyContact = "";
  $wgPasswordSender = "";


  $wgEnotifUserTalk = false; # UPO
  $wgEnotifWatchlist = false; # UPO
  $wgEmailAuthentication = true;

  $wgSMTP = [
    'host'     => "", // could also be an IP address. Where the SMTP server is located
    'IDHost'   => "",      // Generally this will be the domain name of your website (aka mywiki.org)
    'port'     => 587     ,                 // Port to use when connecting to the SMTP server
    'auth'     => true,               // Should we use SMTP authentication (true or false)
    'username' => "",     // Username to use for SMTP authentication (if being used)
    'password' => ""       // Password to use for SMTP authentication (if being used)
  ];

  $wgPasswordSender     = "";
  $wgPasswordSenderName = "";
  $wgEmergencyContact   = $wgPasswordSender;
  $wgNoReplyAddress = $wgPasswordSender;
  $wgUsersNotifiedOnAllChanges = array( 'Egill' );

}
