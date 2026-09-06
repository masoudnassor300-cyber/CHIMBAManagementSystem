<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';

$doc_id = (int)($_GET['id'] ?? 0);

// Fetch document
$stmt = $pdo->prepare("
    SELECT d.*, c.name AS client_name, c.address, c.city, c.email, c.tin,
           f.supplier_name, f.awb_bl, f.reference, f.description,
           f.vessel, f.place_of_loading, f.job_number
    FROM documents d
    JOIN clients c ON c.id = d.client_id
    JOIN files f ON f.id = d.file_id
    WHERE d.id = ?
");
$stmt->execute([$doc_id]);
$doc = $stmt->fetch();

// Fetch items
$stmt = $pdo->prepare("
    SELECT * FROM document_items
    WHERE document_id = ? AND qty > 0 AND unit_price > 0
");
$stmt->execute([$doc_id]);
$items = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><?= e($doc['document_number']) ?></title>

<style>
@page { size: A4; margin: 12mm; }

body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #222;
}

table {
    width: 100%;
    border-collapse: collapse;
}

td, th {
    padding: 6px;
    vertical-align: top;
}

/* HEADER */
.header td {
    vertical-align: middle;
}

.logo img {
    height: 55px;
}

.company-name {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 1px;
}

.company-details {
    font-size: 12px;
    color: #444;
}

/* JOB BOX */
.job-box {
    border: 1.5px solid #000;
    width: 110px;
    text-align: center;
    padding: 6px;
    float: left;
    margin-bottom: 8px;
}

.job-box small {
    font-size: 9px;
    color: #000000ff;
}

.job-box strong {
    font-size: 13px;
}

/* LINE */
.line {
    border-top: 2px solid #000;
    margin: 10px 0;
}

/* TITLE */
.title {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
}

.doc-meta {
    font-size: 14px;
}

/* SECTIONS */
.section-box {
    border: 1px solid #000;
    padding: 8px;
}

.section-title {
    font-weight: bold;
    font-size: 11px;
    text-transform: uppercase;
    margin-bottom: 4px;
}

/* ITEMS */
.items th {
    background: #000;
    color: #fff;
    font-weight: bold;
}

.items td {
    border-bottom: 1px solid #000000ff;
}

.right {
    text-align: right;
}

/* TOTALS */
.total-table {
    width: 280px;
    margin-left: auto;
    margin-top: 10px;
}

.total-table td {
    padding: 5px;
}

.total-table .grand {
    font-weight: bold;
    border-top: 2px solid #000;
    font-size: 13px;
}

/* FOOTER */
.footer {
    margin-top: 25px;
    font-size: 11px;
    border-top: 1px solid #000000ff;
    padding-top: 6px;
}

/* SIGN */
.sign {
    margin-top: 40px;
    text-align: center;
}
</style>

</head>

<body onload="window.print()">

<!-- HEADER -->
<table class="header">
<tr>
<td width="60%">
    <table>
        <tr>
            <td class="logo" width="70">
                <img src="logo.png">
            </td>
            <td>
                <div class="company-name">CHIMBA LOGISTICS LTD</div>
                <div class="company-details">
                    P.O BOX 77652, DAR ES SALAAM<br>
                    Email: accounts@chimbalogistics.co.tz<br>
                    TIN: 140-456-160
                </div>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>

<div class="line"></div>

<!-- TITLE + META -->
<table>
<tr>

<!-- LEFT: JOB BOX -->
<td width="40%">
    <div class="job-box">
        <small>JOB NO:</small><br>
        <strong><?= e($doc['job_number'] ?? '-') ?></strong>
    </div>
</td>

<!-- RIGHT: DOCUMENT DETAILS -->
<td width="60%" class="right">

    <!-- DOCUMENT TITLE -->
    <div class="title">
        <?php
            $docType = strtolower($doc['document_type']);
            if ($docType === 'invoice') {
                echo 'TAX INVOICE';
            } else {
                echo strtoupper(str_replace('_',' ',$doc['document_type']));
            }
        ?>
    </div>

    <!-- DOCUMENT NUMBER -->
    <div class="doc-meta">
        No: <b><?= e($doc['document_number']) ?></b>
    </div>

    <!-- DATE -->
    <div class="doc-meta">
        Date: <?= e($doc['file_date']) ?>
    </div>

</td>

</tr>
</table>

<br> 

<!-- CLIENT + SHIPMENT -->
<table>
<tr>
<td width="50%">
    <div class="section-box">
        <div class="section-title">Bill To</div>
        <strong><?= e($doc['client_name']) ?></strong><br>
        <?= e($doc['address']) ?><br>
        <?= e($doc['city']) ?><br>
        TIN: <?= e($doc['tin']) ?>
    </div>
</td>

<td width="50%">
    <div class="section-box">
        <div class="section-title">Shipment Details</div>
        Supplier: <?= e($doc['supplier_name']) ?><br>
        AWB / BL: <?= e($doc['awb_bl']) ?><br>
        Reference: <?= e($doc['reference']) ?><br>
        Vessel: <?= e($doc['vessel']) ?><br>
        Place of Loading: <?= e($doc['place_of_loading']) ?>
    </div>
</td>
</tr>
</table>

<br>

<!-- DESCRIPTION -->
<div class="section-box">
    <div class="section-title">Description of Goods</div>
    <?= e($doc['description'] ?? '-') ?>
</div>

<br>

<!-- ITEMS -->
<table class="items">
<tr>
<th>Item</th>
<th class="right">Qty</th>
<th class="right">Unit Price</th>
<th class="right">Line Total</th>
</tr>

<?php foreach($items as $it): ?>
<tr>
<td><?= e($it['item_name']) ?></td>
<td class="right"><?= (int)$it['qty'] ?></td>
<td class="right"><?= number_format($it['unit_price'],2) ?></td>
<td class="right"><?= number_format($it['line_total'],2) ?></td>
</tr>
<?php endforeach; ?>

</table>

<!-- TOTALS -->
<table class="total-table">
<tr>
<td>Subtotal</td>
<td class="right"><?= number_format($doc['total'],2) ?></td>
</tr>
<tr>
<td>VAT</td>
<td class="right">0.00</td>
</tr>
<tr class="grand">
<td>Total</td>
<td class="right"><?= number_format($doc['total'],2) ?></td>
</tr>
</table>

<!-- FOOTER -->
<div class="footer">
Bank: AMANA BANK LTD – MBAGALA<br>
Account: 007121821720001 | SWIFT: AMNNTZTZ
</div>

<!-- SIGN -->
<table class="sign">
<tr>
<td width="50%">
_________________________<br>
Prepared By
</td>
<td width="50%">
_________________________<br>
Approved By
</td>
</tr>
</table>

</body>
</html>