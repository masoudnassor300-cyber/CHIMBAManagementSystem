<?php
// helpers/functions.php

/* =====================================
   SECURITY & SANITIZATION
===================================== */

// Basic escape for output
function e($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

// Trim & sanitize input
function clean($data) {
    return trim(strip_tags($data ?? ''));
}

/* =====================================
   DATE & MONEY
===================================== */

// Format date for display
function formatDate($date) {
    if (!$date) return '';
    return date('d-m-Y', strtotime($date));
}

// Format money (2 decimals)
function money($amount) {
    return number_format((float)$amount, 2, '.', '');
}

/* =====================================
   DOCUMENT CALCULATIONS
===================================== */

// Calculate subtotal from items (ignores zero values)
function calculateSubtotal($items) {
    $subtotal = 0;
    foreach ($items as $item) {
        if ($item['line_total'] > 0) {
            $subtotal += $item['line_total'];
        }
    }
    return $subtotal;
}

// Filter items for print (ZERO RULE)
function printableItems($items) {
    return array_filter($items, function ($item) {
        return $item['line_total'] > 0;
    });
}

/* =====================================
   CLIENT & FILE HELPERS
===================================== */

// Count files per client
function clientFilesCount($pdo, $clientId) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM files WHERE client_id = ?");
    $stmt->execute([$clientId]);
    return (int) $stmt->fetchColumn();
}

// Get client by internal ID
function getClient($pdo, $clientId) {
    $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
    $stmt->execute([$clientId]);
    return $stmt->fetch();
}

// Get file by internal ID
function getFile($pdo, $fileId) {
    $stmt = $pdo->prepare("SELECT * FROM files WHERE id = ?");
    $stmt->execute([$fileId]);
    return $stmt->fetch();
}

/* =====================================
   DOCUMENT HELPERS
===================================== */

// Get document items
function getDocumentItems($pdo, $documentId) {
    $stmt = $pdo->prepare("SELECT * FROM document_items WHERE document_id = ?");
    $stmt->execute([$documentId]);
    return $stmt->fetchAll();
}

// Check if document has printable items
function hasPrintableItems($pdo, $documentId) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM document_items 
        WHERE document_id = ? 
        AND line_total > 0
    ");
    $stmt->execute([$documentId]);
    return $stmt->fetchColumn() > 0;
}

/* =====================================
   DEBIT NOTE SUFFIX LOGIC
===================================== */

// Generate DN suffix (B, C, D...)
function nextDebitNoteSuffix($pdo, $fileId) {
    $stmt = $pdo->prepare("
        SELECT document_number 
        FROM documents 
        WHERE file_id = ? 
        AND document_type = 'debit_note'
        ORDER BY id ASC
    ");
    $stmt->execute([$fileId]);
    $count = $stmt->rowCount();

    if ($count <= 1) return ''; // First DN has no suffix

    // B, C, D...
    return chr(64 + $count);
}

/* =====================================
   SUMMARY HELPERS
===================================== */

// Get total invoices amount
function totalInvoices($pdo) {
    return (float) $pdo->query("
        SELECT SUM(total) 
        FROM documents 
        WHERE document_type = 'invoice'
    ")->fetchColumn();
}

// Get total debit notes amount
function totalDebitNotes($pdo) {
    return (float) $pdo->query("
        SELECT SUM(total) 
        FROM documents 
        WHERE document_type = 'debit_note'
    ")->fetchColumn();
}

// Count documents by type
function countDocuments($pdo, $type) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM documents 
        WHERE document_type = ?
    ");
    $stmt->execute([$type]);
    return (int) $stmt->fetchColumn();
}
