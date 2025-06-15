<?php
session_start();
session_destroy();
header("Location: DashboardGuto/php/login.php");
exit;
?>
