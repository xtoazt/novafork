function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function showDonationPopup() {
    // Always show the popup on page load, regardless of cookies
    document.getElementById('donationPopup').classList.remove('hidden');
}

window.addEventListener('load', () => {
    setTimeout(showDonationPopup, 3000); // Show popup after 3 seconds on page load
});

document.getElementById('closeDonationPopup').addEventListener('click', () => {
    document.getElementById('donationPopup').classList.add('hidden');
});
