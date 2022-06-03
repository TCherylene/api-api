<?php
  include "connect.php";

  $sql = "SELECT * from topup";
  $query = mysqli_query($connect, $sql);
  $results = mysqli_fetch_all($query, MYSQLI_ASSOC); 

  foreach ($results as $result) {
    $item[] = array(
      "jumlah_topUp" => $result["jumlah_topUp"],
    //   "password" => $result["password"]
    );
  }