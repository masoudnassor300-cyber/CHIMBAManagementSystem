<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';

// Simple input sanitization
$client_id = clean($_POST['client_id'] ?? '');
$name      = clean($_POST['name'] ?? '');
$address   = clean($_POST['address'] ?? '');
$city      = clean($_POST['city'] ?? '');
$email     = clean($_POST['email'] ?? '');
$tin       = clean($_POST['tin'] ?? '');

// Check required
if (!$client_id || !$name) {
    echo "Client ID and Name are required!";
    exit;
}

// Check duplicate Client ID
$stmt = $pdo->prepare("SELECT COUNT(*) FROM clients WHERE client_id = ?");
$stmt->execute([$client_id]);
if ($stmt->fetchColumn() > 0) {
    echo "Client ID already exists!";
    exit;
}

// Insert
$stmt = $pdo->prepare("INSERT INTO clients (client_id, name, address, city, email, tin) VALUES (?,?,?,?,?,?)");
if ($stmt->execute([$client_id, $name, $address, $city, $email, $tin])) {
    echo "Client added successfully!";
} else {
    echo "Error adding client!";
}
