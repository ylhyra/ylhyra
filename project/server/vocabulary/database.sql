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
  hash VARCHAR(20),
  level INT,
  difficulty TINYINT,
  card TEXT
);
CREATE INDEX _variation_id ON vocabulary_cards (variation_id);
CREATE INDEX _word_id ON vocabulary_cards (word_id);
CREATE INDEX _level ON vocabulary_cards (level);
CREATE INDEX _type ON vocabulary_cards (type);

DROP TABLE IF EXISTS vocabulary_log;
CREATE TABLE vocabulary_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word_id VARCHAR(20),
  variation_id VARCHAR(20),
  card_id VARCHAR(20),
  word_score VARCHAR(10),
  variation_score VARCHAR(10),
  card_score VARCHAR(10),
  direction BOOLEAN,
  correct BOOLEAN,
  timestamp BIGINT,
  user VARCHAR(255)
);
CREATE INDEX _word_id ON vocabulary_log (word_id);
CREATE INDEX _variation_id ON vocabulary_log (variation_id);
CREATE INDEX _card_id ON vocabulary_log (card_id);
CREATE INDEX _timestamp ON vocabulary_log (timestamp);
CREATE INDEX _user ON vocabulary_log (user);

DROP TABLE IF EXISTS vocabulary_schedule;
CREATE TABLE vocabulary_schedule (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word_id VARCHAR(20),
  due BIGINT,
  last_seen BIGINT,
  -- score VARCHAR(10),
  user VARCHAR(255)
);
CREATE INDEX _due ON vocabulary_schedule (due);
CREATE INDEX _user ON vocabulary_schedule (user);


DROP TABLE IF EXISTS vocabulary_users;
CREATE TABLE vocabulary_users (
  user_id VARCHAR(32) PRIMARY,
  level INT
);
