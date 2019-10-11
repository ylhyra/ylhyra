/*
  Run /scripts/database/create.sh to import this SQL structure
*/

DROP DATABASE IF EXISTS vocabulary;
CREATE DATABASE vocabulary
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_icelandic_ci;

USE vocabulary;
SET sql_mode = '';

GRANT ALL ON `vocabulary`.* TO 'egill'@'localhost' IDENTIFIED BY 'egill';


DROP TABLE IF EXISTS content;
CREATE TABLE content (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(30),
  title VARCHAR(100),
  meta_data MEDIUMTEXT, # Vistar titil, kápu, hitt og þetta
  word_count INT,
  compiled MEDIUMTEXT,
  difficulty INT,
  fun INT
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191), # (Max for a unique field)
  name VARCHAR(255),
  picture VARCHAR(500),
  facebook_user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (email)
);

DROP TABLE IF EXISTS user_sessions;
CREATE TABLE user_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(32),
  user_id INT,
  ip VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  user_agent VARCHAR(255),
  timezone VARCHAR(5),
  display VARCHAR(255),
  accept_language VARCHAR(255)
);

DROP TABLE IF EXISTS levels;
CREATE TABLE levels (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11), -- Either UserID or SesssionID
  level VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX _user_id ON levels (user_id);




-- TODO: Kannski eru þessar töflur óþarfi??

DROP TABLE IF EXISTS vocabulary_words;
CREATE TABLE vocabulary_words (
  word_id VARCHAR(20) PRIMARY KEY,
  level INT,
  category VARCHAR(1)
);
CREATE INDEX _category ON vocabulary_words (category);
CREATE INDEX _level ON vocabulary_words (level);

DROP TABLE IF EXISTS vocabulary_variations;
CREATE TABLE vocabulary_variations (
  variation_id VARCHAR(20) PRIMARY KEY,
  word_id VARCHAR(20)
);
CREATE INDEX _word_id ON vocabulary_variations (word_id);

DROP TABLE IF EXISTS vocabulary_cards;
CREATE TABLE vocabulary_cards (
  card_id VARCHAR(20) PRIMARY KEY,
  variation_id VARCHAR(20),
  word_id VARCHAR(20),
  level INT,
  difficulty TINYINT,
  type VARCHAR(30),
  card TEXT,
  random INT
);
CREATE INDEX _variation_id ON vocabulary_cards (variation_id);
CREATE INDEX _word_id ON vocabulary_cards (word_id);
CREATE INDEX _level ON vocabulary_cards (level);
CREATE INDEX _type ON vocabulary_cards (type);
CREATE INDEX _random ON vocabulary_cards (random);

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

-- DROP TABLE IF EXISTS vocabulary_schedule;
-- CREATE TABLE vocabulary_schedule (
--   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   word_id VARCHAR(20),
--   due BIGINT,
--   last_seen BIGINT,
--   -- score VARCHAR(10),
--   user VARCHAR(255)
-- );
-- CREATE INDEX _due ON vocabulary_schedule (due);
-- CREATE INDEX _user ON vocabulary_schedule (user);

DROP TABLE IF EXISTS vocabulary_queue;
CREATE TABLE vocabulary_queue (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word_id VARCHAR(20),
  queue_position INT,
  user VARCHAR(255)
);
CREATE INDEX _queue_position ON vocabulary_queue (queue_position);
CREATE INDEX _user ON vocabulary_queue (user);


DROP TABLE IF EXISTS vocabulary_users;
CREATE TABLE vocabulary_users (
  user_id VARCHAR(32) PRIMARY KEY,
  level INT
);


/*
  Notifications
*/
DROP TABLE IF EXISTS notifications_settings;
CREATE TABLE notifications_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(255),
  device VARCHAR(255),
  frequency INT, # Every X minutes
  initialized BOOLEAN, # Have we begun creating notifications for this user?
  random INT # Used to spread Vocabulary creation over the day, value between 1-288.
);
CREATE INDEX _user ON notifications_settings (user);

DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  settings_id INT, # To 'notifications_settings'
  heading VARCHAR(255),
  content VARCHAR(255),
  time BIGINT
);
CREATE INDEX _settings_id ON notifications (settings_id);
CREATE INDEX _time ON notifications (time);
