<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';

/* FILTERS */
$where = [];
$params = [];

if (!empty($_GET['from'])) {
    $where[] = "d.file_date >= ?";
    $params[] = $_GET['from'];
}
if (!empty($_GET['to'])) {
    $where[] = "d.file_date <= ?";
    $params[] = $_GET['to'];
}
if (!empty($_GET['client_id'])) {
    $where[] = "d.client_id = ?";
    $params[] = $_GET['client_id'];
}
if (!empty($_GET['type'])) {
    $where[] = "d.document_type = ?";
    $params[] = $_GET['type'];
}
if (!empty($_GET['file_no'])) {
    $where[] = "f.file_id LIKE ?";
    $params[] = "%".$_GET['file_no']."%";
}

$whereSql = $where ? 'WHERE '.implode(' AND ', $where) : '';
?>

<style>
/* FILTERS */
.summary-filters{
    background:#fff;
    padding:15px;
    border-radius:8px;
    margin-bottom:20px;
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
}
.summary-filters input,
.summary-filters select{
    padding:7px 10px;
    border:1px solid #ccc;
    border-radius:4px;
}

/* KPI CARDS */
.kpi-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
    gap:20px;
    margin-bottom:25px;
}
.kpi{
    background:#ffffff;
    padding:20px;
    border-radius:10px;
    box-shadow:0 2px 6px rgba(0,0,0,0.08);
}
.kpi span{
    font-size:13px;
    color:#666;
}
.kpi h3{
    margin:8px 0 0;
    font-size:24px;
    color:#111;
}

/* ITEM SUMMARY TABLE */
#itemSummary, #itemSummary th, #itemSummary td{
    border-collapse:collapse;
    border:1px solid #eee;
}
#itemSummary th{
    background:#f4f6f8;
    padding:12px;
    font-size:13px;
    text-align:left;
}
#itemSummary td{
    padding:12px;
}
#itemSummary button{
    cursor:pointer;
}
</style>

<h2>Financial Summary</h2>

<!-- FILTER BAR -->
<form method="get" class="summary-filters no-print">
    <input type="date" name="from" value="<?= e($_GET['from'] ?? '') ?>">
    <input type="date" name="to" value="<?= e($_GET['to'] ?? '') ?>">

    <input type="text" name="file_no" placeholder="File Number" value="<?= e($_GET['file_no'] ?? '') ?>">

    <select name="client_id">
        <option value="">All Clients</option>
        <?php
        foreach ($pdo->query("SELECT id,name FROM clients ORDER BY name") as $c) {
            $sel = ($_GET['client_id'] ?? '') == $c['id'] ? 'selected' : '';
            echo "<option value='{$c['id']}' $sel>{$c['name']}</option>";
        }
        ?>
    </select>

    <select name="type">
        <option value="">All Documents</option>
        <option value="invoice" <?= ($_GET['type'] ?? '')=='invoice'?'selected':'' ?>>Invoice</option>
        <option value="debit_note" <?= ($_GET['type'] ?? '')=='debit_note'?'selected':'' ?>>Debit Note</option>
    </select>

    <button class="btn btn-primary">Apply</button>
</form>

<?php
/* KPI QUERY */
$stmt = $pdo->prepare("
    SELECT
        COUNT(CASE WHEN d.document_type='invoice' THEN 1 END) invoice_count,
        SUM(CASE WHEN d.document_type='invoice' THEN d.total ELSE 0 END) invoice_total,
        COUNT(CASE WHEN d.document_type='debit_note' THEN 1 END) debit_count,
        SUM(CASE WHEN d.document_type='debit_note' THEN d.total ELSE 0 END) debit_total
    FROM documents d
    JOIN files f ON f.id = d.file_id
    $whereSql
");
$stmt->execute($params);
$kpi = $stmt->fetch();
?>

<!-- KPI CARDS -->
<div class="kpi-grid">
    <div class="kpi">
        <span>Total Invoices</span>
        <h3><?= $kpi['invoice_count'] ?></h3>
    </div>

    <div class="kpi">
        <span>Invoice Value</span>
        <h3><?= number_format($kpi['invoice_total'],2) ?></h3>
    </div>

    <div class="kpi">
        <span>Total Debit Notes</span>
        <h3><?= $kpi['debit_count'] ?></h3>
    </div>

    <div class="kpi">
        <span>Debit Note Value</span>
        <h3><?= number_format($kpi['debit_total'],2) ?></h3>
    </div>
</div>

<?php
/* ITEM SUMMARY */
$stmt = $pdo->prepare("
    SELECT 
        di.item_name,
        SUM(CASE WHEN d.document_type='invoice' THEN di.line_total ELSE 0 END) invoice_total,
        SUM(CASE WHEN d.document_type='debit_note' THEN di.line_total ELSE 0 END) debit_total
    FROM document_items di
    JOIN documents d ON d.id = di.document_id
    JOIN files f ON f.id = d.file_id
    $whereSql
    GROUP BY di.item_name
    HAVING invoice_total > 0 OR debit_total > 0
    ORDER BY di.item_name
");
$stmt->execute($params);
$items = $stmt->fetchAll();
?>

<h3>Item Summary</h3>

<table id="itemSummary" style="width:100%;">
    <thead>
        <tr>
            <th>Item</th>
            <th>Invoice Total</th>
            <th>Debit Note Total</th>
            <th>Details</th>
        </tr>
    </thead>
    <tbody>
    <?php
    foreach ($items as $i):
        $itemName = $i['item_name'];
        $itemId = preg_replace('/[^a-z0-9]/i','',$itemName); // safe id
    ?>
        <tr>
            <td><?= e($itemName) ?></td>
            <td><?= number_format($i['invoice_total'],2) ?></td>
            <td><?= number_format($i['debit_total'],2) ?></td>
            <td>
                <button onclick="toggleDetails('<?= $itemId ?>')">[+]</button>
            </td>
        </tr>

        <!-- HIDDEN DETAILS -->
        <tr id="details-<?= $itemId ?>" style="display:none; background:#f9f9f9;">
            <td colspan="4">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr>
                            <th>Document No</th>
                            <th>File Number</th>
                            <th>Document Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    // fetch contributing documents for this item
                    $stmt2 = $pdo->prepare("
                        SELECT d.document_number, f.file_id, d.document_type, di.line_total
                        FROM document_items di
                        JOIN documents d ON d.id = di.document_id
                        JOIN files f ON f.id = d.file_id
                        WHERE di.item_name = ?
                        " . ($whereSql ? " AND " . implode(' AND ', $where) : '') . "
                        ORDER BY d.file_date
                    ");
                    $stmt2->execute(array_merge([$itemName], $params));
                    $details = $stmt2->fetchAll();
                    foreach($details as $det):
                    ?>
                        <tr>
                            <td><?= e($det['document_number']) ?></td>
                            <td><?= e($det['file_id']) ?></td>
                            <td><?= ucfirst(str_replace('_',' ',$det['document_type'])) ?></td>
                            <td><?= number_format($det['line_total'],2) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </td>
        </tr>

    <?php endforeach; ?>
    </tbody>
</table>

<script>
function toggleDetails(id){
    var row = document.getElementById('details-'+id);
    if(row.style.display === 'none'){
        row.style.display = 'table-row';
    }else{
        row.style.display = 'none';
    }
}
</script>

<?php include '../includes/footer.php'; ?>
