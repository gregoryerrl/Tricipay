<?php include "db_connection.php";
include "helpers.php";
session_start();
$action = $_GET["action"];
$conn->query("Set NAMES 'utf8';");
if ($action === "query") {
  $sql = replace_session_variables($_GET["query"]);
  try {
    $result = $conn->query($sql);
    $temp = "[";
    while ($row = $result->fetch_assoc()) {
      if ($temp !== "[") {
        $temp .= ",";
      }
      $temp .= json_encode($row);
    }
    $temp .= "]";
    echo $temp;
  } catch (Exception $e) {
    echo "Error: " . $e->getMessage();
  }
} elseif ($action === "non-query") {
  $sql = replace_session_variables($_GET["query"]);
  try {
    $conn->query($sql);
    echo "success";
  } catch (Exception $e) {
    echo "failed: " . $e->getMessage();
  }
}
