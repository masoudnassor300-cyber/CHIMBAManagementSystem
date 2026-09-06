<?php
function generateInvoiceNumber($fileId) {
    return "CLL/$fileId";
}

function generateDebitNoteNumber($fileId, $suffix = '') {
    $base = "DN/" . DN_YEAR . $fileId;
    return $suffix ? $base . "($suffix)" : $base;
}
