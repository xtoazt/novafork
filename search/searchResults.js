$(document).ready(async function () {
    const API_BASE_URL = 'https://api.themoviedb.org/3';
    let apiKey;
    const genreMap = {};

    // Centralized error handler
    const handleError = (message, error) => {
        console.error(`${message}:`, error);
    };

    // Fetch API Key from config
    const getApiKey = async () => {
        if (apiKey) return apiKey;
        try {
            const response = await $.getJSON('apis/config.json');
            apiKey = response.apiKey;
            return apiKey;
        } catch (error) {
            handleError('Failed to fetch API key', error);
            return null;
        }
    };

    // Generic API call handler
    const apiCall = async (endpoint, params = {}) => {
        const key = await getApiKey();
        if (!key) return null;

        params.api_key = key;
        const queryString = $.param(params);
        const url = `${API_BASE_URL}/${endpoint}?${queryString}`;

        try {
            return await $.getJSON(url);
        } catch (error) {
            handleError(`Error during API call to ${endpoint}`, error);
            return null;
        }
    };

    // Fetch and map genres
    const fetchAllGenres = async () => {
        try {
            const [movieGenres, tvGenres] = await Promise.all([
                apiCall('genre/movie/list', { language: 'en-US' }),
                apiCall('genre/tv/list', { language: 'en-US' })
            ]);
            [...(movieGenres?.genres || []), ...(tvGenres?.genres || [])].forEach(genre => {
                genreMap[genre.id] = genre.name;
            });
        } catch (error) {
            handleError('Failed to fetch genres', error);
        }
    };

    // Debounce function for optimized input handling
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Show loading indicator
    const showLoading = () => {
        $('#searchSuggestions').html('<div class="spinner"></div>').removeClass('hidden');
    };

    // Highlight query in text
    const highlightText = (text, query) => {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };
    const displaySearchSuggestions = (results, query) => {
        const $searchSuggestions = $('#searchSuggestions');
        if (results.length === 0) {
            $searchSuggestions.html('<div class="no-suggestions">No suggestions available</div>').removeClass('hidden');
            return;
        }

        const suggestionsHTML = results.map(media => {
            // Determine media type and assign corresponding icon
            const mediaTypeIcon = media.media_type === 'movie' ? '<i class="fas fa-film"></i>' : '<i class="fas fa-tv"></i>';
            const mediaTitle = media.title || media.name;
            const mediaId = media.id;
            const mediaType = media.media_type;
            const mediaRating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
            const highlightedTitle = highlightText(mediaTitle, query);

            // Set the poster image, fallback to a placeholder if missing
            const posterPath = media.poster_path
                ? `https://image.tmdb.org/t/p/w185${media.poster_path}`
                : 'path-to-placeholder-image.jpg';

            // Fetch genres for the media, slice to show top 2 genres
            const genreNames = (media.genre_ids || []).map(id => genreMap[id] || 'Unknown').slice(0, 2).join(', ');

            // Get the year based on the media's release date or first air date
            const year = media.release_date
                ? new Date(media.release_date).getFullYear()
                : media.first_air_date
                    ? new Date(media.first_air_date).getFullYear()
                    : 'N/A';

            return `
        <div class="suggestion-item" data-id="${mediaId}" data-type="${mediaType}">
            <div class="suggestion-left">
                <img src="${posterPath}" alt="${mediaTitle}" class="suggestion-poster">
            </div>
            <div class="suggestion-center">
                <h4 class="suggestion-title">${highlightedTitle}</h4>
                <div class="suggestion-meta">
                    <div class="suggestion-type">
                        ${mediaTypeIcon} ${mediaType === 'movie' ? 'Movie' : 'TV Show'}
                    </div>
                    <div class="suggestion-year">
                        <i class="fas fa-calendar-alt"></i> ${year}
                    </div>
                    <div class="suggestion-rating">
                        <i class="fas fa-star"></i> ${mediaRating}
                    </div>
                    <div class="suggestion-genres">
                        <i class="fas fa-tags"></i> ${genreNames}
                    </div>
                </div>
            </div>
        </div>
    `;
        }).join('');

        $searchSuggestions.html(suggestionsHTML).removeClass('hidden');

        $searchSuggestions.find('.suggestion-item').on('click', function () {
            const mediaId = $(this).data('id');
            const mediaType = $(this).data('type');
            fetchSelectedMedia(mediaId, mediaType);
            $searchSuggestions.addClass('hidden');
        });
    };

    const fetchSelectedMedia = async (mediaId, mediaType) => {
        try {
            const media = await apiCall(`${mediaType}/${mediaId}`);
            if (media) {
                displaySelectedMedia(media, mediaType);

                // Update URL to reflect selected media
                const newUrl = `${window.location.origin}${window.location.pathname}?mediaType=${mediaType}&mediaId=${mediaId}`;
                window.history.pushState({ mediaId, mediaType }, '', newUrl);
            } else {
                handleError('Failed to fetch media details.', new Error('No data returned from API.'));
            }
        } catch (error) {
            handleError('Error fetching media details:', error);
        }
    };

    // Handle search input
    const handleSearchInput = debounce(async () => {
        const query = $('#searchInput').val().trim();
        if (query.length < 2) {
            $('#searchSuggestions').empty().addClass('hidden');
            return;
        }

        showLoading();

        const result = await apiCall('search/multi', { query, include_adult: false });
        if (result?.results) {
            const filteredResults = result.results.filter(media =>
                media.media_type === 'movie' || media.media_type === 'tv'
            ).slice(0, 10);
            displaySearchSuggestions(filteredResults, query);
        }
    }, 300);

    // Initialize the app
    const init = async () => {
        if (await getApiKey()) {
            await fetchAllGenres();

            // Load media details from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const mediaType = urlParams.get('mediaType');
            const mediaId = urlParams.get('mediaId');
            if (mediaType && mediaId) {
                await fetchSelectedMedia(mediaId, mediaType);
            }
        }
    };

    await init();
    $('#searchInput').on('input', handleSearchInput);
});
