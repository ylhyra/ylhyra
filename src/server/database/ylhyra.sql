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
DROP TABLE IF EXISTS analytics;
CREATE TABLE analytics (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INT UNSIGNED,
  session_id VARCHAR(14),
  country VARCHAR(2),
  type VARCHAR(40), /* "page_view" / "vocabulary" */
  page_name VARCHAR(120),
  user_languages VARCHAR(30),
  referrer VARCHAR(120),
  seconds_spent SMALLINT UNSIGNED,
  INDEX (user_id),
  INDEX (session_id),
  INDEX (page_name),
  INDEX (referrer)
) ROW_FORMAT=COMPRESSED;


/*
  _   _ ____  _____ ____  ____
 | | | / ___|| ____|  _ \/ ___|
 | | | \___ \|  _| | |_) \___ \
 | |_| |___) | |___|  _ < ___) |
  \___/|____/|_____|_| \_\____/
*/
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(120),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (username),
  INDEX (email),
  INDEX (created_at)
) ROW_FORMAT=COMPRESSED;

-- DROP TABLE IF EXISTS user_login_tokens;
-- CREATE TABLE user_login_tokens (
--   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--   email VARCHAR(255),
--   short_token VARCHAR(4),
--   long_token VARCHAR(20),
--   expires VARCHAR(20),
--   attempts INT(1),
--   INDEX (email),
--   INDEX (long_token)
-- ) ROW_FORMAT=COMPRESSED;

/* Payments */
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  price VARCHAR(20),
  transaction_id VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  type ENUM('pwyw', 'donation'),
  verified BOOL,
  INDEX (user_id)
) ROW_FORMAT=COMPRESSED;



-- Other data:
-- inflection/database.sql
-- vocabulary/database.sql
