<?php session_start();
header("Content-Type: application/json");
require 'sqlconnect.php';

// PHP code to create new user

// we need to connect to module3 database in order to validate information from the form
//change the echo's in the file to send data to the console
// $json = file_get_contents('php://input');
// $json_obj = json_decode($json, true);
// echo ("hello?");
    $newuser = $_POST['register-user'];
    $password = $_POST['register-password'];
    echo ("hello?");
    if(strlen($newuser) != 0 && strlen($password) != 0) { // the typed in something for both username an password 
        //FIEO
        // Get the username of new user and make sure it is valid
        if( !preg_match('/^[\w_\-]+$/', $newuser) ){
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid Username"
            )); 
            
        }
        // query the user name to check if the name exists in the database
        $check_stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
        if(!$check_stmt){
            //printf("Query Prep Failed: %s\n", $mysqli->error);
            echo json_encode(array(
                "success" => false,
                "message" => "Query Prep Failed"
            )); 
            exit;
        }
        $check_stmt->bind_param('s', $newuser);
        $check_stmt->execute();  
        $check_stmt->bind_result($numrows); // store the number of rows gotten from select statement into variable  
        $check_stmt->fetch();
        $check_stmt->close();

        if($numrows == 0){  //if a user with this username does not exist then a new user can be added with that name
            // the username does not already exist
            $stmt = $mysqli->prepare("insert into users (username, hashed_pass) values (?, ?)"); //this is our php equivalent sql command
            if(!$stmt){
                //printf("Query Prep Failed: %s\n", $mysqli->error);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Query Prep Failed"
                )); 
                exit; 
            }
            // manually salt the passwords
            $salt = random_bytes(32);
            $options = [
                'salty' => $salt,
            ];
            //here we hash the password and make it more safe
            $password_hash = password_hash($password, PASSWORD_BCRYPT, $options);
            
            $stmt->bind_param('ss', $newuser, $password_hash);
            $stmt->execute();
            $stmt->close();
            if (!$mysqli->commit()) {
                echo json_encode(array(
                    "success" => false,
                    "message" => "Commit Transaction Failed"
                )); 
                exit();
            }
            echo json_encode(array(
                "success" => true,
                "message" => "Successful Login."
            )); 
        }else{
            // username is already taken
            echo json_encode(array(
                "success" => false,
                "message" => "Username is already taken"
            )); 
        }
    } else {
            echo json_encode(array(
                "success" => false,
                "message" => "Invalid username and password"
            )); 
    }

?>