<?php
// Fetch files and client info
$files = $pdo->query("
    SELECT f.id, f.file_id, f.job_number, f.file_date,
           c.id AS client_id, c.name AS client_name, c.tin
    FROM files f
    JOIN clients c ON c.id=f.client_id
    ORDER BY f.created_at DESC
")->fetchAll(PDO::FETCH_ASSOC);

// Prefilled items
$debitItems = [
    'Airport'=>[
        'Swissport / Handling / Storage','Consolidation Fees','TBS','Additional Duty',
        'Amendment Fees','Customs Rent','Chemical Permits','Kilimo','Misc','Road Transport','Magunia/Mbao'
    ],
    'Sea Port'=>[
        'Shipping Line','Demurrage Charges','Makbul','Transire','Consolidation / Handover','Port Charges','TBS',
        'Amendment Fee','Manifest Ammendment','Additional Duty','Chemical Permit','Carmatec',
        'Customs Rent','Misc','Kilimo','Plate Number',
        'Kufuli','Petrol','Driver','Interchange','Road Transport','Magunia/Mbao','TPA/TICTS/ICD Charges'
    ],
    'Road Transport'=>[
        'Handling','TBS','Kilimo','Transport','Consolidation','Amendment Fee',
        'Additional Duty','Rent','Others','Misc'
    ]
];
$invoiceItems = ['Agency Fees'];
?>

<div id="documentModal" class="modal">
<div class="modal-content">

<h2>Create Document</h2>

<form id="documentForm">

<!-- Document Type -->
<label>Document Type</label>
<select id="document_type" name="document_type" required>
    <option value="">--Select--</option>
    <option value="Invoice">Invoice</option>
    <option value="Debit_Note">Debit Note</option>
</select>

<!-- File Search -->
<label>Search File</label>
<input type="text" id="fileSearch" placeholder="Type File ID or Client Name">
<div id="fileResults"></div>

<!-- Hidden Inputs -->
<input type="hidden" name="file_id" id="file_id">       <!-- FK numeric -->
<input type="hidden" name="file_code" id="file_code">   <!-- text File ID -->
<input type="hidden" name="client_id" id="client_id">

<!-- Client Info -->
<div class="grid">
    <input type="text" id="client_name" placeholder="Client Name" readonly>
    <input type="text" id="client_tin" placeholder="TIN" readonly>
    <input type="text" id="job_number" placeholder="Job Number" readonly>
    <input type="date" name="file_date" id="file_date" required>
</div>

<!-- Transport Type (for Debit Note) -->
<div id="transportBox" style="display:none;">
    <label>Transport Type</label>
    <select id="transport_type" name="transport_type">
        <option value="Airport">Airport</option>
        <option value="Sea Port">Sea Port</option>
        <option value="Road Transport">Road Transport</option>
    </select>
</div>

<!-- Items Table -->
<table id="docItemsTable">
    <thead>
        <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Line Total</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>

<button type="button" id="addItemBtn">+ Add Item</button>

<p>Total: <strong id="doc_total">0.00</strong></p>

<button type="submit" class="btn btn-primary">Save Document</button>
<button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>

</form>
</div>
</div>

<style>
.modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;justify-content:center;align-items:center;z-index:999;}
.modal-content{background:#fff;padding:20px;width:95%;max-width:950px;border-radius:6px;max-height:90vh;overflow:auto;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-bottom:10px;}
#fileResults{border:1px solid #ccc;max-height:150px;overflow:auto;margin-bottom:10px;}
#fileResults div{padding:6px;cursor:pointer;}
#fileResults div:hover{background:#eee;}
table{width:100%;border-collapse:collapse;margin-top:10px;}
th,td{border:1px solid #ccc;padding:5px;text-align:left;}
input,select{width:100%;padding:6px;}
button{margin-top:10px;padding:6px 12px;cursor:pointer;}
</style>

<script>
const FILES = <?= json_encode($files) ?>;
const debitItems = <?= json_encode($debitItems) ?>;
const invoiceItems = <?= json_encode($invoiceItems) ?>;

// File Search
fileSearch.oninput = () => {
    fileResults.innerHTML = '';
    const v = fileSearch.value.toLowerCase();
    FILES.filter(f => f.file_id.toLowerCase().includes(v) || f.client_name.toLowerCase().includes(v))
    .forEach(f => {
        const d = document.createElement('div');
        d.textContent = f.file_id + ' - ' + f.client_name;
        d.onclick = () => selectFile(f);
        fileResults.appendChild(d);
    });
};

function selectFile(f){
    file_id.value = f.id;           // FK
    file_code.value = f.file_id;    // human-readable
    client_id.value = f.client_id;
    client_name.value = f.client_name;
    client_tin.value = f.tin;
    job_number.value = f.job_number;
    file_date.value = f.file_date;
    fileSearch.value = f.file_id;
    fileResults.innerHTML='';
    initDocumentItems();
}

// Init items
function initDocumentItems(){
    const tbody = document.querySelector('#docItemsTable tbody');
    tbody.innerHTML = '';
    populateItems();
}

// Populate items based on type
function populateItems(){
    const type = document_type.value;
    const tbody = document.querySelector('#docItemsTable tbody');
    tbody.innerHTML = '';
    let items = [];

    if(type==='Invoice'){
        transportBox.style.display='none';
        items = invoiceItems;
    }else if(type==='Debit_Note'){
        transportBox.style.display='block';
        const t = transport_type.value;
        items = debitItems[t] || [];
    }

    items.forEach(i => addRow(i));
}

// Add new row
function addRow(name=''){
    const tr = document.createElement('tr');
    tr.innerHTML = `
<td><input name="item_name[]" value="${name}"></td>
<td><input type="number" name="qty[]" value="1" min="0"></td>
<td><input type="number" name="price[]" value="0" min="0"></td>
<td class="line">0.00</td>
<td><button type="button" onclick="this.closest('tr').remove();calc()">✕</button></td>`;
    document.querySelector('#docItemsTable tbody').appendChild(tr);
    calc();
}

// Calc totals
function calc(){
    let total = 0;
    document.querySelectorAll('#docItemsTable tbody tr').forEach(r=>{
        const q = parseFloat(r.querySelector('[name="qty[]"]').value)||0;
        const p = parseFloat(r.querySelector('[name="price[]"]').value)||0;
        const line = q*p;
        r.querySelector('.line').innerText = line.toFixed(2);
        total += line;
    });
    doc_total.innerText = total.toFixed(2);
}

// Event listeners
document_type.onchange = populateItems;
transport_type.onchange = populateItems;
addItemBtn.onclick = () => addRow();
document.addEventListener('input', calc);

function closeModal(){documentModal.style.display='none';}

// Form submission
document.getElementById('documentForm').onsubmit = function(e){
    e.preventDefault();
    const formData = new FormData(this);
    fetch('../ajax/documents.php', {method:'POST', body: formData})
    .then(r=>r.json())
    .then(res=>{
        if(res.status==='success'){alert('Document saved'); location.reload();}
        else alert(res.error || 'Error saving document');
    }).catch(()=>alert('Error saving document'));
};
</script>
