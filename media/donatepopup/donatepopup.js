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
    const lastPopupTime = getCookie('lastPopupTime');
    const currentTime = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (!lastPopupTime || currentTime - lastPopupTime >= oneWeek) {
        document.getElementById('donationPopup').classList.remove('hidden');
        setCookie('lastPopupTime', currentTime, 7);
    }
}

window.addEventListener('load', () => {
    setTimeout(showDonationPopup, 3000);
});
document.getElementById('closeDonationPopup').addEventListener('click', () => {
    document.getElementById('donationPopup').classList.add('hidden');
});
