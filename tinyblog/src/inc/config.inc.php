<?php
require_once(__DIR__.'/../classes/DBConnection.class.php');

// Database connection
$_Db = null;
// $_Db = new DBConnection(array('driver' => 'mysql', 'host' => 'localhost', 'dbname' => 'tinyblog', 'username' => 'tinybloguser', 'password' => 'password123'));

// Blog object
$_Blog = null;

/*if (!isset($_Db->dbc)) {
  exit('Bad connection');
}*/
