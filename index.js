// Utility function to handle errors
function handleError(message, error) {
    console.error(message, error);
    alert(message);
}

// Function to fetch the API key from the configuration file
async function getApiKey() {
    try {
        const response = await fetch('apis/config.json');
        const config = await response.json();
        return config.apiKey;
    } catch (error) {
        handleError('Failed to fetch API key.', error);
        return null;
    }
}

// Function to fetch genres
async function fetchGenres(apiKey) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        if (response.ok) {
            const data = await response.json();
            return data.genres;
        } else {
            handleError('Failed to fetch genres.');
            return [];
        }
    } catch (error) {
        handleError('An error occurred while fetching genres:', error);
        return [];
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function () {
    const homePage = document.getElementById('homePage');
    const welcomeBanner = document.getElementById('welcomeBanner');
    const closeBanner = document.getElementById('closeBanner');
    const categorySelect = document.getElementById('categorySelect');
    const popularMedia = document.getElementById('popularMedia');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const videoPlayer = document.getElementById('videoPlayer');
    const posterImage = document.getElementById('posterImage'); // Assuming you have an element for the poster

    closeBanner.addEventListener('click', () => {
        welcomeBanner.style.display = 'none';
    });

    // Show home page directly
    homePage.classList.remove('hidden');

    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    document.getElementById('searchButton').addEventListener('click', search);
    searchInput.addEventListener('keydown', async function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
    });

    // Fetch the API key
    const API_KEY = await getApiKey();
    if (!API_KEY) return;

    // Fetch genres
    const genres = await fetchGenres(API_KEY);
    const genreMap = genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
    }, {});

    // Function to handle search
    async function search() {
        const searchInputValue = searchInput.value;
        const selectedCategory = categorySelect.value;
        const response = await fetch(`https://api.themoviedb.org/3/search/${selectedCategory}?api_key=${API_KEY}&query=${searchInputValue}`);
        if (response.ok) {
            const data = await response.json();
            displaySearchResults(data.results);
            searchSuggestions.classList.add('hidden');

            // Update the URL to reflect the search query and remove media ID parameters
            const newUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(searchInputValue)}&category=${selectedCategory}`;
            window.history.pushState({ searchInputValue, selectedCategory }, '', newUrl);
        } else {
            handleError('Failed to fetch search results.');
        }
    }

    searchInput.addEventListener('input', async function() {
        const query = searchInput.value;
        if (query.length > 2) {
            const selectedCategory = categorySelect.value;
            const response = await fetch(`https://api.themoviedb.org/3/search/${selectedCategory}?api_key=${API_KEY}&query=${query}`);
            if (response.ok) {
                const data = await response.json();
                displaySearchSuggestions(data.results);
            } else {
                searchSuggestions.classList.add('hidden');
            }
        } else {
            searchSuggestions.classList.add('hidden');
        }
    });

    // Function to fetch popular media
    async function fetchPopularMedia(page = 1) {
        const selectedCategory = categorySelect.value;
        const response = await fetch(`https://api.themoviedb.org/3/trending/${selectedCategory}/week?api_key=${API_KEY}&page=${page}`);
        if (response.ok) {
            const data = await response.json();
            displayPopularMedia(data.results);
            updatePaginationControls(data.page, data.total_pages);
        } else {
            handleError('Failed to fetch popular media.');
        }
    }

    // Function to update pagination controls
    function updatePaginationControls(currentPage, totalPages) {
        const prevPageButton = document.getElementById('prevPage');
        const nextPageButton = document.getElementById('nextPage');
        const currentPageSpan = document.getElementById('currentPage');

        currentPageSpan.textContent = currentPage;

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;

        prevPageButton.onclick = () => changePage(currentPage - 1);
        nextPageButton.onclick = () => changePage(currentPage + 1);
    }

    // Function to change page
    function changePage(page) {
        fetchPopularMedia(page);
    }

    // Function to fetch selected media details and update URL
    async function fetchSelectedMedia(mediaId, mediaType) {
        // Fetch media details
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${API_KEY}`);
        if (response.ok) {
            const media = await response.json();

            // Update the URL with the media ID and type
            const newUrl = `${window.location.origin}${window.location.pathname}?mediaId=${mediaId}&mediaType=${mediaType}`;
            window.history.pushState({ mediaId, mediaType }, '', newUrl);

            displaySelectedMedia(media, mediaType);
            fetchMediaTrailer(mediaId, mediaType);  // Fetch and display the trailer

            // Set the poster image
            if (posterImage && media.poster_path) {
                posterImage.src = `https://image.tmdb.org/t/p/w300${media.poster_path}`;
                posterImage.alt = media.title || media.name;
            }
        } else {
            handleError('Failed to fetch media details.');
        }
    }

    // Function to fetch and display media trailer
    async function fetchMediaTrailer(mediaId, mediaType) {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                videoPlayerContainer.classList.remove('hidden');
                videoPlayer.src = `https://www.youtube.com/embed/${trailer.key}`;
            } else {
                videoPlayerContainer.classList.add('hidden');
                videoPlayer.src = '';
                alert('No trailer available for this media.');
            }
        } else {
            handleError('Failed to fetch media trailer.');
        }
    }

    // Function to display popular media cards
    function displayPopularMedia(results) {
        popularMedia.innerHTML = '';

        // Sort media results by rating in descending order
        const sortedResults = results.sort((a, b) => b.vote_average - a.vote_average);

        sortedResults.forEach(media => {
            const mediaCard = document.createElement('div');
            mediaCard.classList.add('media-card', 'bg-gray-900', 'p-6', 'rounded-lg', 'shadow-lg', 'cursor-pointer', 'transition-transform', 'hover:scale-105', 'relative', 'flex', 'flex-col', 'items-start', 'group', 'overflow-hidden');

            const genreNames = media.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');
            const formattedDate = media.release_date ? new Date(media.release_date).toLocaleDateString() : (media.first_air_date ? new Date(media.first_air_date).toLocaleDateString() : 'Unknown Date');
            const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(media.vote_average / 2) ? '★' : '☆').join(' ');

            mediaCard.innerHTML = `
            <div class="relative w-full h-80 overflow-hidden rounded-lg mb-4">
                <img src="https://image.tmdb.org/t/p/w300${media.poster_path}" alt="${media.title || media.name}" class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
            </div>
            <div class="w-full">
                <h3 class="text-xl font-semibold text-white truncate">${media.title || media.name}</h3>
                <p class="text-gray-400 text-sm mt-1">${media.media_type === 'movie' ? '🎬 Movie' : '📺 TV Show'}</p>
                <p class="text-gray-400 text-sm mt-1">Genres: ${genreNames}</p>
                <div class="flex items-center mt-2">
                    <span class="text-yellow-400 text-lg">${ratingStars}</span>
                    <span class="text-gray-300 text-sm ml-2">${media.vote_average.toFixed(1)}/10</span>
                </div>
                <p class="text-gray-300 text-sm mt-1">Release Date: ${formattedDate}</p>
            </div>
        `;

            // Event listener to fetch and display selected media details
            mediaCard.addEventListener('click', function() {
                fetchSelectedMedia(media.id, media.media_type);
            });

            popularMedia.appendChild(mediaCard);
        });
    }

    // Function to fetch upcoming media
    async function fetchUpcomingMedia() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
        if (response.ok) {
            const data = await response.json();
            const upcomingMovies = data.results.filter(media => new Date(media.release_date) > new Date());
            displayUpcomingMedia(upcomingMovies);
        } else {
            handleError('Failed to fetch upcoming media.');
        }
    }

    // Function to display upcoming media
    function displayUpcomingMedia(mediaList) {
        const upcomingMedia = document.getElementById('upcomingMedia');
        upcomingMedia.innerHTML = '';

        mediaList.forEach(media => {
            const mediaItem = document.createElement('div');
            mediaItem.classList.add('text-zinc-300', 'mb-2');
            mediaItem.innerHTML = `<span>${media.title}:</span> <span>${media.release_date}</span>`;
            upcomingMedia.appendChild(mediaItem);
        });
    }

    // Check for media ID in the URL and fetch the corresponding media
    const urlParams = new URLSearchParams(window.location.search);
    const mediaIdFromUrl = urlParams.get('mediaId');
    const mediaTypeFromUrl = urlParams.get('mediaType');
    if (mediaIdFromUrl && mediaTypeFromUrl) {
        fetchSelectedMedia(mediaIdFromUrl, mediaTypeFromUrl);
    }

    // Fetch popular media and upcoming media on page load
    fetchPopularMedia();
    fetchUpcomingMedia();

    // Update popular media when the category changes
    categorySelect.addEventListener('change', function() {
        fetchPopularMedia();
    });
});
