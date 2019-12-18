/**
 * tinyblog/bin/dbsetup.sql
 * The database setup file for the 'tinyblog' project in the 'for-recruiters' repository.
 * © George Pickering 2019, https://github.com/geopic
 */
CREATE DATABASE IF NOT EXISTS tinyblog;
CREATE USER 'tinybloguser' @'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON tinyblog.* TO 'tinybloguser' @'localhost';
FLUSH PRIVILEGES;
USE tinyblog;
CREATE TABLE `users` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(32) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 -- boolean flag to mark user as deleted. 0 = not deleted, 1 = deleted
);
CREATE TABLE `posts` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `post_content` TEXT NOT NULL,
  `post_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_tags` VARCHAR(128) DEFAULT NULL,
  -- JSON array of tags for the post stored as string, e.g. "[\'food\', \'cooking\']"
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 -- boolean flag to mark post as deleted. 0 = not deleted, 1 = deleted
);
CREATE TABLE `comments` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `comment_author_id` INT NOT NULL,
  `comment_content` TEXT NOT NULL,
  `comment_posted` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_id` INT NOT NULL,
  FOREIGN KEY (`comment_author_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`)
);
CREATE TABLE `meta` (
  `author_id` INT NOT NULL,
  `author_username` VARCHAR(32) NOT NULL,
  `author_pw` VARCHAR(32) NOT NULL,
  `blog_name` VARCHAR(64) NOT NULL,
  `blog_created` DATETIME NOT NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
);
