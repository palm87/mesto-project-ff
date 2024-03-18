return fetch('https://nomoreparties.co/v1/wff-cohort-9/cards', {
  headers: {
    authorization: '10c1d3be-59bf-42c2-a7cc-3e9744607a63'
  }
})
  .then(res => res.json())
  .then((result) => {
    console.log(result);
  });