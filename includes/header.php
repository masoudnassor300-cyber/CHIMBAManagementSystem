<?php
// includes/header.php
require_once __DIR__ . '/../config/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CHIMBA LOGISTICS LTD</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>
/* ===============================
   RESET & BASE
================================ */
* {
    box-sizing: border-box;
}
body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #f8f9fa;
    color: #212529;
}

/* ===============================
   NAVBAR
================================ */
.navbar {
    height: 60px;
    background: #0d6efd; /* Blue */
    color: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 20px;
}
.navbar .brand {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
}

/* ===============================
   LAYOUT
================================ */
.wrapper {
    display: flex;
    min-height: calc(100vh - 60px);
}

/* ===============================
   SIDEBAR
================================ */
.sidebar {
    width: 230px;
    background: #ffffff;
    border-right: 3px solid #dc3545; /* Red */
    padding-top: 20px;
}
.sidebar a {
    display: block;
    padding: 12px 20px;
    color: #212529;
    text-decoration: none;
    font-weight: 500;
}
.sidebar a:hover {
    background: #f1f1f1;
    color: #0d6efd;
}
.sidebar a.active {
    background: #0d6efd;
    color: #ffffff;
}

/* ===============================
   MAIN CONTENT
================================ */
.main-content {
    flex: 1;
    padding: 20px;
    background: #ffffff;
}

/* ===============================
   BUTTONS
================================ */
.btn {
    padding: 8px 14px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
}
.btn-primary {
    background: #0d6efd;
    color: #ffffff;
}
.btn-danger {
    background: #dc3545;
    color: #ffffff;
}
.btn-secondary {
    background: #6c757d;
    color: #ffffff;
}

/* ===============================
   TABLES
================================ */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}
table th,
table td {
    border: 1px solid #dee2e6;
    padding: 8px;
    text-align: left;
}
table th {
    background: #f1f1f1;
    font-weight: bold;
}

/* ===============================
   MODAL (BASE)
================================ */
.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.modal-content {
    background: #ffffff;
    width: 95%;
    max-width: 600px;
    padding: 20px;
    border-radius: 6px;
}

/* ===============================
   RESPONSIVE
================================ */
@media (max-width: 768px) {
    .sidebar {
        width: 180px;
    }
}
@media (max-width: 576px) {
    .sidebar {
        display: none;
    }
    .wrapper {
        flex-direction: column;
    }
}

/* ===============================
   PRINT RULES
================================ */
@media print {
    .no-print {
        display: none !important;
    }
    body {
        background: #ffffff;
    }
    table {
        border-collapse: collapse;
    }
}
</style>
</head>

<body>

<!-- NAVBAR -->
<div class="navbar no-print">
    <div class="brand">CHIMBA LOGISTICS LTD</div>
</div>

<!-- PAGE WRAPPER -->
<div class="wrapper">

    <!-- SIDEBAR -->
    <div class="sidebar no-print">
        <a href="../pages/dashboard.php">Dashboard</a>
        <a href="../pages/clients.php">Clients</a>
        <a href="../pages/files.php">Files</a>
        <a href="../pages/documents.php">Documents</a>
        <a href="../pages/summary.php">Summary</a>
    </div>

    <!-- MAIN CONTENT START -->
    <div class="main-content">
