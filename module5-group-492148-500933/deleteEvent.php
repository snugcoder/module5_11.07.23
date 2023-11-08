<?php
require 'database.php';

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');

$json_obj = json_decode($json_str, true);

$eventId = $json_obj["eventid"];

    $stmt = $mysqli->prepare("delete from events where eventid = ?");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed"
        )); 
        exit;
    }

    $stmt->bind_param('s', $eventId);

    $stmt->execute();

    $stmt->close();
    
    echo json_encode(array(
        "success" => true,
        "message" => "Event Deleted Sucessfully"
    ));  

?>

