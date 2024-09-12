function showModal() {
    document.getElementById('shareModal').classList.remove('hidden');
}

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('shareModal').classList.add('hidden');
});

window.addEventListener('load', showModal);
