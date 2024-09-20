$(document).ready(function() {
    const $popularMediaSection = $('#popularMedia');
    const $toggleButton = $('#togglePopularMedia');

    // Load the saved preference from localStorage
    const isHidden = localStorage.getItem('popularMediaHidden') === 'true';

    // Toggle visibility and button text based on stored preference
    $popularMediaSection.toggle(!isHidden);
    $toggleButton.text(isHidden ? 'Show Trending Media' : 'Hide Trending Media');

    $toggleButton.on('click', function() {
        const isCurrentlyHidden = $popularMediaSection.is(':hidden');

        // Toggle visibility and update button text
        $popularMediaSection.toggle(isCurrentlyHidden);
        $toggleButton.text(isCurrentlyHidden ? 'Hide Trending Media' : 'Show Trending Media');

        // Save the new state in localStorage
        localStorage.setItem('popularMediaHidden', isCurrentlyHidden);
    });
});