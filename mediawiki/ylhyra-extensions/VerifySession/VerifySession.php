<?php
/*

  Third party session verification
  GPLv2+.
	Code derived from MediaWiki (© Wikimedia).

*/

class ApiThirdPartySessionVerification extends ApiBase {

	public function execute() {
    $res = [];
		$token = $this->extractRequestParams()['token'];
		if($token) {
			$this->verifyToken($token, $res);
		} else {
			$this->generateToken($res);
		}
		$this->getResult()->addValue( null, $this->getModuleName(), $res );
	}

	private function generateToken(&$res) {
    $userID = $this->getUser()->getID();
    if($userID == 0) {
      $res['error'] = 'No user';
    } else {
      $salt = bin2hex(openssl_random_pseudo_bytes(10));
      $time = time();
			$hash = $this->generateHash($userID, $time, $salt);
      $res['token'] = ($hash . '-' . $salt . '-' . $time . '-' . $userID);
    }
	}

	private function verifyToken($token, &$res) {
		[$hash, $salt, $time, $userID] = explode('-', $token);
		if($hash == $this->generateHash($userID, $time, $salt)) {
			$res['success'] = 1;
			$res['userID'] = $userID;
			$res['token_age_in_seconds'] = (time() - $time);
		} else {
			$res['error'] = 'Incorrect token';
		}
	}

	private function generateHash($userID, $time, $salt) {
		global $wgSecretKey, $wgAuthenticationTokenVersion;
    $secret = $userID . $wgSecretKey . $wgAuthenticationTokenVersion . $time;
    $iterations = 5000;
    $hash = hash_pbkdf2( 'sha256', $secret, $salt, $iterations, 40, false );
		return $hash;
	}

	public function getAllowedParams() {
		return [
			'token' => [
				ApiBase::PARAM_TYPE => 'string',
				ApiBase::PARAM_REQUIRED => false,
				ApiBase::PARAM_SENSITIVE => true,
			],
	  ];
	}
}
