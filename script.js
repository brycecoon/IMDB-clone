const apiBaseURL = "https://api.themoviedb.org/3";
const apiKey = '72b6e431a6971daf962d4040e255606d';
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

document.addEventListener('DOMContentLoaded', () => {
    const moviesGrid = document.getElementById("movies-grid");
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    const nowPlaying = document.getElementById("nowPlaying");
    const trending = document.getElementById("trending");
    const kids = document.getElementById("kids");
    const tvShows = document.getElementById("TV-shows");
    const people = document.getElementById("People");
    const genres = document.getElementById("genres")

    async function generateGenres()
    {
        const response = await fetch(`${apiBaseURL}/genre/movie/list?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const allGenres = jsonResponse.genres;
        console.log(allGenres[0].id);
    }
    
    // ` {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},
    // {"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},
    // {"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},
    // {"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},
    // {"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},
    // {"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]}
    // `

    async function fetchMoviesNowPlaying() {
        const response = await fetch(`${apiBaseURL}/movie/now_playing?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    async function fetchTrendingMovies() {
        const response = await fetch(`${apiBaseURL}/trending/all/day?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    async function fetchTVShows() {
        const response = await fetch(`${apiBaseURL}/tv/top_rated?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    async function fetchPopularPeople() {
        const response = await fetch(`${apiBaseURL}/person/popular?api_key=${apiKey}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayPeople(movies);
    }

    async function searchMovies(query) {
        const response = await fetch(`${apiBaseURL}/search/movie?api_key=${apiKey}&query=${query}`);
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        displayMovies(movies);
    }

    function displayPeople(movies) {
        moviesGrid.innerHTML = movies
            .map((movie) =>
                `<div class="movie-card">
                <img src="${imageBaseUrl}${movie.profile_path}"/>
        <p>Known for: ${movie.known_for_department
                }</p>
        <h1>${movie.name} 
        </div>`
            )
            .join("");
    }

    function displayMovies(movies) {
        moviesGrid.innerHTML = movies
            .map((movie) =>
                `<div class="movie-card">
                <img src="${imageBaseUrl}${movie.poster_path}"/>
        <p>⭐${movie.vote_average}/10</p>
        <h1>${movie.title} 
        </div>`
            )
            .join("");
    }

    function handleSearchFormSubmit(event) {
        event.preventDefault();
        const searchQuery = searchInput.value;
        searchMovies(searchQuery);
    }

    generateGenres();
    fetchMoviesNowPlaying();
    searchForm.addEventListener('submit', handleSearchFormSubmit);
    nowPlaying.addEventListener('click', fetchMoviesNowPlaying);
    trending.addEventListener('click', fetchTrendingMovies);
    tvShows.addEventListener('click', fetchTVShows);
    people.addEventListener('click', fetchPopularPeople);

})