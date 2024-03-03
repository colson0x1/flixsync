import { apiKey } from './apiKey.js';

const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },

  inputValue: (movie) => {
    return movie.Title;
  },
  fetchData: async (searchQuery) => {
    // const apiKey = await import('./apiKey.js').then((module) => module.apiKey);
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: apiKey,
        s: searchQuery,
      },
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  },
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  },
});

let leftMovie;
let rightMovie;
window.onMovieSelect = async (movie, summaryElement, side) => {
  const apiKey = await import('./apiKey.js').then((module) => module.apiKey);
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: apiKey,
      i: movie.imdbID,
    },
  });

  console.log(response.data);

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification',
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification',
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

function convertToMovieTime(movieTime) {
  const regex = /^(\d+)\s*min$/;

  const match = movieTime.match(regex);

  if (!match) {
    return "Invalid input format. Please provide time in the format 'X min'.";
  }

  const minutes = parseInt(match[1]);

  if (isNaN(minutes) || minutes < 0) {
    return 'Invalid input. Minutes should be a non-negative number.';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const formattedTime = `${hours} hr ${remainingMinutes} min`;

  return formattedTime;
}

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''),
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseInt(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  console.log(awards);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>Type: ${movieDetail.Type.toUpperCase()}</h4>
          <h4>Genre: ${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Released}</p>
      <p class="subtitle">Released</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Actors}</p>
      <p class="subtitle">Actors</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Director}</p>
      <p class="subtitle">Director</p>
    </article>
    <article data-value=${awards} class="notification is-primary article-background">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary article-background">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification is-primary article-background">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary article-background">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary article-background">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${convertToMovieTime(movieDetail.Runtime)}</p>
      <p class="subtitle">Movie Length</p>
    </article>
  `;
};
