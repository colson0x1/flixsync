it('Shows an autocomplete', () => {
  createAutoComplete({
    root: document.querySelector('#target'),
    fetchData() {
      return [
        { Title: 'John Wick' },
        { Title: 'Transformers' },
        { Title: 'Avengers' },
      ];
    },
    renderOption(movie) {
      return movie.Title;
    },
  });

  const dropdown = document.querySelector('.dropdown');

  expect(dropdown.className).not.to.include('is-active');
});
