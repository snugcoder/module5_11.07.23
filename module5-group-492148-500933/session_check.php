<?php
    header("Content-Type: application/json");
    session_start();

    if(isset($_SESSION['username'])){
        echo json_encode(array(
            "success" => true,
            "username" => $_SESSION['username'],
            "userid" => $_SESSION['id'],
            "token" => $_SESSION['token']
        ));
    }else{
        echo json_encode(array(
            "success" => false
        ));
    }
?>