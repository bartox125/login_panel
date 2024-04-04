document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;

    if (!name || !pass) {
        alert('Nie wszystkie pola są wypełnione');
        return false;
    }
    this.submit();
});