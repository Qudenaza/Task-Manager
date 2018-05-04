const calendar = document.querySelector('.calendar'),
      frontSide = document.querySelector('.calendar__side--front'),
      modal = document.querySelector('.modal'),
      closeBtn = modal.querySelector('.close__btn'),
      form = modal.querySelector('.form'),
      taskInput = form.querySelector('#inputTask'),
      editModal = document.querySelector('.edit');

let currentTaskList;      


// При загрузке страницы отрисовывает задачи на днях календаря беря информацию из localStorage
function getTasks() {
  let month = document.querySelectorAll('.calendar__day');

  for(var key in localStorage) {
    if(localStorage[key]) {
      let tasks = JSON.parse(localStorage[key]),
          fragment = document.createDocumentFragment();
      
      tasks.forEach(task => {
        const li = document.createElement('li'),
              editBtn = document.createElement('button'),
              deleteBtn = document.createElement('button');

        li.className = 'calendar__item';

        li.textContent = task;

        editBtn.className = 'edit__btn';

        editBtn.title = 'Редактировать';
      
        deleteBtn.title = 'Удалить';
      
        deleteBtn.className = 'delete__btn';
      
        li.appendChild(editBtn);
      
        li.appendChild(deleteBtn);

        fragment.appendChild(li);

      });

      month[key - 1].lastElementChild.children[2].appendChild(fragment);
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

    currentTaskList = e.target.parentElement.nextElementSibling.children[2];

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
        editBtn = document.createElement('button'),
        deleteBtn = document.createElement('button'),
        day = currentTaskList.parentElement.previousElementSibling.firstElementChild.textContent;    
        
  li.className = 'calendar__item';

  li.textContent = taskInput.value;

  editBtn.className = 'edit__btn';

  editBtn.title = 'Редактировать';

  deleteBtn.title = 'Удалить';

  deleteBtn.className = 'delete__btn'

  li.appendChild(editBtn);

  li.appendChild(deleteBtn);

  currentTaskList.appendChild(li);

  storeTaskInLocalStorage(taskInput.value, day);

  taskInput.value = '';

  e.preventDefault();

  countTasks();
};

// Функция удаляет все события на карте и удаляет их из локального хранилища
function clearTasks(e) {
  if (e.target.classList.contains('calendar__clear-all-btn')) {
    const taskList = e.target.previousElementSibling,
          day = e.target.parentElement.previousElementSibling.firstElementChild.textContent;

    while(taskList.firstElementChild) {
      taskList.removeChild(taskList.firstElementChild);
    };

    localStorage.removeItem(day);

    countTasks();
  };
};

// Функциия удаляет задачу с задней стороны карты и из локального хранилища
function removeTask(e) {
  if(e.target.classList.contains('delete__btn')) {
    const day = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.textContent,
          taskItem = e.target.parentElement;

    if(confirm('Вы точно хотите удалить событие?')) {
      e.target.parentElement.remove();

      removeTaskFromLocalStorage(taskItem, day)
    };
  };
  e.preventDefault();
}


// Функция удаляет задачи из локального хранилища
function removeTaskFromLocalStorage(taskItem, day) {
  let tasks,
      num;

  tasks = localStorage.getItem(day) === null ? [] : JSON.parse(localStorage.getItem(day));

  num = tasks.indexOf(taskItem.textContent);

  if(num !== -1) tasks.splice(num, 1);

  localStorage.setItem(day, JSON.stringify(tasks));

  countTasks();
};


// Функция считает количество дел и выводит информацию на переднюю сторону карты
function countTasks() {
  let month = document.querySelectorAll('.calendar__day'),
      tasks = month[0].children[1].lastElementChild.children.length;

  for(let i = 0; i < 2; i++) {
    let numberOfTasks = month[i].lastElementChild.children[2].children.length;
    
    month[i].firstElementChild.children[1].textContent = `У вас на этот день запланировано ${numberOfTasks} дел(-а)`
  };    
  // month.forEach((task) => {
  //   let tasks = task.firstElementChild.children[1].children.length;

  //   task.firstElementChild.children[1].textContent = `У вас на этот день запланировано ${tasks} дел(-а)`;
  // });
};


// Функция отвечает за изменения текста события и изменения его в локальном хранилищие
function editTask(e) {
  if(e.target.classList.contains('edit__btn')) {
    const currentTask = e.target.parentElement,
          day = currentTask.parentElement.parentElement.previousElementSibling.firstElementChild.textContent;
          editField = prompt('Введите текст', '');

    let tasks;      

    if(editField !== null) {
      currentTask.innerHTML = `${editField}
                            <button class="edit__btn" title="Редактировать"></button>
                            <button class="delete__btn" title="Удалить"></button>`
    };

    tasks = JSON.parse(localStorage.getItem(day));

    tasks.splice(tasks.indexOf(currentTask.textContent.trim()), 1, currentTask.textContent.trim());

    localStorage.setItem(day, JSON.stringify(tasks)); 
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

// Когда нажали на крестик то событие удаляется с карты и из хранилища
calendar.addEventListener('click', removeTask);

// При нажатии на кнопку очистки событий удаляются все задания на карте и из локального хранилища
calendar.addEventListener('click', clearTasks);

// При нажатие на кнопку редактирования открывается модальное окно с полем редактирования
calendar.addEventListener('click', editTask);

// При загрузке страници берет данные из локального хранилища и отрисовывает их на карте
document.addEventListener('DOMContentLoaded', function(e) {
  countTasks();
  getTasks();
});



