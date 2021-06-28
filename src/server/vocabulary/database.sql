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
  relation_depth INT(2),
  INDEX (from_id),
  INDEX (to_id)
) ROW_FORMAT=COMPRESSED;

/* Log created after each session */
DROP TABLE IF EXISTS vocabulary_session_log;
CREATE TABLE vocabulary_session_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(32),
  card_id VARCHAR(20),
  score VARCHAR(20),
  times_seen INT(2) UNSIGNED, -- Times seen in this session
  fails INT(2) UNSIGNED,
  `timestamp` DATETIME,
  INDEX (card_id),
  INDEX (`timestamp`),
  INDEX (user_id)
) ROW_FORMAT=COMPRESSED;

/* Stores both due and score */
DROP TABLE IF EXISTS vocabulary_schedule;
CREATE TABLE vocabulary_schedule (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(32),
  card_id VARCHAR(20),
  due DATETIME,
  adjusted_due DATETIME,
  score DECIMAL(3,2) UNSIGNED, -- Range from 0 to 3
  status ENUM('learning', 'learned'),
  last_seen DATETIME,
  last_interval_in_days INT(5) UNSIGNED,
  sessions_seen INT(5) UNSIGNED, -- Number of sessions this items has been seen
  INDEX (card_id),
  INDEX (due),
  INDEX (score),
  INDEX (user_id)
) ROW_FORMAT=COMPRESSED;
