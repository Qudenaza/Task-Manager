'use strcit';

(function() {

  // При клике на кнопку добавления события в любом дне месяца, откроется окно, которое привязано к этому дню с помощью currentDay
  calendar.addEventListener('click', popupOpen);

  // Функция открытия модального окна
  function popupOpen(e) {
    if(e.target.classList.contains('btn__add')) {
      modal.style.display = 'block';

      currentDayFromModal = e.target.parentElement.firstElementChild.textContent;
      
      // Обработчик события закрытия модального окна
      closeBtn.addEventListener('click', popupClose);
    };
  };


// Функция закрытия модального окна
  function popupClose(e) {
    e.target.parentElement.style.display = 'none';

    form.removeEventListener('click', addTask);
  };

})();