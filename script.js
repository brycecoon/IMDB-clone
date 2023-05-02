// REQUIREMENT 11: use a javascript module
// import { apiBaseURL } from "./apiStuff.js";
// import { apiKey } from "./apiStuff.js";
// import { imageBaseUrl } from "./apiStuff.js";
// import { genreUrl } from "./apiStuff.js";

const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = '72b6e431a6971daf962d4040e255606d';
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
const genreUrl = `https://api.themoviedb.org/3/discover/movie?
api_key=${apiKey}&language=en-US&sort_by=
primary_release_date.desc&primary_release_year=2020&with_genres=`;

document.addEventListener('DOMContentLoaded', () => {

    // REQUIREMENT 9: at least 2 instances of queryselector
    const moviesGrid = document.getElementById("movies-grid");
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const nowPlaying = document.getElementById("nowPlaying");
    const trending = document.getElementById("trending");
    const tvShows = document.getElementById("TV-shows");
    const people = document.getElementById("People");
    const genres = document.getElementById("genreOptions");
    const selectedGenre = document.getElementById("genres");
    const img = document.querySelectorAll("img");
    const movieCards = document.querySelectorAll('.movie-card');
    const pageUp = document.getElementById("page-up");
    const pageDown = document.getElementById("page-down");
    const currPage = document.getElementById("page-num");

    let pageNumber = 1;
    let currentState = "nowPlaying";

    async function fetchGenre(genreID, pageNum) {
        if (currentState != "genre") {
            pageNumber = 1;
            currentState = "genre";
        }
        setButtonStyle();
        testGenre = genreID;
        const response = await fetch(`${genreUrl}${genreID}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=5&vote_average.gte=3&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const allGenres = jsonResponse.results;
        console.log(allGenres);
        displayMovies(allGenres);
    }

    // REQUIREMENT 10: ajax to interact with an API
    async function generateGenres() {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
        // const response = await fetch(`${apiBaseURL}/genre/movie/list?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const allGenres = jsonResponse.genres;
        console.log(allGenres);
        for (genre of allGenres) {
            let addGenre = document.createElement("option");
            addGenre.id = genre.id;
            addGenre.textContent = genre.name;
            genres.appendChild(addGenre);
        }
        genres.addEventListener('change', () => {
            const selectedOptionId = genres.options[genres.selectedIndex].id;
            fetchGenre(selectedOptionId);
        })
    }


    async function fetchMoviesNowPlaying(pageNum) {
        if (currentState != "nowPlaying") {
            pageNumber = 1;
            currentState = "nowPlaying";
        }
        setButtonStyle();
        const response = await fetch(`${apiBaseURL}/movie/now_playing?api_key=${apiKey}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=100&vote_average.gte=5.5&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }



    async function fetchTrendingMovies(pageNum) {
        if (currentState != "trending") {
            pageNumber = 1;
            currentState = "trending";
        }
        setButtonStyle();
        const response = await fetch(`${apiBaseURL}/trending/all/day?api_key=${apiKey}&sort_by=popularity.desc&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=100&vote_average.gte=5.5&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    async function fetchTVShows(pageNum) {
        if (currentState != "tv") {
            pageNumber = 1;
            currentState = "tv";
        }     
        setButtonStyle();

        const response = await fetch(`${apiBaseURL}/tv/top_rated?api_key=${apiKey}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=100&vote_average.gte=5.5&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayShows(movies);
    }

    async function fetchPopularPeople(pageNum) {
        if (currentState != "people") {
            pageNumber = 1;
            currentState = "people";
        }
        setButtonStyle();
        const response = await fetch(`${apiBaseURL}/person/popular?api_key=${apiKey}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=100&vote_average.gte=5.5&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayPeople(movies);
    }

    async function searchMovies(query) {
        const response = await fetch(`${apiBaseURL}/search/movie?api_key=${apiKey}&query=${query}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${pageNumber}&primary_release_date.gte=1980&vote_count.gte=100&vote_average.gte=5.5&with_watch_monetization_types=flatrate`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    function displayPeople(movies) {
        console.log(movies);
        moviesGrid.innerHTML = movies
            .map((movie) => {
                // Check if the movie profile image source is valid
                if (movie.profile_path) {
                    // REQUIREMENT 3: SHOWS EVERY IMAGE WITH ALT
                    return `
                <div class="movie-card">
                  <img src="${imageBaseUrl}${movie.profile_path}" alt="image not found"/>
                  <p>Known for: ${movie.known_for_department}</p>
                  <h1>${movie.name}</h1>
                </div>
              `;
                } else {
                    // If the movie profile image source is invalid, return an empty string
                    return '';
                }
            })
            .join("");
    }



    function displayShows(movies) {
        const validMovies = movies.filter((movie) => movie.poster_path && movie.original_language === 'en');
        console.log(validMovies);
        if (validMovies.length > 0) {
            moviesGrid.innerHTML = validMovies
                .map((movie) =>
                    `<div class="movie-card">
                <img src="${imageBaseUrl}${movie.poster_path}" />
                <p>⭐${movie.vote_average}/10</p>
                <h1>${movie.original_name}</h1>
              </div>`
                )
                .join("");
        } else {
            // If there are no valid movies, clear the content of the moviesGrid element
            moviesGrid.innerHTML = "";
        }
    }

    function displayMovies(movies) {
        const validMovies = movies.filter((movie) => movie.poster_path && movie.original_language === 'en');
        console.log(validMovies);
        if (validMovies.length > 0) {
            moviesGrid.innerHTML = validMovies
                .map((movie) =>
                    `<div class="movie-card">
                <img src="${imageBaseUrl}${movie.poster_path}" alt="Image not found"/>
                <p>⭐${movie.vote_average}/10 (${movie.vote_count} votes)</p>
                <h1>${movie.title}</h1>
                <p>${movie.release_date}</p>
                <p id="description">${movie.overview}</p> 
              </div>`
                )
                .join("");
        } else {
            // If there are no valid movies, clear the content of the moviesGrid element
            moviesGrid.innerHTML = "";
        }
    }

    function handleImageClick(movie) {
        moviesGrid.innerHTML = `<div class="movie-card">
        <img src="${imageBaseUrl}${movie.poster_path}" alt="Image not found"/>
        <p>⭐${movie.vote_average}/10 (${movie.vote_count} votes)</p>
        <h1>${movie.title}</h1>
        <p>${movie.release_date}</p>
        <p id="description">${movie.overview}</p> 
      </div>`
    }

    function addClickEventToMovies() {
        movieCards.forEach((movieCard) => {
            document.write("hello");
            movieCard.addEventListener('click', () => {
                const movieId = movieCard.id;
                document.write("hello");

                // Fetch movie details based on the ID
                fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
                    .then((response) => response.json())
                    .then((data) => {
                        // Clear the movies grid
                        moviesGrid.innerHTML = '';

                        // Create a movie card for the selected movie
                        const selectedMovie = `
                <div class="movie-card">
                    <img src="${imageBaseUrl}${data.poster_path}" alt="image not found"/>
                    <p>Release date: ${data.release_date}</p>
                    <h1>${data.title}</h1>
                    <p>${data.overview}</p>
                </div>
            `;

                        // Add the selected movie card to the movies grid
                        moviesGrid.insertAdjacentHTML('beforeend', selectedMovie);
                    })
                    .catch((error) => console.log(error));
            });
        });
    };

    function handleSearchFormSubmit(event) {
        event.preventDefault();
        const searchQuery = searchInput.value;
        searchMovies(searchQuery);
    }

    function setButtonStyle() {
        nowPlaying.style.backgroundColor = "#AF5B5B";
        nowPlaying.style.color = "#EDDEA4";
        trending.style.backgroundColor = "#AF5B5B";
        trending.style.color = "#EDDEA4";
        tvShows.style.backgroundColor = "#AF5B5B";
        tvShows.style.color = "#EDDEA4";
        people.style.backgroundColor = "#AF5B5B";
        people.style.color = "#EDDEA4";

        if (currentState == "nowPlaying") {
            nowPlaying.style.backgroundColor = "#EDDEA4";
            nowPlaying.style.color = "#AF5B5B";
        }
        else if (currentState == "trending") {
            trending.style.backgroundColor = "#EDDEA4";
            trending.style.color = "#AF5B5B";
        }
        else if (currentState == "tv") {
            tvShows.style.backgroundColor = "#EDDEA4";
            tvShows.style.color = "#AF5B5B";
        }
        else if (currentState == "people") {
            people.style.backgroundColor = "#EDDEA4";
            people.style.color = "#AF5B5B";
        }
    }



    generateGenres();
    // addClickEventToMovies();
    fetchMoviesNowPlaying(pageNumber);


    // REQUIREMENT 8: at least 2 instances of using event listener
    searchForm.addEventListener('submit', handleSearchFormSubmit);
    nowPlaying.addEventListener('click', fetchMoviesNowPlaying);
    trending.addEventListener('click', fetchTrendingMovies);
    tvShows.addEventListener('click', fetchTVShows);
    people.addEventListener('click', fetchPopularPeople);
    pageUp.addEventListener('click', () => {
        pageNumber++;
        if (currentState == "nowPlaying") { fetchMoviesNowPlaying(pageNumber) }
        else if (currentState == "trending") { fetchTrendingMovies(pageNumber) }
        else if (currentState == "tv") { fetchTVShows(pageNumber) }
        else if (currentState == "people") { fetchPopularPeople(pageNumber) }
        else if (currentState == "genre") { fetchGenre(genres.options[genres.selectedIndex].id, pageNumber) }

        currPage.innerHTML = `<p id="page-num">Page: ${pageNumber}</p>`;
    })
    pageDown.addEventListener('click', () => {
        if (pageNumber > 1) { pageNumber-- }
        if (currentState == "nowPlaying") { fetchMoviesNowPlaying(pageNumber) }
        else if (currentState == "trending") { fetchTrendingMovies(pageNumber) }
        else if (currentState == "tv") { fetchTVShows(pageNumber) }
        else if (currentState == "people") { fetchPopularPeople(pageNumber) }
        else if (currentState == "genre") { fetchGenre(genres.options[genres.selectedIndex].id, pageNumber) }
        let addPageNumber = document.createElement("p");
        addPageNumber.textContent = pageNumber;
        currPage.innerHTML = `<p id="page-num">Page: ${pageNumber}</p>`;
    })
    let addPageNumber = document.createElement("p");
    addPageNumber.textContent = pageNumber;
    currPage.innerHTML = `<p id="page-num">Page: ${pageNumber}</p>`;
})