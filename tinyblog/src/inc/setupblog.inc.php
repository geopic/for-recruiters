<?php
require_once '../classes/DBConnection.class.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: '.DIRECTORY_SEPARATOR);
  exit();
}

// Config to use for db connection and write to file
$config = array('driver' => 'mysql', 'host' => 'localhost', 'dbname' => trim($_POST['db-name']), 'username' => trim($_POST['db-user-name']), 'password' => trim($_POST['db-user-pass']));
$confFilePath = __DIR__.str_replace('/', DIRECTORY_SEPARATOR, '/../../bin/settings.json');

$db = new DBConnection($config);

// Early return (exit) if config file already exists
if (file_exists($confFilePath)) {
  echo '<br>Your config file already exists at '.$confFilePath.'. Please delete it and retry the setup process.';
  exit();
}

file_put_contents($confFilePath, '{"database": '.json_encode($config).', "info": '. json_encode(array('blogName' => trim($_POST['blog-name']), 'userName' => trim($_POST['user-name']), 'userPass' => trim($_POST['user-pass']))) .'}');
