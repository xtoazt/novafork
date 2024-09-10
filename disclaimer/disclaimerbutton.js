document.addEventListener('DOMContentLoaded', function() {
    const disclaimerButton = document.getElementById('disclaimerButton');
    const disclaimerModal = document.getElementById('disclaimerModal');
    const closeDisclaimerButton = document.getElementById('closeDisclaimerButton');

    if (disclaimerButton && disclaimerModal && closeDisclaimerButton) {
        disclaimerButton.addEventListener('click', function() {
            disclaimerModal.classList.remove('hidden');
        });

        closeDisclaimerButton.addEventListener('click', function() {
            disclaimerModal.classList.add('hidden');
        });
    }
});
