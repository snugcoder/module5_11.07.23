<?php
    session_start(); 
    header("Content-Type: application/json");
    require 'sqlconnect.php';

        //get the given username and password
        $json_str = file_get_contents('php://input');

        $json_obj = json_decode($json_str, true);
        
        $checkusername = $json_obj['username'];
        $checkpassword = $json_obj['password'];
        $action = $json_obj['action'];

    // <!-- FIEO -->
    // <!-- validate username  -->
    if( !preg_match('/^[\w_\-]+$/', $checkusername) ){
        echo json_encode(array(
            "success" => false,
            "message" => "invalid username"
        )); 
        exit;
    }

    if(strlen($checkusername) != 0 && strlen($checkpassword) != 0){ // there is given input for both username and password
        $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
        if(!$stmt){
            //printf("Query Prep Failed: %s\n", $mysqli->error);
            echo json_encode(array(
                "success" => false,
                "message" => "Query Prep Failed"
            )); 
            exit;
        }
        // if($action == "LOGIN"){
        $stmt->bind_param('s', $checkusername);

        $stmt->execute();  
        $stmt->bind_result($numrows); // store the number of rows gotten from select statement into variable  
        $stmt->fetch();
        $stmt->close();

        if($numrows == 1) { // 1 row present means there is a matching username 
            $sql_stmt = $mysqli->prepare("SELECT id, username, hashed_pass FROM users WHERE username = ?");

            if(!$sql_stmt){
                // printf("Query Prep Failed: %s\n", $mysqli->error);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Query Prep Failed"
                )); 
                exit; 
            }
            $sql_stmt->bind_param('s', $checkusername);
            $sql_stmt->execute();
            $sql_stmt->bind_result($id, $username, $hashpassword);
            $sql_stmt->fetch();

            if(password_verify($checkpassword, $hashpassword)) { // check if matching
                session_start(); // start new session with correct login credentials 
                $_SESSION["registereduser"] = true; // use variable to check for posting and commenting 
                $_SESSION["id"] = $id;
                $_SESSION["username"] = $checkusername;
                $_SESSION["password"] = $checkpassword;
                $token = bin2hex(openssl_random_pseudo_bytes(32)); // create the CSRF token
                $_SESSION['token'] = $token;
                $sql_stmt->close(); // after checking user, close the select statment 
                } else {
                 // but specifically, password is not valid
                    echo json_encode(array(
                        "success" => false,
                        "message" => "Invalid password"
                    )); 
                }
                echo json_encode(array(
                    "success" => true,
                    "username" => $checkusername,
                    "userID" => $id,
                    "token" => $token,
                    "message" => "Successful Login."
                ));
            } else{
                // username is not valid
                echo json_encode(array(
                    "success" => false,
                    "message" => "Invalid username"
                )); 
            }
        // }
    
    } else{
        echo json_encode(array( // if either user input for username or password was blank 
            "success" => false,
            "message" => "username or password is empty, please input something first"
        )); 
    }
?>