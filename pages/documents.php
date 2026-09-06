<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';

// Handle filters
$where = [];
$params = [];

// SORT OPTION
$sort = $_GET['sort'] ?? 'newest';

if (!empty($_GET['date_from'])) {
    $where[] = 'f.file_date >= :date_from';
    $params[':date_from'] = $_GET['date_from'];
}

if (!empty($_GET['date_to'])) {
    $where[] = 'f.file_date <= :date_to';
    $params[':date_to'] = $_GET['date_to'];
}

if (!empty($_GET['document_type'])) {
    $where[] = 'd.document_type = :document_type';
    $params[':document_type'] = $_GET['document_type'];
}

if (!empty($_GET['client_name'])) {
    $where[] = 'c.name LIKE :client_name';
    $params[':client_name'] = '%' . $_GET['client_name'] . '%';
}

$sql = "
    SELECT 
        d.*,
        c.name AS client_name,
        f.file_id AS file_code,
        f.file_date AS file_date
    FROM documents d
    JOIN clients c ON c.id = d.client_id
    JOIN files f ON f.id = d.file_id
";

if ($where) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

// SORT LOGIC
switch ($sort) {
    case 'doc_no':
        $sql .= " ORDER BY d.document_number ASC";
        break;
    case 'type':
        $sql .= " ORDER BY d.document_type ASC";
        break;
    case 'file_id':
        $sql .= " ORDER BY f.file_id ASC";
        break;
    case 'client':
        $sql .= " ORDER BY c.name ASC";
        break;
    case 'date':
        $sql .= " ORDER BY f.file_date DESC";
        break;
    case 'total':
        $sql .= " ORDER BY d.total DESC";
        break;
    case 'oldest':
        $sql .= " ORDER BY d.created_at ASC";
        break;
    case 'highest':
        $sql .= " ORDER BY d.total DESC";
        break;
    case 'lowest':
        $sql .= " ORDER BY d.total ASC";
        break;
    default:
        $sql .= " ORDER BY d.created_at DESC";
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$docs = $stmt->fetchAll();
?>

<h2>Documents</h2>

<!-- ACTION BUTTONS -->
<div class="no-print" style="margin-bottom:15px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
    <button class="btn btn-primary" onclick="openDocumentModal('invoice')">
        Create Invoice
    </button>
    <button class="btn btn-danger" onclick="openDocumentModal('Debit_Note')">
        Create Debit Note
    </button>

    <!-- Search Bar -->
    <input type="text" id="documentSearch" placeholder="Search documents..." 
           class="form-control" style="max-width:300px; margin-left:auto;">
</div>

<!-- FILTERS -->
<div class="filters" style="margin-bottom:20px; border:1px solid #ccc; padding:15px; border-radius:8px;">
    <form method="get" style="display:flex; flex-wrap:wrap; gap:10px; align-items:flex-end;">
        
        <div>
            <label>Date From:</label><br>
            <input type="date" name="date_from" value="<?=e($_GET['date_from'] ?? '')?>">
        </div>

        <div>
            <label>Date To:</label><br>
            <input type="date" name="date_to" value="<?=e($_GET['date_to'] ?? '')?>">
        </div>

        <div>
            <label>Document Type:</label><br>
            <select name="document_type">
                <option value="">All</option>
                <option value="invoice" <?= (($_GET['document_type'] ?? '') == 'invoice') ? 'selected' : '' ?>>Invoice</option>
                <option value="Debit_Note" <?= (($_GET['document_type'] ?? '') == 'Debit_Note') ? 'selected' : '' ?>>Debit Note</option>
            </select>
        </div>

        <div>
            <label>Client Name:</label><br>
            <input type="text" name="client_name" placeholder="Search client..." value="<?=e($_GET['client_name'] ?? '')?>">
        </div>

        <div>
            <button type="submit" class="btn btn-primary">Filter</button>
            <a href="documents.php" class="btn btn-secondary">Reset</a>
        </div>
    </form>
</div>

<!-- DOCUMENTS TABLE -->
<table class="table table-bordered">
    <thead>
        <tr>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'doc_no'])) ?>">Document No</a>
            </th>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'type'])) ?>">Type</a>
            </th>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'file_id'])) ?>">File ID</a>
            </th>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'client'])) ?>">Client</a>
            </th>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'date'])) ?>">Date</a>
            </th>
            <th>
                <a href="?<?= http_build_query(array_merge($_GET, ['sort' => 'total'])) ?>">Total</a>
            </th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="documentsTable">
        <?php
        foreach ($docs as $d) {
            echo "
            <tr>
                <td>".e($d['document_number'])."</td>
                <td>".e($d['document_type'])."</td>
                <td>".e($d['file_code'])."</td>
                <td>".e($d['client_name'])."</td>
                <td>".e($d['file_date'])."</td>
                <td>".number_format($d['total'],2)."</td>
                <td>
                    <button class='btn btn-secondary' onclick='printDocument(".$d['id'].")'>
                        Print
                    </button>
                </td>
            </tr>";
        }
        if (!$docs) {
            echo "<tr><td colspan='7' style='text-align:center;'>No documents found.</td></tr>";
        }
        ?>
    </tbody>
</table>

<?php include '../modals/document_modal.php'; ?>
<?php include '../includes/footer.php'; ?>

<script>
function openDocumentModal(type){
    document.getElementById('document_type').value = type;
    document.getElementById('documentModal').style.display = 'flex';
    setTimeout(initDocumentModal, 50);
}

function printDocument(id){
    window.open('print_document.php?id='+id,'_blank');
}

// SEARCH FUNCTIONALITY
const docSearchInput = document.getElementById('documentSearch');
const documentsTable = document.getElementById('documentsTable');

docSearchInput.addEventListener('keyup', function() {
    const filter = docSearchInput.value.toLowerCase();
    const rows = documentsTable.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }

        rows[i].style.display = match ? '' : 'none';
    }
});
</script>