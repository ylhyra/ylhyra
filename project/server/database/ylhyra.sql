-- Run /scripts/database/create.sh to run this

DROP DATABASE IF EXISTS ylhyra;
CREATE DATABASE ylhyra
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_icelandic_ci; -- Case insensitive

USE ylhyra;
SET sql_mode = '';

-- CREATE USER 'example_user'@'localhost' IDENTIFIED BY 'example_password';
-- GRANT ALL ON `ylhyra`.* TO 'example_user'@'localhost';

-- Sentence analysis from Greinir
DROP TABLE IF EXISTS analysis;
CREATE TABLE analysis (
  lang VARCHAR(3),
  text_hash VARCHAR(20),
  text MEDIUMTEXT,
  analysis MEDIUMTEXT
);
CREATE INDEX _text_hash ON analysis (text_hash);


--    ____        __ _       _ _   _
--   |  _ \  ___ / _(_)_ __ (_) |_(_) ___  _ __  ___
--   | | | |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \/ __|
--   | |_| |  __/  _| | | | | | |_| | (_) | | | \__ \
--   |____/ \___|_| |_|_| |_|_|\__|_|\___/|_| |_|___/

DROP TABLE IF EXISTS words_and_sentences;
CREATE TABLE words_and_sentences (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  from_lang VARCHAR(3),
  to_lang VARCHAR(3),
  text_hash VARCHAR(20),
  translation_frame_hash VARCHAR(20), # Used by words
  definition_hash VARCHAR(20),        # Used by sentences
  document_id INT UNSIGNED
);
CREATE INDEX _from_lang ON words_and_sentences (from_lang);
CREATE INDEX _to_lang ON words_and_sentences (to_lang);
CREATE INDEX _text_hash ON words_and_sentences (text_hash);
CREATE INDEX _document_id ON words_and_sentences (document_id);

DROP TABLE IF EXISTS translation_frames;
CREATE TABLE translation_frames (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  translation_frame_hash VARCHAR(20),
  -- position_in_translation_frame INT,
  definition_hash VARCHAR(20)
);
CREATE UNIQUE INDEX _translation_frame_hash ON translation_frames (translation_frame_hash);

DROP TABLE IF EXISTS words_in_translation_frame;
CREATE TABLE words_in_translation_frame (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  translation_frame_hash VARCHAR(20),
  position_relative_to_center_word INT, # [-3,-2,-1,0,1,2,3]
  -- position_in_translation_frame INT,
  word VARCHAR(32),
  is_part_of_definition BOOL
);
CREATE INDEX _translation_frame_hash ON words_in_translation_frame (translation_frame_hash);
CREATE INDEX _word ON words_in_translation_frame (word);

DROP TABLE IF EXISTS definitions;
CREATE TABLE definitions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  definition_hash VARCHAR(20),
  definition MEDIUMTEXT
);
CREATE UNIQUE INDEX _definition_hash ON definitions (definition_hash);

DROP TABLE IF EXISTS google_translate;
CREATE TABLE google_translate (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hash VARCHAR(25),
  translation MEDIUMTEXT
);
CREATE UNIQUE INDEX _google_translate_hash ON google_translate (hash);







DROP TABLE IF EXISTS pronunciation;
CREATE TABLE pronunciation (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(100) COLLATE utf8_bin,
  pronunciation VARCHAR(100),
  guessed BOOL
);
CREATE INDEX _word ON pronunciation (word);


DROP TABLE IF EXISTS sounds;
CREATE TABLE sounds (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(120) COLLATE utf8_bin,
  file VARCHAR(120),
  speaker VARCHAR(120)
);
CREATE INDEX _text ON sounds (text);



/*
  Analytics
*/
DROP TABLE IF EXISTS interactions;
CREATE TABLE interactions (
  id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  timestamp TIMESTAMP,

  ip VARCHAR(120),
  browser VARCHAR(120),
  version VARCHAR(120),
  os VARCHAR(120),
  platform VARCHAR(120),
  is_mobile BOOLEAN,

  user_session VARCHAR(120),
  page_name VARCHAR(120),
  item_id VARCHAR(40),
  item_seen_at DATETIME,
  item_time_seen INT UNSIGNED, -- Milliseconds
  country VARCHAR(2),

  type VARCHAR(40) -- "text" for text interaction, "view" for a page view
);
-- CREATE INDEX _text ON sounds (text);
-- DROP TABLE IF EXISTS sessions;
-- CREATE TABLE sessions (
--   id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   timestamp TIMESTAMP,
--   user_session VARCHAR(120),
--   analytics_hash VARCHAR(120) -- FOREIGN KEY user_analytics.hash,
-- );
-- DROP TABLE IF EXISTS user_analytics;
-- CREATE TABLE user_analytics (
--   id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   hash VARCHAR(120),
--   ip VARCHAR(120),
--   browser VARCHAR(120),
--   version VARCHAR(120),
--   os VARCHAR(120),
--   platform VARCHAR(120),
--   is_mobile BOOLEAN
-- );



-- Other data:
-- inflection/database.sql



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
  card_id VARCHAR(20) PRIMARY KEY,
  level INT,
  difficulty TINYINT,
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
