<?php
require 'sqlconnect.php';
header("Content-Type: application/json");


$id = $_SESSION['id'];

$stmt = $mysqli->prepare("update (id, title, summary, start_date_time) from events where user-id = ?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    )); 
    exit;
}

$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->bind_result($id, $title, $summary, $start_date_time);
//which events do we need to bind_result?
$allEvents = array();
while($stmt -> fetch()){
    $currentEvent = array(
        "id" => $id,
        "title" => $title,
        "summary" => $summary,
        "start_date_time" => $start_date_time
    );
    array_push($allEvents, $currentEvent);
}
$stmt->close();
echo json_encode(array(
    "sucess" => true,
    "allEvents" => $allEvents
)); 


?>