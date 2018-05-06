'use strict';

(function() {

// При клике на кнопку просмотра событий карта поворачиваеться на 180 градусов
calendar.addEventListener('click', rotateCard);

// При нажатии на кнопку просмотра событий, карта поворачивается на 180 градусов
function rotateCard(e) {
  if(e.target.classList.contains('btn__watch')) {
    const cardFrontSide = e.target.parentElement,
          cardBackSide = e.target.parentElement.nextElementSibling;

    cardFrontSide.style.transform = 'rotateY(-180deg)';
    cardBackSide.style.transform = 'rotateY(0)';

    // При повороте карты добавляем события на обратную сторону
    calendar.addEventListener('click', rotateCardBack);  
  };
};

// При нажатии на обратную сторону карты она поворачиваеться на 180 градусов
function rotateCardBack(e) {
  if(e.target.classList.contains('calendar__back-btn')) {
    const cardFrontSide = e.target.parentElement.previousElementSibling,
          cardBackSide = e.target.parentElement;

    cardFrontSide.style.transform = 'rotateY(0)';
    cardBackSide.style.transform = 'rotateY(180deg)';
  };
};

})();