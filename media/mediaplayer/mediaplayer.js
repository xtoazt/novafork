let selectedProvider = 'vidlink';

async function getApiKey() {
    try {
        const response = await fetch('apis/config.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json().then(config => config.apiKey);
    } catch (error) {
        console.error('Failed to fetch API key:', error);
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

async function getMovieEmbedUrl(mediaId, provider, apiKey) {
    const primaryColor = '#FFFFFF';
    const secondaryColor = '#FFFFFF';
    const iconColor = '#FFFFFF';

    switch (provider) {
        case 'vidsrc':
            return `https://vidsrc.cc/v3/embed/movie/${mediaId}?autoPlay=true`;
        case 'vidsrc2':
            return `https://vidsrc2.to/embed/movie/${mediaId}`;
        case 'vidsrcxyz':
            return `https://vidsrc.xyz/embed/movie/${mediaId}`;
        case 'embedsoap':
            return `https://www.embedsoap.com/embed/movie/?id=${mediaId}`;
        case 'autoembed':
            return `https://player.autoembed.cc/embed/movie/${mediaId}`;
        case 'smashystream':
            return `https://player.smashy.stream/movie/${mediaId}`;
        case 'anime':
            return `https://anime.autoembed.cc/embed/${mediaId}-episode-1`;
        case '2animesub':
            return `https://2anime.xyz/embed/${mediaId}-episode-1`;
        case '2embed':
            return `https://www.2embed.cc/embed/${mediaId}`;
        case 'nontonGo':
            return `https://www.NontonGo.win/embed/movie/${mediaId}`;
        case 'AdminHiHi':
            const movieSlug = mediaId.replace(/\s+/g, '-');
            return `https://embed.anicdn.top/v/${movieSlug}-dub/1.html`;
        case 'vidlink':
            return `https://vidlink.pro/movie/${mediaId}?primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&iconColor=${iconColor}&autoplay=false`;
        case 'vidlinkdub':
            return `https://vidlink.pro/movie/${mediaId}?player=jw&multiLang=true&primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&iconColor=${iconColor}`;
        case 'vidsrcnl':
            return `https://player.vidsrc.nl/embed/movie/${mediaId}`;
        case 'vidsrc.rip':
            return `https://vidsrc.rip/embed/movie/${mediaId}`;
        case 'vidbinge':
            return `https://vidbinge.dev/embed/movie/${mediaId}`;
        case 'moviesapi':
            return `https://moviesapi.club/movie/${mediaId}`;
        case 'moviee':
            return `https://moviee.tv/embed/movie/${mediaId}`;
        case 'multiembed':
            return `https://multiembed.mov/?video_id=${mediaId}&tmdb=1`;
        case 'multiembedvip':
            return `https://multiembed.mov/directstream.php?video_id=${mediaId}&tmdb=1`;
        case 'vidsrcicu':
            return `https://vidsrc.icu/embed/movie/${mediaId}`;  // New URL structure
        default:
            throw new Error('Provider not recognized.');
    }
}


async function getTvEmbedUrl(mediaId, seasonId, episodeId, provider, apiKey) {
    const primaryColor = '#FFFFFF';
    const secondaryColor = '#FFFFFF';
    const iconColor = '#ffffff';

    switch (provider) {
        case 'vidsrc':
            return `https://vidsrc.cc/v3/embed/tv/${mediaId}/${seasonId}/${episodeId}?autoPlay=true&autoNext=true`;
        case 'vidsrcpro':
            return `https://vidsrc.pro/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'vidsrc2':
            return `https://vidsrc2.to/embed/tv/${mediaId}?season=${seasonId}&episode=${episodeId}`;
        case 'vidsrcxyz':
            return `https://vidsrc.xyz/embed/tv/${mediaId}?season=${seasonId}&episode=${episodeId}`;
        case 'embedsoap':
            return `https://www.embedsoap.com/embed/tv/?id=${mediaId}&s=${seasonId}&e=${episodeId}`;
        case 'autoembed':
            return `https://player.autoembed.cc/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'smashystream':
            return `https://player.smashy.stream/tv/${mediaId}?s=${seasonId}&e=${episodeId}`;
        case 'anime':
            return `https://anime.autoembed.cc/embed/${media.name.replace(/\s+/g, '-').toLowerCase()}-episode-${episodeId}`;
        case 'nontonGo':
            return `https://www.NontonGo.win/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'nontonGoAlt':
            return `https://www.NontonGo.win/embed/tv/?id=${mediaId}&s=${seasonId}&e=${episodeId}`;
        case '2animesub':
            return `https://2anime.xyz/embed/${media.name.replace(/\s+/g, '-').toLowerCase()}-episode-${episodeId}`;
        case '2embed':
            return `https://www.2embed.skin/embedtv/${mediaId}&s=${seasonId}&e=${episodeId}`;
        case 'AdminHiHi':
            const tvSlug = media.name.replace(/\s+/g, '-');
            return `https://embed.anicdn.top/v/${tvSlug}-dub/${episodeId}.html`;
        case 'moviesapi':
            return `https://moviesapi.club/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'vidlink':
            return `https://vidlink.pro/tv/${mediaId}/${seasonId}/${episodeId}?primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&iconColor=${iconColor}&nextbutton=true&autoplay=false`;
        case 'vidlinkdub':
            return `https://vidlink.pro/tv/${mediaId}/${seasonId}/${episodeId}?player=jw&multiLang=true`;
        case 'vidsrcnl':
            return `https://player.vidsrc.nl/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'vidsrc.rip':
            return `https://vidsrc.rip/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'vidbinge':
            return `https://vidbinge.dev/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        case 'moviee':
            return `https://moviee.tv/embed/tv/${mediaId}?seasion=${seasonId}&episode=${episodeId}`;
        case 'multiembed':
            return `https://multiembed.mov/?video_id=${mediaId}&tmdb=1&s=${seasonId}&e=${episodeId}`;
        case 'multiembedvip':
            return `https://multiembed.mov/directstream.php?video_id=${mediaId}&tmdb=1&s=${seasonId}&e=${episodeId}`;
        case 'vidsrcicu':
            return `https://vidsrc.icu/embed/tv/${mediaId}/${seasonId}/${episodeId}`;
        default:
            throw new Error('Provider not recognized.');
    }
}



async function fetchMediaData(mediaId, mediaType, apiKey) {
    return fetchJson(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${apiKey}`);
}

async function fetchCastData(mediaId, mediaType, apiKey) {
    return fetchJson(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${apiKey}`);
}

async function fetchTrailer(mediaId, mediaType, apiKey) {
    const data = await fetchJson(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?api_key=${apiKey}`);
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

async function displaySelectedMedia(media, mediaType) {
    const $selectedMovie = $('#selectedMovie');
    const $mediaSection = $('#selectedMediaSection');
    const apiKey = await getApiKey();

    if (!media || !media.id) {
        $mediaSection.addClass('hidden');
        return;
    } else {
        $mediaSection.removeClass('hidden');

        document.getElementById('selectedMediaSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    if (!apiKey) return console.error('API key is not available.');

    try {
        const [mediaData, castData] = await Promise.all([
            fetchMediaData(media.id, mediaType, apiKey),
            fetchCastData(media.id, mediaType, apiKey)
        ]);

        const genres = mediaData.genres?.map(genre => genre.name).join(', ') || 'Unknown Genre';
        const language = mediaData.original_language?.toUpperCase() || 'Unknown';
        const releaseDate = media.release_date || media.first_air_date || 'Unknown Release Date';
        const productionCompanies = mediaData.production_companies?.map(company => company.name).join(', ') || 'Unknown Production Companies';
        const budget = mediaType === 'movie' ? (mediaData.budget ? `$${mediaData.budget.toLocaleString()}` : 'Unknown') : 'N/A';
        const revenue = mediaType === 'movie' ? (mediaData.revenue ? `$${mediaData.revenue.toLocaleString()}` : 'Unknown') : 'N/A';

        const ratings = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-star text-yellow-400"></i>
                <span class="text-lg font-semibold text-white">${(mediaData.vote_average || 0).toFixed(1)}</span>
                <span class="text-sm text-gray-400">/10</span>
            </div>`;
        const popularity = `
                <div class="flex items-center space-x-2">
                    <i class="fas fa-fire text-orange-500"></i>
                    <span class="text-lg font-semibold text-white">${(mediaData.popularity || 0).toFixed(1)}</span>
                    <span class="text-sm text-gray-400">Popularity</span>
                </div>`;

        const castList = castData.cast.slice(0, 5).map(actor => `
                <div class="flex-shrink-0 w-28 mx-2 text-center">
                    <div class="w-28 h-28 mx-auto mb-2 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
                        <img src="${actor.profile_path ? 'https://image.tmdb.org/t/p/w500' + actor.profile_path : 'path/to/placeholder-image.jpg'}" alt="${actor.name}" 
                             class="w-full h-full object-cover" onerror="this.src='path/to/placeholder-image.jpg';">
                    </div>
                    <p class="text-white font-semibold text-sm truncate">${actor.name}</p>
                    <p class="text-gray-400 text-xs truncate">${actor.character}</p>
                </div>
            `).join('');

        let runtime;

        if (mediaType === 'movie') {
            runtime = `${mediaData.runtime || 'N/A'} min`;
        } else if (mediaType === 'tv') {
            runtime = `${Math.round(mediaData.episode_run_time.reduce((a, b) => a + b, 0) / mediaData.episode_run_time.length)} min per episode`;
        }

        const template = await fetch('media/mediaTemplate.html').then(response => response.text());

        $selectedMovie.html(template
            .replace(/{{poster_path}}/g, `${media.poster_path}`)
            .replace(/{{title_or_name}}/g, media.title || media.name)
            .replace(/{{release_date_or_first_air_date}}/g, releaseDate)
            .replace(/{{overview}}/g, media.overview || 'No overview available.')
            .replace(/{{type}}/g, mediaType === 'movie' ? 'Movie' : 'TV Show')
            .replace(/{{language}}/g, `${language}`)
            .replace(/{{genres}}/g, `${genres}`)
            .replace(/{{runtime}}/g, `${runtime}`)
            .replace(/{{budget}}/g, `${budget}`)
            .replace(/{{revenue}}/g, `${revenue}`)
            .replace(/{{ratings}}/g, ratings)
            .replace(/{{popularity}}/g, popularity)
            .replace(/{{cast_list}}/g, castList)
            .replace(/{{production_companies}}/g, `${productionCompanies}`)
        );

        const $videoPlayer = $('#videoPlayer');
        const $movieInfo = $('#movieInfo');
        const $playButton = $('#playButton');
        const $closePlayerButton = $('#closePlayerButton');
        const $languageSelect = $('#languageSelect');
        const $providerSelect = $('#providerSelect');
        const $selectEpisodeButton = $('#selectEpisodeButton');
        const $episodeModal = $('#episodeModal');

        let selectedProvider = 'vidsrc';
        let selectedEpisode = null;
        let selectedSeason = null;
        let episodesData = [];
        let seasonsData = [];

        if (mediaType === 'tv') {
            seasonsData = mediaData.seasons.filter(season => season.season_number !== 0);
        }

        async function updateVideo() {
            try {
                const provider = $providerSelect.length ? $providerSelect.val() : selectedProvider;
                let endpoint;

                if (mediaType === 'tv') {
                    if (!selectedSeason || !selectedEpisode) {
                        alert('Please select a season and an episode.');
                        return;
                    }
                    endpoint = await getTvEmbedUrl(media.id, selectedSeason, selectedEpisode, provider, apiKey);
                } else {
                    endpoint = await getMovieEmbedUrl(media.id, provider, apiKey);
                }

                const sandboxAttribute = provider === 'vidlink' ? 'sandbox="allow-same-origin allow-scripts allow-forms"' : '';

                const iframeHtml = `
                        <iframe 
                            src="${endpoint}" 
                            class="video-iframe" 
                            allowfullscreen 
                            ${sandboxAttribute}>
                        </iframe>
                    `;

                $videoPlayer.html(iframeHtml).removeClass('hidden');

                $movieInfo.children().not($videoPlayer).addClass('hidden');
                $closePlayerButton.removeClass('hidden');

                $('iframe').one('load', function () {
                    const iframeWindow = this.contentWindow;

                    if (iframeWindow) {
                        try {
                            iframeWindow.document.addEventListener('click', function (event) {
                                const target = event.target.tagName;
                                if (target === 'A' || target === 'BUTTON') {
                                    event.preventDefault();
                                }
                            });

                            ['beforeunload', 'unload', 'submit'].forEach(eventType => {
                                iframeWindow.document.addEventListener(eventType, event => event.preventDefault());
                            });
                        } catch (error) {
                            console.error('Error in iframe event handling:', error);
                        }
                    }
                });
            } catch (error) {
                console.error('Error updating video:', error);
            }
        }

        async function closeVideoPlayer() {
            $videoPlayer.html('').addClass('hidden');
            $movieInfo.children().removeClass('hidden');
            $closePlayerButton.addClass('hidden');
        }

        function adjustIframeSize() {
            const $iframe = $('#dynamicIframe');
            const viewportWidth = $(window).width();
            const viewportHeight = $(window).height();
            $iframe.css({
                width: `${viewportWidth}px`,
                height: `${viewportHeight}px`
            });
        }

        $(window).on('resize', adjustIframeSize);
        adjustIframeSize();

        async function updateEpisodes(seasonNumber) {
            if (!seasonNumber) return;

            try {
                const season = await fetchJson(`https://api.themoviedb.org/3/tv/${media.id}/season/${seasonNumber}?api_key=${apiKey}`);

                const currentDate = new Date();

                const airedEpisodes = season.episodes.filter(episode => {
                    const airDate = new Date(episode.air_date);
                    return airDate <= currentDate;
                });

                if (airedEpisodes.length === 0) {
                    $('#runtime').html('No episodes have aired yet.');
                } else {
                    const episodeRuntime = airedEpisodes.reduce((total, episode) => total + (episode.runtime || 0), 0) / airedEpisodes.length || 0;
                    $('#runtime').html(`Runtime: ${Math.round(episodeRuntime)} min per episode`);
                }

                episodesData = airedEpisodes.map(episode => ({
                    number: episode.episode_number,
                    name: episode.name || 'Untitled',
                    airDate: new Date(episode.air_date),
                    stillPath: episode.still_path,
                    overview: episode.overview || 'No description available.'
                }));

                selectedEpisode = null;

                $('#episodeGrid').html(renderEpisodeGrid(episodesData));

                $('.episodes-grid').scrollTop(0);

                attachEpisodeDescriptionToggle();

            } catch (error) {
                console.error('Failed to fetch season details:', error);
            }
        }

        function escapeHtml(str) {
            return str.replace(/[&<>"'()]/g, function (match) {
                const escape = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                    '(': '&#40;',
                    ')': '&#41;'
                };
                return escape[match];
            });
        }

        function renderEpisodeGrid(episodes) {
            return episodes.map(episode => `
                    <div class="episode-item bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer relative" data-episode-number="${episode.number}">
                        <img src="${episode.stillPath ? 'https://image.tmdb.org/t/p/w780' + episode.stillPath : 'path/to/placeholder-image.jpg'}" alt="Episode ${episode.number}" class="w-full h-32 object-cover">
                        <div class="p-3">
                            <h3 class="text-white text-base font-semibold mb-1">E${episode.number}: ${escapeHtml(episode.name)}</h3>
                            <p class="text-gray-400 text-xs mb-2">Air Date: ${episode.airDate ? episode.airDate.toLocaleDateString() : 'Unknown'}</p>
                            <button class="description-toggle absolute top-2 right-2 text-white rounded-full p-1 focus:outline-none">
                                <i class="fas fa-info-circle"></i>
                            </button>
                            <div class="description-content hidden mt-2 text-gray-300 text-sm bg-gray-900 bg-opacity-90 p-2 rounded-lg absolute inset-0 overflow-y-auto">
                                <button class="close-description absolute top-2 right-2 text-white rounded-full p-1 focus:outline-none">
                                    <i class="fas fa-times"></i>
                                </button>
                                <p>${escapeHtml(episode.overview)}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
        }

        function renderSeasonList(seasons) {
            return seasons.map(season => `
                    <div class="season-item flex items-center mb-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition" data-season-number="${season.season_number}">
                        <img src="${season.poster_path ? 'https://image.tmdb.org/t/p/w200' + season.poster_path : 'path/to/placeholder-image.jpg'}" alt="Season ${season.season_number}" class="w-12 h-18 object-cover rounded-lg flex-shrink-0">
                        <div class="ml-3">
                            <h4 class="text-white text-base font-semibold">Season ${season.season_number}</h4>
                            <p class="text-gray-400 text-xs">${season.episode_count} Episodes</p>
                        </div>
                    </div>
                `).join('');
        }

        function openEpisodeModal() {
            if (mediaType !== 'tv') {
                alert('Episode selection is only available for TV shows.');
                return;
            }

            if (seasonsData.length === 0) {
                alert('No seasons are available for this show.');
                return;
            }

            const modalContent = `
                    <div class="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div class="modal-container bg-gray-900 rounded-lg shadow-xl overflow-hidden max-w-full w-full md:max-w-4xl md:w-auto max-h-full relative">
                            <button id="closeModalButton" class="absolute top-4 right-4 text-gray-300 text-2xl hover:text-white focus:outline-none">&times;</button>
                            <div class="flex flex-col md:flex-row h-full">
                                <div class="seasons-list md:w-1/4 w-full bg-gray-800 overflow-y-auto custom-scrollbar max-h-screen">
                                    <h3 class="text-lg font-bold text-white p-4 border-b border-gray-700">Seasons</h3>
                                    <div class="p-2">
                                        ${renderSeasonList(seasonsData)}
                                    </div>
                                </div>
                                <div class="episodes-grid md:w-3/4 w-full p-4 overflow-y-auto custom-scrollbar max-h-screen">
                                    <h2 class="text-xl font-bold text-white mb-4">Select Episode</h2>
                                    <input type="text" id="episodeSearchInput" class="w-full mb-2 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Search episodes...">
                                    <div id="episodeGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

            $episodeModal.html(modalContent).removeClass('hidden');

            $('#closeModalButton').on('click', function() {
                $episodeModal.addClass('hidden').html('');
            });

            $('.season-item').on('click', async function() {
                const seasonNumber = $(this).data('season-number');
                selectedSeason = seasonNumber;

                $('.season-item').removeClass('bg-gray-700');
                $(this).addClass('bg-gray-700');

                await updateEpisodes(seasonNumber);

                attachEpisodeDescriptionToggle();
            });

            if (!selectedSeason) {
                $('.season-item').first().click();
            } else {
                $(`.season-item[data-season-number="${selectedSeason}"]`).click();
            }

            $('#episodeSearchInput').on('input', function() {
                const searchTerm = $(this).val().toLowerCase();
                const filteredEpisodes = episodesData.filter(episode =>
                    episode.name.toLowerCase().includes(searchTerm) ||
                    episode.number.toString().includes(searchTerm)
                );
                $('#episodeGrid').html(renderEpisodeGrid(filteredEpisodes));

                attachEpisodeDescriptionToggle();
            });

            $('#episodeGrid').on('click', '.episode-item', function(event) {
                if ($(event.target).closest('.description-toggle').length > 0 || $(event.target).closest('.description-content').length > 0) {
                    return;
                }
                const episodeNumber = $(this).data('episode-number');
                selectEpisode(episodeNumber);
                $episodeModal.addClass('hidden').html('');
            });

            function attachEpisodeDescriptionToggle() {
                $('.description-toggle').off('click').on('click', function(event) {
                    event.stopPropagation();
                    const $descriptionContent = $(this).closest('.episode-item').find('.description-content');
                    $descriptionContent.fadeToggle();
                });

                $('.close-description').off('click').on('click', function(event) {
                    event.stopPropagation();
                    $(this).closest('.description-content').fadeOut();
                });
            }

            attachEpisodeDescriptionToggle();
        }

        function selectEpisode(episodeNumber) {
            selectedEpisode = episodeNumber;
            const episode = episodesData.find(ep => ep.number === episodeNumber);
            if (episode) {
                $selectEpisodeButton.html(`<i class="fas fa-list mr-2"></i>Selected: S${selectedSeason}E${episode.number} - ${escapeHtml(episode.name)}`);
            } else {
                $selectEpisodeButton.text(`Episode ${episodeNumber} Selected`);
            }
            updateVideo();
        }

        $playButton.on('click', updateVideo);
        $closePlayerButton.on('click', closeVideoPlayer);
        $languageSelect.on('change', function() {
            $providerSelect.toggleClass('hidden', $languageSelect.val() === 'fr');
            updateVideo();
        });
        $providerSelect.on('change', function() {
            selectedProvider = $(this).val();
            updateVideo();
        });
        $selectEpisodeButton.on('click', function() {
            openEpisodeModal();
        });

    } catch (error) {
        console.error('Failed to display selected media:', error);
    }
}

