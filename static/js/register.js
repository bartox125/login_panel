document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let pass = document.getElementById('p1').value;
    let confirmPass = document.getElementById('p2').value;

    if (!name || !pass || !confirmPass) {
        alert('Nie wszystkie pola są wypełnione');
        return false;
    }
    if (pass !== confirmPass) {
        alert('Hasła się nie zgadzają!');
        return false;
    }
    this.submit();
});