
<!--Searches through database to find account-->
<?php
$query= "SELECT * FROM login WHERE Username = '$username' AND Password = '$password'";


$result = $conn->query( $query );

if ($result->num_rows > 0){
    $row = mysqli_fetch_array($result);
}else{
    die("Error: username or password are incorrect");
}
$conn->close();
?>