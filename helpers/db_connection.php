<?php

  $server   = 'localhost';
  $username = 'root';
  $password = 'new_password';
  $db       = 'tricipay';
  $conn     = new mysqli( $server, $username, $password, $db );
  

  if ( $conn -> connect_error )  { die( "connection_error" ); }

?>