const calendar = document.querySelector('.calendar'),
      frontSide = document.querySelector('.calendar__side--front'),
      modal = document.querySelector('.modal'),
      closeBtn = modal.querySelector('.close__btn'),
      form = modal.querySelector('.form'),
      taskInput = form.querySelector('#inputTask');

let currentTaskList;      


// При загрузке страницы отрисовывает задачи на днях календаря беря информацию из localStorage
function getTasks() {
  let month = document.querySelectorAll('.calendar__day');

  for(var key in localStorage) {
    if(localStorage[key]) {
      let tasks = JSON.parse(localStorage[key]),
          fragment = document.createDocumentFragment();
      
      tasks.forEach(task => {
        const li = document.createElement('li');

        li.className = 'calendar__item';

        li.textContent = task;

        fragment.appendChild(li);

      });

      month[key - 1].lastElementChild.lastElementChild.appendChild(fragment);
      console.dir(fragment)
    };
  };

  countTasks();
};


// Сохраняет задачи в локальном хранилище
function storeTaskInLocalStorage(task, date) {
  let tasks;

  tasks = localStorage.getItem(date) === null ? [] : JSON.parse(localStorage.getItem(date));

  tasks.push(task);

  localStorage.setItem(date, JSON.stringify(tasks));
};


// Функция открытия модального окна
function popupOpen(e) {
  if(e.target.classList.contains('btn__add')) {
    modal.style.display = 'block';

    currentTaskList = e.target.parentElement.parentElement.lastElementChild.firstElementChild;

    // Обработчик события закрытия модального окна
    closeBtn.addEventListener('click', popupClose);
  };
};


// Функция закрытия модального окна
function popupClose(e) {
  e.target.parentElement.style.display = 'none';

  form.removeEventListener('click', addTask);
};

// Функция добавления задания на заднюю сторону карты
function addTask(e) {
  const li = document.createElement('li'),
        day = currentTaskList.parentElement.previousElementSibling.firstElementChild.textContent;    
        
  li.className = 'calendar__item';

  li.textContent = taskInput.value;

  currentTaskList.appendChild(li);

  storeTaskInLocalStorage(taskInput.value, day);

  taskInput.value = '';

  e.preventDefault();

  countTasks();
};

// Функция считает количество дел и выводит информацию на переднюю сторону карты
function countTasks() {
  let month = document.querySelectorAll('.calendar__day'),
      tasks = month[0].children[1].lastElementChild.children.length;

  for(let i = 0; i < 2; i++) {
    let numberOfTasks = month[i].lastElementChild.children[0].children.length;
    
    month[i].firstElementChild.children[1].textContent = `У вас на этот день запланировано ${numberOfTasks} дел(-а)`
  };    
  // month.forEach((task) => {
  //   let tasks = task.firstElementChild.children[1].children.length;

  //   task.firstElementChild.children[1].textContent = `У вас на этот день запланировано ${tasks} дел(-а)`;
  // });
};


// При нажатии на обратную сторону карты она поворачиваеться на 180 градусов
function rotateCardBack(e) {
  if(e.target.classList.contains('calendar__side--back')) {
    const cardFrontSide = e.target.previousElementSibling,
          cardBackSide = e.target;

    cardFrontSide.style.transform = 'rotateY(0)';
    cardBackSide.style.transform = 'rotateY(180deg)';
    
    // При клике на обратную сторону снимаем этоже событие
    calendar.removeEventListener('click', rotateCardBack);
  };
};


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


// При клике на кнопку добавления события в любом дне месяца, откроется окно, которое привязано к этому дню с помощью currentDay
calendar.addEventListener('click', popupOpen);

// При клике на кнопку просмотра событий карта поворачиваеться на 180 градусов
calendar.addEventListener('click', rotateCard);

// Обработчик отрисовки списка дел на карте
form.addEventListener('submit', addTask);

// При загрузке страници берет данные из локального хранилища и отрисовывает их на карте
document.addEventListener('DOMContentLoaded', function(e) {
  countTasks();
  getTasks();
});