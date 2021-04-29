/*
 __     __              _           _
 \ \   / /__   ___ __ _| |__  _   _| | __ _ _ __ _   _
  \ \ / / _ \ / __/ _` | '_ \| | | | |/ _` | '__| | | |
   \ V / (_) | (_| (_| | |_) | |_| | | (_| | |  | |_| |
    \_/ \___/ \___\__,_|_.__/ \__,_|_|\__,_|_|   \__, |
                                                 |___/
*/
DROP TABLE IF EXISTS vocabulary_cards;
CREATE TABLE vocabulary_cards (
  id VARCHAR(20) PRIMARY KEY,
  -- hash VARCHAR(20),
  level INT(1),
  sort INT(2),
  data TEXT,
  INDEX (level)
) ROW_FORMAT=COMPRESSED;

DROP TABLE IF EXISTS vocabulary_card_relations;
CREATE TABLE vocabulary_card_relations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_id VARCHAR(20),
  to_id VARCHAR(20),
  relation_type ENUM('belongs_to', 'depends_on', 'related'),
  INDEX (from_id),
  INDEX (to_id)
) ROW_FORMAT=COMPRESSED;

/* Log created after each session */
DROP TABLE IF EXISTS vocabulary_log;
CREATE TABLE vocabulary_log (
  log_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(20),
  score VARCHAR(20),
  `timestamp` BIGINT,
  user_id VARCHAR(32),
  INDEX (card_id),
  INDEX (`timestamp`),
  INDEX (user_id)
) ROW_FORMAT=COMPRESSED;

/* Stores both due and score */
DROP TABLE IF EXISTS vocabulary_schedule;
CREATE TABLE vocabulary_schedule (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(20),
  due DATETIME,
  score VARCHAR(20),
  status ENUM('learning', 'learned'),
  last_seen TIMESTAMP,
  user_id VARCHAR(32),
  INDEX (card_id),
  INDEX (due),
  INDEX (score),
  INDEX (user_id)
) ROW_FORMAT=COMPRESSED;

DROP TABLE IF EXISTS vocabulary_users;
CREATE TABLE vocabulary_users (
  user_id VARCHAR(32) PRIMARY KEY,
  level INT(1)
) ROW_FORMAT=COMPRESSED;
