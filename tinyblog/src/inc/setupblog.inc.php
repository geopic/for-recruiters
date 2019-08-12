<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: /');
  exit();
} else {
  var_dump($_POST);
}