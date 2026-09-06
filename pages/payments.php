<?php
require_once '../config/database.php';
require_once '../helpers/functions.php';
include '../includes/header.php';

// Handle payment submission
if(isset($_POST['mark_paid'])){
    $doc_id = (int)$_POST['document_id'];
    $paid_amount = (float)$_POST['paid_amount'];

    // Get current paid amount
    $stmt = $pdo->prepare("SELECT paid_amount, total FROM documents WHERE id = ?");
    $stmt->execute([$doc_id]);
    $doc = $stmt->fetch();

    if($doc){
        $new_paid = $doc['paid_amount'] + $paid_amount;
        $stmt = $pdo->prepare("UPDATE documents SET paid_amount = ? WHERE id = ?");
        $stmt->execute([$new_paid, $doc_id]);
        $success = "Payment updated successfully!";
    }
}

// Fetch documents with balances
$stmt = $pdo->query("
    SELECT d.*, c.name AS client_name,
           (d.total - IFNULL(d.paid_amount,0)) AS balance
    FROM documents d
    JOIN clients c ON c.id = d.client_id
    ORDER BY d.created_at DESC
");
$docs = $stmt->fetchAll();

// Total left
$stmt2 = $pdo->query("SELECT SUM(total - IFNULL(paid_amount,0)) AS total_left FROM documents");
$total_left = $stmt2->fetchColumn();
?>

<h2>Payments</h2>

<?php if(isset($success)): ?>
<div style="color:green; margin-bottom:10px;"><?= $success ?></div>
<?php endif; ?>

<div style="margin-bottom:15px;">
    <strong>Total Left to Collect: TSH <?= number_format($total_left,2) ?></strong>
</div>

<table class="table">
<thead>
<tr>
<th>Document No</th>
<th>Type</th>
<th>Client</th>
<th>Total (TSH)</th>
<th>Paid (TSH)</th>
<th>Balance (TSH)</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<?php foreach($docs as $d): ?>
<tr>
<td><?= e($d['document_number']) ?></td>
<td><?= strtoupper(e($d['document_type'])) ?></td>
<td><?= e($d['client_name']) ?></td>
<td class="right"><?= number_format($d['total'],2) ?></td>
<td class="right"><?= number_format($d['paid_amount'] ?? 0,2) ?></td>
<td class="right"><?= number_format($d['balance'],2) ?></td>
<td>
    <button onclick="openPaymentModal(<?= $d['id'] ?>, '<?= e($d['document_number']) ?>', <?= $d['balance'] ?>)">
        Mark Paid
    </button>
</td>
</tr>
<?php endforeach; ?>
</tbody>
</table>

<!-- PAYMENT MODAL -->
<div id="paymentModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
    background:rgba(0,0,0,0.5); justify-content:center; align-items:center;">
    <div style="background:white; padding:20px; width:350px; border-radius:6px; position:relative;">
        <h3>Mark Payment</h3>
        <form method="post">
            <input type="hidden" name="document_id" id="modal_doc_id">
            <p>Document: <span id="modal_doc_number"></span></p>
            <p>Balance Left: TSH <span id="modal_balance"></span></p>
            <p>
                Amount to Pay:<br>
                <input type="number" name="paid_amount" id="modal_paid_amount" step="0.01" max="0" required>
            </p>
            <button type="submit" name="mark_paid">Submit</button>
            <button type="button" onclick="closePaymentModal()">Cancel</button>
        </form>
    </div>
</div>

<script>
function openPaymentModal(id, number, balance){
    document.getElementById('modal_doc_id').value = id;
    document.getElementById('modal_doc_number').innerText = number;
    document.getElementById('modal_balance').innerText = balance.toLocaleString();
    let input = document.getElementById('modal_paid_amount');
    input.max = balance;
    input.value = balance;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal(){
    document.getElementById('paymentModal').style.display = 'none';
}
</script>

<?php include '../includes/footer.php'; ?>