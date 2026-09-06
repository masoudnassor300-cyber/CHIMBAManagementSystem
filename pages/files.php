<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';

// Handle filters
$where = [];
$params = [];

// Use file_date instead of created_at
if (!empty($_GET['date_from'])) {
    $where[] = 'f.file_date >= :date_from';
    $params[':date_from'] = $_GET['date_from'];
}

if (!empty($_GET['date_to'])) {
    $where[] = 'f.file_date <= :date_to';
    $params[':date_to'] = $_GET['date_to'];
}

if (!empty($_GET['file_from'])) {
    $where[] = 'f.file_id >= :file_from';
    $params[':file_from'] = $_GET['file_from'];
}

if (!empty($_GET['file_to'])) {
    $where[] = 'f.file_id <= :file_to';
    $params[':file_to'] = $_GET['file_to'];
}

if (!empty($_GET['customer_name'])) {
    $where[] = 'c.name LIKE :customer_name';
    $params[':customer_name'] = '%' . $_GET['customer_name'] . '%';
}

// Default sort by File ID ascending
$sql = "SELECT f.*, c.name as client_name 
        FROM files f
        JOIN clients c ON c.id = f.client_id";

if ($where) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY f.file_id ASC"; // <--- Sorted by File ID lowest to highest

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$files = $stmt->fetchAll();
?>

<h2>Files</h2>

<!-- Search Bar -->
<input type="text" id="fileSearch" placeholder="Search files..." 
       class="form-control" style="margin-bottom:15px; max-width:300px;">

<!-- Add File Button -->
<button class="btn btn-primary no-print" style="margin-bottom:15px;"
        onclick="openModal('fileModal')">Add New File</button>

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
            <label>File ID From:</label><br>
            <input type="text" name="file_from" value="<?=e($_GET['file_from'] ?? '')?>">
        </div>
        <div>
            <label>File ID To:</label><br>
            <input type="text" name="file_to" value="<?=e($_GET['file_to'] ?? '')?>">
        </div>
        <div>
            <label>Customer Name:</label><br>
            <input type="text" name="customer_name" placeholder="Search name..." value="<?=e($_GET['customer_name'] ?? '')?>">
        </div>
        <div>
            <button type="submit" class="btn btn-primary">Filter</button>
            <a href="files.php" class="btn btn-secondary">Reset</a>
        </div>
    </form>
</div>

<!-- Files Table -->
<table class="table table-bordered">
    <thead>
        <tr>
            <th style="cursor:pointer" onclick="sortTable(0)">File ID</th>
            <th style="cursor:pointer" onclick="sortTable(1)">Client Name</th>
            <th style="cursor:pointer" onclick="sortTable(2)">AWB/BL</th>
            <th style="cursor:pointer" onclick="sortTable(3)">Job Number</th>
            <th style="cursor:pointer" onclick="sortTable(4)">File Date</th>
        </tr>
    </thead>
    <tbody id="filesTableBody">
        <?php
        foreach ($files as $file) {
            echo "<tr>
                <td>".e($file['file_id'])."</td>
                <td>".e($file['client_name'])."</td>
                <td>".e($file['awb_bl'])."</td>
                <td>".e($file['job_number'])."</td>
                <td>".e($file['file_date'])."</td>
            </tr>";
        }
        if (!$files) {
            echo "<tr><td colspan='5' style='text-align:center;'>No files found.</td></tr>";
        }
        ?>
    </tbody>
</table>

<?php include '../modals/file_modal.php'; ?>

<!-- Search & Sorting Script -->
<script>
    const searchInput = document.getElementById('fileSearch');
    const tableBody = document.getElementById('filesTableBody');

    searchInput.addEventListener('keyup', function() {
        const filter = searchInput.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

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

    function sortTable(colIndex) {
        const rows = Array.from(tableBody.getElementsByTagName('tr'));
        let asc = tableBody.getAttribute('data-sort-col') != colIndex || tableBody.getAttribute('data-sort-dir') === 'desc';
        
        rows.sort((a, b) => {
            let aText = a.getElementsByTagName('td')[colIndex].textContent.trim();
            let bText = b.getElementsByTagName('td')[colIndex].textContent.trim();

            let aNum = parseFloat(aText.replace(/,/g, ''));
            let bNum = parseFloat(bText.replace(/,/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return asc ? aNum - bNum : bNum - aNum;
            }

            return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        rows.forEach(row => tableBody.appendChild(row));
        tableBody.setAttribute('data-sort-col', colIndex);
        tableBody.setAttribute('data-sort-dir', asc ? 'asc' : 'desc');
    }
</script>

<?php include '../includes/footer.php'; ?>