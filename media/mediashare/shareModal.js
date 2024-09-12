
function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function showModal() {
    let lastShown = getCookie('popupShown');
    if (!lastShown || (new Date() - new Date(lastShown)) > 7 * 24 * 60 * 60 * 1000) { // 7 days in milliseconds
        document.getElementById('shareModal').classList.remove('hidden');
    }
}

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('shareModal').classList.add('hidden');
    setCookie('popupShown', new Date().toUTCString(), 7); // Set cookie to expire in 7 days
});

// Show the modal on page load
window.addEventListener('load', showModal);