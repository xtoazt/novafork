document.addEventListener('DOMContentLoaded', function () {
    const popularMediaSection = document.getElementById('popularMedia');
    const toggleButton = document.getElementById('togglePopularMedia');

    // Load the saved preference from localStorage
    const isHidden = localStorage.getItem('popularMediaHidden') === 'true';


    popularMediaSection.style.display = isHidden ? 'none' : 'grid';
    toggleButton.textContent = isHidden ? 'Show Popular Media' : 'Hide Popular Media';


    toggleButton.addEventListener('click', function () {
        const isCurrentlyHidden = popularMediaSection.style.display === 'none';


        popularMediaSection.style.display = isCurrentlyHidden ? 'grid' : 'none';
        toggleButton.textContent = isCurrentlyHidden ? 'Hide Popular Media' : 'Show Popular Media';


        localStorage.setItem('popularMediaHidden', !isCurrentlyHidden);
    });
});
