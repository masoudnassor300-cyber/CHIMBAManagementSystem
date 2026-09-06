<div id="clientModal" class="modal">
    <div class="modal-content">
        <h3>Add New Client</h3>
        <form id="clientForm">
            <label>Client ID:</label><br>
            <input type="text" name="client_id" required><br><br>

            <label>Name:</label><br>
            <input type="text" name="name" required><br><br>

            <label>Address:</label><br>
            <textarea name="address"></textarea><br><br>

            <label>City:</label><br>
            <input type="text" name="city"><br><br>

            <label>Email:</label><br>
            <input type="email" name="email"><br><br>

            <label>TIN:</label><br>
            <input type="text" name="tin"><br><br>

            <button type="submit" class="btn btn-primary">Save Client</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('clientModal')">Cancel</button>
        </form>
    </div>
</div>

<script>
// AJAX submit
document.getElementById('clientForm').addEventListener('submit', function(e){
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    let params = new URLSearchParams(data).toString();

    ajax('../ajax/clients.php', params, function(res){
        alert(res); // show success/error
        location.reload(); // reload table
    });
});
</script>
