<?php
  include "connect.php";

  $nama_client = isset($_POST["nama_client"]) ? $_POST["nama_client"] : "";
  $user_name = isset($_POST["user_name"]) ? $_POST["user_name"] : "";
  $no_hp = isset($_POST["no_hp"]) ? $_POST["no_hp"] : "";
  $password = isset($_POST["password"]) ? $_POST["password"] : "";

  if ($nama_client != "" && $user_name != "" && $no_hp != "" && $password != "") 
  {
    $sql_user_name = "SELECT * FROM daftar_client WHERE user_name = '$user_name'";
    $res_user_name = mysqli_query($connect, $sql_user_name);

    $sql = "INSERT INTO `daftar_client` (`nama_client`, `user_name`,`no_hp`, `password`	) VALUES ('".$nama_client."', '".$user_name."".$no_hp."', '".$password."');";
    $query = mysqli_query($connect, $sql);
  }

  if ($query) 
  {
    $msg = "Save account data successfully!";
  } 
  else 
  {
    $msg = "Save account data failed";
  }

  $response = array(
    "msg" => $msg
  );

  echo json_encode($response);

  header('Location: register.html');
?>