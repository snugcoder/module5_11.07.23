<?php
require 'sqlconnect.php';
header("Content-Type: application/json");
session_start();

$id = $_SESSION['id'];
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$title = $json_obj["title"]; 
$summary = $json_obj["summary"];
$year = $json_obj["year"];
$month = $json_obj["month"]; 
$day = $json_obj["day"]; 
$hour = $json_obj["hour"]; 
$minute = $json_obj["minute"];
$startTime= "$year-$month-$day $hour:$minute:00";

if(strlen($year) == 0 || strlen($month) == 0 || strlen($day) == 0 || strlen($hour) == 0 || strlen($title) == 0 || strlen($summary) == 0 || strlen($minute) == 0){
    echo json_encode(array(
        "success" => false,
        "message" => "Entries can't be empty"
    )); 
    exit;
}
$stmt = $mysqli->prepare("insert into events (user_id, title, summary, start_date_time) values (?, ?, ?, ?);");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    )); 
    exit;
}

$stmt->bind_param('isss', $id, $title, $summary, $startTime);//if something goes wrong here, then change the datatype for start_date_time

$stmt->execute();

echo json_encode(array(
    "success" => true,
    "message" => "success"
));  

$stmt->close();
?>