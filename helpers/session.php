<?php

  session_start();

  $action = $_POST["action"];

  if ( $action === "get" ) {
    echo json_encode( $_SESSION );
  }

  elseif ( $action === "set" ) {
    $name = $_POST["name"];
    $value = $_POST["value"];

    $_SESSION[$name] = $value;
    echo json_encode( $_SESSION );
  }

  elseif ( $action === "destroy" ) {
    session_destroy();
  }

?>