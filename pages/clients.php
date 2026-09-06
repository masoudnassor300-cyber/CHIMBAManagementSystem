<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';
?>

<h2>Clients</h2>

<!-- Search Bar -->
<input type="text" id="clientSearch" placeholder="Search clients..." 
       class="form-control" style="margin-bottom:15px; max-width:300px;">

<!-- Add Client Button -->
<button class="btn btn-primary no-print" style="margin-bottom:15px;"
        onclick="openModal('clientModal')">Add New Client</button>

<!-- Clients Table -->
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Client ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Email</th>
            <th>TIN</th>
            <th>Files</th>
        </tr>
    </thead>
    <tbody id="clientsTable">
        <?php
        $stmt = $pdo->query("SELECT * FROM clients ORDER BY created_at DESC");
        $clients = $stmt->fetchAll();
        foreach ($clients as $client) {
            $fileCount = clientFilesCount($pdo, $client['id']);
            echo "<tr>
                <td>".e($client['client_id'])."</td>
                <td>".e($client['name'])."</td>
                <td>".e($client['address'])."</td>
                <td>".e($client['city'])."</td>
                <td>".e($client['email'])."</td>
                <td>".e($client['tin'])."</td>
                <td>$fileCount</td>
            </tr>";
        }
        ?>
    </tbody>
</table>

<?php include '../modals/client_modal.php'; ?>

<!-- Search Table Script -->
<script>
    const searchInput = document.getElementById('clientSearch');
    const table = document.getElementById('clientsTable');

    searchInput.addEventListener('keyup', function() {
        const filter = searchInput.value.toLowerCase();
        const rows = table.getElementsByTagName('tr');

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

<?php include '../includes/footer.php'; ?>
