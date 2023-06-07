const apiKey = 'ade48d0d534f4a192c19d6c06d954956';
const baseUrl = 'https://api.themoviedb.org/3';
const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

const genreListElement = document.getElementById('genreList');
const movieListElement = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('search-btn');
const popup = document.getElementById('popup');
const popupContent = document.getElementById('popupContent');
const closePopupButton = document.getElementById('closePopup');

// Fetch genres and display them in the genre list
function fetchGenres() {
  fetch(genresUrl)
    .then((res) => res.json())
    .then((data) => {
      data.genres.forEach((genre) => {
        const li = document.createElement('li');
        li.textContent = genre.name;
        li.addEventListener('click', () => filterMoviesByGenre(genre.id));
        genreListElement.appendChild(li);
      });
    })
    .catch((error) => console.log(error));
}

// Fetch now playing movies and display them
function fetchNowPlayingMovies() {
  fetch(nowPlayingUrl)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        movieListElement.appendChild(movieCard);
      });
    })
    .catch((error) => console.log(error));
}

// Create a movie card HTML element
function createMovieCard(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div>
                  <h3>${movie.title}</h3>
            </div>
            <div>
              <p>${movie.vote_average}</p>
              <p>${movie.original_language.toUpperCase()}</p>
            </div>
        `;
  movieCard.addEventListener('click', () => showMovieDetails(movie));
  return movieCard;
}

// Filter movies by genre
function filterMoviesByGenre(genreId) {
  const genreMoviesUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
  fetch(genreMoviesUrl)
    .then((response) => response.json())
    .then((data) => {
      movieListElement.innerHTML = '';
      data.results.forEach((movie) => {
        const movieCard = createMovieCard(movie);
        movieListElement.appendChild(movieCard);
      });
    })
    .catch((error) => console.log(error));
}

function showMovieDetails(movie) {
  popupContent.style.display = '';
  // console.log(movie);
  // const price = getRandomPrice();
  const runtime = movie.duration;
  // const genreNames = movie.genres.map((genre) => genre.name).join(', ');
  // const overview = movie.overview;
  checkoutContent.textContent = '';
  checkoutContent.style.display = 'none';
  popupContent.innerHTML = `
          <h2>${movie.title}</h2>
            <div class="popup-details">
                <div class="popup-image">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="popup-info">
                    <div class="popup-info-item">
                        <span class="popup-info-label">★</span>
                        <span class="popup-info-value">${movie.vote_average}</span>
                    </div>
                    <div class="popup-info-item">
                        <span class="popup-info-value">${movie.original_language.toUpperCase()}</span>
                    </div>
                    <div class="popup-info-item">
                        <span class="popup-info-label">Duration:</span>
                        <span class="popup-info-value">${movie.runtime} min</span>
                    </div>
                    <div class="popup-info-item">
                        <span class="popup-info-label">Genre:</span>
                        <span class="popup-info-value">${fetchGenres()} min</span>
                    </div>
                    <div class="popup-info-item">
                        <span class="popup-info-label">Overview:</span>
                        <span class="popup-info-value">${movie.overview}</span>
                    </div>
                    <div class="popup-info-item">
                        <span class="popup-info-label">Price:</span>
                        <span class="popup-info-value">₹${getRandomPrice()}</span>
                    </div>
                    <button onclick="openCheckoutPage('${movie.title}', ${getRandomPrice()})">Book Tickets</button>
                </div>
            </div>
        `;
  popup.style.display = 'flex';
}

//random price between 250 and 300
function getRandomPrice() {
  return Math.floor(Math.random() * 51) + 250;
}

const checkoutContent = document.getElementById('checkoutContent');
function openCheckoutPage(movieTitle, price) {
  checkoutContent.style.display = 'flex';
  popupContent.style.display = 'none';
  checkoutContent.innerHTML = `
          <div class="summary-section">
              <h2>Summary</h2>
              <div class="summary-item">
                  <h5 class="summary-value">${movieTitle}</h5>
              </div>
              <div class="summary-item">
                  <span class="summary-label">Ticket Price:</span>
                  <span class="summary-value">₹${price}</span>
              </div>
              <div class="summary-item">
                  <label for="ticketCount" class="summary-label">Number of Tickets:</label>
                  <input type="number" id="ticketCount" min="1" value="1">
              </div>
              <div class="summary-item">
                  <span class="summary-label">Convenience Fee(1.75%):   </span>
                  <span class="summary-value" id="convenienceFee">${price * 0.02}</span>
              </div>
              <hr/>
              <div class="summary-item">
                  <span class="summary-label">Subtotal:</span>
                  <span class="summary-value" id="subtotal">₹${price + price * 0.02}</span>
              </div>
          </div>
          <div class="payment-section">
              <h2>Payment Details</h2>
              <form id="paymentForm">
                <div>
                  <div class="payment-item">
                      <label for="firstName">First Name:</label>
                      <input type="text" id="firstName" required>
                  </div>
                  <div class="payment-item">
                      <label for="lastName">Last Name:</label>
                      <input type="text" id="lastName" required>
                  </div>
                  <div class="payment-item">
                      <label for="email">Email:</label>
                      <input type="email" id="email" required>
                      </div>
                </div>
                      <div class="payment-item">
                        <p>Payment Method:</p>
                        <input type="radio" id="creditcard" name="for="paymentMethod"" required>
                        <label for="creditcard">Credit Card</label>
                        <input type="radio" id="creditcard" name="for="paymentMethod"" required>
                        <label for="debitcard">Debit Card</label>
                        <input type="radio" id="upi" name="for="paymentMethod"" required>
                        <label for="upi">UPI</label>
                  </div>
                  <button type="submit">Proceed to Pay</button>
              </form>
          </div>
      `;
}

// Close the movie details popup
function closePopup() {
  popup.style.display = 'none';
}

// Event listeners
searchBtn.addEventListener('click', debounce(searchMovies, 300));
closePopupButton.addEventListener('click', closePopup);

// Debounce function for search input
function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

// Search movies based on input text
function searchMovies() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    movieListElement.innerHTML = '';
    fetchNowPlayingMovies();
  } else {
    const searchMoviesUrl = `${searchUrl}${searchTerm}`;
    fetch(searchMoviesUrl)
      .then((response) => response.json())
      .then((data) => {
        movieListElement.innerHTML = '';
        data.results.forEach((movie) => {
          const movieCard = createMovieCard(movie);
          movieListElement.appendChild(movieCard);
        });
      })
      .catch((error) => console.log(error));
  }
}
// Fetch genres and now playing movies on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchGenres();
  fetchNowPlayingMovies();
});
