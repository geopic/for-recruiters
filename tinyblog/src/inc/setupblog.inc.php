<?php
require_once '../classes/DBConnection.class.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: /');
  exit();
} else {
  // Config to use for db connection and write to file
  $config = array('driver' => 'mysql', 'host' => 'localhost', 'dbname' => $_POST['db-name'], 'username' => $_POST['db-user-name'], 'password' => $_POST['db-user-pass']);
  $confFilePath = '../../bin/settings.config.php';

  $db = new DBConnection($config);
  
  // Early return (exit) if db connection fails or config file already exists
  if ($db->dbc === null || file_exists($confFilePath)) {
    exit();
  }

  file_put_contents($confFilePath, $config);
}