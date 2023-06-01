window.fetchData = async (searchQuery) => {
  const apiKey = await import('./apiKey.js').then((module) => module.apiKey);
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: apiKey,
      s: searchQuery,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

createAutoComplete({
  root: document.querySelector('.autocomplete'),
});
createAutoComplete({
  root: document.querySelector('.autocomplete-x'),
});
createAutoComplete({
  root: document.querySelector('.autocomplete-y'),
});
createAutoComplete({
  root: document.querySelector('.autocomplete-z'),
});

window.onMovieSelect = async (movie) => {
  const apiKey = await import('./apiKey.js').then((module) => module.apiKey);
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: apiKey,
      i: movie.imdbID,
    },
  });

  console.log(response.data);

  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
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
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    <article class="notification is-primary article-background">
      <p class="title">${movieDetail.Runtime}</p>
      <p class="subtitle">Movie Length</p>
    </article>
  `;
};
