<?php
require_once('./DBConnection.class.php');

// TOP SECRET and hacker-proof database connection parameters
$dbconfig = array('driver' => 'mysql', 'host' => 'localhost', 'dbname' => 'tinyblogdb', 'username' => 'tinybloguser', 'password' => 'hello123');
$dbconn = new DBConnection($dbconfig);
