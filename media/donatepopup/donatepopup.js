// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + (value || "") + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function showDonationPopup() {
    const lastPopupTime = getCookie('lastPopupTime');
    const currentTime = new Date().getTime();

    if (!lastPopupTime || currentTime - lastPopupTime >= 24 * 60 * 60 * 1000) {
        document.getElementById('donationPopup').classList.remove('hidden');
        setCookie('lastPopupTime', currentTime, 1); // Expires in 1 day
    }
}

window.addEventListener('load', () => {
    setTimeout(showDonationPopup, 3000); // 3-second delay for demonstration purposes
});

// Close donation popup button
document.getElementById('closeDonationPopup').addEventListener('click', () => {
    document.getElementById('donationPopup').classList.add('hidden');
});
