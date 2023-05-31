const fetchData = async () => {
  const apiKey = await import('./apiKey.js').then((module) => module.apiKey);
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: apiKey,
      s: 'iron man',
    },
  });

  console.log(response.data);
};

fetchData();
