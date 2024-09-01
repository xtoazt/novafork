function handleError(message, error, showAlert = false) {
    console.error(message, error);
    if (showAlert) {
        alert(message);
    }
}

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

document.addEventListener('DOMContentLoaded', async function () {
    const homePage = document.getElementById('homePage');
    const welcomeBanner = document.getElementById('welcomeBanner');
    const closeBanner = document.getElementById('closeBanner');
    const categorySelect = document.getElementById('categorySelect');
    const popularMedia = document.getElementById('popularMedia');
    const videoPlayerContainer = document.getElementById('videoPlayerContainer');
    const videoPlayer = document.getElementById('videoPlayer');
    const posterImage = document.getElementById('posterImage');

    closeBanner.addEventListener('click', () => {
        welcomeBanner.style.display = 'none';
    });

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

    const API_KEY = await getApiKey();
    if (!API_KEY) return;

    const genres = await fetchGenres(API_KEY);
    const genreMap = genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
    }, {});

    genreMap[80] = 'Crime';

    async function search() {
        const searchInputValue = searchInput.value;
        const selectedCategory = categorySelect.value;
        const response = await fetch(`https://api.themoviedb.org/3/search/${selectedCategory}?api_key=${API_KEY}&query=${searchInputValue}`);
        if (response.ok) {
            const data = await response.json();
            displaySearchResults(data.results);
            searchSuggestions.classList.add('hidden');

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

    async function fetchPopularMedia(page = 1) {
        const selectedCategory = categorySelect.value;
        let url = '';
        let moviePage = page;
        let tvPage = page;

        if (selectedCategory === 'animation') {
            const genreId = 16;
            const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${moviePage}`;
            const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${tvPage}`;

            try {
                const [movieResponse, tvResponse] = await Promise.all([
                    fetch(movieUrl),
                    fetch(tvUrl)
                ]);

                if (movieResponse.ok && tvResponse.ok) {
                    const [movieData, tvData] = await Promise.all([
                        movieResponse.json(),
                        tvResponse.json()
                    ]);

                    const combinedResults = [...movieData.results, ...tvData.results];
                    const totalPages = Math.max(movieData.total_pages, tvData.total_pages);
                    displayPopularMedia(combinedResults);
                    updatePaginationControls(page, totalPages);
                } else {
                    handleError(`Failed to fetch ${selectedCategory} media.`);
                }
            } catch (error) {
                handleError(`An error occurred while fetching ${selectedCategory} media.`, error);
            }
        } else if (selectedCategory === 'crime') {
            const genreId = 80;
            const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${moviePage}`;
            const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${tvPage}`;

            try {
                const [movieResponse, tvResponse] = await Promise.all([
                    fetch(movieUrl),
                    fetch(tvUrl)
                ]);

                if (movieResponse.ok && tvResponse.ok) {
                    const [movieData, tvData] = await Promise.all([
                        movieResponse.json(),
                        tvResponse.json()
                    ]);

                    const combinedResults = [...movieData.results, ...tvData.results];
                    const totalPages = Math.max(movieData.total_pages, tvData.total_pages);
                    displayPopularMedia(combinedResults);
                    updatePaginationControls(page, totalPages);
                } else {
                    handleError(`Failed to fetch ${selectedCategory} media.`);
                }
            } catch (error) {
                handleError(`An error occurred while fetching ${selectedCategory} media.`, error);
            }
        } else if (selectedCategory === 'tv') {
            url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&page=${page}`;

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const filteredResults = data.results.filter(media => !media.genre_ids.includes(16));
                    displayPopularMedia(filteredResults);
                    updatePaginationControls(data.page, data.total_pages);
                } else {
                    handleError('Failed to fetch TV shows.');
                }
            } catch (error) {
                handleError('An error occurred while fetching TV shows.', error);
            }
        } else {
            url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`;

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const filteredResults = data.results.filter(media => !media.genre_ids.includes(16));
                    displayPopularMedia(filteredResults);
                    updatePaginationControls(data.page, data.total_pages);
                } else {
                    handleError('Failed to fetch popular media.');
                }
            } catch (error) {
                handleError('An error occurred while fetching popular media.', error);
            }
        }
    }

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

    function changePage(page) {
        fetchPopularMedia(page);
    }

    async function fetchSelectedMedia(mediaId, mediaType) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${API_KEY}`);
            if (response.ok) {
                const media = await response.json();

                const newUrl = `${window.location.origin}${window.location.pathname}?mediaId=${mediaId}&mediaType=${mediaType}`;
                window.history.pushState({ mediaId, mediaType }, '', newUrl);

                displaySelectedMedia(media, mediaType);
                await fetchMediaTrailer(mediaId, mediaType);

                if (posterImage && media.poster_path) {
                    posterImage.src = `https://image.tmdb.org/t/p/w300${media.poster_path}`;
                    posterImage.alt = media.title || media.name;
                }

                videoPlayerContainer.classList.remove('hidden');
            } else {
                handleError('Failed to fetch media details.', new Error('API response not OK'));
                videoPlayerContainer.classList.add('hidden');
            }
        } catch (error) {
            handleError('An error occurred while fetching media details.', error);
            videoPlayerContainer.classList.add('hidden');
        }
    }

    function displaySelectedMedia(media, mediaType) {
        const title = media.title || media.name;
        const releaseDate = media.release_date || media.first_air_date;
        const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString() : 'Unknown Date';
        const genreNames = media.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');

        const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(media.vote_average / 2) ? '★' : '☆').join(' ');

        document.getElementById('mediaTitle').textContent = title;
        document.getElementById('mediaOverview').textContent = media.overview || 'No overview available.';
        document.getElementById('mediaGenres').textContent = genreNames;
        document.getElementById('mediaReleaseDate').textContent = `Release Date: ${formattedDate}`;
        document.getElementById('mediaRating').textContent = `${ratingStars} (${media.vote_average.toFixed(1)}/10)`;
    }

    async function fetchMediaTrailer(mediaId, mediaType) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    videoPlayer.src = `https://www.youtube.com/embed/${trailer.key}`;
                } else {
                    videoPlayer.src = '';
                    videoPlayerContainer.classList.add('hidden');
                }
            } else {
                handleError('Failed to fetch media trailer.', new Error('API response not OK'));
                videoPlayerContainer.classList.add('hidden');
            }
        } catch (error) {
            handleError('An error occurred while fetching media trailer.', error);
            videoPlayerContainer.classList.add('hidden');
        }
    }

    function displayPopularMedia(results) {
        popularMedia.innerHTML = '';

        const sortedResults = results.sort((a, b) => b.vote_average - a.vote_average);

        sortedResults.forEach(media => {
            const mediaCard = document.createElement('div');
            mediaCard.classList.add(
                'media-card',
                'bg-gray-800',
                'p-4',
                'rounded-lg',
                'shadow-lg',
                'cursor-pointer',
                'transition-transform',
                'hover:scale-105',
                'relative',
                'flex',
                'flex-col',
                'items-start',
                'group',
                'overflow-hidden',
                'max-w-sm',
                'm-2',
            );

            const genreNames = media.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');
            const formattedDate = media.release_date ? new Date(media.release_date).toLocaleDateString() : (media.first_air_date ? new Date(media.first_air_date).toLocaleDateString() : 'Unknown Date');
            const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.round(media.vote_average / 2) ? '★' : '☆').join(' ');

            const mediaType = media.media_type || (media.title ? 'movie' : 'tv');

            mediaCard.innerHTML = `
            <div class="relative w-full h-64 overflow-hidden rounded-lg mb-4">
                <img src="https://image.tmdb.org/t/p/w300${media.poster_path}" alt="${media.title || media.name}" class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            </div>
            <div class="flex-grow w-full">
                <h3 class="text-lg font-semibold text-white truncate">${media.title || media.name}</h3>
                <p class="text-gray-400 text-sm mt-2">${mediaType === 'movie' ? '🎬 Movie' : mediaType === 'tv' ? '📺 TV Show' : '📽 Animation'}</p>
                <p class="text-gray-400 text-sm mt-1">Genres: ${genreNames}</p>
                <div class="flex items-center mt-2">
                    <span class="text-yellow-400 text-base">${ratingStars}</span>
                    <span class="text-gray-300 text-sm ml-2">${media.vote_average.toFixed(1)}/10</span>
                </div>
                <p class="text-gray-300 text-sm mt-1">Release Date: ${formattedDate}</p>
            </div>
        `;

            mediaCard.addEventListener('click', function() {
                fetchSelectedMedia(media.id, mediaType);
            });

            popularMedia.appendChild(mediaCard);
        });
    }

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

    const urlParams = new URLSearchParams(window.location.search);
    const mediaIdFromUrl = urlParams.get('mediaId');
    const mediaTypeFromUrl = urlParams.get('mediaType');
    if (mediaIdFromUrl && mediaTypeFromUrl) {
        fetchSelectedMedia(mediaIdFromUrl, mediaTypeFromUrl);
    }

    fetchPopularMedia();
    fetchUpcomingMedia();

    categorySelect.addEventListener('change', function() {
        fetchPopularMedia();
    });
});
