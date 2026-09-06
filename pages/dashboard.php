<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';
?>

<h2>Dashboard</h2>

<div style="display:flex; flex-wrap:wrap; gap:20px; margin-top:20px;">
    <!-- Total Clients -->
    <div style="flex:1; min-width:200px; background:#0d6efd; color:white; padding:20px; border-radius:6px;">
        <h3>Total Clients</h3>
        <p style="font-size:24px; font-weight:bold;">
            <?php 
            $stmt = $pdo->query("SELECT COUNT(*) FROM clients");
            echo number_format($stmt->fetchColumn());
            ?>
        </p>
    </div>

    <!-- Total Files -->
    <div style="flex:1; min-width:200px; background:#dc3545; color:white; padding:20px; border-radius:6px;">
        <h3>Total Files</h3>
        <p style="font-size:24px; font-weight:bold;">
            <?php 
            $stmt = $pdo->query("SELECT COUNT(*) FROM files");
            echo number_format($stmt->fetchColumn());
            ?>
        </p>
    </div>

    <!-- Total Invoices -->
    <div style="flex:1; min-width:200px; background:#007bff; color:white; padding:20px; border-radius:6px;">
        <h3>Total Invoices</h3>
        <p style="font-size:24px; font-weight:bold;">
            TZS <?= number_format(totalInvoices($pdo)) ?>
        </p>
    </div>

    <!-- Total Debit Notes -->
    <div style="flex:1; min-width:200px; background:#dc3545; color:white; padding:20px; border-radius:6px;">
        <h3>Total Debit Notes</h3>
        <p style="font-size:24px; font-weight:bold;">
            TZS <?= number_format(totalDebitNotes($pdo)) ?>
        </p>
    </div>
</div>

<?php include '../includes/footer.php'; ?>
