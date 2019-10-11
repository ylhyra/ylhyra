-- Run /scripts/database/create.sh to run this

DROP DATABASE IF EXISTS punktur;
CREATE DATABASE punktur
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE punktur;
SET sql_mode = '';

GRANT ALL ON `punktur`.* TO 'egill'@'localhost' IDENTIFIED BY 'egill';



DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191), # (Max for a unique field)
  name VARCHAR(255),
  picture VARCHAR(500),
  facebook_user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  -- UNIQUE (email)
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

-- DROP TABLE IF EXISTS projects;
-- CREATE TABLE projects (
--   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
-- );

DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner VARCHAR(30), -- User id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS revisions;
CREATE TABLE revisions (
  revision_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id INT UNSIGNED,
  from_lang VARCHAR(3),
  to_lang VARCHAR(3),
  type VARCHAR(30),
  title VARCHAR(100),
  word_count INT,
  metadata MEDIUMTEXT, -- Vistar titil, kápu, hitt og þetta
  input MEDIUMTEXT,
  parsed MEDIUMTEXT,
  tokenized MEDIUMTEXT,
  list MEDIUMTEXT,
  translation MEDIUMTEXT,
  compiled MEDIUMTEXT,
  suggestions MEDIUMTEXT,
  audio MEDIUMTEXT,
  pronunciation MEDIUMTEXT,
  approved BOOL,
  updated_by VARCHAR(30), -- User id
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
  -- FOREIGN KEY (updated_by) REFERENCES users(id)
);


DROP TABLE IF EXISTS media;
CREATE TABLE media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file VARCHAR(225),
  edited BOOL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS analysis;
CREATE TABLE analysis (
  lang VARCHAR(3),
  text_hash VARCHAR(20),
  text MEDIUMTEXT,
  analysis MEDIUMTEXT
);
CREATE INDEX _text_hash ON analysis (text_hash);




#   ____        __ _       _ _   _
#  |  _ \  ___ / _(_)_ __ (_) |_(_) ___  _ __  ___
#  | | | |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \/ __|
#  | |_| |  __/  _| | | | | | |_| | (_) | | | \__ \
#  |____/ \___|_| |_|_| |_|_|\__|_|\___/|_| |_|___/

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
