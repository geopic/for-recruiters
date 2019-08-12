CREATE DATABASE tinyblog IF NOT EXISTS;

USE tinyblog;

CREATE TABLE `posts` (
  `id` TINYINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `post_content` TEXT NOT NULL,
  `post_created` DATETIME NOT NULL,
);

CREATE TABLE `comments` (
  `id` TINYINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `comment_author` VARCHAR(32) NOT NULL,
  `comment_content` TEXT NOT NULL,
  `comment_posted` DATETIME NOT NULL,
  `post_id` TINYINT NOT NULL,
  CONSTRAINT `fk_post_id`
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE RESTRICT,
);

CREATE TABLE `meta` (
  `id` TINYINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `author_username` VARCHAR(32) NOT NULL,
  `author_pw` VARCHAR(32) NOT NULL,
  `blog_name` VARCHAR(64) NOT NULL,
  `blog_created` DATETIME NOT NULL,
);