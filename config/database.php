<?php
$host = 'localhost';   // Usually localhost
$db   = 'chimba_invoicing';  // Database name
$user = 'root';        // MySQL username
$pass = '';            // MySQL password (empty on XAMPP/LAMPP)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Show errors
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Show the exact error for debugging
    die('Database connection failed: ' . $e->getMessage());
}
