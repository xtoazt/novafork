
document.getElementById('togglePopularMedia').addEventListener('click', function() {
    var popularMediaSection = document.getElementById('popularMedia');
    var toggleButton = document.getElementById('togglePopularMedia');

    if (popularMediaSection.style.display === 'none') {
        popularMediaSection.style.display = 'grid';
        toggleButton.textContent = 'Hide Popular Media';
    } else {
        popularMediaSection.style.display = 'none';
        toggleButton.textContent = 'Show Popular Media';
    }
});
