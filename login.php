<?php      
    include('connect.php');  
    $username = $_POST['user_name'];
    $password = $_POST['password'];  
      
        //to prevent from mysqli injection  
        $user_name = stripcslashes($user_name);  
        $password = stripcslashes($password);  
        $user_name = mysqli_real_escape_string($connect, $user_name);  
        $password = mysqli_real_escape_string($connect, $password);  
    
        $sql = "SELECT * FROM daftar_client where user_name = '$user_name' and password = '$password'";  
        $result = mysqli_query($connect, $sql);  
        $row = mysqli_fetch_array($result, MYSQLI_ASSOC);  
        $count = mysqli_num_rows($result);  
          
        if($count != 1){    
            echo("<script LANGUAGE='JavaScript'>
                        // window.alert('Username or Password is wrong. Please try again.');
                        window.location.href='home.html';
                    </script>");
        }     
        else{
            header('Location: login.html');
        }
?>