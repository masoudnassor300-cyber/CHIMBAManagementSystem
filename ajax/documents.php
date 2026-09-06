<?php
require_once '../config/database.php';
header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(403);
    echo json_encode(['error'=>'Invalid request']);
    exit;
}

try{
    $pdo->beginTransaction();

    // Get form data
    $document_type = $_POST['document_type'] ?? '';
    $file_id       = (int) $_POST['file_id'] ?? 0;        // FK to files.id
    $file_code     = $_POST['file_code'] ?? '';           // text FileID
    $client_id     = (int) $_POST['client_id'] ?? 0;
    $file_date     = $_POST['file_date'] ?? '';
    $transport     = $_POST['transport_type'] ?? null;

    if(!$document_type || !$file_id || !$file_code || !$client_id){
        throw new Exception('Missing required fields');
    }

    // Determine Document Number
if($document_type === 'Invoice'){
    $document_number = "CLL/$file_code";
} else {

    $base_number = "DN/23$file_code"; // ✅ hardcoded 23
    $document_number = $base_number;

    $counter = 0;

    while (true) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM documents WHERE document_number = ?");
        $stmt->execute([$document_number]);
        $exists = $stmt->fetchColumn();

        if ($exists == 0) {
            break; // ✅ unique found
        }

        $counter++;
        $suffix = chr(65 + $counter); // B, C, D...
        $document_number = $base_number . $suffix;
    }
}

    // Handle items
    $items = [];
    $total_amount = 0;

    $item_names = $_POST['item_name'] ?? [];
    $qtys       = $_POST['qty'] ?? [];
    $prices     = $_POST['price'] ?? [];

    foreach($item_names as $i => $name){
        $qty = floatval($qtys[$i] ?? 0);
        $price = floatval($prices[$i] ?? 0);

        // Ignore zero items
        if($qty <= 0 || $price <= 0) continue;

        $line_total = $qty * $price;
        $items[] = [
            'item_name'  => $name,
            'qty'        => $qty,
            'unit_price' => $price,
            'line_total' => $line_total
        ];
        $total_amount += $line_total;
    }

    if(empty($items)){
        throw new Exception('No valid items to save');
    }

    // Insert into documents table
    $stmt = $pdo->prepare("
        INSERT INTO documents 
        (document_type, document_number, file_id, file_code, client_id, transport_type, file_date, total, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $document_type,
        $document_number,
        $file_id,
        $file_code,
        $client_id,
        $transport,
        $file_date,
        $total_amount
    ]);

    $document_id = $pdo->lastInsertId();

    // Insert items
    $stmt_item = $pdo->prepare("
        INSERT INTO document_items (document_id, item_name, qty, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach($items as $item){
        $stmt_item->execute([
            $document_id,
            $item['item_name'],
            $item['qty'],
            $item['unit_price'],
            $item['line_total']
        ]);
    }

    $pdo->commit();

    echo json_encode(['status'=>'success','document_number'=>$document_number]);

}catch(Exception $e){
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error'=>$e->getMessage()]);
}
