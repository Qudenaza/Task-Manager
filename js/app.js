const calendar = document.querySelector('.calendar'),
      frontSide = document.querySelector('.calendar__side--front'),
      modal = document.querySelector('.modal'),
      closeBtn = modal.querySelector('.close__btn'),
      form = modal.querySelector('.form'),
      taskInput = form.querySelector('#inputTask'),
      editModal = document.querySelector('.edit'),
      fullScreen = document.querySelector('.fullscreen'),
      list = document.querySelector('.fullscreen__list'),
      fullScreenClose = document.querySelector('.fullscreen__close');

let currentDayFromModal,      // Приходит из modal.js
    currentDayFromFull        // Приходит из fullscreen
    
// Сохраняет задачи в локальном хранилище
function storeTaskInLocalStorage(task, date) {
  let tasks;

  tasks = localStorage.getItem(date) === null ? [] : JSON.parse(localStorage.getItem(date));

  tasks.push(task);

  localStorage.setItem(date, JSON.stringify(tasks));
};



// Функция добавления задания на заднюю сторону карты
function addTask(e) {
  const li = document.createElement('li'),
        editBtn = document.createElement('button'),
        deleteBtn = document.createElement('button'); 
                
  deleteBtn.className = 'delete__btn';
  deleteBtn.title = 'Удалить';
  
  editBtn.className = 'edit__btn';
  editBtn.title = 'Редактировать';

  li.className = 'calendar__item';
  li.textContent = taskInput.value;
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  storeTaskInLocalStorage(taskInput.value, currentDayFromModal);

  taskInput.value = '';

  e.preventDefault();

  countTasks();
};


// Функция удаляет все события на карте и удаляет их из локального хранилища
function clearTasks(e) {
  if (e.target.classList.contains('calendar__clear-all-btn')) {
    const taskList = e.target.previousElementSibling;

    while(taskList.firstElementChild) {
      taskList.removeChild(taskList.firstElementChild);
    };

    localStorage.removeItem(currentDayFromFull);

    countTasks();
  };
};


// Функциия удаляет задачу с задней стороны карты и из локального хранилища
function removeTask(e) {
  if(e.target.classList.contains('delete__btn')) {
    const taskItem = e.target.parentElement;

    if(confirm('Вы точно хотите удалить событие?')) {
      taskItem.remove();

      removeTaskFromLocalStorage(taskItem)
    };
  };
};


// // Функция удаляет задачи из локального хранилища
function removeTaskFromLocalStorage(taskItem) {
  let tasks;

  tasks = JSON.parse(localStorage.getItem(currentDayFromFull));

  tasks.splice(tasks.indexOf(taskItem.textContent), 1);

  localStorage.setItem(currentDayFromFull, JSON.stringify(tasks));

  if(JSON.parse(localStorage.getItem(currentDayFromFull)).length === 0) localStorage.removeItem(currentDayFromFull);

  countTasks();
};


// Функция считает количество дел и выводит информацию на переднюю сторону карты
function countTasks() {
  let month = document.querySelectorAll('.calendar__day');

  for(let i = 1; i <= month.length; i++) {
    let numberOfTasks = JSON.parse(localStorage.getItem(i)) ? (JSON.parse(localStorage.getItem(i))).length : 0;
    
    if(!numberOfTasks) {
      month[i - 1].firstElementChild.children[2].textContent = `У вас на этот день запланировано ${numberOfTasks} дел(-а)`;
    } else {
    month[i - 1].firstElementChild.children[2].innerHTML = `У вас на этот день запланировано <span class="task-counter">${numberOfTasks}</span> дел(-а)`;
    };
  };  
};


// Функция открытия окна заданий и отрисовки тасков
function fullScreenOpen(e) {
  if(e.target.parentElement.classList.contains('fullscreen__btn')) {
          currentDayFromFull = e.target.parentElement.previousElementSibling.textContent,
          tasks = JSON.parse(localStorage.getItem(currentDayFromFull));

    printTasks(tasks);

    fullScreen.style.display = 'block';

    calendar.removeEventListener('click', fullScreenOpen);

    fullScreen.addEventListener('click', removeTask);

    fullScreenClose.addEventListener('click', closeFullScreen);

    fullScreen.addEventListener('click', editTask);

    fullScreen.addEventListener('click', clearTasks);
  };
};


// Функция закрытия окна заданий
function closeFullScreen(e) {
  if(e.target.classList.contains('fullscreen__close')) {
  
    fullScreen.style.display = 'none';

    calendar.addEventListener('click', fullScreenOpen);
  
    while(fullScreen.children[2].firstElementChild) {
      fullScreen.children[2].firstElementChild.remove();
    };
  

    fullScreen.removeEventListener('click', removeTask);

    fullScreen.removeEventListener('click', clearTasks);

    fullScreen.removeEventListener('click', editTask);
  };  
};


// Функция отрисовки заданий
function printTasks(tasks) {
  const list = document.querySelector('.fullscreen__list'),
        fragment = document.createDocumentFragment();

  if(!tasks) return;

  tasks.forEach(task => {
    const li = document.createElement('li'),
          deleteBtn = document.createElement('button'),
          editBtn = document.createElement('button');

    deleteBtn.className = 'delete__btn';
    deleteBtn.title = 'Удалить';
    
    editBtn.className = 'edit__btn';
    editBtn.title = 'Редактировать';

    li.className = 'calendar__item';
    li.textContent = task;
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    fragment.appendChild(li);
  });      

  list.appendChild(fragment);
};

// Функция отвечает за изменения текста события и изменения его в локальном хранилищие
function editTask(e) {
  if(e.target.classList.contains('edit__btn')) {
    const currentTask = e.target.parentElement;
          editField = prompt('Введите текст', '');
    
    let tasks; 
    
    if(editField === null || editField === '') return;

 
    currentTask.innerHTML = `${editField}
                            <button class="edit__btn" title="Редактировать"></button>
                            <button class="delete__btn" title="Удалить"></button>`
  

    tasks = JSON.parse(localStorage.getItem(currentDayFromFull));
    
    tasks.splice(tasks.indexOf(currentTask.textContent.trim()), 1, editField);

    localStorage.setItem(currentDayFromFull, JSON.stringify(tasks)); 
  };
};




// Обработчик отрисовки списка дел на карте
form.addEventListener('submit', addTask);

// При нажатие на кнопку редактирования открывается модальное окно с полем редактирования

// При клике на иконку заданий открывается окно
calendar.addEventListener('click', fullScreenOpen);

// При загрузке страници берет данные из локального хранилища и отрисовывает их на карте
document.addEventListener('DOMContentLoaded', countTasks);
