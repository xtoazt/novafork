async function getApiKey() {
    try {
        const response = await fetch('apis/config.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const config = await response.json();
        return config.apiKey;
    } catch (error) {
        console.error('Failed to fetch API key:', error);
        return null;
    }
}

async function getApiProviders() {
    try {
        const response = await fetch('apis/apiProviders.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch API providers:', error);
        return null;
    }
}

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        throw error;
    }
}

async function fetchMediaData(mediaId, mediaType, apiKey) {
    const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}`;
    return fetchJson(url);
}

async function fetchCastData(mediaId, mediaType, apiKey) {
    const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${apiKey}`;
    return fetchJson(url);
}

async function fetchTrailer(mediaId, mediaType, apiKey) {
    const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${apiKey}`;
    const data = await fetchJson(url);
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

async function displaySelectedMedia(media, mediaType) {
    const selectedMovie = document.getElementById('selectedMovie');
    const apiKey = await getApiKey();
    const apiProviders = await getApiProviders();

    if (!apiKey || !apiProviders) {
        console.error('API key or providers are not available.');
        return;
    }

    const mediaDataPromise = fetchMediaData(media.id, mediaType, apiKey);
    const castDataPromise = fetchCastData(media.id, mediaType, apiKey);

    try {
        const [mediaData, castData] = await Promise.all([mediaDataPromise, castDataPromise]);

        const genres = mediaData.genres ? mediaData.genres.map(genre => genre.name).join(', ') : 'Unknown Genre';
        const runtime = mediaType === 'tv' ? `${mediaData.episode_run_time ? mediaData.episode_run_time[0] : 'N/A'} min per episode` : `${mediaData.runtime || 'N/A'} min`;
        const language = mediaData.original_language ? mediaData.original_language.toUpperCase() : 'Unknown';

        const voteAverage = mediaData.vote_average || 0;
        const popularityScore = mediaData.popularity || 0;
        const stars = Math.round(voteAverage / 2);

        const ratings = `
            <div class="flex items-center space-x-1 mb-2">
                <span class="text-yellow-400">${'★'.repeat(stars)}</span>
                <span class="text-gray-300">${'★'.repeat(5 - stars)}</span>
                <span class="ml-2 text-sm text-gray-300">${voteAverage.toFixed(1)}/10</span>
            </div>
        `;
        const popularity = `
            <div class="text-sm text-gray-300 mb-4">Popularity: <span class="font-semibold">${popularityScore.toFixed(1)}</span></div>
        `;

        const castList = castData.cast.slice(0, 5).map(actor =>
            `<div class="flex-shrink-0 w-32 mx-2">
                <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}" class="w-full h-32 rounded-full object-cover shadow-md">
                <div class="mt-2 text-center">
                    <p class="text-white font-semibold">${actor.name}</p>
                    <p class="text-gray-400 text-sm">${actor.character}</p>
                </div>
            </div>`
        ).join('');

        const seasonSection = mediaType === 'tv' ? `
            <div class="mt-4">
                <label for="seasonSelect" class="block text-xs font-medium text-gray-300">Select Season:</label>
                <select id="seasonSelect" class="dropdown mt-1 block w-full bg-gray-800 text-white rounded border border-gray-700 text-sm">
                    ${mediaData.seasons.map(season =>
            `<option value="${season.season_number}">Season ${season.season_number}: ${season.name}</option>`
        ).join('')}
                </select>

                <label for="episodeSelect" class="block text-xs font-medium text-gray-300 mt-2">Select Episode:</label>
                <select id="episodeSelect" class="dropdown mt-1 block w-full bg-gray-800 text-white rounded border border-gray-700 text-sm"></select>
                
                <div id="episodeImage" class="mt-4"></div>
            </div>
        ` : '';

        const templateResponse = await fetch('media/mediaTemplate.html');
        if (!templateResponse.ok) throw new Error('Network response was not ok');
        const template = await templateResponse.text();

        const populatedHTML = template
            .replace(/{{poster_path}}/g, `https://image.tmdb.org/t/p/w500${media.poster_path}`)
            .replace(/{{title_or_name}}/g, media.title || media.name)
            .replace(/{{release_date_or_first_air_date}}/g, media.release_date || media.first_air_date)
            .replace(/{{overview}}/g, media.overview || 'No overview available.')
            .replace(/{{type}}/g, mediaType === 'movie' ? 'Movie' : 'TV Show')
            .replace(/{{ratings}}/g, ratings)
            .replace(/{{popularity}}/g, popularity)
            .replace(/{{season_section}}/g, seasonSection)
            .replace(/{{genres}}/g, `Genres: ${genres}`)
            .replace(/{{runtime}}/g, `Runtime: ${runtime}`)
            .replace(/{{language}}/g, `Language: ${language}`)
            .replace(/{{cast_list}}/g, castList)
            .replace(/{{quality}}/g, 'HD'); // Placeholder for streaming quality

        selectedMovie.innerHTML = populatedHTML;

        const playButton = document.getElementById('playButton');
        const videoPlayer = selectedMovie.querySelector('#videoPlayer');
        const movieInfo = selectedMovie.querySelector('#movieInfo');
        const languageSelect = document.getElementById('languageSelect');
        const providerSelect = document.getElementById('providerSelect');
        const seasonSelect = document.getElementById('seasonSelect');
        const episodeSelect = document.getElementById('episodeSelect');

        async function updateVideo() {
            if (!videoPlayer || !movieInfo) {
                console.error("Error: videoPlayer or movieInfo elements not found.");
                return;
            }

            let endpoint;
            const selectedLanguage = languageSelect ? languageSelect.value : '';
            const provider = providerSelect ? providerSelect.value : '';

            if (mediaType === 'tv') {
                const seasonNumber = seasonSelect ? seasonSelect.value : '';
                const episodeNumber = episodeSelect ? episodeSelect.value : '';

                if (!seasonNumber || !episodeNumber) {
                    console.error("Error: Season number or episode number not selected.");
                    return;
                }

                endpoint = apiProviders.tv[provider]
                    ? apiProviders.tv[provider].replace('{{mediaId}}', media.id).replace('{{seasonNumber}}', seasonNumber).replace('{{episodeNumber}}', episodeNumber)
                    : null;
            } else {
                endpoint = apiProviders.movie[provider]
                    ? apiProviders.movie[provider].replace('{{mediaId}}', media.id)
                    : null;
            }

            if (provider === 'trailer') {
                endpoint = await fetchTrailer(media.id, mediaType, apiKey);
            }

            if (endpoint) {
                videoPlayer.innerHTML = `<iframe src="${endpoint}" class="w-full" style="height: ${document.getElementById('poster').offsetHeight}px;" allowfullscreen></iframe>`;
                videoPlayer.classList.remove('hidden');
                movieInfo.classList.add('hidden');
            } else {
                console.error('Provider not recognized or endpoint not found.');
            }
        }

        async function updateEpisodes() {
            if (!episodeSelect || !seasonSelect || !apiProviders) return;

            const seasonNumber = seasonSelect.value;
            const episodes = mediaData.seasons.find(season => season.season_number == seasonNumber).episodes;
            episodeSelect.innerHTML = episodes.map(episode =>
                `<option value="${episode.episode_number}">Episode ${episode.episode_number}: ${episode.name}</option>`
            ).join('');
            await updateEpisodeImage();
        }

        async function updateEpisodeImage() {
            const episodeNumber = episodeSelect ? episodeSelect.value : '';
            if (episodeNumber && mediaData.seasons) {
                const seasonNumber = seasonSelect ? seasonSelect.value : '';
                const episode = mediaData.seasons.find(season => season.season_number == seasonNumber).episodes.find(ep => ep.episode_number == episodeNumber);
                const episodeImage = selectedMovie.querySelector('#episodeImage');
                episodeImage.innerHTML = episode ? `<img src="https://image.tmdb.org/t/p/w500${episode.still_path}" alt="${episode.name}" class="w-full rounded-md">` : '';
            }
        }

        if (playButton) {
            playButton.addEventListener('click', updateVideo);
        }

        if (languageSelect) {
            languageSelect.addEventListener('change', () => {
                if (providerSelect) {
                    providerSelect.classList.toggle('hidden', languageSelect.value === 'fr');
                }
                updateVideo();
            });
        }

        if (providerSelect) {
            providerSelect.addEventListener('change', updateVideo);
        }

        if (mediaType === 'tv') {
            if (seasonSelect) {
                seasonSelect.addEventListener('change', async () => {
                    await updateEpisodes();
                    await updateVideo();
                });

                await updateEpisodes();
            }

            if (episodeSelect) {
                episodeSelect.addEventListener('change', async () => {
                    await updateEpisodeImage();
                    await updateVideo();
                });
            }
        }
    } catch (error) {
        console.error('Failed to display selected media:', error);
    }
}
