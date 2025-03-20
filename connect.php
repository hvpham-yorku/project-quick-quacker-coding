
<!--Connects to the main database containing account-->
<?php

$host = "localhost";
$dbUsername = "Username";
$dbPassword = "Password";
$conn = new mysqli( $host,$dbUsername,$dbPassword,"QuickQuacker.sql");

if(empty($Username) || empty($Password)) {
    die("Error: There is no username or password");
}

$conn = mysqli_connect('localhost', 'name', 'password','QuickQuacker.sql')
or die("Error: cannot connect to servers")
?>

