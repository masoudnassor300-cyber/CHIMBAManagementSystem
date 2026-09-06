<?php
// includes/footer.php
?>

<script>
/* =====================================
   GLOBAL HELPERS
===================================== */

// Open modal
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Close modal
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Format money (2 decimals)
function money(val) {
    val = parseFloat(val || 0);
    return val.toFixed(2);
}

/* =====================================
   DOCUMENT ITEMS CALCULATION
===================================== */

function calculateRow(row) {
    const qty = row.querySelector('.qty');
    const price = row.querySelector('.price');
    const total = row.querySelector('.line-total');

    let lineTotal = (parseFloat(qty.value || 0) * parseFloat(price.value || 0));
    total.value = money(lineTotal);

    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;

    document.querySelectorAll('.line-total').forEach(input => {
        let val = parseFloat(input.value || 0);
        if (val > 0) subtotal += val;
    });

    const subtotalField = document.getElementById('subtotal');
    const totalField = document.getElementById('total');

    if (subtotalField) subtotalField.value = money(subtotal);
    if (totalField) totalField.value = money(subtotal);
}

/* =====================================
   ADD / REMOVE ITEM ROWS
===================================== */

function addItemRow(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" name="item_name[]" /></td>
        <td><input type="number" class="qty" name="qty[]" value="1" min="0"
                   oninput="calculateRow(this.closest('tr'))"></td>
        <td><input type="number" class="price" name="unit_price[]" min="0"
                   oninput="calculateRow(this.closest('tr'))"></td>
        <td><input type="text" class="line-total" name="line_total[]" readonly></td>
        <td class="no-print">
            <button type="button" class="btn btn-danger"
                    onclick="this.closest('tr').remove(); calculateTotals();">
                X
            </button>
        </td>
    `;
    container.appendChild(row);
}

/* =====================================
   AJAX HELPER
===================================== */

function ajax(url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(xhr.responseText);
        } else {
            alert('Server error');
        }
    };

    xhr.send(data);
}

/* =====================================
   CLIENT SEARCH AUTOFILL
===================================== */

function selectClient(id, name, address, city, email, tin) {
    document.getElementById('client_id').value = id;
    document.getElementById('client_name').value = name;
    document.getElementById('client_address').value = address;
    document.getElementById('client_city').value = city;
    document.getElementById('client_email').value = email;
    document.getElementById('client_tin').value = tin;

    closeModal('clientSearchModal');
}

</script>

</div> <!-- END MAIN CONTENT -->
</div> <!-- END WRAPPER -->
</body>
</html>