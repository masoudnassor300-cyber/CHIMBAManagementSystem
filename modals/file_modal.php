<div id="fileModal" class="modal">
    <div class="modal-content">
        <h3>Add New File</h3>
        <form id="fileForm">
            <label>Date:</label><br>
            <input type="date" name="file_date" required><br><br>

            <label>File ID:</label><br>
            <input type="text" name="file_id" required><br><br>

            <label>Job Number:</label><br>
            <input type="text" name="job_number" required><br><br>

            <label>Client:</label><br>
            <input type="text" id="client_search_input" placeholder="Type to search client..." required>
            <input type="hidden" name="client_id" id="client_id"><br><br>

            <label>Supplier Name:</label><br>
            <input type="text" name="supplier_name"><br><br>

            <label>AWB/BL:</label><br>
            <input type="text" name="awb_bl"><br><br>

            <label>Reference:</label><br>
            <input type="text" name="reference"><br><br>

            <label>Description of Goods:</label><br>
            <textarea name="description"></textarea><br><br>

            <label>Vessel:</label><br>
            <input type="text" name="vessel"><br><br>

            <label>Place of Loading:</label><br>
            <input type="text" name="place_of_loading"><br><br>

            <button type="submit" class="btn btn-primary">Save File</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('fileModal')">Cancel</button>
        </form>
    </div>
</div>

<!-- CLIENT SELECT MODAL -->
<div id="clientSelectModal" class="modal">
    <div class="modal-content">
        <h3>Select Client</h3>
        <input type="text" id="clientFilter" placeholder="Type to search..." style="width:100%; padding:8px; margin-bottom:10px; border-radius:4px; border:1px solid #ccc;">

        <table id="clientTable" style="width:100%; border-collapse:collapse;">
            <thead>
                <tr style="background:#ddd;">
                    <th style="padding:8px; border:1px solid #ccc;">Client ID</th>
                    <th style="padding:8px; border:1px solid #ccc;">Name</th>
                    <th style="padding:8px; border:1px solid #ccc;">City</th>
                    <th style="padding:8px; border:1px solid #ccc;">Select</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM clients ORDER BY name ASC");
                $clients = $stmt->fetchAll();
                foreach ($clients as $c) {
                    $id = e($c['id']);
                    $name = htmlspecialchars($c['name'], ENT_QUOTES);
                    $client_id_html = e($c['client_id']);
                    $city = e($c['city']);
                    echo "<tr>
                        <td style='padding:8px; border:1px solid #ccc;'>$client_id_html</td>
                        <td style='padding:8px; border:1px solid #ccc;'>$name</td>
                        <td style='padding:8px; border:1px solid #ccc;'>$city</td>
                        <td style='padding:8px; border:1px solid #ccc;'>
                            <button type='button' class='btn btn-primary select-client' data-id='$id' data-name='$name'>Select</button>
                        </td>
                    </tr>";
                }
                ?>
            </tbody>
        </table>
        <button type="button" class="btn btn-secondary" onclick="closeModal('clientSelectModal')">Cancel</button>
    </div>
</div>

<style>
/* MODAL BASE */
.modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90%;
    overflow-y: auto;
}

/* TABLE */
table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 8px;
    border:1px solid #ccc;
    text-align:left;
}

/* RESPONSIVE */
@media(max-width:600px){
    .modal-content {
        width: 95%;
        padding:15px;
    }
    th, td {
        font-size:12px;
        padding:6px;
    }
    button {
        font-size:12px;
        padding:5px 8px;
    }
}
</style>

<script>
// OPEN / CLOSE MODALS
function openModal(id){document.getElementById(id).style.display='flex';}
function closeModal(id){document.getElementById(id).style.display='none';}

// SELECT CLIENT USING DATA ATTRIBUTES
document.querySelectorAll('.select-client').forEach(btn=>{
    btn.addEventListener('click', function(){
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        document.getElementById('client_id').value = id;
        document.getElementById('client_search_input').value = name;
        closeModal('clientSelectModal');
    });
});

// OPEN CLIENT MODAL WHEN FOCUSING ON INPUT
document.getElementById('client_search_input').addEventListener('focus', function(){
    openModal('clientSelectModal');
    document.getElementById('clientFilter').focus();
});

// LIVE FILTER INSIDE MODAL
document.getElementById('clientFilter').addEventListener('input', function(){
    let filter = this.value.toLowerCase();
    let rows = document.querySelectorAll('#clientTable tbody tr');
    rows.forEach(row => {
        let name = row.cells[1].innerText.toLowerCase();
        let id = row.cells[0].innerText.toLowerCase();
        row.style.display = (name.includes(filter) || id.includes(filter)) ? '' : 'none';
    });
});

// AJAX SUBMIT FILE
document.getElementById('fileForm').addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(this);
    const params = new URLSearchParams(data).toString();
    ajax('../ajax/files.php', params, function(res){
        alert(res);
        location.reload();
    });
});
</script>
