<?php

//establish connection to sql database
$mysqli = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'calendar'); // creating the connection

// checking the connection 
if($mysqli->connect_errno) {
    printf("Connection Failed: %s\n", $mysqli->connect_error);
    exit;
}

?>