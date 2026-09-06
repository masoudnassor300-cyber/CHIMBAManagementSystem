<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';

$file_date = $_POST['file_date'] ?? '';
$file_id = clean($_POST['file_id'] ?? '');
$job_number = clean($_POST['job_number'] ?? '');
$client_id = $_POST['client_id'] ?? '';
$supplier_name = clean($_POST['supplier_name'] ?? '');
$awb_bl = clean($_POST['awb_bl'] ?? '');
$reference = clean($_POST['reference'] ?? '');
$description = clean($_POST['description'] ?? '');
$vessel = clean($_POST['vessel'] ?? '');
$place_of_loading = clean($_POST['place_of_loading'] ?? '');

// Required
if (!$file_date || !$file_id || !$job_number || !$client_id) {
    echo "Date, File ID, Job Number and Client are required!";
    exit;
}

// Check duplicate file ID
$stmt = $pdo->prepare("SELECT COUNT(*) FROM files WHERE file_id = ?");
$stmt->execute([$file_id]);
if ($stmt->fetchColumn() > 0) {
    echo "File ID already exists!";
    exit;
}

// Insert
$stmt = $pdo->prepare("
    INSERT INTO files 
    (file_date, file_id, job_number, client_id, supplier_name, awb_bl, reference, description, vessel, place_of_loading)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
if ($stmt->execute([$file_date, $file_id, $job_number, $client_id, $supplier_name, $awb_bl, $reference, $description, $vessel, $place_of_loading])) {
    echo "File added successfully!";
} else {
    echo "Error adding file!";
}
