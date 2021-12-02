'use strict';

(function() {

  let output = document.querySelectorAll('.calendar__output');

  document.addEventListener('DOMContentLoaded', getQuotes); 

  function getQuotes() {
    fetch(`https://api.icndb.com/jokes/random/${output.length}`)
      .then(res => res.json())
      .then(data => {
        data.value.forEach((joke, i) =>{
          output[i].textContent = joke.joke;
        });
      })
      .catch(err => console.log(err));   
  };

})();