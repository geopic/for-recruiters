<?php
require_once '../classes/DBConnection.class.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: '.DIRECTORY_SEPARATOR);
  exit();
}

// Config to use for db connection and write to file
$config = array('driver' => 'mysql', 'host' => 'localhost', 'dbname' => trim($_POST['db-name']), 'username' => trim($_POST['db-user-name']), 'password' => trim($_POST['db-user-pass']));
$confFilePath = __DIR__.str_replace('/', DIRECTORY_SEPARATOR, '/../../bin/settings.json');

// Early return if config file already exists
if (file_exists($confFilePath)) {
  exit('<br>Your config file already exists at '.$confFilePath.'. Please delete it and retry the setup process.');
}

// Run SQL query to create database
$conn = new mysqli('localhost', 'root', '');
if (mysqli_connect_errno()) {
  exit(mysqli_connect_error());
}
try {
  mysqli_query("
    CREATE DATABASE IF NOT EXISTS ".$config['dbname'].";
    CREATE USER '".$config['username']."' @'".$config['host']."' IDENTIFIED BY '".$config['password']."';
    GRANT ALL PRIVILEGES ON ".$config['dbname'].".* TO '".$config['username']."' @'".$config['host']."';
    FLUSH PRIVILEGES;
    USE ".$config['dbname'].";
    CREATE TABLE `users` (
      `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      `username` VARCHAR(32) NOT NULL,
      `password` VARCHAR(32) NOT NULL,
      `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
    );
    CREATE TABLE `posts` (
      `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      `post_content` TEXT NOT NULL,
      `post_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `post_tags` VARCHAR(128) DEFAULT NULL,
      `is_deleted` TINYINT(1) NOT NULL DEFAULT 0
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
  ");
} catch (Exception $e) {
  echo $e->getMessage();
  exit();
}

// Save to config file
file_put_contents($confFilePath, '{"database": '.json_encode($config).', "info": '. json_encode(array('blogName' => trim($_POST['blog-name']), 'userName' => trim($_POST['user-name']), 'userPass' => trim($_POST['user-pass']))) .'}');
